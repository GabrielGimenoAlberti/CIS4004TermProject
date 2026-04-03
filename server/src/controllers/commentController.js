const Comment = require("../models/Comment");
const User = require("../models/User");
const Event = require("../models/Event");

const createComment = async (req, res) => {
    try {
        const { userId, eventId, text } = req.body;

        if ( !userId || !eventId || !text ){
            return res.status(400).json ({
                message: "UserID, eventID and text are required."
            });
        }

        const userDoc = await User.findById(userId);
        if (!userDoc) {
            return res.status(400).json({ message: "Invalid user."});
        }

        const eventDoc = await Event.findById(eventId);
        if (!eventDoc) {
            return res.status(400).json({ message: "Invalid event."});
        }

        const comment = new Comment({
            userId,
            eventId,
            text,
        });

        const savedComment = await comment.save();
        res.status(201).json(savedComment);
    } catch (error) {
        res.status(500).json({ message: "Error creating comment.", error: error.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { userId } = req.body;

        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found."});
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({message: "User not found."});
        }

        const isOwner = comment.userId.toString() === userId;
        const isAdmin = user.role ==="admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: "Not authorized to delete this comment."});
        }

        await comment.deleteOne();
        res.json({ message: "Comment deleted successfully."});
    } catch (error) {
        res.status(500).json({ message: "Error deleting comment."});
    }
};

const getCommentsByEvent = async (req, res) => {
    try {
        const comments = await Comment.find({ eventId: req.params.eventId })
            .populate("userId", "name email");
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching comments.", error: error.message });
    }
};

module.exports = {
    createComment,
    deleteComment,
    getCommentsByEvent
};
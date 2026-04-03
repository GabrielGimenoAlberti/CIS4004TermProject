const express = require("express");
const router = express.Router();
const {
    createComment,
    deleteComment,
    getCommentsByEvent,
} = require("../controllers/commentController");

router.post("/", createComment);
router.delete("/:id", deleteComment);
router.get("/events/:eventId", getCommentsByEvent);

module.exports = router;
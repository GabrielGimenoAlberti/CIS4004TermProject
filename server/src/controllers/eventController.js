const Event = require("../models/Event");
const User = require("../models/User");
const Category = require("../models/Category")

const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, category, createdBy } = req.body;

    if (!title || !description || !date || !location || !category || !createdBy) {
      return res.status(400).json({
        message: "Title, description, date, location, category, and createdBy are required.",
      });
    }

    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(400).json({ message: "Invalid category." });
    }

    const user = await User.findById(createdBy);
    if (!user) {
      return res.status(400).json({ message: "Invalid user." });
    }

    const event = new Event({
      title,
      description,
      date,
      location,
      category,
      createdBy,
      approved: user.role === "admin",
    });

    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: "Error creating event.", error: error.message });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "name email role");
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events.", error: error.message });
  }
};

const getApprovedEvents = async (req, res) => {
  try {
    const events = await Event.find({ approved: true }).populate("createdBy", "name email role");
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching approved events.", error: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("createdBy", "name email role");

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event.", error: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { userId, title, description, date, location, category, approved } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "Invalid user." });
    }

    const isOwner = event.createdBy.toString() === userId;
    const isAdmin = user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to update this event." });
    }

    event.title = title ?? event.title;
    event.description = description ?? event.description;
    event.date = date ?? event.date;
    event.location = location ?? event.location;
    event.category = category ?? event.category;

    if (isAdmin && typeof approved === "boolean") {
      event.approved = approved;
    }

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Error updating event.", error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { userId } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "Invalid user." });
    }

    const isOwner = event.createdBy.toString() === userId;
    const isAdmin = user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this event." });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event.", error: error.message });
  }
};

const approveEvent = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required." });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    event.approved = true;
    const updatedEvent = await event.save();

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Error approving event.", error: error.message });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getApprovedEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  approveEvent,
};
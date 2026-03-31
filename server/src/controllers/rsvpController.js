const Rsvp = require("../models/Rsvp");
const User = require("../models/User");
const Event = require("../models/Event");

const createRsvp = async (req, res) => {
  try {
    const { user, event, status } = req.body;

    if (!user || !event) {
      return res.status(400).json({ message: "User and event are required." });
    }

    const foundUser = await User.findById(user);
    const foundEvent = await Event.findById(event);

    if (!foundUser || !foundEvent) {
      return res.status(400).json({ message: "Invalid user or event." });
    }

    const existingRsvp = await Rsvp.findOne({ user, event });
    if (existingRsvp) {
      return res.status(400).json({ message: "User has already RSVP'd to this event." });
    }

    const rsvp = new Rsvp({
      user,
      event,
      status: status || "going",
    });

    const savedRsvp = await rsvp.save();
    res.status(201).json(savedRsvp);
  } catch (error) {
    res.status(500).json({ message: "Error creating RSVP.", error: error.message });
  }
};

const getRsvpsByUser = async (req, res) => {
  try {
    const rsvps = await Rsvp.find({ user: req.params.userId })
      .populate("event")
      .populate("user", "name email role");

    res.json(rsvps);
  } catch (error) {
    res.status(500).json({ message: "Error fetching RSVPs for user.", error: error.message });
  }
};

const getRsvpsByEvent = async (req, res) => {
  try {
    const rsvps = await Rsvp.find({ event: req.params.eventId })
      .populate("user", "name email role")
      .populate("event");

    res.json(rsvps);
  } catch (error) {
    res.status(500).json({ message: "Error fetching RSVPs for event.", error: error.message });
  }
};

const deleteRsvp = async (req, res) => {
  try {
    const deleted = await Rsvp.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "RSVP not found." });
    }

    res.json({ message: "RSVP deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting RSVP.", error: error.message });
  }
};

module.exports = {
  createRsvp,
  getRsvpsByUser,
  getRsvpsByEvent,
  deleteRsvp,
};
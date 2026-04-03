const express = require("express");
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getApprovedEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  approveEvent,
} = require("../controllers/eventController");

router.get("/", getAllEvents);
router.get("/approved", getApprovedEvents);
router.get("/:id", getEventById);
router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
router.patch("/:id/approve", approveEvent);

module.exports = router;
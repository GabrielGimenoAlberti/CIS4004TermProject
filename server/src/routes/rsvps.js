const express = require("express");
const router = express.Router();

const {
  createRsvp,
  getRsvpsByUser,
  getRsvpsByEvent,
  deleteRsvp,
} = require("../controllers/rsvpController");

router.post("/", createRsvp);
router.get("/user/:userId", getRsvpsByUser);
router.get("/event/:eventId", getRsvpsByEvent);
router.delete("/:id", deleteRsvp);

module.exports = router;
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema (
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true
        },
        text: { type: String, required: true, trim: true },
    },
    { timestamps: true }
)
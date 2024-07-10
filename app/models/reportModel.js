const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true
    },
    result: {
      type: Object,
      required: true
    },
    answers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answer",
      required: true
    }]
  },
  {
    timestamps: true
  }
);

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;

const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  }
}, { _id: false });

const questionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  correctOption: {
    type: String,
    required: true,
  },
  options: [optionSchema],
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
    required: true,
  },
  answers:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Answer",
    required:true
  }],

}, {
  timestamps: true,
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;

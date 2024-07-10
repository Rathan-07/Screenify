const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
      type: String,
     
    },
    duration: {
      type: Number,
     
    },
    category: {
      type: String,
     
    },
    totalMarks: {
      type: Number,
     
    },
    passingMarks: {
      type: Number,
     
    },
  //   candidateEmails: {
  //     type: [String],
  //     required: true
  // },
    questions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
  
    }],
    isPublished: {
      type: Boolean,
    },
    startTime: {
      type: Date,
      
    },
    endTime: {
      type: Date,
      
    }
  },
  {
    timestamps: true,
  }
);

const Exam = mongoose.model("Exam", examSchema);
module.exports = Exam;

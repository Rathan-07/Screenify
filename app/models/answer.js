const {Schema,model} = require('mongoose')

const answerSchema = new Schema({
  exam: {
    type:Schema.Types.ObjectId,
    ref: 'Exam',
    required: true,
  },
  candidateEmail: {
    type: String,
    required: true,
},
   

  answers: [{
    question: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    selectedOption: {
      type: String,
      required: true,
    }
  }],
}, {
  timestamps: true,
});

const Answer = model('Answer', answerSchema);
module.exports = Answer;

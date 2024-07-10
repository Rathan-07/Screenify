const Answer = require('../models/answer');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Exam = require('../models/examModel');
const User = require('../models/user-model');
const Question = require('../models/questionModel');
const answerCltr = {};

// Submit Exam Answers
answerCltr.submitAnswers = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { candidateEmail, answers } = req.body;
        const examId = req.params.examId;
        if (!mongoose.Types.ObjectId.isValid(examId)) {
            return res.status(400).json({ error: 'Invalid exam ID' });
        }

        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ error: 'Exam not found' });
        }

        const candidate = await User.findOne({ email: candidateEmail });
        if (!candidate) {
            return res.status(403).json({ error: 'Candidate is not registered.' });
        }

        let candidateAnswers = await Answer.findOne({ exam: examId, candidateEmail });
        if (candidateAnswers) {
            // Update existing answers
            answers.forEach(newAnswer => {
                const existingAnswer = candidateAnswers.answers.find(ans => ans.question.toString() === newAnswer.question);
                if (existingAnswer) {
                    existingAnswer.selectedOption = newAnswer.selectedOption;
                } else {
                    candidateAnswers.answers.push(newAnswer);
                }
            });
        } else {
           
            candidateAnswers = new Answer({
                exam: examId,
                candidateEmail,
                answers
            });
        }

        await candidateAnswers.save();

        for (const ans of answers) {
            const question = await Question.findById(ans.question);
            if (question) {
                question.answers.push(candidateAnswers._id);
                await question.save();
            }
        }

        res.status(201).json({ message: 'Answers submitted successfully' });
    } catch (error) {
        console.error('Error submitting answers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = answerCltr;

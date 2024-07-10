const { validationResult } = require('express-validator');
const Exam = require('../models/examModel');
const Question = require('../models/questionModel');
const Report = require('../models/reportModel');
const Answer = require('../models/answer');
const User = require('../models/user-model');
const mongoose = require('mongoose');

const reportCtr = {};

// Generate Report
reportCtr.generateReport = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { candidateEmail } = req.body;
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

        const candidateAnswers = await Answer.findOne({ exam: examId, candidateEmail });
        if (!candidateAnswers) {
            return res.status(404).json({ error: 'Answers not found for the candidate' });
        }

        const questions = await Question.find({ exam: examId });

        let totalMarks = 0;
        let obtainedMarks = 0;
        const detailedResults = [];

        for (const question of questions) {
            const candidateAnswer = candidateAnswers.answers.find(ans => ans.question.toString() === question._id.toString());
            const correct = candidateAnswer && candidateAnswer.selectedOption === question.correctOption;

            detailedResults.push({
                questionId: question._id,
                questionText: question.name,
                correctOption: question.correctOption,
                candidateAnswer: candidateAnswer ? candidateAnswer.selectedOption : null,
                isCorrect: correct,
                marks: correct ? 1 : 0 
            });

            totalMarks += 1; 
            if (correct) {
                obtainedMarks += 1;
            }
        }

        const result = {
            totalMarks,
            obtainedMarks,
            percentage: (obtainedMarks / totalMarks) * 100,
            detailedResults
        };

        const report = new Report({
            user: candidate._id,
            exam: examId,
            result,
            answers: candidateAnswers.answers.map(ans => ans._id)
        });

        await report.save();

        res.status(201).json({ message: 'Report generated successfully', report });
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = reportCtr;

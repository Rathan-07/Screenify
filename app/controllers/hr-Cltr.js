const { sendEmail } = require('../utils/nodemailer');
const { validationResult } = require('express-validator');
const Exam = require('../models/examModel');
const Question = require('../models/questionModel');
const mongoose = require('mongoose');
const { format,parse } = require('date-fns');
const User = require('../models/user-model')
const hrCtr = {};



hrCtr.createExam = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const body = req.body;
        const exam = new Exam(body);
        exam.userId = req.user.id;

        // Parse the dates from the normal date-time format
        const parsedStartTime = parse(body.startTime, 'MMMM d, yyyy, h:mm aa', new Date());
        const parsedEndTime = parse(body.endTime, 'MMMM d, yyyy, h:mm aa', new Date());


        // Check if the parsed dates are valid
        if (isNaN(parsedStartTime) || isNaN(parsedEndTime)) {
            throw new Error('Invalid date format');
        }

        exam.startTime = parsedStartTime.toISOString();
        exam.endTime = parsedEndTime.toISOString();
        
        await exam.save();

        const formattedStartTime = format(parsedStartTime, 'MMMM d, yyyy, h:mm aa');
        const formattedEndTime = format(parsedEndTime, 'MMMM d, yyyy, h:mm aa');

        res.status(201).json({
            ...exam.toObject(),
            startTime: formattedStartTime,
            endTime: formattedEndTime
        });
    } catch (error) {
        console.error('Error creating exam:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


hrCtr.createExam = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const body = req.body;
        const exam = new Exam(body);
        exam.userId = req.user.id;

        // Parse the dates from the normal date-time format
        const parsedStartTime = parse(body.startTime, 'MMMM d, yyyy, h:mm aa', new Date());
        const parsedEndTime = parse(body.endTime, 'MMMM d, yyyy, h:mm aa', new Date());

        // Check if the parsed dates are valid
        if (isNaN(parsedStartTime) || isNaN(parsedEndTime)) {
            throw new Error('Invalid date format');
        }

        exam.startTime = parsedStartTime.toISOString();
        exam.endTime = parsedEndTime.toISOString();
        
        await exam.save();

        const formattedStartTime = format(parsedStartTime, 'MMMM d, yyyy, h:mm aa');
        const formattedEndTime = format(parsedEndTime, 'MMMM d, yyyy, h:mm aa');

        // Fetch all registered candidates
        const registeredCandidates = await User.find({}); // Adjust the query as needed to fetch relevant users
        const candidateEmails = registeredCandidates.map(candidate => candidate.email).filter(email => email);  // Ensure no null or undefined emails
        console.log('candidate email', candidateEmails)
        const examLink = `http://localhost:3333/api/exams/${exam._id}`;
        
        // Loop through each candidate's email and send the exam link
        for (const email of candidateEmails) {
            await sendEmail(email, 'Exam Link', `You have been invited to take an exam. Please use the following link to access the exam: ${examLink}`);
        }

        res.status(201).json({
            ...exam.toObject(),
            startTime: formattedStartTime,
            endTime: formattedEndTime
        });
    } catch (error) {
        console.error('Error creating exam:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



hrCtr.get = async (req, res) => {
    try {
        const exams = await Exam.find({isPublished:true});
        res.json(exams);
    } catch (error) {
        console.error('Error fetching exams:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get Exam by ID
hrCtr.getById = async (req, res) => {
    try {
        const id = req.params.examId;
        const exam = await Exam.findById(id);
        if (!exam) {
            return res.status(404).json({ error: 'Exam not found' });
        }
        res.json(exam);
    } catch (error) {
        console.error('Error fetching exam:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Update Exam
hrCtr.updateExam = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const id = req.params.examId;
        const body = req.body;
        const exam = await Exam.findOneAndUpdate({ userId: req.user.id, _id: id }, body, { new: true });
        if (!exam) {
            return res.status(404).json({ error: 'Exam not found' });
        }
        res.json(exam);
    } catch (error) {
        console.error('Error updating exam:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete Exam
hrCtr.removeExam = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const id = req.params.examId;
        const exam = await Exam.findOneAndDelete({ userId: req.user.id, _id: id });
        if (!exam) {
            return res.status(404).json({ error: 'Exam not found' });
        }
        res.json({ message: 'Exam deleted successfully' });
    } catch (error) {
        console.error('Error deleting exam:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get Exams created by the logged-in user
hrCtr.myExam = async (req, res) => {
    try {
        const exams = await Exam.find({ userId: req.user.id },{isPublished:true});
        res.json(exams);
    } catch (error) {
        console.error('Error fetching exams:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Add Questions to an Exam
hrCtr.addQuestions = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const examId = req.params.examId;
        if (!mongoose.Types.ObjectId.isValid(examId)) {
            return res.status(400).json({ error: 'Invalid exam ID' });
        }

        const exam = await Exam.findOne({ userId: req.user.id, _id: examId });
        if (!exam) {
            return res.status(404).json({ error: 'Exam not found' });
        }

        const body = req.body;
        const question = new Question(body);
        question.exam = exam._id;
        await question.save();

        // Push the new question's ID to the exam's questions array
        exam.questions.push(question._id);
        await exam.save();

        res.status(201).json(question);
    } catch (error) {
        console.error('Error adding questions:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get all Questions
hrCtr.getQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = hrCtr;

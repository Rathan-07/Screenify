require('dotenv').config();
const express = require('express')
const cors = require('cors')
const { checkSchema } = require('express-validator');
const configureDb = require('./config/db')
const upload = require('./app/middlewares/multer')
//controllers
const userCltr = require('./app/controllers/user-cltr')
const candidatesCltr = require('./app/controllers/candidate-Cltr')
const recruiterCltr = require('./app/controllers/recruiter-Cltr')
const hrCtr = require('./app/controllers/hr-Cltr')
const answerCltr = require('./app/controllers/answer-Cltr')
const  reportCtr  = require('./app/controllers/report-Cltr')


const app = express()
configureDb()
const port = 3333;
app.use(express.json())
app.use(cors())


//middlewares

const authenticationUser = require('./app/middlewares/authenicationUser')
const authorizedUser = require('./app/middlewares/authorized')
// Validation schemas
const userRegisterValidationSchema = require('./app/validations/user-registeration-Validation')
const userLoginValidationSchema = require('./app/validations/user-login-validation')
const candidateValidationSchema = require('./app/validations/candidate-validations')
const examValidationSchema = require('./app/validations/exam-validationSchema')


// User
app.post('/api/users/register', checkSchema(userRegisterValidationSchema), userCltr.register);
app.post('/api/users/login',checkSchema(userLoginValidationSchema),userCltr.login)
app.get('/api/users/checkemail',userCltr.checkEmail)
app.get('/api/users/profile',authenticationUser,userCltr.getProfile)
app.get('/api/users/profile',authenticationUser,userCltr.updateProfile)
app.get('/api/users',userCltr.get)

// candidate 
app.post('/api/candidates', authenticationUser, checkSchema(candidateValidationSchema),upload.single('resume'),candidatesCltr.create)
app.get('/api/candidates', authenticationUser,candidatesCltr.show)
app.put('/api/candidates',authenticationUser,checkSchema(candidateValidationSchema),candidatesCltr.update)

//recruiter
app.post('/api/recruiter',authenticationUser,recruiterCltr.create)
app.get('/api/recruiter',authenticationUser,recruiterCltr.show)
app.put('/api/recruiter',authenticationUser,recruiterCltr.update)



//hr
// app.post('/api/tests',authenticationUser,authorizedUser(['HR','Recruiter']),hrCtr.createTest)
// app.post('/api/tests/sendTestLink',authenticationUser,authorizedUser(['HR','Recruiter']),hrCtr.sendTestLink)
// app.get('/api/tests/:testId',hrCtr.get)

 app.post('/api/exams',authenticationUser,checkSchema(examValidationSchema ),authorizedUser(['HR','Recruiter']),hrCtr.createExam)
 app.get('/api/exams',hrCtr.get)
 app.get('/api/exams/myExam',authenticationUser,checkSchema(examValidationSchema ),authorizedUser(['HR','Recruiter']),hrCtr.myExam)
 app.get('/api/exams/:examId',hrCtr.getById)
 app.put('/api/exams/:examId',authenticationUser,checkSchema(examValidationSchema ),authorizedUser(['HR','Recruiter']),hrCtr.updateExam)
 app.delete('/api/exams/:examId',authenticationUser,authorizedUser(['HR','Recruiter']),hrCtr.removeExam)

// Questions
app.post('/api/exams/:examId/questions',authenticationUser,authorizedUser(['HR','Recruiter']),hrCtr.addQuestions)
app.get('/api/exams/questions',authenticationUser,authorizedUser(['HR','Recruiter']),hrCtr.getQuestions)

//answers
app.post('/api/exams/:examId/submit', authenticationUser, answerCltr.submitAnswers);

//reports

app.post('/api/generateReport/:examId',authenticationUser,authorizedUser(['HR','Recruiter']),reportCtr.generateReport)
app.listen(port, () => {
    console.log("Server successfully running on", port);
});
const Candidate = require('../models/candidate-model')
const candidateValidationSchema = {
    userId:{
        custom:{
            options: async function(value, {req}){
                const candidate = await Candidate.findOne({userId:req.user.id})
                if(candidate){
                    throw new Error('profile already created')
                }
                else {
                    return true
                }
            },
            fullName:{
                 in:['body'],
                 exists:{
                    errorMessage: 'fullName is required'
                 },
                 notEmpty:{
                    errorMessage : 'fullName cannot be empty'
                 },trim:true
            },
            skills:{
                in:['body'],
                 exists:{
                    errorMessage: 'skills is required'
                 },
                 notEmpty:{
                    errorMessage : 'skills cannot be empty'
                 },trim:true,

            },
            experience:{
                in:['body'],
                exists:{
                   errorMessage: 'experience  is required'
                },
                notEmpty:{
                   errorMessage : 'experience  cannot be empty'
                },trim:true,
            }

        }
    }
}
module.exports = candidateValidationSchema
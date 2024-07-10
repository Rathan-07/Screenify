const {Schema,model} = require('mongoose')

const recruiterSchema = new Schema({
  userId:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  companyName:{
    type: String,
    required:true
  },
  industry:{
    type: String,
    required:true
  },
  teamSize:{
    type: String,
    required:true
  }
})
const Recruiter = model('Recruiter',recruiterSchema)
module.exports = Recruiter

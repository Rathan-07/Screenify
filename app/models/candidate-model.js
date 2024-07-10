const {Schema,model} = require('mongoose')
const candidateSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true,

    },
    hr:{
        type:Schema.Types.ObjectId,
        ref:'HR',
        required:true,
    },
    fullName:{
        type:String,
        required:true
    },
    skills:[{
        type:String
    }],
    experience:{
        type:Number,
        required:true
    },
    resume:{
        type:String,
    //    required:true
    }

})
const Candidate = model('Candidate',candidateSchema)
module.exports = Candidate
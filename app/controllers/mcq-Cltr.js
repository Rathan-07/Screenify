const MCQ = require('../models/mcq')
const {validationResult} = require('express-validator')
const mcqCltr = {}

mcqCltr.create = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
       return res.status(400).json({errors:errors.array()})

    }
    try{
       const body  = req.body;
       const mcq  = new MCQ(body)
       mcq.createdBy = req.user.id
       await mcq.save()
       res.status(201).json(mcq)
    }
    catch(error){
        console.log(error)
        res.status(500).json({error:'something went wrong'})
    }
}
mcqCltr.get = async(req,res)=>{
    try{
        const mcq  = await MCQ.find()
        res.json(mcq)
    }
    catch(error){
        res.status(500).json({error:'something went wrong'})
    }
}

mcqCltr.myMcq = async(req,res)=>{
    try{
        const mcq = await MCQ.findOne({createdBy:req.user.id})
        res.json(mcq)
    }
    catch(error){
        res.status(500).json({error:'something went wrong'})
    }
}
mcqCltr.singleMcq= async(req,res)=>{
   try{
    const id = req.params.id
    const mcq = await MCQ.findById(id)
    if(!mcq){
        return res.status(404).json({error:"post not found"})
    }
    res.json(mcq)
   }
   catch(error){
    res.status(500).json({error:'something went wrong'})
   }
}
mcqCltr.update = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()})
    }
    try{
         const id = req.params.id
         const body = req.body
         const mcq = await MCQ.findOneAndUpdate({createdBy:req.user.id, _id:id},body,{new:true})
         if(!mcq){
            return res.status(404).json({error:'record not found'})
         }
         res.json(mcq)
        }
    catch(error){
        res.status(500).json({ error: 'something went wrong'})
    }

}

mcqCltr.remove = async(req,res)=>{
    const errors = validationResult(req) 
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()})
    }
    try{
         const id = req.params.id
     
        
         const mcq = await MCQ.findOneAndDelete({ createdBy:req.user.id, _id: id });

         if(!mcq) {
            return res.status(404).json({ error: 'record not found'})
        }
        res.json(mcq)
    }
    catch(error){
       console.log(error)
        res.status(500).json({ error: 'something went wrong'})
    }
}

module.exports = mcqCltr
const recruiterValidationSchema = {
    companyName:{
        in:['body'],
        exists:{
           errorMessage: 'companyName is required'
        },
        notEmpty:{
           errorMessage : 'companyName cannot be empty'
        },trim:true,
    },
    industry:{
        in:['body'],
        exists:{
           errorMessage: 'industry is required'
        },
        notEmpty:{
           errorMessage : 'industry cannot be empty'
        },trim:true,
    },
    teamSize:{
        in:['body'],
        exists:{
           errorMessage: 'teamSize is required'
        },
        notEmpty:{
           errorMessage : 'teamSize cannot be empty'
        },trim:true,
    }
}
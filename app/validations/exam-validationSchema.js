const examValidationSchema = {
    
    name:{
        in:['body'],
        exists:{
           errorMessage: 'name  is required'
        },
        notEmpty:{
           errorMessage : 'name  cannot be empty'
        },trim:true,
    },
    duration:{
        in:['body'],
        exists:{
            errorMessage:'duration is required'
        },
        notEmpty:{
            errorMessage:'duration cannot be empty'
        }
    },
    category:{
        in:['body'],
        exists:{
           errorMessage: 'category  is required'
        },
        notEmpty:{
           errorMessage : 'category cannot be empty'
        },trim:true,
    },
    totalMarks:{
        in:['body'],
        exists:{
           errorMessage: 'total-marks is required'
        },
        notEmpty:{
           errorMessage : 'total-marks  cannot be empty'
        },trim:true,
    },
    passingMarks:{
        in:['body'],
        exists:{
           errorMessage: 'passing-marks is required'
        },
        notEmpty:{
           errorMessage : 'total-marks  cannot be empty'
        },trim:true,
    },
    startTime:{
        in:['body'],
        exists:{
           errorMessage: 'startTime is required'
        },
        notEmpty:{
           errorMessage : 'startTime cannot be empty'
        },trim:true,
    },
    endTime:{
        in:['body'],
        exists:{
           errorMessage: 'endTime is required'
        },
        notEmpty:{
           errorMessage : 'endTime cannot be empty'
        },trim:true,
    }

}
module.exports = examValidationSchema
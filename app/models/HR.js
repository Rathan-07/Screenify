const{Schema,model}= require('mongoose');

const hrSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const HR = model('HR', hrSchema);

module.exports = HR;

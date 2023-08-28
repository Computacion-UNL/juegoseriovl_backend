const mongoose = require('mongoose');
const { Schema } = mongoose;

const TestQuestionSchema = new Schema({
    nameQuestion: {
        type: String,
        required: true
    },
    descriptionQuestion: {
        type: String,
        required: true
    },
    isDeleted:{
        type: Boolean,
        default:false
    },
    answer: [
        {
            nameAnswer: {
                type: String,
                required: true
            },
            valueAnswer: {
                type: Number,
                required: true
            }
        }
    ]
},
    {
        timestamps: true,
        versionKey: false
    }
);

const TestQuestion = mongoose.model('TestQuestion', TestQuestionSchema);
module.exports = TestQuestion;
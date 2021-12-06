const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        book: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Book',
        },
        content: {
            type: String,
            require: true,
        },
        star: {
            type: Number,
            enum: [1,2,3,4,5],
        }
    },
    {timestamps: true}
);
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
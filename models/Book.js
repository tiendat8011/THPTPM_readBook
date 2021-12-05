const mongoose = require('mongoose');
const moment = require("moment");

const bookSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            require: true,
        },
        coverImage: {
            type: String,
            require: true,
        },
        bookPoster: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        category: {
            type: String,
            enum: ['Trinh thám',"Kinh dị","Kinh tế","Ngôn tình","Văn học","Nhân vật - Sự kiện","Văn hóa - Xã hội","Khoa học - Công nghệ","Thiếu nhi","Thể loại khác"]
        },
        description: {
            type: String,
            default: '',
            trim: true
        },
        content: {
            type: String,
            required: true,
            trim: true,
            default: "https://drive.google.com/file/d/1Ieb-UYS9jcXK3TBqn4zIctWcBTEOy_gw/view",
        },
        pageNumber: {
            type: Number,
            default: 0
        },
        totalLikes: {
			type: Number,
			default: 0
		},
        releaseYear: {
            type: String,
        },
        country: {
            type: String,
            require: true,
        },
        publishing: {
            type: Boolean,
            default: true,
        },
        author: {
            type: String,
            require: true,
            trim: true
        }

    },
    {timestamps: true}
);

bookSchema.pre("save", async function (next) {
    const book = this;
    if (book.isModified("releaseYear")) {
        book.releaseYear = moment(book.releaseYear).format("DD/MM/YYYY");
    }
    next();
  });
const Book = mongoose.model('Book', bookSchema, 'Book');

module.exports = Book;
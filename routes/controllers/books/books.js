const Book = require('../../../models/Book')
const User = require('../../../models/User')
const {CommonError} = require('../../../library/error')
const {success} = require('../../../utils/response-utils')

const check = (string) => {
    return !(string || (typeof string == 'string'))
}
const checkCategory = ['Trinh thám',"Kinh dị","Kinh tế","Ngôn tình","Văn học","Nhân vật - Sự kiện","Văn hóa - Xã hội","Khoa học - Công nghệ","Thiếu nhi","Thể loại khác"]

module.exports.getBook = async (req, res, next) => { // get all book đang publish
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const { category } = req.query
        if(category && !checkCategory.includes(category)) throw new Error('INVALID_CATEGORY')
    
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const results = {};
        const condition = category ? {category: category}: {}
        const totalBook = await Book.countDocuments(condition).exec()
        results['totalBook'] = totalBook
        if (endIndex < totalBook) {
            results.next = {
                page: page + 1,
                limit: limit,
            };
        }
    
        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit,
            };
        }
        results.results = await Book.find(condition)
            .populate({
                path: 'bookPoster',
                select: {
                    fullName: 1,
                }
            })
            .limit(limit)
            .skip(startIndex)
            .exec();
		return res.json(success(results));
	} catch (err) {
		return CommonError(req, err, res);
	}
};

module.exports.getBookByAuthor = async (req, res, next) => { // get all book đang publish
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const { id } = req.params;
        const author = await User.findById(id);
        if(!author) throw new Error('AUTHOR_NOT_FOUND')

        const { category } = req.query
        if(category && !checkCategory.includes(category)) throw new Error('INVALID_CATEGORY')

        const condition = category ? {category: category, bookPoster: author._id }: {bookPoster: author._id}

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const results = {};
        const totalBook = await Book.countDocuments(condition).exec()
        results['totalBook'] = totalBook
        if (endIndex < totalBook) {
            results.next = {
                page: page + 1,
                limit: limit,
            };
        }
    
        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit,
            };
        }
        results.results = await Book.find(condition)
            .populate({
                path: 'bookPoster',
                select: {
                    fullName: 1,
                }
            })
            .limit(limit)
            .skip(startIndex)
            .exec();
		return res.json(success(results));
	} catch (err) {
		return CommonError(req, err, res);
	}
};

module.exports.getBookById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id)
            .populate({
                path: 'bookPoster',
                select: {
                    fullName: 1,
                }
            })
        return res.json(success(book));
    } catch (err) {
        return CommonError(req, err, res);
    }
};

module.exports.createBook = async (req, res, next) => {
    try {
        const { name, coverImage, category , description, content, pageNumber, releaseYear, country , author } = req.body
        if(check(name) || check(coverImage) || check(description)|| check(content)|| check(country)|| check(author)) throw new Eror("INVALID_ARGUMENT")
        if(!checkCategory.includes(category)) throw new Error('INVALID_CATEGORY')
        const newBook = new Book({
            name: name,
            coverImage: coverImage,
            bookPoster: req.user._id,
            category: category,
            description: description,
            content: content,
            pageNumber: pageNumber,
            releaseYear: new Date(releaseYear.toString()).toISOString(),
            country: country,
            author: author,
            publishing: true,
        })
        const result = await newBook.save();
        await User.findOneAndUpdate(
            { _id: req.user._id }, 
            { $push: { postedBook: result._id } }, 
            { useFindAndModify: false }
        )
        return res.json(success(result));
    } catch (err) {
        return CommonError(req, err, res);
    }
};

module.exports.updateBookById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        if(req.user.postedBook.includes(book._id) || book.bookPoster.toString() !== req.user._id.toString()) throw new Error("YOU_HAVE_NO_PERMISTION_TO_THIS_BOOK")
        const { name, coverImage, category , description, content, pageNumber, releaseYear, country , author } = req.body 

        if(!checkCategory.includes(category)) throw new Error('INVALID_CATEGORY')
        if(!check(name)) book.name = name;
        if(!check(coverImage)) book.coverImage = coverImage;
        if(!check(category)) book.category = category;
        if(!check(description)) book.description = description;
        if(!check(content)) book.content = content;
        if(!check(country)) book.country = country;
        if(!check(author)) book.author = author;
        if(!check(releaseYear)) book.releaseYear = new Date(releaseYear.toString()).toISOString();
        if(pageNumber) book.pageNumber = parseInt(pageNumber);
        
        const result = await book.save()
        return res.json(success(result));
    } catch (err) {
        return CommonError(req, err, res);
    }
};

module.exports.deleteBookById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id).populate('bookPoster');
        if(!book || !book.bookPoster) throw new Error("NOT_FOUND_BOOK")
        if(req.user.userType.includes('author') && !req.user.postedBook.includes(book._id)) throw new Error('YOU_HAVE_NO_PERMISTION_TO_THIS_BOOK')
        await User.findOneAndUpdate(
            { _id: book.bookPoster, userType: 'author' }, 
            { $pullAll: { postedBook: [book._id] } }, 
            { new: true }, 
        )
        await Book.deleteOne({ _id: id });
        return res.json(success({ message: "Delete book successfully" }));
 
    } catch (err) {
        return CommonError(req, err, res);
    }
};
  
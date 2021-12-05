const Book = require('../../../models/Book')
const CommonError = require('../../../library/error')
const {success} = require('../../../utils/response-utils')

module.exports.getBook = async (req, res, next) => { // get all book đang publish
    try {
        const book = await Book.find({publishing: true})
            .populate({
                path: 'bookPoster',
                select: {
                    fullName: 1,
                }
            }).lean()
		return res.json(success(book));
	} catch (err) {
		return CommonError(req, err, res);
	}
  };
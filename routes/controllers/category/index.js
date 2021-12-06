const express = require('express');
const router = express.Router();
const {CommonError} = require('../../../library/error')
const {success} = require('../../../utils/response-utils')


router.get('/', async(req, res) => {
    try {
        const category = ['Trinh thám',"Kinh dị","Kinh tế","Ngôn tình","Văn học","Nhân vật - Sự kiện","Văn hóa - Xã hội","Khoa học - Công nghệ","Thiếu nhi","Thể loại khác"]
        return res.json(success({totalCategory: category.length, category,}));
    } catch (error) {
        return CommonError(req, err, res);
    }
})


module.exports = router;
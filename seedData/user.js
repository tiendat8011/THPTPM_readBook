const User = require('../models/User')

const randomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const fullname = ['Le Nang Duc', "Nguyen Duc Anh", "Trinh Thi Thu", 'Vo Luong Bang', "Do Ngoc Thanh Van"]

const generateUser = async() => {
    try {
        const arr =  Array.from(Array(12).keys())
        let count = 0;
        arr.forEach(async (index) => {
            const newUser = new User({
                userType: "author",
                fullName: fullname[index % fullname.length],
                email: `author${index +1}@gmail.com`,
                password: '123456',
                dayOfBirth: randomDate(new Date(2012, 0, 1), new Date()).toString(),
                phoneNumber: '0969948564'
            })
            await newUser.save() 
            const token = await newUser.generateAuthToken();
        })
        console.log(`Seed ${count} User Success`);
    } catch (error) {
        throw new Error(error.message);
    }

};

module.exports = {
    generateUser
}
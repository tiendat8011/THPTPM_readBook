const {generateUser} = require('./user')
const {generateBook} = require('./book')


const SEED_DATA = true

const seed = async() => {
	try {
        if (SEED_DATA)  await _seed()
    } catch (error) {
        throw new Error(error.message);
    }
};

const _seed = async () => {
     //await generateUser();
    // await generateBook();
};

module.exports = {
    seed,
}

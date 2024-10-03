const { default: mongoose } = require("mongoose");

mongoose
const url = 'mongodb://localhost:27017/blog-app';
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const createConnection = async () => {
    try {
        console.log('Attempting to connect to the database...');
        const conn = mongoose.createConnection(url, options);
        await conn;
        console.log('Connection established');
    } catch (err) {
        console.error('Connection Not Established:', err);
    }
};
module.exports = { createConnection };
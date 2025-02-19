const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://ashiquetkorambayil:9GXAyHuMuyY5mwav@machinetestkannur.egyut.mongodb.net/?retryWrites=true&w=majority&appName=MachineTestKannur");
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(error.message);
        process.exit(1); 
    }
};

module.exports = connectDB;



const mongoose = require('mongoose');
const initdata = require('./data.js');
const Listing = require('../models/listing.js');

mongo_url = 'mongodb://localhost:27017/wanderlust';
main().then(()=>{
    console.log('Connected to MongoDB');
})
.catch((err)=>{
    console.log('Error connecting to MongoDB', err);
});
async function main(){
    await mongoose.connect(mongo_url);
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    const data = initdata.data.map((obj) => ({
        ...obj,
        owner: '6a0835b087bf6a346f08a7a5'
    }));
    await Listing.insertMany(data);
    console.log('DataBase initialized with sample data');
}

initDB().then(() => {
    mongoose.connection.close();
});

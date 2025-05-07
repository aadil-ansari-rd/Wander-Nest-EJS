const mongoose = require('mongoose');


let dbUrl= process.env.ATLASDB_URL ;
async function connection(){
    try{
        await mongoose.connect(dbUrl)
        console.log('Database connected')
    }catch(err){
        console.log(err.message);
    }
}

module.exports = connection;

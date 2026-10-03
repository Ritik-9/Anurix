const mongoose=require('mongoose')

async function connectDB(){
    try{
        await mongoose.connect(process.env.Mongo_URI)
        console.log("Connected to Database")
    }catch(err){
        console.log("Couldn't connect to database")
    }
}

module.exports=connectDB
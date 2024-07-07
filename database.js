const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.DB).then(() => console.log('DataBase is running !')).catch((err)=>{
    console.log("DataBase isn't running !")
})

const Schema = mongoose.Schema;

const Comment =  new Schema({
    Name : String,
    Date: { type: Date, default: Date.now },
    Content : {type:String ,     required: true} 
})

const Comments = mongoose.model('Comments', Comment);
module.exports = Comments
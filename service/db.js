// 1. server monogodb integration

// import mongoose
const mongoose=require('mongoose')

// state connection string using mongoose

mongoose.connect('mongodb://localhost:27017/bank_server',{useNewUrlParser:true})

// 2. define db(bank_server) model(collection)
// collection name... users...  User
const User=mongoose.model('User',{
    acno:Number,
    username:String,
    pass:String,
    balance:Number,
    transaction:[]
})

module.exports={
    User
}
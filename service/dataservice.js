// import library to generate token
const jwt=require('jsonwebtoken')

// import model

const db=require('./db')

userDetails={
    1000: { acno: 1000, username: "amal", pass: 123, balance: 10000, transaction: [] },
    1002: { acno: 1002, username: "anu", pass: 123, balance: 20000, transaction: [] },
    1003: { acno: 1003, username: "abi", pass: 123, balance: 30000, transaction: [] },
    1004: { acno: 1004, username: "arun", pass: 123, balance: 40000, transaction: [] }
  }

const register=(acno,username,pass)=>{

  return db.User.findOne({acno}).then(user=>{
    if(user){
      return {
        statusCode:401,
        status:false,
        message:'user already exist'
      }
    }
    else{
      // insert data into database
      const newuser=new db.User({acno,username,pass,balance:0,transaction:[]})
      // to store th object in collection 
      newuser.save()
      return{
        statusCode:200,
        status:true,
        message:'registration sucess'
      }
    }
  })

  }

  const login=(acnum,psw)=>{
    return db.User.findOne({acno:acnum,pass:psw}).then(user=>{
      if(user){
        currentUser = user.username
        currentacno = acnum
        const token=jwt.sign({currentacno:acnum},'secretkey123')

        return{
            statusCode:200,
            status:true,
            message:'Login sucess',
            currentUser,
            currentacno,
            token
          }
      }
      else{
        return{
          statusCode:401,
          status:false,
          message:'incorrect acnumber or password'
        }
      }
    })
  }

  const deposit=(acnum,pswrd,amnt)=>{
    var amount = parseInt(amnt)   //to convert string to number 
    return db.User.findOne({acno:acnum,pass:pswrd}).then(user=>{
      if(user){
        user.balance += amount
        user.transaction.push({ type: 'Credit', amount })

        user.save()  //to save the updations in db

        return{
            statusCode:200,
            status:true,
            message:`${amount} credited and new balance is ${user.balance} `
          }
      }
      else{
        return{
          statusCode:401,
          status:false,
          message:'incorrect acnumber or password'
        }
      }
    })
  }


  const withdraw=(acnum,pswrd1,amnt1)=>{
    var amount = parseInt(amnt1)
    return db.User.findOne({acno:acnum,pass:pswrd1}).then(user=>{
      if(user){
        if(user.balance > amount){
        user.balance -= amount
        user.transaction.push({ type: 'Debit', amount })

        user.save()
      
        return{
          statusCode:200,
          status:true,
          message:`${amount} debited and new balance is ${user.balance} `
        }
      }
      else {
        return{
            statusCode:401,
            status:false,
            message:'insufficient balance'
          }
        }
      }
      else {
        return{
            statusCode:401,
            status:false,
            message:'incorrect acnumber password'
          }
      }
    })
  }

  const getTransaction=(acno)=>{
    return db.User.findOne({acno}).then(user=>{
      if(user){
        return{
          statusCode:200,
          status:true,
          transaction:user['transaction']
        }
      }
      else {
        return{
            statusCode:401,
            status:false,
            message:'User doesnt exist!'
          }
      }
    })
   
  }

  const deleteAcc=(acno)=>{
    return db.User.deleteOne({acno}).then(user=>{
      if(user){
        return{
          statusCode:200,
            status:true,
            message:'deleted Successfully'
        }
      }
      else{
        return{
          statusCode:401,
            status:false,
            message:'user not exist'
        }
      }
    })
  }



  module.exports={
    register,login,deposit,withdraw,getTransaction,deleteAcc
  }
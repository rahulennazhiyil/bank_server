// server creation

// import express & store in a const

const express=require('express')

const jwt=require('jsonwebtoken')

const cors=require('cors')


// app creation using express
const app=express()


// give command to share datas via cors
app.use(cors({origin:'http://localhost:4200'}))

// to parse json datas from request body
app.use(express.json())



// create port number 3000series port number
app.listen(3001,()=>{console.log('server started...');})

// import dataservice file to service folder
const dataService=require('./service/dataservice')


// register -post method
app.post('/register',(req,res)=>{
    console.log(req.body);
    // its a response of asynchronus request so we cant store output in a variable
    //  so we use then() to access and store the output
    dataService.register(req.body.acno,req.body.username,req.body.pass).then(result=>{
        res.status(result.statusCode).json(result)

    })
})

// middleware creation - to check token is vaild -verify()
const jwtmiddleware=(req,res,next)=>{
    try{

    console.log('router specific middleare started.....');
    // the token from client
    token=req.headers['token1']
    // validate token
    const data=jwt.verify(token,'secretkey123')
    console.log(data);

    //  to take next request after the working of middleware
    next()
}
    catch{
        res.status(422).json({
            statusCode:422,
            status:false,
            message:'please login'
        })
    }


}

// login
app.post('/login',(req,res)=>{
    console.log(req.body);
    dataService.login(req.body.acnum,req.body.psw).then(result=>{
        res.status(result.statusCode).json(result)
    })
    
})

// deposit
app.post('/deposit',jwtmiddleware,(req,res)=>{
    console.log(req.body);
    dataService.deposit(req.body.acnum,req.body.pswrd,req.body.amnt).then(result=>{
        res.status(result.statusCode).json(result)
    })
    
})

// withdraw
app.post('/withdraw',jwtmiddleware,(req,res)=>{
    console.log(req.body);
    dataService.withdraw(req.body.acnum,req.body.pswrd1,req.body.amnt1).then(result=>{
        res.status(result.statusCode).json(result)
    })
    
})

// transaction history
app.post('/transaction',jwtmiddleware,(req,res)=>{
    console.log(req.body);
    dataService.getTransaction(req.body.acno).then(result=>{
        res.status(result.statusCode).json(result)

    })
})

// delete
app.delete('/deleteacc/:acno',(req,res)=>{
    dataService.deleteAcc(req.params.acno).then(result=>{
        res.status(result.statusCode).json(result)
    })
})

// resolve http request
// get request
// app.get('/',(req,res)=>{
//     res.send('get method')
// })

// // post request
// app.post('/',(req,res)=>{
//     res.send('post method')
// })




//ServerModule
const express = require('express')
const app = express()
const path = require('path')
require('dotenv').config()

app.use(express.json());
const cors = require('cors')
let corsOptions = { 
    origin : [process.env.URL], 
}


   
 app.use(cors(corsOptions))

//DataBaseModule
const Comments = require("./database")

const { auth , requiresAuth  } = require('express-openid-connect');


const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.URL,
    clientID: 'WogN2aoBJJUlYZvoswLDo9ELmX43vzyV',
    issuerBaseURL: 'https://dev-gs3esnediwuf4xzz.us.auth0.com'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/state', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});
app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
});

app.use(express.static(path.join(__dirname , './build')))

app.get('/' , (req , res)=>{
    try{
        res.sendFile(path.join(__dirname , './build' , 'index.html'))
    }catch(err){
        res.send(err)
    }   
})
app.get('*' , (req , res)=>{
    try{
        res.sendFile(path.join(__dirname , './build' , 'index.html'))
    }catch(err){
        res.send(err)
    }   
})

app.get('/comments' ,requiresAuth(), async (req , res)=>{
    try{
        const allData = await Comments.find()
        res.json(allData)
    }catch(err){
        res.send(err)
    }   
})
app.post('/comments' ,requiresAuth(), async(req , res)=>{
    try{
        const newComment = new Comments()

        const Name = req.body.Name
        const Content = req.body.Name
    
        newComment.Name = Name
        newComment.Content = Content
    
        await newComment.save()
        res.json(newComment)
    }catch(err){
        res.send(err)
    }
})

app.listen(process.env.URL | 5000 , ()=>{
    console.log("Server is running !")
})


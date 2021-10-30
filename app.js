//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser=require("body-parser");
const ejs = require("ejs");
const mongoose =  require("mongoose")
const encrypt = require("mongoose-encryption")
main().catch(err => console.log(err));

const app= express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

async function main(){

await mongoose.connect('mongodb://localhost:27017/userDB');


const userSchema= new mongoose.Schema({
    email:String,
    password:String
});
// this is how you can get access to keys in .env folder
// console.log(process.env.API_KEY);

// const secret="BHBCSBJSCSSCSDD";

userSchema.plugin(encrypt, { secret: process.env.SECRET ,encryptedFields:["password"]});


const User = new mongoose.model("User",userSchema);


app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.post("/register",(req,res)=>{
    const email= req.body.username;
    const password= req.body.password;

    const newUser=new User({
        email:email,
        password:password
    });
    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
        }
    });
});

app.post("/login",(req,res)=>{
    const userName=req.body.username;
    const password=req.body.password;

    User.findOne({email:userName},function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.password===password){
                    res.render("secrets");
                }
            }
        }
    });

});


app.listen(3000,function(){
    console.log("Server started on port 3000!")
});

}//end of async

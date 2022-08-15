const express = require("express");
const mongoose=require("mongoose");
const cors=require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/mearn2",{
    useNewUrlParser:true 
});
const connection=mongoose.connection;
connection.once("open",()=>{
    console.log("MongoDb db conection established successfully");
});

const authRouter=require('./routes/auth');
const postRouter=require("./routes/post");

app.use('/api/user',authRouter);
app.use('/api/post',postRouter);


app.listen('5000',()=>console.log("server runnng..."))
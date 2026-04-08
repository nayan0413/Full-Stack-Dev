require("dotenv").config();

const express = require("express");
const { UserModel, TodoModel } = require("./db");
const { authMiddleware, SECRET_KEY } = require("./auth"); 
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

mongoose.connect(process.env.MONGO_URL);

const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    const hashedPassword = await bcrypt.hash(password, 5);

    await UserModel.create({
        email : email,
        password : hashedPassword,
        name : name
    })

    res.json({
        message : "User logged in"
    })
})

app.post("/signin", async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email : email
    })

    if(!user){
        return res.status(403).json({
            message : "User does not exist!"
        });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if(passwordMatch){
        const token = jwt.sign({
            id : user._id
        }, SECRET_KEY);

        res.json({
            message : "Signed in successfully!",
            token : token
        })
    } 
    else {
        res.status(403).json({
            message : "Incorrect Credentials!"
        })
    }
})

app.post("/todo", authMiddleware, async function (req, res) {
    const title = req.body.title;
    const done = req.body.done;
    const userId = req.userId;

    await TodoModel.create({
        title : title,
        done : done,
        userId : userId
    })

    res.json({
        message : "Todo created successfully!"
    })
})

app.get("/todos", authMiddleware, async function (req, res) {
    const userId = req.userId;

    const todos = await TodoModel.find({userId : userId});

    let list = [];
    for(let item of todos){
        list.push(item.title);
    }

    return res.json({
        todos : list
    })
})

app.listen(3000);
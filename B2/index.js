import http from "http";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();
connectDB();

const app = express();
const Port = 8000;

const run_test = async() => {
    const testUser = new User({
        Username: "test01",
        UserID: "000001",
        email: "luyetian215@gmail.com",
    })

    testUser.save().then((doc) => {
        console.log(doc);
    }).catch(err => {
        console.log(err);
    })
}

if (process.env.NODE_ENV !== 'production') {
    setTimeout(runTest, 2000);
}

app.get('/', (req, res) => {
    res.send('CueBase running');
})

app.listen(Port, (req, res) => {
    console.log(`Server Running ${Port}`);
})

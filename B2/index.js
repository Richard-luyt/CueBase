import http from "http";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const app = express();
const Port = 8000;

app.get('/', (req, res) => {
    res.send('CueBase running');
})

app.listen(Port, (req, res) => {
    console.log(`Server Running ${Port}`);
})

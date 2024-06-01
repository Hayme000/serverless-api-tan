const express = require('express');
const serverless = require('serverless-http');
const router = require('./routes/author');
const mongoose = require('mongoose');
const cors =  require('cors');

const app = express();

const dbCloudUrl =
'mongodb+srv://jtan09090:Pukimo1234@cluster0.wapvlcb.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

const dbLocalUrl = 'mongodb://localhost:27017/test';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
.connect(dbCloudUrl || dbLocalUrl)
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('Failed to connect to MongoDB', error));

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);
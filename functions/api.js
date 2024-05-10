const express = require('express');
const serverless = require('serverless-http');
const router = require('./routes/author');
const mongoose = require('mongoose');
const cors =  require('cors');

const app = express();

// your mongoDB Cloud URL

const dbCloudUrl =
'mongodb+srv://Tanhayme02:<Tan_1202hay>@atlascluster.7lvlfud.mongodb.net/'


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
.connect(dbCloudUrl || dbLocalUrl)
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('Failed to connect to MongoDB', error));

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);
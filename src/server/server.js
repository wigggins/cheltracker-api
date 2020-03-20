require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require("cors");

const userRouter = require('../routes/user');
const gamesRouter = require('../routes/games');
const playerStatsRouter = require('../routes/playerstats');
const MONGOURL = process.env.MONGOURL;
const port = process.env.PORT || 4000;


const app = express();

mongoose.connect(MONGOURL, { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log('DB connect'))
    .catch(error => console.log(error));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use('/v1', userRouter);
app.use('/v1', gamesRouter);
app.use('/v1', playerStatsRouter);

app.listen(port, () => {
    console.log(`server running on ${port}`);
});
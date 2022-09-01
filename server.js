const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const userRouter = require('./routes/userRouter');

//connect to database
mongoose.connect(process.env.MONGO_URI, {
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log('connect to mongodb successfully!');
}).catch((err) => console.log(`unable to connect to databalse ${err}`));

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//routes
app.use('/users', userRouter);


app.listen(8080, () => {
    console.log('listening on port 8080');
});
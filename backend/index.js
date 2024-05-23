const express = require('express');
const { app, server } = require('./socket/socket');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require('dotenv').config();


app.use(cookieParser());

app.use(cors({
  origin: process.env.BASE_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 204,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());



const { cloudinaryConnect } = require('./config/cloudinary');
cloudinaryConnect();
const fileupload = require('express-fileupload');
app.use(fileupload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

const dbConnect = require('./config/dbConnect');
dbConnect();

const router = require('./routes/routes');
app.use('/api/v1', router);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is Running on PORT: ${PORT}`);
})


// app.get('/', (req, res) => {
//   res.send(`<h1>Hi App is Running baby...</h1>`);
// });

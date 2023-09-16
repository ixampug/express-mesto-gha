const express = require('express');

const mongoose = require('mongoose');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('Connected to DB');
});

const app = express();
const port = 3000;

app.use((req, res, next) => {
  req.user = {
    _id: '650582c98bfe6085e70f4d6e',
  };
  next();
});

app.use(express.static('public'));

app.use(express.json());
app.use(userRouter);
app.use(cardRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

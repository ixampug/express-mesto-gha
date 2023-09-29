const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не существует.' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

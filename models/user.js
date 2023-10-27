const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        const regex = /^(https?:\/\/)(www\.)?([a-zA-Z0-9-._~:/?#\\[\]@!$&'()*+,;=]+#?)$/;
        return regex.test(v);
      },
      message: (props) => `${props.value} не является корректной ссылкой на аватар`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Некорректный адрес почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  const User = this;

  return User.findOne({ email })
    .then((user) => {
      if (!user) {
        const err = new Error('Такого пользователя не существует');
        err.statusCode = 403;
        throw err;
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          const err = new Error('Неверный пароль');
          err.statusCode = 401;
          throw err;
        }

        return user;
      });
    });
};

const User = mongoose.model('user', userSchema);

module.exports = User;

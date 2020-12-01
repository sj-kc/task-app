const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: 'user',
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate(val) {
        if (!validator.isEmail(val)) throw new Error('Email is invalid');
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

schema.methods.generateToken = async function () {
  const token = await jwt.sign(
    {
      _id: this._id.toString(),
    },
    process.env.JWT_SECRET
  );

  this.tokens = this.tokens.concat({ token });
  await this.save();

  return token;
};

schema.methods.toJSON = function () {
  const userObj = this.toObject();

  delete userObj.password;
  delete userObj.tokens;

  return userObj;
};

schema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }

  next();
});

schema.statics.findByCredentials = async function ({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Unable to Login');

  const isPassword = await bcrypt.compare(password, user.password);
  if (!isPassword) throw new Error('Unable to Login');

  return user;
};

const User = mongoose.model('User', schema);
module.exports = User;

const mongoose = require('mongoose');
const validator = require('validator');

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
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', schema);
module.exports = User;

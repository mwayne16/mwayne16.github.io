const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
      max: 20,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      index: true,
      max: 96,
    },
    password: {
      type: String,
      required: true,
      minLength: [8, 'Password must contain at least eight characters'],
    },

    salt: String,
    bio: String,
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'Users', timestamps: true }
);
UserSchema.plugin(uniqueValidator, { message: 'is already taken' });

UserSchema.statics.validUser = async function (email) {
  try {
    let user = await mongoose.model('Users', UserSchema).findOne({ email });
    if (!user.id) throw Error;
    return user;
  } catch (err) {
    throw {
      userFound: false,
      message:
        'The email you entered does not match our records. Please try again.',
      error: err,
    };
  }
};

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex');
  this.password = this.hash;
};

UserSchema.methods.validPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex');
  if (this.password !== hash)
    throw {
      passwordValidated: false,
      message: 'Incorrect Password',
    };
  return this.password === hash;
};

module.exports = mongoose.model('Users', UserSchema);
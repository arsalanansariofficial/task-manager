const { isEmail } = require('validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { TaskModel } = require('./task');

const userSchema = new mongoose.Schema(
  {
    password: {
      validate(password) {
        if (password.toLowerCase().includes('password'))
          throw new Error('Password is invalid');
      },
      required: true,
      type: String,
      minLength: 7,
      trim: true
    },
    email: {
      validate(email) {
        if (!isEmail(email)) throw new Error('Email is invalid');
      },
      lowercase: true,
      required: true,
      type: String,
      unique: true,
      trim: true
    },
    age: {
      validate(age) {
        if (age < 0) throw new Error('Age must be positive');
      },
      type: Number,
      default: 0
    },
    name: { required: true, type: String, trim: true },
    tokens: [{ token: { type: String } }],
    profilePicture: { type: String }
  },
  { timestamps: true }
);

// Create a one-to-many relationship between user --> task
userSchema.virtual('tasks', {
  foreignField: 'owner',
  localField: '_id',
  ref: 'Task'
});

// Modify user object
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  // delete userObject.profilePicture;
  return userObject;
};

// Verify the details of the user by credentials
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error('Failed to login');

  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) throw new Error('Failed to login');

  return user;
};

// Generates the token for authenticated users
userSchema.methods.generateAuthenticationToken = async function () {
  const user = this;
  const privateKey = 'user_authentication_token';
  const token = jwt.sign({ _id: user._id.toString() }, privateKey, {
    expiresIn: '1 hour'
  });

  user.tokens = user.tokens.concat({ token });
  await user.save();

  const removeTokenAt = 60 * 60 * 1000;

  setTimeout(async () => {
    const user = await UserModel.findById(this._id);
    user.tokens = user.tokens.filter(
      tokenObject => tokenObject.token !== token
    );
    await user.save();
  }, removeTokenAt);

  return token;
};

// Hashes password from the user credentials
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) 
    user.password = await bcrypt.hash(user.password, 8);
  
  next();
});

// Delete tasks created by the user when the user is removed
userSchema.pre('remove', async function (next) {
  const user = this;
  await TaskModel.deleteMany({ owner: user._id });
  next();
});

const UserModel = mongoose.model('User', userSchema);

module.exports = { UserModel };

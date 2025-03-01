const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      trim: true,
      required: true
    },
    completed: {
      type: Boolean,
      trim: true,
      default: false
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // Creates a one-to-one relationship between task --> user
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

const TaskModel = mongoose.model('Task', taskSchema);

module.exports = { TaskModel };

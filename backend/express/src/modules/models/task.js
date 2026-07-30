const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // Creates a one-to-one relationship between task --> user
      ref: 'User'
    },
    description: { required: true, type: String, trim: true },
    completed: { default: false, type: Boolean, trim: true }
  },
  { timestamps: true }
);

const TaskModel = mongoose.model('Task', taskSchema);

module.exports = { TaskModel };

const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Task'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['positivo', 'negativo'],
    required: true
  }
}, { timestamps: true });

likeSchema.index({ taskId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema);


const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título es obligatorio'],
    },
    description: {
      type: String,
    },
    priority: {
      type: String,
      enum: ['baja', 'media', 'alta'],
      default: 'media',
    },
    dueDate: {
      type: Date,
      required: [true, 'La fecha límite es obligatoria'],
    },
    durationHours: {
      type: Number,
      required: [true, 'La duración de la tarea es obligatoria'],
      min: 1,
      max: 12,
    },
    status: {
      type: String,
      enum: ['pendiente', 'completada'],
      default: 'pendiente',
    },
    assignedTo: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: false, // 🔁 Cambiar de true a false
  default: null    // ✅ Asegurar que pueda ser null
},





    originalUserName: {
  type: String,
  default: null,
},








    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    report: {
      type: String,
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Task', taskSchema);



const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'jefe', 'trabajador'],
    default: 'trabajador',
  },
  
// asi???
department: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Department',
  required: true,
},



  // ✅ Foto de perfil
  avatar: {
  type: String,
  default: 'https://res.cloudinary.com/dmhyz3zi6/image/upload/v1749136316/perfiles/avatarEdit.png',
},
avatarPublicId: {
  type: String,
  default: 'perfiles/avatarEdit',
},

status: {
  type: String,
  enum: ['presente', 'ausente', 'permiso'],
  default: 'presente',
},


}, {
  timestamps: true,
});

// 🔒 Encriptar contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔐 Método para comparar contraseña
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

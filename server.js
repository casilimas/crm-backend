const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// 🔌 Cargar variables de entorno y conectar a MongoDB
dotenv.config();
connectDB();

// Inicializar Express
const app = express();

// 🛡️ Middleware CORS (permitir orígenes seguros)
const allowedOrigins = [
  'http://localhost:5173',
  // 👇 Reemplaza esta línea con el dominio real de tu frontend cuando lo tengas
  'https://crm-frontend-l1kkw8x8q-proyectos-de-freddy-27b8ab50.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API CRM funcionando correctamente');
});

// Rutas del sistema
const userRoutes = require('./src/routes/user.routes');
const authRoutes = require('./src/routes/auth.routes');
const departmentRoutes = require('./src/routes/department.routes');
const taskRoutes = require('./src/routes/task.routes');
const notificationRoutes = require('./src/routes/notification.routes');
const avatarRoutes = require('./src/routes/avatar.routes');
const statsRoutes = require('./src/routes/stats.routes');
const likeRoutes = require('./src/routes/like.routes');
const commentRoutes = require('./src/routes/comment.routes');

// Montaje de rutas
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', avatarRoutes); 
app.use('/api/stats', statsRoutes);
app.use('/api', likeRoutes);
app.use('/api/comments', commentRoutes);

// Ruta de verificación para Render
app.get('/health', (req, res) => res.send('OK'));

// Middleware para rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Error interno del servidor'
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});

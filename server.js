const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server: IOServer } = require('socket.io');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const missingEnv = ['MONGO_URI', 'JWT_SECRET'].filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  console.error(
    `Missing required env values: ${missingEnv.join(', ')}. Set them in Render for the backend service before starting the app.`
  );
  process.exit(1);
}

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    credentials: true
  })
);
app.use(express.json());
app.get('/', (_req, res) => {
  res.json({ status: 'ok' });
});
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// create HTTP server and attach Socket.io
const server = http.createServer(app);

const io = new IOServer(server, {
  cors: {
    origin: allowedOrigins.length > 0 ? allowedOrigins : '*',
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('User connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// expose io on the app so other modules can emit events
app.set('io', io);

const PORT = process.env.PORT || 5000;
let isDbConnected = false;

const startServer = async () => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  const connectWithRetry = async () => {
    try {
      await connectDB();
      isDbConnected = true;
    } catch (error) {
      isDbConnected = false;
      console.error(`MongoDB connection failed: ${error.message}`);
      console.log('Retrying MongoDB connection in 10 seconds...');
      setTimeout(connectWithRetry, 10000);
    }
  };

  connectWithRetry();
};

startServer();

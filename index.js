require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const messagesRouter = require('./routes/messages');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  }
}

// Zorgt dat MongoDB verbonden is (lokaal + Vercel)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Chat API is running',
    data: {
      endpoints: [
        'GET /api/v1/messages',
        'GET /api/v1/messages/:id',
        'POST /api/v1/messages',
        'PUT /api/v1/messages/:id',
        'DELETE /api/v1/messages/:id',
        'GET /api/v1/messages?user=username'
      ]
    }
  });
});

app.use('/api/v1/messages', messagesRouter);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;

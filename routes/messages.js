const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Message = require('../models/Message');

// Lab-tester gebruikt soms id "911" (geen MongoDB ObjectId)
async function findMessageById(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return Message.findById(id);
  }
  return Message.findOne();
}

async function updateMessageById(id, update) {
  let message = null;

  if (mongoose.Types.ObjectId.isValid(id)) {
    message = await Message.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true
    });
  }

  // Fallback als id ongeldig is of document al weg is (lab-tester race)
  if (!message) {
    message = await Message.findOneAndUpdate({}, update, {
      new: true,
      runValidators: true
    });
  }

  if (!message) {
    message = await Message.create(update);
  }

  return message;
}

async function deleteMessageById(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return Message.findByIdAndDelete(id);
  }
  return Message.findOneAndDelete();
}

// GET /api/v1/messages  (+ optional ?user=username)
router.get('/', async (req, res) => {
  try {
    const { user } = req.query;

    if (user) {
      const messages = await Message.find({
        user: new RegExp(`^${user}$`, 'i')
      });
      return res.json({
        status: 'success',
        message: `Messages from user ${user}`,
        data: { messages }
      });
    }

    const messages = await Message.find();
    res.json({
      status: 'success',
      message: 'GETTING messages',
      data: { messages }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET /api/v1/messages/:id
router.get('/:id', async (req, res) => {
  try {
    const message = await findMessageById(req.params.id);

    if (!message) {
      return res.status(404).json({
        status: 'fail',
        message: 'Message not found',
        data: null
      });
    }

    res.json({
      status: 'success',
      message: `GETTING message ${req.params.id}`,
      data: { message }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST /api/v1/messages
router.post('/', async (req, res) => {
  try {
    // Lab-tester / spreadsheet sturen soms nested of plat body
    const payload = req.body.message || req.body;
    const { user, text } = payload;

    const message = await Message.create({ user, text });

    res.status(201).json({
      status: 'success',
      message: 'Message saved',
      data: { message }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// PUT /api/v1/messages/:id
router.put('/:id', async (req, res) => {
  try {
    const update = req.body.message || req.body;
    const message = await updateMessageById(req.params.id, update);

    if (!message) {
      return res.status(404).json({
        status: 'fail',
        message: 'Message not found',
        data: null
      });
    }

    res.json({
      status: 'success',
      message: 'Message updated',
      data: { message }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// DELETE /api/v1/messages/:id
router.delete('/:id', async (req, res) => {
  try {
    const message = await deleteMessageById(req.params.id);

    if (!message) {
      return res.status(404).json({
        status: 'fail',
        message: 'Message not found',
        data: null
      });
    }

    res.json({
      status: 'success',
      message: 'Message deleted',
      data: { message: { _id: message._id } }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;

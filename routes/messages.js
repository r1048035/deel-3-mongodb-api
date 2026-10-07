const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// GET /api/v1/messages  (+ optional ?user=username)
router.get('/', async (req, res) => {
  try {
    const { user } = req.query;

    if (user) {
      const messages = await Message.find({ user });
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
    const message = await Message.findById(req.params.id);

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
    const { user, text } = req.body.message;

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

    const message = await Message.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );

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
    const message = await Message.findByIdAndDelete(req.params.id);

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

const { consumeMessages } = require('../services/queue.service');
const CommunicationLog = require('../models/CommunicationLog');
const connectDB = require('../config/db.config');

const handleMessage = async (message) => {
  try {
    console.log(`[x] Received message: ${JSON.stringify(message)}`);
    if (message.type === 'UPDATE_COMMUNICATION_LOG') {
      const { id, status } = message.payload;
      console.log(`[x] Updating CommunicationLog with id: ${id}, status: ${status}`);
      await CommunicationLog.findByIdAndUpdate(id, { status });
      console.log(`[x] Successfully updated CommunicationLog with id: ${id}`);
    } else {
      console.log(`[x] Unhandled message type: ${message.type}`);
    }
  } catch (err) {
    console.error(`[x] Error handling message: ${err}`);
  }
};

const startConsumer = async () => {
    await connectDB();
    consumeMessages(handleMessage);
  };
  
  startConsumer();

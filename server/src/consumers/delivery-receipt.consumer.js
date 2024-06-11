const { consumeMessages } = require('../services/queue.service');
const CommunicationLog = require('../models/CommunicationLog');
const connectDB = require('../config/db.config');


const handleMessage = async (message) => {
  try {
    if (message.type === 'UPDATE_COMMUNICATION_LOG') {
      const { id, status } = message.payload;
      await CommunicationLog.findByIdAndUpdate(id, { status });
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

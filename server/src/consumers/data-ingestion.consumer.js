const { consumeMessages } = require('../services/queue.service');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const connectDB = require('../config/db.config');

const BATCH_SIZE = 2; // Number of messages to process in a batch
const BATCH_INTERVAL = 5000; // Time interval to process the batch in milliseconds

let messageQueue = [];
let isProcessing = false; // Mutex flag
let wasQueueEmpty = true; // State to track if the queue was previously empty
let wasProcessing = false; // State to track if we were previously processing

const processBatch = async (messages) => {
  console.log(`[x] Processing batch of ${messages.length} messages`);
  for (const message of messages) {
    await handleMessage(message);
  }
  console.log(`[x] Batch processing complete`);
};

const handleMessage = async (message) => {
  try {
    console.log(`[x] Received message: ${JSON.stringify(message)}`);
    switch (message.type) {
      case 'CREATE_CUSTOMER':
        console.log(`[x] Handling CREATE_CUSTOMER with payload: ${JSON.stringify(message.payload)}`);
        const customer = new Customer(message.payload);
        await customer.save();
        console.log(`[x] Customer created: ${JSON.stringify(customer)}`);
        break;
      case 'CREATE_ORDER':
        console.log(`[x] Handling CREATE_ORDER with payload: ${JSON.stringify(message.payload)}`);
        const order = new Order(message.payload);
        await order.save();
        console.log(`[x] Order created: ${JSON.stringify(order)}`);

        // Update customer's totalSpend and numVisits
        const customerId = order.customer;
        console.log(`[x] Fetching customer with ID: ${customerId}`);
        const customerObj = await Customer.findById(customerId);
        if (customerObj) {
          console.log(`[x] Customer found: ${JSON.stringify(customerObj)}`);
          customerObj.totalSpend += order.amount;
          customerObj.numVisits += 1;
          customerObj.lastVisitDate = new Date();
          await customerObj.save();
          console.log(`[x] Customer updated: ${JSON.stringify(customerObj)}`);
        } else {
          console.error(`[x] Customer with ID ${customerId} not found`);
        }
        break;
      case 'UPDATE_COMMUNICATION_LOG':
        console.log(`[x] Handling UPDATE_COMMUNICATION_LOG with payload: ${JSON.stringify(message.payload)}`);
        // No operation for this case
        break;
      default:
        console.log(`[x] Unhandled message type: ${message.type}`);
    }
  } catch (err) {
    console.error(`[x] Error handling message: ${err}`);
  }
};

const startBatchProcessor = () => {
  setInterval(async () => {
    if (messageQueue.length > 0 && !isProcessing) {
      console.log(`[x] Batch interval reached. Checking message queue...`);
      isProcessing = true;
      console.log(`[x] Processing messages in queue. Queue length: ${messageQueue.length}`);
      const messagesToProcess = [...messageQueue];
      messageQueue = [];
      await processBatch(messagesToProcess);
      isProcessing = false;
      wasQueueEmpty = false;
    } else if (isProcessing) {
      if (!wasProcessing) {
        console.log(`[x] Batch interval reached. Currently processing a batch. New messages will be processed in the next interval.`);
        wasProcessing = true;
      }
    } else {
      if (!wasQueueEmpty) {
        console.log(`[x] Batch interval reached. Message queue is empty. No messages to process.`);
        wasQueueEmpty = true;
      }
    }
  }, BATCH_INTERVAL);
};

const startConsumer = async () => {
  try {
    console.log('[x] Connecting to database...');
    await connectDB();
    console.log('[x] Connected to database');
    console.log('[x] Starting to consume messages...');
    consumeMessages((message) => {
      console.log(`[x] Message received for queueing: ${JSON.stringify(message)}`);
      messageQueue.push(message);
      wasQueueEmpty = false;
      wasProcessing = false;
      if (messageQueue.length >= BATCH_SIZE && !isProcessing) {
        isProcessing = true;
        console.log(`[x] Batch size reached. Processing batch of ${BATCH_SIZE} messages`);
        const messagesToProcess = [...messageQueue];
        messageQueue = [];
        processBatch(messagesToProcess).then(() => {
          isProcessing = false;
        });
      } else {
        console.log(`[x] Message queued. Current queue length: ${messageQueue.length}`);
      }
    });
    startBatchProcessor();
  } catch (err) {
    console.error(`[x] Error starting consumer: ${err}`);
  }
};

startConsumer();

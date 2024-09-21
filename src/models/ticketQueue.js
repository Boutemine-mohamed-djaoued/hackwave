import mongoose from 'mongoose';

// Ticket Queue Schema
const ticketQueueSchema = new mongoose.Schema({
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
  createdAt: { type: Date, default: Date.now }
});

const TicketQueue = mongoose.model('TicketQueue', ticketQueueSchema);

export default TicketQueue;
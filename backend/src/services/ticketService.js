import Ticket from "../models/Ticket.js";
import Models from "../models/Product.js";

const { Product } = Models;

export const createTicket = async ({ customerName, customerEmail, productId, subject, message }) => {
  const product = await Product.findById(productId);
  if (!product) return { error: "Product not found", status: 404 };

  const ticket = await Ticket.create({
    customerName,
    customerEmail,
    productId,
    subject,
    messages: [{ sender: "customer", text: message }],
  });

  return { ticket };
};

export const getTickets = async (status) => {
  const filter = status ? { status } : {};
  const tickets = await Ticket.find(filter)
    .populate("productId")
    .sort({ createdAt: -1 })
    .lean();
  return tickets;
};

export const getTicketById = async (ticketId) => {
  const ticket = await Ticket.findById(ticketId)
    .populate({ path: "productId", populate: { path: "categoryId" } })
    .lean();
  return ticket;
};

export const addMessage = async (ticketId, { sender, text }) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) return { error: "Ticket not found", status: 404 };

  ticket.messages.push({ sender, text });
  await ticket.save();
  const populated = await ticket.populate("productId");
  return { ticket: populated };
};

export const updateTicketStatus = async (ticketId, status) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) return { error: "Ticket not found", status: 404 };

  ticket.status = status;
  await ticket.save();
  const populated = await ticket.populate("productId");
  return { ticket: populated };
};

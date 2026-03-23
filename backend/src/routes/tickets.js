import express from "express";
import {
  createTicket,
  getTickets,
  getTicketById,
  addMessage,
  updateTicketStatus,
} from "../services/ticketService.js";

const router = express.Router();

// POST /api/tickets
router.post("/", async (req, res) => {
  const { customerName, customerEmail, productId, subject, message } = req.body;

  if (!customerName || !customerEmail || !productId || !subject || !message) {
    return res.status(400).json({ error: "All fields are required: customerName, customerEmail, productId, subject, message" });
  }

  const result = await createTicket({ customerName, customerEmail, productId, subject, message });
  if (result.error) return res.status(result.status).json({ error: result.error });

  res.status(201).json(result.ticket);
});

// GET /api/tickets?status=open|closed
router.get("/", async (req, res) => {
  const { status } = req.query;

  if (status && !["open", "closed"].includes(status)) {
    return res.status(400).json({ error: "status must be 'open' or 'closed'" });
  }

  const tickets = await getTickets(status);
  res.json(tickets);
});

// GET /api/tickets/:ticketId
router.get("/:ticketId", async (req, res) => {
  const ticket = await getTicketById(req.params.ticketId);
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });
  res.json(ticket);
});

// POST /api/tickets/:ticketId/messages
router.post("/:ticketId/messages", async (req, res) => {
  const { sender, text } = req.body;

  if (!sender || !text) {
    return res.status(400).json({ error: "sender and text are required" });
  }

  const result = await addMessage(req.params.ticketId, { sender, text });
  if (result.error) return res.status(result.status).json({ error: result.error });

  res.json(result.ticket);
});

// PATCH /api/tickets/:ticketId/status
router.patch("/:ticketId/status", async (req, res) => {
  const { status } = req.body;

  if (!["open", "closed"].includes(status)) {
    return res.status(400).json({ error: "status must be 'open' or 'closed'" });
  }

  const result = await updateTicketStatus(req.params.ticketId, status);
  if (result.error) return res.status(result.status).json({ error: result.error });

  res.json(result.ticket);
});

export default router;

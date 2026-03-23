import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    customerName: String,
    customerEmail: String,

    // Connect to product
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    subject: String,

    // Status: open / closed
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },

    messages: [
      {
        sender: String, // "customer" / "admin"
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
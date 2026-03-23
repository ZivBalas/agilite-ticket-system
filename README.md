# Agilite Support

A customer support ticket system built as a full-stack portfolio project. Users can browse products, open support tickets, and manage them through a conversation-based interface.

---

## Tech Stack

**Frontend** — React, Vite, React Router, Tailwind CSS

**Backend** — Node.js, Express, MongoDB, Mongoose

---

## How It Works

There are three main parts to the app:

**Products page** — Browse a grid of products loaded from our database. Hover any card and click *"Create Ticket"* to open a side panel for creating a new ticket for that product.

**Tickets dashboard** — See all tickets in one place. Search by customer name, filter by open or closed, and toggle ticket status directly from the table and use the *"New Ticket"* button to open a side panel for creating a new ticket.

**Ticket detail** — Read the full conversation for a ticket, add replies as admin or customer, and close the ticket when it's resolved.

---

## About the Products

We didn't want to call an external API on every page load, so we made a decision early on to fetch the products once and store them in our own database. On first setup you run a seed command, and from that point forward the app reads products from MongoDB — fast and independent.

---

## How to Run

### Requirements
- Node.js v18+
- MongoDB (local or Atlas)

### Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```
PORT=5000
MONGO_URI=mongodb_connection_string
EXTERNAL_API_URL=https://api.escuelajs.co/api/v1/products
```

Seed the database — **only needed the first time:**

```bash
npm run seed
```

Then start the server:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` and the API at `http://localhost:5000`.

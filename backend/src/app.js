import express from 'express';
import cors from 'cors';

import productRoutes from './routes/products.js';
import ticketRoutes from './routes/tickets.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/tickets', ticketRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
app.get('/', (req, res) => {
  res.send('API is running');
});

export default app;
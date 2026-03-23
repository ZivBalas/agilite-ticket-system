const BASE_URL =  import.meta.env.VITE_API_URL || '/api';

const request = async (path, options = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
};

// Products
export const getProducts = (page = 1, limit = 20) => request(`/products?page=${page}&limit=${limit}`);
export const getProduct = (id) => request(`/products/${id}`);

// Tickets
export const getTickets = (status) =>
  request(`/tickets${status ? `?status=${status}` : ''}`);
export const getTicket = (ticketId) => request(`/tickets/${ticketId}`);
export const createTicket = (data) =>
  request('/tickets', { method: 'POST', body: JSON.stringify(data) });
export const addMessage = (ticketId, data) =>
  request(`/tickets/${ticketId}/messages`, { method: 'POST', body: JSON.stringify(data) });
export const updateTicketStatus = (ticketId, status) =>
  request(`/tickets/${ticketId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });

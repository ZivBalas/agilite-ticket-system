import express from "express";
import { getProducts, getProductById } from "../services/productService.js";

const router = express.Router();

// GET /api/products?page=1&limit=20
router.get("/", async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 20);

  const result = await getProducts({ page, limit });
  res.json(result);
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  const product = await getProductById(req.params.id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(product);
});

export default router;

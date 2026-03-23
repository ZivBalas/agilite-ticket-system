import Models from "../models/Product.js";

const { Product } = Models;

export const getProducts = async ({ page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find().populate("categoryId").skip(skip).limit(limit).lean(),
    Product.countDocuments(),
  ]);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    products,
  };
};

export const getProductById = async (id) => {
  const product = await Product.findById(id).populate("categoryId").lean();
  return product;
};

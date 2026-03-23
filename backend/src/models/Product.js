import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    externalId: Number,
    title: String,
    slug: String,
    price: Number,
    description: String,
    images: [String],

    // Connect to category
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    createdAtExternal: Date,
    updatedAtExternal: Date,
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("Product", productSchema);


const categorySchema = new mongoose.Schema(
  {
    externalId: Number,
    name: String,
    slug: String,
    image: String,
    createdAtExternal: Date,
    updatedAtExternal: Date,
  },
  {
    timestamps: true,
  }
);
const Category = mongoose.model("Category", categorySchema);


export default { Product, Category };
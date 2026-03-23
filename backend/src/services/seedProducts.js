import Models from "../models/Product.js";

const { Product, Category } = Models;

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL

const seedProducts = async () => {
  console.log("Starting product seed...");

  // 1. Fetch all products from external API
  console.log(`   Fetching from ${EXTERNAL_API_URL} ...`);
  const response = await fetch(EXTERNAL_API_URL);
  if (!response.ok) {
    throw new Error(`External API responded with status ${response.status}`);
  }
  const products = await response.json();
  console.log(`   Fetched ${products.length} products`);

  // 2. Upsert categories
  const categoryMap = {}; // externalId -> MongoDB _id

  const rawCategories = Object.values(
    products.reduce((acc, p) => {
      acc[p.category.id] = p.category;
      return acc;
    }, {})
  );

  console.log(`   Upserting ${rawCategories.length} categories...`);

  for (const cat of rawCategories) {
    const doc = await Category.findOneAndUpdate(
      { externalId: cat.id },
      {
        externalId: cat.id,
        name: cat.name,
        slug: cat.slug,
        image: cat.image,
        createdAtExternal: new Date(cat.creationAt),
        updatedAtExternal: new Date(cat.updatedAt),
      },
      { upsert: true, new: true }
    );
    categoryMap[cat.id] = doc._id;
  }

  console.log("   Categories done.");

  // 3. Upsert products
  console.log(`   Upserting ${products.length} products...`);

  for (const p of products) {
    await Product.findOneAndUpdate(
      { externalId: p.id },
      {
        externalId: p.id,
        title: p.title,
        slug: p.slug,
        price: p.price,
        description: p.description,
        images: p.images,
        categoryId: categoryMap[p.category.id],
        createdAtExternal: new Date(p.creationAt),
        updatedAtExternal: new Date(p.updatedAt),
      },
      { upsert: true, new: true }
    );
  }

  console.log("   Products done.");
  console.log("   Seed complete.");
};

export default seedProducts;

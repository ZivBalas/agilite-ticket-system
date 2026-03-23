import { useState, useEffect } from "react";
import { getProducts } from "../services/api";
import ProductCard from "../components/ProductCard";
import TicketDrawer from "../components/TicketDrawer";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        setLoading(true);
        const data = await getProducts(1);
        setProducts(data.products);
        setTotalPages(data.totalPages);
        setPage(1);
      } catch {
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    try {
      setLoadingMore(true);
      const data = await getProducts(nextPage);
      setProducts((prev) => [...prev, ...data.products]);
      setPage(nextPage);
      setTotalPages(data.totalPages);
    } catch {
      setError("Failed to load more products.");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleCreateTicket = (product) => {
    setSelectedProduct(product);
    setDrawerOpen(true);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-slate-400 text-sm"
        style={{ background: "linear-gradient(180deg, rgba(107,122,80,0.10) 0%, #f5f5f3 40%, #f8f8f8 100%)" }}
      >
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-red-400 text-sm"
        style={{ background: "linear-gradient(180deg, rgba(107,122,80,0.10) 0%, #f5f5f3 40%, #f8f8f8 100%)" }}
      >
        {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-slate-400 text-sm"
        style={{ background: "linear-gradient(180deg, rgba(107,122,80,0.10) 0%, #f5f5f3 40%, #f8f8f8 100%)" }}
      >
        No products found.
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(180deg, rgba(107,122,80,0.4) 0%,rgb(145, 145, 140,0.4) 75%" }}
    >
      <div className="max-w-7xl mx-auto px-8 pb-16">

        {/* Hero Header */}
        <div className="text-center pt-16 pb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Discover Our Collection
          </h1>
          <p className="text-base text-slate-600 max-w-md mx-auto leading-relaxed">
            Browse products and create support tickets with ease
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onCreateTicket={handleCreateTicket}
            />
          ))}
        </div>

        {/* Load More */}
        {page < totalPages && (
          <div className="flex justify-center mt-14">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-7 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50 transition-all hover:opacity-90 hover:shadow-md active:scale-95"
              style={{ backgroundColor: "#6B7A50" }}
            >
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>

      <TicketDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        selectedProduct={selectedProduct}
      />
    </div>
  );
};

export default ProductsPage;

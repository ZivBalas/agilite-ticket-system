import { useEffect, useRef, useState } from "react";
import { getProducts, createTicket } from "../services/api";

const EMPTY_FORM = {
  customerName: "",
  customerEmail: "",
  subject: "",
  message: "",
  productId: "",
};

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function ProductDropdown({ products, loading, value, onChange, error }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);

  const selectedProduct = products.find((product) => product._id === value);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
        setQuery("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(query.toLowerCase())
  );

  function handleSelect(product) {
    onChange(product._id);
    setOpen(false);
    setQuery("");
  }

  return (
    <div ref={containerRef} className="relative">
      <div
        onClick={() => setOpen(true)}
        className={`flex cursor-pointer items-center justify-between rounded-xl border bg-slate-50 px-3 py-2.5 text-sm ${
          error
            ? "border-red-300"
            : open
            ? "border-[#6B7A50] ring-2 ring-[#6B7A50]/20"
            : "border-slate-200"
        }`}
      >
        {open ? (
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder="Search products..."
            className="w-full bg-transparent outline-none"
          />
        ) : (
          <span className={selectedProduct ? "text-slate-800" : "text-slate-400"}>
            {selectedProduct
              ? selectedProduct.title
              : loading
              ? "Loading products..."
              : "Select product"}
          </span>
        )}

        <span className="ml-2 text-xs text-slate-400">▾</span>
      </div>

      {open && (
        <div className="absolute left-0 right-0 z-10 mt-2 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
          {loading ? (
            <p className="px-4 py-3 text-sm text-slate-400">Loading...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="px-4 py-3 text-sm text-slate-400">No products found.</p>
          ) : (
            <ul>
              {filteredProducts.map((product) => {
                const isSelected = product._id === value;

                return (
                  <li
                    key={product._id}
                    onClick={() => handleSelect(product)}
                    className={`flex cursor-pointer items-center gap-3 px-4 py-3 text-sm ${
                      isSelected ? "bg-[#6B7A50]/10" : "hover:bg-slate-50"
                    }`}
                  >
                    {product.images?.[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="h-8 w-8 rounded-md object-cover"
                      />
                    )}

                    <span
                      className={`truncate ${
                        isSelected ? "font-medium text-[#6B7A50]" : "text-slate-700"
                      }`}
                    >
                      {product.title}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function inputClass(hasError) {
  return `w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition ${
    hasError
      ? "border-red-300 bg-red-50"
      : "border-slate-200 bg-slate-50 focus:border-[#6B7A50] focus:ring-2 focus:ring-[#6B7A50]/20"
  }`;
}

export default function TicketDrawer({
  isOpen,
  onClose,
  selectedProduct = null,
  onSuccess,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;

    setForm({
      ...EMPTY_FORM,
      productId: selectedProduct?._id || "",
    });
    setError("");
    setSuccess(false);
    setValidationErrors({});
  }, [isOpen, selectedProduct]);

  useEffect(() => {
    if (!isOpen || selectedProduct) return;

    async function fetchProducts() {
      try {
        setLoadingProducts(true);
        const data = await getProducts(1, 100);
        setProducts(data.products || []);
      } catch {
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    }

    fetchProducts();
  }, [isOpen, selectedProduct]);

  function validateForm() {
    const errors = {};

    if (!form.customerName.trim()) {
      errors.customerName = "Required";
    }

    if (!form.customerEmail.trim()) {
      errors.customerEmail = "Required";
    } else if (!/\S+@\S+\.\S+/.test(form.customerEmail)) {
      errors.customerEmail = "Invalid email";
    }

    if (!form.subject.trim()) {
      errors.subject = "Required";
    }

    if (!form.message.trim()) {
      errors.message = "Required";
    }

    if (!form.productId) {
      errors.productId = "Please select a product";
    }

    return errors;
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  }

  function handleProductChange(productId) {
    setForm((prev) => ({
      ...prev,
      productId,
    }));

    if (validationErrors.productId) {
      setValidationErrors((prev) => ({
        ...prev,
        productId: "",
      }));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await createTicket({
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        productId: form.productId,
        subject: form.subject,
        message: form.message,
      });

      setSuccess(true);
      onSuccess?.();

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch {
      setError("Failed to create ticket. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="relative border-b border-slate-200 px-6 py-5">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            ✕
          </button>

          <h2 className="text-lg font-semibold text-slate-900">
            Create Support Ticket
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Fill in the details to submit your request
          </p>
        </div>

        {success ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#6B7A50] text-xl text-white">
              ✓
            </div>
            <p className="mt-4 text-sm font-medium text-slate-800">
              Ticket created successfully
            </p>
            <p className="mt-1 text-xs text-slate-500">Closing in a moment...</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-1 flex-col overflow-hidden"
          >
            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
              {selectedProduct ? (
                <Field label="Product">
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    {selectedProduct.images?.[0] && (
                      <img
                        src={selectedProduct.images[0]}
                        alt={selectedProduct.title}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {selectedProduct.title}
                      </p>
                      {selectedProduct.price && (
                        <p className="mt-0.5 text-xs text-slate-500">
                          ${selectedProduct.price}
                        </p>
                      )}
                    </div>
                  </div>
                </Field>
              ) : (
                <Field label="Product" error={validationErrors.productId}>
                  <ProductDropdown
                    products={products}
                    loading={loadingProducts}
                    value={form.productId}
                    onChange={handleProductChange}
                    error={!!validationErrors.productId}
                  />
                </Field>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Customer Name" error={validationErrors.customerName}>
                  <input
                    type="text"
                    name="customerName"
                    value={form.customerName}
                    onChange={handleChange}
                    placeholder="Full name"
                    className={inputClass(!!validationErrors.customerName)}
                  />
                </Field>

                <Field label="Email" error={validationErrors.customerEmail}>
                  <input
                    type="email"
                    name="customerEmail"
                    value={form.customerEmail}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={inputClass(!!validationErrors.customerEmail)}
                  />
                </Field>
              </div>

              <Field label="Subject" error={validationErrors.subject}>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Brief description of the issue"
                  className={inputClass(!!validationErrors.subject)}
                />
              </Field>

              <Field label="Message" error={validationErrors.message}>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe the issue in detail..."
                  className={`${inputClass(!!validationErrors.message)} resize-none`}
                />
              </Field>

              {error && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}
            </div>

            <div className="border-t border-slate-200 px-6 py-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-[#6B7A50] py-3 text-sm font-medium text-white transition hover:bg-[#5a6840] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Ticket"}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
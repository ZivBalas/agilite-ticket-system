const FALLBACK_IMAGE = "https://placehold.co/400x300?text=No+Image";

const ProductCard = ({ product, onCreateTicket }) => {
  const { title, price, images, categoryId } = product;
  const image = images?.[0] || FALLBACK_IMAGE;
  const category = categoryId?.name || "Uncategorized";

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-250 flex flex-col overflow-hidden cursor-default">

      {/* Image */}
      <div className="overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-350"
          onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-widest mb-2">
          {category}
        </span>
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug mb-4">
          {title}
        </h3>

        <div className="flex items-center justify-between mt-auto">
          <p className="text-base font-bold text-[#6B7A50]">
            ${price}
          </p>

          <button
            onClick={() => onCreateTicket(product)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#6B7A50] hover:bg-[#5a6840]
                       opacity-0 group-hover:opacity-100
                       translate-y-1 group-hover:translate-y-0
                       transition-all duration-200"
          >
            Create Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

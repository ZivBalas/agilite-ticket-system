import { useNavigate } from "react-router-dom";
import background from "../assets/agiliteBackground.jpg";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Background image */}
      <img
        src={background}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-900/45" />

      {/* Content */}
      <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-5 px-3 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
            Agilite Support 
          </span>

          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-5 tracking-tight">
            Customer Support
            <br />
            Dashboard
          </h1>

          <p className="text-base sm:text-lg text-slate-300 mb-10 leading-relaxed">
            Manage tickets and track product issues in one place.
            <br />
            Keep your customers happy with fast, organized support.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => navigate("/tickets")}
              className="px-7 py-3 rounded-xl bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 transition-colors shadow-sm"
            >
              View Tickets
            </button>
            <button
              onClick={() => navigate("/products")}
              className="px-7 py-3 rounded-xl bg-white/10 text-white text-sm font-semibold border border-white/25 hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
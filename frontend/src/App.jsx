import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import TicketsPage from "./pages/TicketsPage";
import TicketDetailPage from "./pages/TicketDetailPage";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/products", label: "Products" },
  { to: "/tickets", label: "Tickets" },
];

const NavBar = () => (
  <nav className="fixed top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100">
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-8">
      <NavLink to="/" className="shrink-0">
        <img src="/agiliteLogo.png" alt="Agilite" className="h-12 w-22" />
      </NavLink>

      <div className="flex items-center gap-1">
        {NAV_LINKS.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </div>
  </nav>
);

const App = () => (
  <BrowserRouter>
    <NavBar />
    <main className="pt-16 min-h-screen bg-slate-50">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="/tickets/:ticketId" element={<TicketDetailPage />} />
      </Routes>
    </main>
  </BrowserRouter>
);

export default App;

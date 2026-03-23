import { useState, useEffect, useCallback } from "react";
import { getTickets, updateTicketStatus } from "../services/api";
import TicketsTable from "../components/TicketsTable";
import TicketDrawer from "../components/TicketDrawer";

const FILTERS = ["all", "open", "closed"];

const TicketsPage = () => {
  const [allTickets, setAllTickets] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTickets();
      setAllTickets(data);
    } catch {
      setError("Failed to load tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleToggleStatus = async (ticket) => {
    const newStatus = ticket.status === "open" ? "closed" : "open";
    try {
      await updateTicketStatus(ticket._id, newStatus);
      await fetchTickets();
    } catch {
      // silently fail
    }
  };

  const counts = {
    all: allTickets.length,
    open: allTickets.filter((t) => t.status === "open").length,
    closed: allTickets.filter((t) => t.status === "closed").length,
  };

  const visibleTickets = allTickets
    .filter((t) => filter === "all" || t.status === filter)
    .filter((t) =>
      search.trim() === "" ||
      t.customerName.toLowerCase().includes(search.trim().toLowerCase())
    );

  return (
    <div className="min-h-screen bg-[#d9ddd5]">
      <div className="max-w-7xl mx-auto px-8 py-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1.5 tracking-tight">
              Tickets
            </h1>
            <p className="text-sm text-slate-400">
              Manage and track all customer support requests
            </p>
          </div>
          <button
            onClick={() => setDrawerOpen(true)}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#6B7A50] hover:bg-[#5a6840] transition-all shadow-sm active:scale-95 mt-1"
          >
            + New Ticket
          </button>
        </div>

        {/* Toolbar: search + filters */}
        <div className="flex items-center justify-between gap-4 mb-5">

          {/* Search */}
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name..."
              className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6B7A50]/20 focus:border-[#6B7A50]/50 transition-all w-64"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                  filter === f
                    ? "bg-[#6B7A50] text-white shadow-sm"
                    : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-700"
                }`}
              >
                {f}
                <span
                  className={`text-xs font-semibold rounded-full px-1.5 py-0.5 min-w-[20px] text-center ${
                    filter === f ? "bg-white/25 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {counts[f]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
            Loading tickets...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-48 text-red-400 text-sm">
            {error}
          </div>
        ) : visibleTickets.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center h-48 text-slate-400 text-sm">
            No tickets found.
          </div>
        ) : (
          <TicketsTable tickets={visibleTickets} onToggleStatus={handleToggleStatus} />
        )}
      </div>

      <TicketDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSuccess={() => { fetchTickets(); setFilter("all"); }}
      />
    </div>
  );
};

export default TicketsPage;

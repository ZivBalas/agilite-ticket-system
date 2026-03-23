import { useNavigate } from "react-router-dom";
import { formatId } from "../utils/formatId";

const STATUS_STYLES = {
  open: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  closed: "bg-slate-100 text-slate-500 border border-slate-200",
};

const TOGGLE_STYLES = {
  open: "text-slate-400 hover:text-slate-600 border border-slate-200 hover:border-slate-300",
  closed: "text-[#6B7A50] hover:text-[#5a6840] border border-[#6B7A50]/30 hover:border-[#6B7A50]/60",
};

const HEADERS = ["Ticket", "Subject", "Customer", "Product", "Status", "Date", ""];

const TicketsTable = ({ tickets, onToggleStatus }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <table className="min-w-full text-sm text-left">
        <thead>
          <tr className="border-b border-slate-100 bg-[#f7f7f5]">
            {HEADERS.map((h, i) => (
              <th key={i} className="px-6 py-3.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr
              key={ticket._id}
              onClick={() => navigate(`/tickets/${ticket._id}`)}
              className="group border-b border-slate-50 last:border-b-0 transition-colors cursor-pointer hover:bg-[#fafaf9]"
            >
              <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-400">
                {formatId(ticket._id)}
              </td>
              <td className="px-6 py-4 font-medium text-slate-900 max-w-[220px] truncate">
                {ticket.subject}
              </td>
              <td className="px-6 py-4 text-slate-500">
                {ticket.customerName}
              </td>
              <td className="px-6 py-4 text-slate-400 max-w-[180px] truncate text-xs">
                {ticket.productId?.title || "—"}
              </td>
              <td className="px-6 py-4">
                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[ticket.status]}`}>
                  {ticket.status}
                </span>
              </td>
              <td className="px-6 py-4 text-slate-400 text-xs">
                {new Date(ticket.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleStatus(ticket); }}
                  className={`opacity-0 group-hover:opacity-100 text-xs rounded-lg px-2.5 py-1 transition-all whitespace-nowrap ${TOGGLE_STYLES[ticket.status]}`}
                >
                  {ticket.status === "open" ? "Close" : "Reopen"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketsTable;

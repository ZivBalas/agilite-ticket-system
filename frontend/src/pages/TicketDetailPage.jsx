import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTicket, addMessage, updateTicketStatus } from "../services/api";
import { formatId } from "../utils/formatId";

const MessageBubble = ({ message }) => {
  const isAdmin = message.sender === "admin";

  return (
    <div className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
      <div className="flex flex-col gap-1 max-w-[70%]">
        <div
          className={`px-4 py-3 text-sm leading-relaxed ${
            isAdmin
              ? "bg-[#6B7A50]/10 text-[#2d3a22] rounded-2xl rounded-br-sm"
              : "bg-[#f1f2f0] text-slate-900 rounded-2xl rounded-bl-sm"
          }`}
        >
          {message.text}
        </div>
        <p className={`text-xs px-1 text-slate-400 ${isAdmin ? "text-right" : ""}`}>
          {message.sender} ·{" "}
          {new Date(message.createdAt).toLocaleString(undefined, {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </p>
      </div>
    </div>
  );
};

const InfoField = ({ label, value, mono = false }) => (
  <div className="flex flex-col gap-0.5">
    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
    <p className={`text-sm text-slate-500 ${mono ? "font-mono break-all" : "font-medium"}`}>
      {value}
    </p>
  </div>
);

const TicketDetailPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [replyText, setReplyText] = useState("");
  const [replySender, setReplySender] = useState("admin");
  const [sending, setSending] = useState(false);
  const [replyError, setReplyError] = useState(null);
  const [closing, setClosing] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const data = await getTicket(ticketId);
        setTicket(data);
      } catch {
        setError("Failed to load ticket.");
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [ticketId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages]);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      setSending(true);
      setReplyError(null);
      const updated = await addMessage(ticketId, { sender: replySender, text: replyText.trim() });
      setTicket(updated);
      setReplyText("");
    } catch {
      setReplyError("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const handleCloseTicket = async () => {
    try {
      setClosing(true);
      const updated = await updateTicketStatus(ticketId, "closed");
      setTicket(updated);
    } catch {
      // keep state as-is
    } finally {
      setClosing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#d9ddd5] flex items-center justify-center text-slate-400 text-sm">
        Loading ticket...
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-[#d9ddd5] flex items-center justify-center text-red-400 text-sm">
        {error || "Ticket not found."}
      </div>
    );
  }

  const product = ticket.productId;
  const isClosed = ticket.status === "closed";

  return (
    <div className="min-h-screen bg-[#d9ddd5]">
      <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-5">

        {/* Top bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/tickets")}
            className="px-4 py-2 rounded-xl text-sm font-semibold border border-[#6B7A50]/40 bg-[#6B7A50]/[0.06] text-[#6B7A50] hover:bg-[#6B7A50]/10 hover:border-[#6B7A50]/60 transition-all"
          >
            ← Back to Tickets
          </button>

          {!isClosed && (
            <button
              onClick={handleCloseTicket}
              disabled={closing}
              className="px-4 py-2 rounded-xl text-sm font-semibold border border-[#6B7A50]/40 text-[#6B7A50] hover:bg-[#6B7A50]/[0.08] transition-all disabled:opacity-50"
            >
              {closing ? "Closing…" : "Close Ticket"}
            </button>
          )}
        </div>

        {/* Ticket info */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-start justify-between gap-6 mb-5">
            <h1 className="text-lg font-bold text-slate-900 leading-snug">{ticket.subject}</h1>
            <span
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                isClosed ? "bg-slate-100 text-slate-400" : "bg-[#6B7A50]/10 text-[#6B7A50]"
              }`}
            >
              {ticket.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <InfoField label="Customer" value={ticket.customerName} />
            <InfoField label="Email" value={ticket.customerEmail} />
            <InfoField
              label="Date"
              value={new Date(ticket.createdAt).toLocaleDateString(undefined, {
                year: "numeric", month: "short", day: "numeric",
              })}
            />
            <InfoField label="Ticket ID" value={formatId(ticket._id)} />
          </div>
        </div>

        {/* Product */}
        {product && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex gap-4">
            {product.images?.[0] && (
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-20 h-20 rounded-xl object-cover shrink-0"
              />
            )}
            <div className="flex flex-col gap-1.5 min-w-0">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Product</p>
              <p className="text-sm font-bold text-slate-900">{product.title}</p>
              <p className="text-sm font-semibold text-[#6B7A50]">${product.price}</p>
              {product.categoryId?.name && (
                <span className="self-start px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#6B7A50]/10 text-[#6B7A50]">
                  {product.categoryId.name}
                </span>
              )}
              {product.description && (
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Conversation */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">

          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Conversation</h2>
            <span className="text-xs text-slate-400">
              {ticket.messages.length} message{ticket.messages.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Messages area */}
          <div className="relative flex flex-col gap-4 px-6 py-6 min-h-[220px] bg-[#fafaf9]">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06]">
              <img src="/agiliteLogo.png" alt="" className="w-48 h-auto" />
            </div>

            {ticket.messages.length === 0 ? (
              <p className="text-sm text-slate-400 text-center my-auto relative z-10">
                No messages yet.
              </p>
            ) : (
              <div className="relative z-10 flex flex-col gap-4">
                {ticket.messages.map((msg, i) => (
                  <MessageBubble key={i} message={msg} />
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply form */}
          {!isClosed && (
            <form onSubmit={handleSendReply} className="flex flex-col gap-3 px-6 py-5 border-t border-slate-100 bg-white">
              <div className="flex gap-1.5">
                {["admin", "customer"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setReplySender(s)}
                    className={`px-3.5 py-1 rounded-full text-xs font-semibold capitalize transition-colors ${
                      replySender === s
                        ? "bg-[#6B7A50] text-white"
                        : "bg-[#f1f2f0] text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 items-end">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Write a reply as ${replySender}…`}
                  rows={2}
                  className="flex-1 px-4 py-3 rounded-xl text-sm text-slate-900 placeholder-slate-400 border border-slate-200 bg-[#f4f5f2] resize-none outline-none focus:border-[#6B7A50] focus:ring-2 focus:ring-[#6B7A50]/20 transition-all"
                />
                <button
                  type="submit"
                  disabled={sending || !replyText.trim()}
                  className="px-5 py-3 rounded-xl text-sm font-semibold text-white bg-[#6B7A50] hover:bg-[#5a6840] disabled:opacity-40 transition-colors shrink-0"
                >
                  {sending ? "…" : "Send"}
                </button>
              </div>

              {replyError && <p className="text-xs text-red-500">{replyError}</p>}
            </form>
          )}

          {isClosed && (
            <p className="px-6 py-4 border-t border-slate-100 text-xs text-slate-400 text-center">
              This ticket is closed. No further replies can be added.
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default TicketDetailPage;

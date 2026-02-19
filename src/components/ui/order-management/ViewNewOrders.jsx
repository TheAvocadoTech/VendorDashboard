import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  Box, Paper, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, CircularProgress,
  Dialog, DialogContent, DialogActions, DialogContentText,
  DialogTitle, Stack, Avatar, Divider, IconButton, Tooltip, Grid,
} from "@mui/material";
import {
  Refresh, CheckCircle, Close, Visibility,
  ShoppingBag, LocationOn, Inventory2, AttachMoney, AccessTime, Receipt, Person,
  Download,
} from "@mui/icons-material";

// ─── Invoice Generator (client-side print-to-PDF) ─────────────────────────────
const generateInvoice = (order) => {
  const fmtINR = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
  const fmtDate = (iso) => {
    try { return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
    catch { return iso; }
  };
  const addr    = order.shippingAddress || {};
  const user    = order.user || {};
  const addrLine = [addr.line1, addr.line2, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ");
  const customer = user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : addr.name || "Customer";
  const invoiceNo = `INV-${order._id?.slice(-10).toUpperCase()}`;
  const subtotal  = order.items?.reduce((s, i) => s + i.price * i.quantity, 0) || 0;
  const totalDisc = order.items?.reduce((s, i) => s + ((i.originalPrice || i.price) - i.price) * i.quantity, 0) || 0;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>${invoiceNo}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background:#fff; color:#111827; font-size:13px; }
  .page { width:210mm; min-height:297mm; margin:0 auto; padding:14mm 16mm; }

  /* Header */
  .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; }
  .brand-name { font-size:28px; font-weight:900; color:#e53935; letter-spacing:-1px; }
  .brand-sub  { font-size:10px; color:#9ca3af; margin-top:2px; }
  .inv-label  { font-size:22px; font-weight:800; color:#111827; text-align:right; }
  .inv-num    { font-size:10px; color:#9ca3af; text-align:right; font-family:monospace; }
  .red-bar    { height:3px; background:#e53935; border-radius:2px; margin:10px 0; }

  /* Meta pills */
  .meta-row { display:flex; gap:0; border:1px solid #e2e6f0; border-radius:8px; overflow:hidden; margin-bottom:16px; }
  .meta-cell { flex:1; padding:10px 14px; background:#f7f8fc; border-right:1px solid #e2e6f0; }
  .meta-cell:last-child { border-right:none; }
  .meta-lbl { font-size:9px; text-transform:uppercase; letter-spacing:.6px; color:#9ca3af; font-weight:700; margin-bottom:3px; }
  .meta-val { font-size:11px; font-weight:700; color:#111827; }
  .meta-val.status { color:#2563eb; }

  /* Bill/From */
  .parties { display:flex; gap:0; margin-bottom:16px; }
  .party { flex:1; padding:0 16px 0 0; }
  .party + .party { padding:0 0 0 16px; border-left:1px solid #e2e6f0; }
  .party-lbl { font-size:9px; text-transform:uppercase; letter-spacing:.6px; color:#9ca3af; font-weight:700; margin-bottom:6px; }
  .party-name { font-size:13px; font-weight:700; color:#111827; margin-bottom:2px; }
  .party-detail { font-size:10px; color:#6b7280; line-height:1.6; }

  .divider { border:none; border-top:1px solid #e2e6f0; margin:12px 0; }

  /* Items table */
  table.items { width:100%; border-collapse:collapse; margin-bottom:10px; border-radius:8px; overflow:hidden; border:1px solid #e2e6f0; }
  table.items thead tr { background:#e53935; }
  table.items thead th { color:#fff; font-size:9px; text-transform:uppercase; letter-spacing:.5px; padding:9px 8px; font-weight:700; text-align:center; }
  table.items thead th.left { text-align:left; }
  table.items tbody tr:nth-child(even) { background:#f7f8fc; }
  table.items tbody tr:nth-child(odd)  { background:#fff; }
  table.items tbody td { padding:9px 8px; font-size:11px; color:#374151; text-align:center; border-top:1px solid #e2e6f0; }
  table.items tbody td.left { text-align:left; }
  table.items tbody td.product-name { font-weight:700; color:#111827; font-size:12px; }
  table.items tbody td.total-cell { font-weight:800; color:#e53935; font-size:13px; }

  /* Totals */
  .totals-wrap { display:flex; justify-content:flex-end; margin-bottom:20px; }
  .totals-box  { width:260px; border:1px solid #e2e6f0; border-radius:8px; overflow:hidden; }
  .tot-row { display:flex; justify-content:space-between; padding:7px 14px; font-size:11px; border-bottom:1px solid #e2e6f0; }
  .tot-row:last-child { border-bottom:none; }
  .tot-row.grand { background:#fff5f5; padding:10px 14px; }
  .tot-row .lbl { color:#6b7280; }
  .tot-row .val { font-weight:700; color:#111827; }
  .tot-row .disc-val { color:#16a34a; font-weight:700; }
  .tot-row.grand .lbl { font-size:13px; font-weight:800; color:#111827; }
  .tot-row.grand .val { font-size:18px; font-weight:900; color:#e53935; }

  /* Footer */
  .footer { border-top:1px solid #e2e6f0; padding-top:10px; text-align:center; color:#9ca3af; font-size:9px; line-height:1.7; }
  .footer b { color:#6b7280; }

  /* Stamp */
  .paid-stamp {
    position:absolute; top:55mm; right:14mm;
    border:3px solid #16a34a; color:#16a34a; padding:6px 14px;
    font-size:18px; font-weight:900; letter-spacing:3px; border-radius:6px;
    transform:rotate(-12deg); opacity:.18; pointer-events:none;
  }

  @media print {
    body { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    .page { padding:10mm 14mm; }
  }
</style>
</head>
<body>
<div class="page" style="position:relative;">
  <div class="paid-stamp">INVOICE</div>

  <!-- Header -->
  <div class="header">
    <div>
      <div class="brand-name">Minutos</div>
      <div class="brand-sub">A Local Delivery Shop</div>
    </div>
    <div>
      <div class="inv-label">INVOICE</div>
      <div class="inv-num">${invoiceNo}</div>
    </div>
  </div>
  <div class="red-bar"></div>

  <!-- Meta -->
  <div class="meta-row">
    <div class="meta-cell">
      <div class="meta-lbl">Date Issued</div>
      <div class="meta-val">${fmtDate(order.createdAt)}</div>
    </div>
    <div class="meta-cell">
      <div class="meta-lbl">Order Status</div>
      <div class="meta-val status">${order.status}</div>
    </div>
    <div class="meta-cell">
      <div class="meta-lbl">Order ID</div>
      <div class="meta-val" style="font-family:monospace">#${order._id?.slice(-10).toUpperCase()}</div>
    </div>
    <div class="meta-cell" style="border-right:none;">
      <div class="meta-lbl">Items</div>
      <div class="meta-val">${order.items?.length || 0} item(s)</div>
    </div>
  </div>

  <!-- Parties -->
  <div class="parties">
    <div class="party">
      <div class="party-lbl">Bill To</div>
      <div class="party-name">${customer}</div>
      <div class="party-detail">
        ${addrLine ? addrLine + "<br/>" : ""}
        ${(user.phone || addr.phone) ? "📞 " + (user.phone || addr.phone) + "<br/>" : ""}
        ${user.email ? "✉️ " + user.email : ""}
      </div>
    </div>
    <div class="party">
      <div class="party-lbl">From</div>
      <div class="party-name">Minutos Platform</div>
      <div class="party-detail">
        Local Delivery Services<br/>
        support@minutos.in<br/>
        www.minutos.in
      </div>
    </div>
  </div>
  <hr class="divider"/>

  <!-- Items Table -->
  <table class="items">
    <thead>
      <tr>
        <th>#</th>
        <th class="left">Product</th>
        <th>Unit</th>
        <th>Orig. Price</th>
        <th>Discount</th>
        <th>Unit Price</th>
        <th>Qty</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      ${order.items?.map((item, i) => `
        <tr>
          <td>${i + 1}</td>
          <td class="left product-name">${item.name || item.product?.name || "Product"}</td>
          <td>${item.unit || item.product?.unit || "—"}</td>
          <td>${fmtINR(item.originalPrice || item.price)}</td>
          <td style="color:#16a34a;font-weight:700">${item.discount ? item.discount + "%" : "—"}</td>
          <td>${fmtINR(item.price)}</td>
          <td>${item.quantity}</td>
          <td class="total-cell">${fmtINR(item.price * item.quantity)}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>

  <!-- Totals -->
  <div class="totals-wrap">
    <div class="totals-box">
      <div class="tot-row">
        <span class="lbl">Subtotal</span>
        <span class="val">${fmtINR(subtotal)}</span>
      </div>
      <div class="tot-row">
        <span class="lbl">Total Discount</span>
        <span class="disc-val">− ${fmtINR(totalDisc)}</span>
      </div>
      <div class="tot-row grand">
        <span class="lbl">Grand Total</span>
        <span class="val">${fmtINR(order.totalAmount)}</span>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <b>Thank you for shopping with Minutos!</b><br/>
    For support: support@minutos.in &nbsp;|&nbsp; www.minutos.in<br/>
    This is a computer-generated invoice. Generated on ${new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}.
  </div>
</div>
</body>
</html>`;

  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  setTimeout(() => { win.focus(); win.print(); }, 500);
};

const C = {
  bg:         "#f7f8fc",
  surface:    "#ffffff",
  surfaceAlt: "#f1f3f9",
  border:     "#e2e6f0",
  accent:     "#e53935",
  accentSoft: "rgba(229,57,53,0.08)",
  accentMid:  "rgba(229,57,53,0.15)",
  success:    "#16a34a",
  successBg:  "rgba(22,163,74,0.09)",
  error:      "#dc2626",
  errorBg:    "rgba(220,38,38,0.09)",
  warning:    "#d97706",
  warningBg:  "rgba(217,119,6,0.09)",
  info:       "#2563eb",
  infoBg:     "rgba(37,99,235,0.08)",
  text:       "#111827",
  sub:        "#6b7280",
  muted:      "#9ca3af",
  white:      "#ffffff",
  shadow:     "0 1px 4px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)",
  shadowLg:   "0 8px 40px rgba(0,0,0,0.12)",
};

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const statusMeta = (s) =>
  ({
    PLACED:    { color: C.info,    bg: C.infoBg,    label: "Placed"    },
    ACCEPTED:  { color: C.success, bg: C.successBg, label: "Accepted"  },
    REJECTED:  { color: C.error,   bg: C.errorBg,   label: "Rejected"  },
    COMPLETED: { color: C.warning, bg: C.warningBg, label: "Completed" },
  }[s] || { color: C.sub, bg: C.surfaceAlt, label: s });

const initials = (first = "", last = "") =>
  `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase() || "?";

const resolveImg = (entry) => {
  if (!entry) return null;
  const raw = typeof entry === "string" ? entry : (entry.secure_url || entry.url || entry.path || entry.src || null);
  if (!raw || typeof raw !== "string" || !raw.trim()) return null;
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return `https://api.minutos.in/${raw.replace(/^\/+/, "")}`;
};

const getAllImages = (item) => {
  const p = item?.product || {};
  for (const key of ["images", "photos", "gallery"]) {
    const arr = p[key] ?? item[key];
    if (Array.isArray(arr) && arr.length > 0) {
      const srcs = arr.map(resolveImg).filter(Boolean);
      if (srcs.length) return srcs;
    }
  }
  for (const key of ["imageUrl", "image", "photo", "thumbnail"]) {
    const src = resolveImg(p[key] ?? item[key]);
    if (src) return [src];
  }
  return [];
};

const getFirstImage = (item) => getAllImages(item)[0] ?? null;
const firstVal = (v) => (Array.isArray(v) ? (v[0] ?? null) : (v ?? null));
const safeLabel = (v) => {
  const s = String(v ?? "").trim();
  return /^[a-f\d]{24}$/i.test(s) ? null : s || null;
};

// ─── ProductImage ─────────────────────────────────────────────────────────────
const ProductImage = ({ item, size = 64 }) => {
  const [errored, setErrored] = React.useState(false);
  const src = errored ? null : getFirstImage(item);
  return (
    <Box sx={{
      width: size, height: size, flexShrink: 0,
      borderRadius: 1.5, overflow: "hidden",
      border: `1.5px solid ${C.border}`,
      bgcolor: C.surfaceAlt,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {src ? (
        <img src={src} alt={item?.name || "product"} onError={() => setErrored(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      ) : (
        <Inventory2 sx={{ fontSize: size * 0.4, color: C.muted }} />
      )}
    </Box>
  );
};

// ─── StatusChip ───────────────────────────────────────────────────────────────
const StatusChip = ({ status }) => {
  const m = statusMeta(status);
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.6, px: 1.2, py: 0.35, borderRadius: "20px", bgcolor: m.bg, border: `1px solid ${m.color}33` }}>
      <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: m.color }} />
      <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: m.color, letterSpacing: 0.2 }}>{m.label}</Typography>
    </Box>
  );
};

// ─── InfoRow ──────────────────────────────────────────────────────────────────
const InfoRow = ({ icon: Icon, label, value }) => (
  <Stack direction="row" alignItems="flex-start" spacing={1.2} sx={{ py: 0.7 }}>
    <Icon sx={{ fontSize: 15, color: C.muted, mt: 0.3 }} />
    <Box>
      <Typography sx={{ fontSize: 10.5, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>{label}</Typography>
      <Typography sx={{ fontSize: 13, color: C.text, fontWeight: 500, mt: 0.15 }}>{value || "—"}</Typography>
    </Box>
  </Stack>
);

// ─── Tag ─────────────────────────────────────────────────────────────────────
const Tag = ({ label, color = C.info }) =>
  label ? (
    <Box sx={{ display: "inline-flex", px: 0.9, py: 0.2, borderRadius: 0.8, bgcolor: `${color}14`, border: `1px solid ${color}2a` }}>
      <Typography sx={{ fontSize: 10, color, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase" }}>{label}</Typography>
    </Box>
  ) : null;

// ─── ProductCard ──────────────────────────────────────────────────────────────
const ProductCard = ({ item }) => {
  const p = item?.product || {};
  const allImgs = getAllImages(item);
  const name        = item.name || p.name || p.productName || "Unknown Product";
  const category    = safeLabel(firstVal(p.category    ?? item.category));
  const subCategory = safeLabel(firstVal(p.subCategory ?? item.subCategory));
  const stock       = p.stock        ?? item.stock;
  const unit        = p.unit         ?? item.unit;
  const pack        = p.pack         ?? item.pack;
  const sku         = p.sku          ?? item.sku;
  const description = p.description  ?? item.description;
  const discount    = p.discount     ?? item.discount    ?? 0;
  const origPrice   = p.originalPrice ?? item.originalPrice;

  return (
    <Box sx={{ border: `1px solid ${C.border}`, borderRadius: 2, overflow: "hidden", bgcolor: C.surface, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
      <Stack direction="row">
        <Box sx={{ width: 110, flexShrink: 0, bgcolor: C.surfaceAlt, position: "relative", display: "flex", flexDirection: "column" }}>
          <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: 1.5 }}>
            <ProductImage item={item} size={80} />
          </Box>
          {allImgs.length > 1 && (
            <Stack direction="row" sx={{ px: 0.8, pb: 0.8, gap: 0.5, flexWrap: "nowrap", overflowX: "auto" }}>
              {allImgs.slice(1, 4).map((src, i) => (
                <Box key={i} sx={{ width: 22, height: 22, borderRadius: 0.5, overflow: "hidden", flexShrink: 0, border: `1px solid ${C.border}` }}>
                  <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </Box>
              ))}
              {allImgs.length > 4 && (
                <Box sx={{ width: 22, height: 22, borderRadius: 0.5, bgcolor: C.border, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Typography sx={{ fontSize: 8, color: C.sub, fontWeight: 700 }}>+{allImgs.length - 4}</Typography>
                </Box>
              )}
            </Stack>
          )}
        </Box>

        <Box sx={{ flex: 1, p: 2, minWidth: 0, borderLeft: `1px solid ${C.border}` }}>
          <Typography sx={{ fontWeight: 700, fontSize: 13.5, color: C.text, lineHeight: 1.4, mb: 0.8,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {name}
          </Typography>
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
            <Tag label={category}    color={C.info}    />
            <Tag label={subCategory} color={C.warning} />
            {unit && <Tag label={`Unit: ${unit}`} color={C.sub} />}
            {pack && <Tag label={`Pack: ${pack}`} color={C.sub} />}
            {sku  && <Tag label={`SKU: ${sku}`}   color={C.sub} />}
          </Stack>
          {description ? (
            <Typography sx={{ fontSize: 12, color: C.sub, lineHeight: 1.55, mb: 1,
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {description}
            </Typography>
          ) : null}
          {stock !== undefined && stock !== null && (
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.4, px: 0.9, py: 0.2, borderRadius: 1,
              bgcolor: stock > 0 ? C.successBg : C.errorBg, border: `1px solid ${stock > 0 ? C.success : C.error}30` }}>
              <Typography sx={{ fontSize: 10.5, color: stock > 0 ? C.success : C.error, fontWeight: 700 }}>
                {stock > 0 ? `${stock} in stock` : "Out of stock"}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ flexShrink: 0, width: 130, borderLeft: `1px solid ${C.border}`, p: 2,
          display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center", gap: 0.5 }}>
          {origPrice && origPrice !== item.price && (
            <Typography sx={{ fontSize: 11, color: C.muted, textDecoration: "line-through" }}>{fmt(origPrice)}</Typography>
          )}
          <Typography sx={{ fontSize: 12, color: C.sub }}>{fmt(item.price)} × {item.quantity}</Typography>
          {discount > 0 && <Tag label={`${discount}% off`} color={C.success} />}
          <Typography sx={{ fontSize: 18, fontWeight: 800, color: C.accent, mt: 0.3 }}>
            {fmt(item.price * item.quantity)}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

// ─── Order Detail Drawer ──────────────────────────────────────────────────────
// Uses Drawer instead of Dialog to slide in from the right BELOW the app navbar,
// completely avoiding z-index conflicts with the top header.
const OrderDetailModal = ({ order, onClose }) => {
  // Lock body scroll & handle Escape key
  React.useEffect(() => {
    if (!order) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [order, onClose]);

  if (!order) return null;

  const addr = order.shippingAddress || {};
  const addrLine = [addr.line1, addr.line2, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ");

  // ✅ Portal renders DIRECTLY into document.body — completely outside any
  // app wrapper / navbar stacking context, so z-index battles are impossible.
  return ReactDOM.createPortal(
    <div style={{
      position: "fixed", inset: 0,
      zIndex: 99999,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16, boxSizing: "border-box",
    }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: "absolute", inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(3px)",
      }} />

      {/* Panel */}
      <div style={{
        position: "relative", zIndex: 1,
        width: "100%", maxWidth: 860, maxHeight: "90vh",
        backgroundColor: C.surface,
        borderRadius: 14,
        boxShadow: "0 24px 80px rgba(0,0,0,0.22)",
        border: `1px solid ${C.border}`,
        display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* ── Header ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 24px",
          borderBottom: `1px solid ${C.border}`,
          backgroundColor: C.surfaceAlt,
          flexShrink: 0,
        }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ width: 36, height: 36, borderRadius: 1.5, bgcolor: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Receipt sx={{ fontSize: 18, color: C.accent }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 15, fontWeight: 700, color: C.text }}>Order Details</Typography>
              <Typography sx={{ fontSize: 11, color: C.sub, fontFamily: "monospace" }}>#{order._id?.slice(-10).toUpperCase()}</Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <StatusChip status={order.status} />
            <Button
              size="small"
              variant="contained"
              startIcon={<Download sx={{ fontSize: 14 }} />}
              onClick={() => generateInvoice(order)}
              sx={{
                bgcolor: C.accent, color: C.white, fontWeight: 700, fontSize: 11,
                px: 1.5, height: 30, borderRadius: 1.5, boxShadow: "none",
                "&:hover": { bgcolor: "#c62828", boxShadow: "none" },
              }}
            >
              Invoice
            </Button>
            <IconButton size="small" onClick={onClose} sx={{ color: C.muted, "&:hover": { bgcolor: C.border } }}>
              <Close fontSize="small" />
            </IconButton>
          </Stack>
        </div>

        {/* ── Body (two column) ── */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>

          {/* LEFT — Customer / Address / Info */}
          <div style={{
            width: 280, flexShrink: 0,
            borderRight: `1px solid ${C.border}`,
            overflowY: "auto", padding: 24,
          }}>
            <Typography sx={{ fontSize: 10.5, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 700, mb: 1.5 }}>Customer</Typography>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
              <Avatar sx={{ bgcolor: C.accent, width: 42, height: 42, fontSize: 14, fontWeight: 700 }}>
                {initials(order.user?.firstName, order.user?.lastName)}
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 700, color: C.text, fontSize: 14 }}>
                  {order.user?.firstName ? `${order.user.firstName} ${order.user.lastName || ""}` : addr.name || "Customer"}
                </Typography>
                {order.user?.email && <Typography sx={{ fontSize: 12, color: C.sub }}>{order.user.email}</Typography>}
                {(order.user?.phone || addr.phone) && <Typography sx={{ fontSize: 12, color: C.sub }}>{order.user?.phone || addr.phone}</Typography>}
              </Box>
            </Stack>

            <Divider sx={{ mb: 2, borderColor: C.border }} />

            <Typography sx={{ fontSize: 10.5, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 700, mb: 1.5 }}>Delivery Address</Typography>
            {addrLine ? (
              <Box sx={{ bgcolor: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 1.5, p: 1.8 }}>
                {addr.name && <Typography sx={{ fontSize: 13, fontWeight: 700, color: C.text, mb: 0.3 }}>{addr.name}</Typography>}
                <Stack direction="row" spacing={0.8} alignItems="flex-start">
                  <LocationOn sx={{ fontSize: 14, color: C.accent, mt: 0.2 }} />
                  <Typography sx={{ fontSize: 12.5, color: C.sub, lineHeight: 1.65 }}>{addrLine}</Typography>
                </Stack>
                {addr.phone && <Typography sx={{ fontSize: 12, color: C.sub, mt: 0.5 }}>📞 {addr.phone}</Typography>}
              </Box>
            ) : (
              <Typography sx={{ fontSize: 12.5, color: C.muted, fontStyle: "italic" }}>No address provided</Typography>
            )}

            <Divider sx={{ my: 2, borderColor: C.border }} />

            <Typography sx={{ fontSize: 10.5, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 700, mb: 1 }}>Order Info</Typography>
            <InfoRow icon={AccessTime} label="Placed on"
              value={order.createdAt ? new Date(order.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"} />
            <InfoRow icon={ShoppingBag} label="Total items" value={`${order.items?.length || 0} item(s)`} />
            <InfoRow icon={AttachMoney} label="Order total" value={fmt(order.totalAmount)} />
          </div>

          {/* RIGHT — Products */}
          <div style={{ flex: 1, overflowY: "auto", padding: 24, minWidth: 0 }}>
            <Typography sx={{ fontSize: 10.5, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 700, mb: 2 }}>
              Products · {order.items?.length} item(s)
            </Typography>
            <Stack spacing={1.5}>
              {order.items?.map((item, idx) => <ProductCard key={idx} item={item} />)}
            </Stack>
            <Box sx={{ mt: 2.5, p: 2, bgcolor: C.accentSoft, border: `1px solid ${C.accent}22`, borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography sx={{ fontWeight: 700, color: C.text, fontSize: 14 }}>Order Total</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: 20, color: C.accent }}>{fmt(order.totalAmount)}</Typography>
            </Box>
          </div>
        </div>
      </div>
    </div>,
    document.body  // ← Portal escape hatch — renders outside entire React app tree
  );
};

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
const ConfirmDialog = ({ open, actionType, onClose, onConfirm, loading }) => (
  <Dialog open={open} onClose={onClose}
    PaperProps={{ sx: { bgcolor: C.surface, borderRadius: 2.5, boxShadow: C.shadowLg, minWidth: 340 } }}>
    <DialogTitle sx={{ color: C.text, fontWeight: 700, fontSize: 16, pb: 1 }}>
      {actionType === "accept" ? "Accept this order?" : "Reject this order?"}
    </DialogTitle>
    <DialogContent>
      <DialogContentText sx={{ color: C.sub, fontSize: 13.5 }}>
        {actionType === "accept"
          ? "The order will be marked as accepted and the customer will be notified."
          : "The order will be rejected. This cannot be undone."}
      </DialogContentText>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
      <Button onClick={onClose} disabled={loading} sx={{ color: C.sub, fontWeight: 600 }}>Cancel</Button>
      <Button onClick={onConfirm} disabled={loading} variant="contained"
        startIcon={loading ? <CircularProgress size={14} color="inherit" /> : undefined}
        sx={{
          bgcolor: actionType === "accept" ? C.success : C.error,
          "&:hover": { bgcolor: actionType === "accept" ? "#15803d" : "#b91c1c" },
          fontWeight: 700, borderRadius: 1.5, px: 2.5, boxShadow: "none",
        }}>
        {loading ? "Processing…" : "Confirm"}
      </Button>
    </DialogActions>
  </Dialog>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ViewNewOrders = () => {
  const [orders, setOrders]               = useState([]);
  const [loading, setLoading]             = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [detailOrder, setDetailOrder]     = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [confirmOpen, setConfirmOpen]     = useState(false);
  const [actionType, setActionType]       = useState(null);
  const [apiError, setApiError]           = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setApiError("");
      const token = localStorage.getItem("vendorToken");
      const res  = await fetch("https://api.minutos.in/api/order/vendor/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
        if (data.orders.length === 0) setApiError("No orders found for this vendor.");
      } else {
        setApiError(data.message || "Failed to fetch orders.");
      }
    } catch (e) {
      console.error("Fetch error:", e);
      setApiError("Network error. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const openConfirm = (order, type) => {
    setSelectedOrder(order); setActionType(type); setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedOrder || !actionType) return;
    try {
      setActionLoading(true);
      const token = localStorage.getItem("vendorToken");
      const res  = await fetch(`https://api.minutos.in/api/order/vendor/${selectedOrder._id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: actionType === "accept" ? "ACCEPTED" : "REJECTED" }),
      });
      const data = await res.json();
      if (data.success) {
        if (detailOrder?._id === selectedOrder._id)
          setDetailOrder((prev) => ({ ...prev, status: data.order.status }));
        fetchOrders();
      }
    } catch (e) {
      console.error("Error updating order:", e);
    } finally {
      setActionLoading(false);
      setConfirmOpen(false);
    }
  };

  const counts = {
    total:    orders.length,
    placed:   orders.filter((o) => o.status === "PLACED").length,
    accepted: orders.filter((o) => o.status === "ACCEPTED").length,
    rejected: orders.filter((o) => o.status === "REJECTED").length,
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography sx={{ fontSize: { xs: 20, md: 22 }, fontWeight: 800, color: C.text, letterSpacing: -0.5 }}>
            Vendor Orders
          </Typography>
          <Typography sx={{ fontSize: 13, color: C.sub, mt: 0.2 }}>Manage incoming customer orders</Typography>
        </Box>
        <Button variant="outlined" startIcon={<Refresh />} onClick={fetchOrders} disabled={loading}
          sx={{ color: C.accent, borderColor: C.accent, "&:hover": { bgcolor: C.accentSoft, borderColor: C.accent }, fontWeight: 600, borderRadius: 1.5 }}>
          Refresh
        </Button>
      </Stack>

      {/* Error Banner */}
      {apiError && (
        <Box sx={{ mb: 2, px: 2, py: 1.5, bgcolor: C.errorBg, border: `1px solid ${C.error}33`, borderRadius: 2 }}>
          <Typography sx={{ fontSize: 13, color: C.error, fontWeight: 600 }}>⚠️ {apiError}</Typography>
        </Box>
      )}

      {/* Stat pills */}
      <Stack direction="row" spacing={1.5} mb={3} flexWrap="wrap" useFlexGap>
        {[
          { label: "Total",    value: counts.total,    color: C.sub,     bg: C.surfaceAlt },
          { label: "Pending",  value: counts.placed,   color: C.info,    bg: C.infoBg    },
          { label: "Accepted", value: counts.accepted, color: C.success, bg: C.successBg },
          { label: "Rejected", value: counts.rejected, color: C.error,   bg: C.errorBg   },
        ].map(({ label, value, color, bg }) => (
          <Box key={label} sx={{ px: 2, py: 1, borderRadius: 2, bgcolor: C.surface, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 1, boxShadow: C.shadow }}>
            <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography sx={{ fontSize: 16, fontWeight: 800, color, lineHeight: 1 }}>{value}</Typography>
            </Box>
            <Typography sx={{ fontSize: 12, color: C.sub, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</Typography>
          </Box>
        ))}
      </Stack>

      {/* Table */}
      <Paper elevation={0} sx={{ bgcolor: C.surface, border: `1px solid ${C.border}`, borderRadius: 2.5, overflow: "hidden", boxShadow: C.shadow }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: C.surfaceAlt }}>
                {["Order ID", "Customer", "Items", "Total", "Status", "Actions"].map((h) => (
                  <TableCell key={h} sx={{ color: C.muted, fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.6, borderBottom: `1px solid ${C.border}`, py: 1.5 }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, borderBottom: "none" }}>
                    <CircularProgress size={28} sx={{ color: C.accent }} />
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8, borderBottom: "none" }}>
                    <ShoppingBag sx={{ fontSize: 38, color: C.border, display: "block", mx: "auto", mb: 1 }} />
                    <Typography sx={{ color: C.muted, fontSize: 14 }}>No orders found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => {
                  const addr = order.shippingAddress || {};
                  const customerName = order.user?.firstName
                    ? `${order.user.firstName} ${order.user.lastName || ""}`
                    : addr.name || "—";

                  return (
                    <TableRow key={order._id} sx={{ "&:hover": { bgcolor: "#fafbff" }, "& td": { borderBottom: `1px solid ${C.border}` } }}>
                      <TableCell>
                        <Typography sx={{ fontSize: 12, color: C.sub, fontFamily: "monospace", fontWeight: 600 }}>
                          #{order._id?.slice(-8).toUpperCase()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1.2} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, bgcolor: C.accent, fontSize: 12, fontWeight: 700 }}>
                            {order.user?.firstName
                              ? initials(order.user.firstName, order.user.lastName)
                              : (addr.name?.[0] || "?").toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: 13, fontWeight: 600, color: C.text }}>{customerName}</Typography>
                            {order.user?.email && <Typography sx={{ fontSize: 11, color: C.sub }}>{order.user.email}</Typography>}
                            {!order.user?.email && addr.phone && <Typography sx={{ fontSize: 11, color: C.sub }}>{addr.phone}</Typography>}
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 1.1, py: 0.35, borderRadius: 1.5, bgcolor: C.surfaceAlt, border: `1px solid ${C.border}` }}>
                          <Inventory2 sx={{ fontSize: 12, color: C.muted }} />
                          <Typography sx={{ fontSize: 12, color: C.text, fontWeight: 700 }}>{order.items?.length ?? 0}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: C.accent }}>{fmt(order.totalAmount)}</Typography>
                      </TableCell>
                      <TableCell><StatusChip status={order.status} /></TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.8}>
                          <Tooltip title="View Details" arrow>
                            <IconButton size="small" onClick={() => setDetailOrder(order)}
                              sx={{ color: C.info, border: `1px solid ${C.info}33`, borderRadius: 1.2, width: 30, height: 30, "&:hover": { bgcolor: C.infoBg } }}>
                              <Visibility sx={{ fontSize: 15 }} />
                            </IconButton>
                          </Tooltip>
                          {order.status === "PLACED" && (
                            <>
                              <Button size="small" variant="contained" startIcon={<CheckCircle sx={{ fontSize: 13 }} />}
                                onClick={() => openConfirm(order, "accept")}
                                sx={{ bgcolor: C.success, color: C.white, fontWeight: 700, fontSize: 12, px: 1.5, boxShadow: "none", borderRadius: 1.2, "&:hover": { bgcolor: "#15803d", boxShadow: "none" }, height: 30 }}>
                                Accept
                              </Button>
                              <Button size="small" variant="outlined" startIcon={<Close sx={{ fontSize: 13 }} />}
                                onClick={() => openConfirm(order, "reject")}
                                sx={{ color: C.error, borderColor: `${C.error}55`, fontWeight: 700, fontSize: 12, px: 1.5, borderRadius: 1.2, "&:hover": { bgcolor: C.errorBg, borderColor: C.error }, height: 30 }}>
                                Reject
                              </Button>
                            </>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <OrderDetailModal order={detailOrder} onClose={() => setDetailOrder(null)} />
      <ConfirmDialog open={confirmOpen} actionType={actionType} loading={actionLoading}
        onClose={() => setConfirmOpen(false)} onConfirm={handleConfirm} />
    </Box>
  );
};

export default ViewNewOrders;
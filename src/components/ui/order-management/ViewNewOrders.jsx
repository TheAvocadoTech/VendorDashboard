import React, { useState, useEffect } from "react";
import {
  Box, Paper, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, CircularProgress,
  Dialog, DialogContent, DialogActions, DialogContentText,
  DialogTitle, Stack, Avatar, Divider, IconButton, Tooltip, Grid, Fade,
} from "@mui/material";
import {
  Refresh, CheckCircle, Close, Visibility,
  ShoppingBag, LocationOn, Inventory2, AttachMoney, AccessTime, Receipt, Person,
} from "@mui/icons-material";

// ─── Theme ────────────────────────────────────────────────────────────────────
const C = {
  bg:         "#f7f8fc",
  surface:    "#ffffff",
  surfaceAlt: "#f1f3f9",
  border:     "#e2e6f0",
  accent:     "#e53935",        // red brand
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

// Resolve one raw image entry (string | {url, secure_url, path}) → absolute URL | null
const resolveImg = (entry) => {
  if (!entry) return null;
  const raw =
    typeof entry === "string"
      ? entry
      : (entry.secure_url || entry.url || entry.path || entry.src || null);
  if (!raw || typeof raw !== "string" || !raw.trim()) return null;
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return `http://localhost:8000${raw.startsWith("/") ? "" : "/"}${raw}`;
};

// From the product (or order item), extract ALL image URLs handling every array/scalar pattern
const getAllImages = (item) => {
  const p = item?.product || {};
  // Try array fields
  for (const key of ["images", "photos", "gallery"]) {
    const arr = p[key] ?? item[key];
    if (Array.isArray(arr) && arr.length > 0) {
      const srcs = arr.map(resolveImg).filter(Boolean);
      if (srcs.length) return srcs;
    }
  }
  // Try scalar fields
  for (const key of ["imageUrl", "image", "photo", "thumbnail"]) {
    const src = resolveImg(p[key] ?? item[key]);
    if (src) return [src];
  }
  return [];
};

const getFirstImage = (item) => getAllImages(item)[0] ?? null;

// First value from an array or scalar (for category, subCategory etc.)
const firstVal = (v) => (Array.isArray(v) ? (v[0] ?? null) : (v ?? null));
// Only show value if it's NOT a 24-char MongoDB ObjectId
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

// ─── ProductCard (inside modal) ───────────────────────────────────────────────
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

        {/* Image block */}
        <Box sx={{ width: 110, flexShrink: 0, bgcolor: C.surfaceAlt, position: "relative", display: "flex", flexDirection: "column" }}>
          {/* Main image */}
          <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: 1.5 }}>
            <ProductImage item={item} size={80} />
          </Box>
          {/* Extra thumbnails strip */}
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

        {/* Details */}
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

        {/* Price */}
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

// ─── Order Detail Modal ───────────────────────────────────────────────────────
const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  // ✅ Correct address fields from your API: line1, city, state, pincode, name, phone
  const addr = order.shippingAddress || {};
  const addrLine = [addr.line1, addr.line2, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ");

  return (
    <Dialog open={Boolean(order)} onClose={onClose} maxWidth="md" fullWidth TransitionComponent={Fade}
      PaperProps={{ sx: { bgcolor: C.surface, borderRadius: 3, boxShadow: C.shadowLg, backgroundImage: "none", border: `1px solid ${C.border}` } }}>

      {/* Header */}
      <Box sx={{ px: 3, py: 2.5, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", bgcolor: C.surfaceAlt }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box sx={{ width: 36, height: 36, borderRadius: 1.5, bgcolor: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Receipt sx={{ fontSize: 18, color: C.accent }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: C.text }}>Order Details</Typography>
            <Typography sx={{ fontSize: 11, color: C.sub, fontFamily: "monospace" }}>#{order._id?.slice(-10).toUpperCase()}</Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <StatusChip status={order.status} />
          <IconButton size="small" onClick={onClose} sx={{ color: C.muted, "&:hover": { bgcolor: C.surfaceAlt } }}>
            <Close fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      <DialogContent sx={{ p: 0, maxHeight: "80vh", overflowY: "auto" }}>
        <Grid container>

          {/* LEFT — customer + address + meta */}
          <Grid item xs={12} md={4} sx={{ p: 3, borderRight: { md: `1px solid ${C.border}` } }}>

            <Typography sx={{ fontSize: 10.5, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 700, mb: 1.5 }}>Customer</Typography>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
              <Avatar sx={{ bgcolor: C.accent, width: 42, height: 42, fontSize: 14, fontWeight: 700 }}>
                {initials(order.user?.firstName, order.user?.lastName)}
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 700, color: C.text, fontSize: 14 }}>
                  {order.user?.firstName
                    ? `${order.user.firstName} ${order.user.lastName || ""}`
                    : addr.name || "Customer"}
                </Typography>
                {order.user?.email && <Typography sx={{ fontSize: 12, color: C.sub }}>{order.user.email}</Typography>}
                {(order.user?.phone || addr.phone) && (
                  <Typography sx={{ fontSize: 12, color: C.sub }}>{order.user?.phone || addr.phone}</Typography>
                )}
              </Box>
            </Stack>

            <Divider sx={{ mb: 2, borderColor: C.border }} />

            <Typography sx={{ fontSize: 10.5, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 700, mb: 1.5 }}>Delivery Address</Typography>
            {addrLine ? (
              <Box sx={{ bgcolor: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 1.5, p: 1.8 }}>
                {addr.name && (
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: C.text, mb: 0.3 }}>{addr.name}</Typography>
                )}
                <Stack direction="row" spacing={0.8} alignItems="flex-start">
                  <LocationOn sx={{ fontSize: 14, color: C.accent, mt: 0.2 }} />
                  <Typography sx={{ fontSize: 12.5, color: C.sub, lineHeight: 1.65 }}>{addrLine}</Typography>
                </Stack>
                {addr.phone && (
                  <Typography sx={{ fontSize: 12, color: C.sub, mt: 0.5 }}>📞 {addr.phone}</Typography>
                )}
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
          </Grid>

          {/* RIGHT — products */}
          <Grid item xs={12} md={8} sx={{ p: 3 }}>
            <Typography sx={{ fontSize: 10.5, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 700, mb: 2 }}>
              Products · {order.items?.length} item(s)
            </Typography>

            <Stack spacing={1.5}>
              {order.items?.map((item, idx) => <ProductCard key={idx} item={item} />)}
            </Stack>

            {/* Total bar */}
            <Box sx={{ mt: 2.5, p: 2, bgcolor: C.accentSoft, border: `1px solid ${C.accent}22`, borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography sx={{ fontWeight: 700, color: C.text, fontSize: 14 }}>Order Total</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: 20, color: C.accent }}>{fmt(order.totalAmount)}</Typography>
            </Box>
          </Grid>

        </Grid>
      </DialogContent>
    </Dialog>
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

  const token = localStorage.getItem("vendorToken");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res  = await fetch("http://localhost:8000/api/order/vendor/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (e) {
      console.error("Error fetching orders:", e);
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
                    <Typography sx={{ color: C.muted, fontSize: 14 }}>No orders yet</Typography>
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

                      {/* Order ID */}
                      <TableCell>
                        <Typography sx={{ fontSize: 12, color: C.sub, fontFamily: "monospace", fontWeight: 600 }}>
                          #{order._id?.slice(-8).toUpperCase()}
                        </Typography>
                      </TableCell>

                      {/* Customer */}
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

                      {/* Items */}
                      <TableCell>
                        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 1.1, py: 0.35, borderRadius: 1.5, bgcolor: C.surfaceAlt, border: `1px solid ${C.border}` }}>
                          <Inventory2 sx={{ fontSize: 12, color: C.muted }} />
                          <Typography sx={{ fontSize: 12, color: C.text, fontWeight: 700 }}>{order.items?.length ?? 0}</Typography>
                        </Box>
                      </TableCell>

                      {/* Total */}
                      <TableCell>
                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: C.accent }}>{fmt(order.totalAmount)}</Typography>
                      </TableCell>

                      {/* Status */}
                      <TableCell><StatusChip status={order.status} /></TableCell>

                      {/* Actions */}
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

      {/* Modals */}
      <OrderDetailModal order={detailOrder} onClose={() => setDetailOrder(null)} />
      <ConfirmDialog open={confirmOpen} actionType={actionType} loading={actionLoading}
        onClose={() => setConfirmOpen(false)} onConfirm={handleConfirm} />
    </Box>
  );
};

export default ViewNewOrders;
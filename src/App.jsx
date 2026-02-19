import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ScrollToTop } from "./components/common/ScrollToTop";
import AppLayout from "./layout/AppLayout";

import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import Home from "./pages/Dashboard/Home";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AddNewInventory from "./components/ui/inventory-management/AddNewInventory";
import ViewCurrentInventory from "./components/ui/inventory-management/ViewCurrentInventory";
import ViewNewOrders from "./components/ui/order-management/ViewNewOrders";
import ViewOrderHistory from "./components/ui/order-management/order-history/VIewOrderHistory";
import ViewAdminNotification from "./components/ui/communication/ViewAdminNotification";
import TrackCurrentOrders from "./components/ui/order-management/TrackCurrentOrder";
import SupportRequest from "./components/ui/communication/SupportRequest";
import PlatformAnnouncement from "./components/ui/communication/PlatformAnnouncement";
import UpdateVendorDetails from "./components/ui/account-settings/UpdateVendorDetails";
import ManageOperationHours from "./components/ui/account-settings/ManageOperationHours";
import UpdateContactInformation from "./components/ui/account-settings/UpdateContactInformation";
import SalesPerformance from "./components/ui/vendor-analytics/SalesPerformance";
import ManagePaymentDetails from "./components/ui/account-settings/ManagePaymentDetails";
import CustomerFeedback from "./components/ui/vendor-analytics/CustomerFeedback";
import OrderCompletionRate from "./components/ui/vendor-analytics/OrderCompletionRate";
import SiginInLogin from "./components/auth/SignInForm";

// ── Guards ────────────────────────────────────────────────────────────────────

// Unauthenticated → redirect to /signin
const PrivateRoute = ({ children }) => {
  const { vendor } = useAuth();
  return vendor ? children : <Navigate to="/signin" replace />;
};

// Already logged in → redirect to dashboard
const PublicRoute = ({ children }) => {
  const { vendor } = useAuth();
  return !vendor ? children : <Navigate to="/dashboard" replace />;
};

// ── Routes ────────────────────────────────────────────────────────────────────
const AppRoutes = () => (
  <Routes>
    {/* Redirect root to appropriate page based on auth status */}
    <Route path="/" element={<Navigate to="/signin" replace />} />

    {/* Auth — public only */}
    <Route path="/signin" element={<PublicRoute><SiginInLogin /></PublicRoute>} />
    {/* <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} /> */}

    {/* Dashboard — protected */}
    <Route
      element={
        <PrivateRoute>
          <AppLayout />
        </PrivateRoute>
      }
    >
      <Route path="/dashboard" element={<Home />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/blank" element={<Blank />} />
      <Route path="/form-elements" element={<FormElements />} />
      <Route path="/basic-tables" element={<BasicTables />} />

      {/* Inventory */}
      <Route path="/AddNewInventory" element={<AddNewInventory />} />
      <Route path="/ViewCurrentInventory" element={<ViewCurrentInventory />} />

      {/* Orders */}
      <Route path="/ViewNewOrders" element={<ViewNewOrders />} />
      <Route path="/ViewOrderHistory" element={<ViewOrderHistory />} />
      <Route path="/TrackCurrentOrder" element={<TrackCurrentOrders />} />

      {/* Communication */}
      <Route path="/ViewAdminNotification" element={<ViewAdminNotification />} />
      <Route path="/SupportRequest" element={<SupportRequest />} />
      <Route path="/PlatformAnnouncement" element={<PlatformAnnouncement />} />

      {/* Account Settings */}
      <Route path="/UpdateVendorDetails" element={<UpdateVendorDetails />} />
      <Route path="/ManageOperationHours" element={<ManageOperationHours />} />
      <Route path="/UpdateContactInformation" element={<UpdateContactInformation />} />
      <Route path="/ManagePaymentDetails" element={<ManagePaymentDetails />} />

      {/* Analytics */}
      <Route path="/SalesPerformance" element={<SalesPerformance />} />
      <Route path="/CustomerFeedback" element={<CustomerFeedback />} />
      <Route path="/OrderCompletionRate" element={<OrderCompletionRate />} />

      {/* Charts */}
      <Route path="/line-chart" element={<LineChart />} />
      <Route path="/bar-chart" element={<BarChart />} />
    </Route>

    {/* 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
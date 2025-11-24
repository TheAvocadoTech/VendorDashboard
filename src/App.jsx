import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
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
import PopulationProduct from "./components/ui/vendor-analytics/PopulationProduct";
import CustomerFeedback from "./components/ui/vendor-analytics/CustomerFeedback";
import OrderCompletionRate from "./components/ui/vendor-analytics/OrderCompletionRate";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Inventory Management */}
            <Route path="/AddNewInventory" element={<AddNewInventory />} />
            <Route
              path="/ViewCurrentInventory"
              element={<ViewCurrentInventory />}
            />

            {/* Order Management */}
            <Route path="/ViewNewOrders" element={<ViewNewOrders />} />
            <Route path="ViewOrderHistory" element={<ViewOrderHistory />} />
            <Route path="/TrackCurrentOrder" element={<TrackCurrentOrders />} />

            {/* Communication */}
            <Route
              path="/ViewAdminNotification"
              element={<ViewAdminNotification />}
            />
            <Route path="/SupportRequest" element={<SupportRequest />} />
            <Route
              path="/PlatformAnnouncement"
              element={<PlatformAnnouncement />}
            />

            {/* Account Settings */}
            <Route
              path="/UpdateVendorDetails"
              element={<UpdateVendorDetails />}
            />
            <Route
              path="/ManageOperationHours"
              element={<ManageOperationHours />}
            />
            <Route
              path="/UpdateContactInformation"
              element={<UpdateContactInformation />}
            />
            <Route
              path="/ManagePaymentDetails"
              element={<ManagePaymentDetails />}
            />

            {/* Analytics */}
            <Route path="/SalesPerformance" element={<SalesPerformance />} />
            <Route path="/PopulationProduct" element={<PopulationProduct />} />
            <Route path="/CustomerFeedback" element={<CustomerFeedback />} />
            <Route
              path="/OrderCompletionRate"
              element={<OrderCompletionRate />}
            />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          {/* <Route path="/signup" element={<SignUp />} /> */}

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

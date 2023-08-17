import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Home routes
import HomeLayout from "./components/layout/HomeLayout";
import HomeView from "./views/HomeView";
import AccountView from "./views/AccountView";
import AboutView from "./views/AboutView";
import ContactView from "./views/ContactView";
import NotFoundView from "./views/NotFoundView";
import ForgotPassword from "./components/auth/ForgotPassword";

// Vendor routes
import { VendorProtectedRoute } from "./components/auth/VendorProtectedRoute";
import VendorLayout from "./components/layout/VendorLayout";
import VendorCard from "./components/vendor/VendorCard";
import VendorCharts from "./components/vendor/VendorCharts";

// Customer routes
import { CustomerProtectedRoute } from "./components/auth/CustomerProtectedRoute";
import CustomerLayout from "./components/layout/CustomerLayout";
import CustomerCard from "./components/customer/CustomerCard";
import Carts from "./components/cart/index";
import Faves from "./components/fave/index";
// import ViewCart from "./components/cart/ViewCart";
// import ViewFave from "./components/fave/ViewFave";

import VendorOrders from "./components/order/VendorOrderList";
import CustomerOrders from "./components/order/CustomerOrderList";

// Kitchen routes
import AddKitchen from "./components/kitchen/AddKitchen";
import EditKitchen from "./components/kitchen/EditKitchen";
import { PublicKitchen, VendorKitchen } from "./components/kitchen/ViewKitchen";
import {
  CustomerHome,
  PublicKitchens,
  VendorHome,
} from "./components/kitchen/index";

// Product routes
import ProductForm from "./components/product/ProductForm";
// import ViewProduct from "./components/product/ViewProduct";

function App() {
  return (
    <GoogleOAuthProvider
      clientId="501127864045-ft33hrmuga70sircjvcemeu2g85g55no.apps.googleusercontent.com"
      // redirectUri="https://example.com/oauth2/callback"
      // scopes={['email', 'profile']}
    >
      <BrowserRouter>
        <Routes>
          {/* Home routes */}
          <Route path="/" element={<HomeLayout />}>
            <Route path="/" element={<HomeView />} />
            <Route path="/about" element={<AboutView />} />
            <Route path="/contact" element={<ContactView />} />
            <Route path="/account" element={<AccountView />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<NotFoundView />} />
            <Route path="/kitchens" element={<PublicKitchens />} />
            <Route path="/kitchens/:kitchenId" element={<PublicKitchen />} />
          </Route>

          {/* Vendor routes */}
          <Route path="/vendor" element={<VendorProtectedRoute />}>
            <Route path="/vendor" element={<VendorLayout />}>
              <Route path="/vendor/home" element={<VendorHome />} />
              <Route
                path="/vendor/kitchens/:kitchenId"
                element={<VendorKitchen />}
              />
              <Route path="/vendor/kitchens/add" element={<AddKitchen />} />
              <Route
                path="/vendor/kitchens/edit/:kitchenId"
                element={<EditKitchen />}
              />
              <Route
                path="/vendor/kitchens/:kitchenId/products/add"
                element={<ProductForm />}
              />
              <Route
                path="/vendor/:vendorId/orders"
                element={<VendorOrders />}
              />
              <Route
                path="/vendor/:vendorId/charts"
                element={<VendorCharts />}
              />
              <Route path="/vendor/:vendorId" element={<VendorCard />} />
              <Route
                path="/vendor/:vendorId/customer/:customerId"
                element={<CustomerCard />}
              />
            </Route>
          </Route>

          {/* Customer routes */}
          <Route path="/customer" element={<CustomerProtectedRoute />}>
            <Route path="/customer" element={<CustomerLayout />}>
              <Route path="/customer/home" element={<CustomerHome />} />
              <Route
                path="/customer/kitchens/:kitchenId"
                element={<PublicKitchen />}
              />
              <Route
                path="/customer/:customerId/orders"
                element={<CustomerOrders />}
              />
              <Route path="/customer/:customerId/faves" element={<Faves />} />
              <Route path="/customer/:customerId/carts" element={<Carts />} />
              <Route path="/customer/:customerId" element={<CustomerCard />} />
              <Route
                path="/customer/:customerId/vendor/:vendorId"
                element={<VendorCard />}
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;

import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Home routes
import HomeLayout from "./components/layout/HomeLayout";
import HomeView from "./views/HomeView";
import AccountView from "./views/AccountView";
import AboutView from "./views/AboutView";
import ContactView from "./views/ContactView";
import NotFoundView from "./views/NotFoundView";

// Vendor routes
import { VendorProtectedRoute } from "./components/auth/VendorProtectedRoute";
import VendorLayout from "./components/layout/VendorLayout";
import VendorCard from "./components/vendor/VendorCard";
import VendorCharts from "./components/vendor/index";

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
import AddProduct from "./components/product/ProductForm";
// import EditProduct from "./components/product/EditProduct";
// import ViewProduct from "./components/product/ViewProduct";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home routes */}
        <Route path="/" element={<HomeLayout />}>
          <Route path="/" element={<HomeView />} />
          <Route path="/about" element={<AboutView />} />
          <Route path="/contact" element={<ContactView />} />
          <Route path="/account" element={<AccountView />} />
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
              element={<AddProduct />}
            />
            <Route path="/vendor/:vendorId/orders" element={<VendorOrders />} />
            <Route path="/vendor/:vendorId/charts" element={<VendorCharts />} />
            <Route path="/vendor/:vendorId" element={<VendorCard />} />
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
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

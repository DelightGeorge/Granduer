import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Women from "./pages/Women.jsx";
import Men from "./pages/Men.jsx";
import Children from "./pages/Children.jsx";
import NewArrivals from "./pages/NewArrivals.jsx";
import Cart from "./pages/Cart.jsx";
import { ProductProvider } from "./Context/ProductContext.jsx";
import SingleProduct from "./pages/SingleProduct.jsx";
import UserLoginPage from "./pages/UserLogin.jsx";
import UserDash from "./Dashboard_Pages/UserDashboard.jsx";
import AllProducts from "./pages/AllProducts.jsx";
import Dashboard from "./Dashboard_Pages/Dashboard.jsx";
import CreateProduct from "./pages/CreateProduct.jsx";
import ThankYouPage from "./pages/ThankYouPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/women", element: <Women /> },
      { path: "/men", element: <Men /> },
      { path: "/children", element: <Children /> },
      { path: "/newarrivals", element: <NewArrivals /> },
      { path: "/cart", element: <Cart /> },
      { path: "/product/:id", element: <SingleProduct /> },
      { path: "/login", element: <UserLoginPage /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/userdashboard", element: <UserDash /> },
      { path: "/all-products", element: <AllProducts /> },
      { path: "/create-product", element: <CreateProduct /> },
      { path: "/thank-you", element: <ThankYouPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ProductProvider>
      <RouterProvider router={router} />
    </ProductProvider>
  </StrictMode>
);

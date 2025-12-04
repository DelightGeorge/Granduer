import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { baseUrl } from "../App";
import { jwtDecode } from "jwt-decode";

const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [productData, setProductData] = useState([]);
  const [isAuthentified, setIsAuthentified] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [favouriteCount, setFavouriteCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const getLocalData = (key, fallback) => {
    try {
      const value = localStorage.getItem(key);
      if (!value || value === "undefined") return fallback;
      return JSON.parse(value);
    } catch (err) {
      console.error("Error reading localStorage:", err);
      return fallback;
    }
  };

  const [cartItems, setCartItems] = useState(getLocalData("cartItems", []));
  const [favoriteItems, setFavoriteItems] = useState(
    getLocalData("favouriteCart", [])
  );
  const [user, setUser] = useState(getLocalData("user", {}));
  const [token, setToken] = useState(localStorage.getItem("authToken") || "");
  const [localCartMerged, setLocalCartMerged] = useState(
    getLocalData("localCartMerged", false)
  );

  useEffect(() => setIsAuthentified(!!user?.id), [user]);

  useEffect(
    () =>
      setCartCount(
        cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0)
      ),
    [cartItems]
  );
  useEffect(
    () =>
      setFavouriteCount(
        favoriteItems.reduce((acc, item) => acc + (item.quantity || 0), 0)
      ),
    [favoriteItems]
  );

  // Fetch all products
  const HandleGetProducts = async () => {
    try {
      const res = await fetch(`${baseUrl}getAllProduct`);
      const data = await res.json();
      if (res.ok && data.data) {
        setProductData(data.data);
        localStorage.setItem("productData", JSON.stringify(data.data));
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  useEffect(() => {
    HandleGetProducts();
  }, []);

  // Fetch cart from server
  const fetchServerCart = async () => {
    if (!isAuthentified || !user?.id || !token) return [];
    try {
      const res = await fetch(`${baseUrl}getcart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data?.data?.Productcart) {
        const mapped = data.data.Productcart.map((pc) => ({
          id: pc.product.id,
          product: pc.product,
          quantity: pc.quantity,
          size: pc.selectedsize,
          color: pc.selectedcolor,
        }));
        setCartItems(mapped);
        localStorage.setItem("cartItems", JSON.stringify(mapped));
        return mapped;
      }
      setCartItems([]);
      localStorage.setItem("cartItems", JSON.stringify([]));
      return [];
    } catch (err) {
      console.error("fetchServerCart error:", err);
      return [];
    }
  };

  // Merge local cart with server cart
  const mergeLocalCartToServer = async () => {
    if (!isAuthentified || localCartMerged) {
      await fetchServerCart();
      return;
    }
    if (!cartItems?.length) {
      // No local cart, just fetch server cart
      await fetchServerCart();
      setLocalCartMerged(true);
      localStorage.setItem("localCartMerged", "true");
      return;
    }

    try {
      setLoading(true);
      const addPromises = cartItems.map((item) =>
        fetch(`${baseUrl}addcart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productid: item.id,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          }),
        }).then((r) => r.json())
      );
      await Promise.all(addPromises);
      await fetchServerCart();
      setLocalCartMerged(true);
      localStorage.setItem("localCartMerged", "true");
      toast.success("Merged local cart to your account");
    } catch (err) {
      console.error("mergeLocalCartToServer error:", err);
      toast.error("Failed to merge local cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const syncCart = async () => {
      if (isAuthentified && token && user?.id) {
        await mergeLocalCartToServer();
      } else {
        setCartItems(getLocalData("cartItems", []));
      }
    };
    syncCart();
  }, [isAuthentified, token, user]);

  // Add to cart
  const HandleAddTCart = async (product, quantity = 1, size, color) => {
    if (!isAuthentified) {
      // Guest cart
      const exists = cartItems.find(
        (i) => i.id === product.id && i.size === size && i.color === color
      );
      const updatedCart = exists
        ? cartItems.map((i) =>
            i.id === product.id && i.size === size && i.color === color
              ? { ...i, quantity: i.quantity + quantity }
              : i
          )
        : [...cartItems, { id: product.id, product, quantity, size, color }];

      setCartItems(updatedCart);
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      toast.success("Item added to cart!");
      return { success: true, data: updatedCart };
    }

    // Logged-in user
    try {
      const res = await fetch(`${baseUrl}addcart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productid: product.id, quantity, size, color }),
      });
      const data = await res.json();
      if (res.ok && data?.data?.Productcart) {
        const updatedCart = data.data.Productcart.map((pc) => ({
          id: pc.product.id,
          product: pc.product,
          quantity: pc.quantity,
          size: pc.selectedsize,
          color: pc.selectedcolor,
        }));
        setCartItems(updatedCart);
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        toast.success(data.message || "Item added to cart!");
        return { success: true, data: updatedCart };
      }
      toast.error(data.message || "Failed to add item to cart");
      return { success: false, message: data.message };
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Failed to add item to cart");
      return { success: false, message: err.message };
    }
  };

  // Update cart
  const HandleUpdateCart = async (updatedProd) => {
    if (!isAuthentified) {
      const updatedCart = cartItems.map((i) =>
        i.id === updatedProd.id &&
        i.size === updatedProd.size &&
        i.color === updatedProd.color
          ? { ...i, ...updatedProd }
          : i
      );
      setCartItems(updatedCart);
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      toast.success("Cart updated successfully!");
      return { success: true, data: updatedCart };
    }

    try {
      const res = await fetch(`${baseUrl}updatecart`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productid: updatedProd.id,
          size: updatedProd.size,
          color: updatedProd.color,
          quantity: updatedProd.quantity,
        }),
      });
      const data = await res.json();
      if (res.ok && data?.data?.Productcart) {
        const updatedCart = data.data.Productcart.map((pc) => ({
          id: pc.product.id,
          product: pc.product,
          quantity: pc.quantity,
          size: pc.selectedsize,
          color: pc.selectedcolor,
        }));
        setCartItems(updatedCart);
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        toast.success(data.message || "Cart updated successfully!");
        return { success: true, data: updatedCart };
      }
      toast.error(data.message || "Failed to update cart");
      return { success: false, message: data.message };
    } catch (err) {
      console.error("HandleUpdateCart error:", err);
      toast.error("Failed to update cart");
      return { success: false, message: err.message };
    }
  };

  // Delete cart item
  const HandleDeleteCart = async (prod) => {
    if (!isAuthentified) {
      const updatedCart = cartItems.filter(
        (i) =>
          !(i.id === prod.id && i.size === prod.size && i.color === prod.color)
      );
      setCartItems(updatedCart);
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      toast.success("Item removed from cart!");
      return { success: true, data: updatedCart };
    }

    try {
      const res = await fetch(`${baseUrl}deletecart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productid: prod.id }),
      });
      const data = await res.json();
      if (data.success) {
        const updatedCart = data.data.Productcart.map((pc) => ({
          id: pc.product.id,
          product: pc.product,
          quantity: pc.quantity,
          size: pc.selectedsize,
          color: pc.selectedcolor,
        }));
        setCartItems(updatedCart);
        setCartCount(updatedCart.reduce((acc, i) => acc + i.quantity, 0));
        toast.success("Item removed from cart!");
        return { success: true, data: updatedCart };
      } else {
        toast.error(data.message || "Failed to remove item");
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error("Delete cart error:", err);
      toast.error("Failed to delete cart item");
      return { success: false, message: err.message };
    }
  };

  // Favourite cart
  const HandleAddFavouriteCart = (prod) => {
    const exists = favoriteItems.find(
      (i) => i.id === prod.id && i.size === prod.size && i.color === prod.color
    );
    const updatedFav = exists
      ? favoriteItems.filter(
          (i) =>
            !(
              i.id === prod.id &&
              i.size === prod.size &&
              i.color === prod.color
            )
        )
      : [...favoriteItems, prod];
    setFavoriteItems(updatedFav);
    localStorage.setItem("favouriteCart", JSON.stringify(updatedFav));
    toast[exists ? "info" : "success"](
      exists ? "Removed from favourites" : "Added to favourites"
    );
    return updatedFav;
  };

  // Token expiration check
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("authToken");
          setToken("");
          setUser({});
          setIsAuthentified(false);
        }
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, [token]);

  return (
    <ProductContext.Provider
      value={{
        productData,
        cartItems,
        cartCount,
        favoriteItems,
        favouriteCount,
        isAuthentified,
        loading,
        setLoading,
        setUser,
        setToken: (t) => {
          if (t) localStorage.setItem("authToken", t);
          else localStorage.removeItem("authToken");
          setToken(t || "");
        },
        token,
        setCartItems,
        HandleGetProducts,
        HandleAddTCart,
        HandleUpdateCart,
        HandleDeleteCart,
        HandleAddFavouriteCart,
        setIsAuthentified,
        fetchServerCart,
        mergeLocalCartToServer,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
export { ProductContext };

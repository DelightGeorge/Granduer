import { createContext, useEffect, useState, useCallback } from "react";
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
    } catch {
      return fallback;
    }
  };

  const [cartItems, setCartItems] = useState(() => getLocalData("cartItems", []));
  const [favoriteItems, setFavoriteItems] = useState(() => getLocalData("favouriteCart", []));
  const [user, setUser] = useState(() => getLocalData("user", null));
  const [token, setTokenState] = useState(() => localStorage.getItem("authToken") || "");
  const [localCartMerged, setLocalCartMerged] = useState(() => getLocalData("localCartMerged", false));

  // Fix 10/11: derive isAuthentified from user AND token together
  useEffect(() => {
    setIsAuthentified(!!(user?.id && token));
  }, [user, token]);

  // Fix 12: token expiry check also clears user from localStorage
  useEffect(() => {
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        localStorage.removeItem("localCartMerged");
        setTokenState("");
        setUser(null);
        setIsAuthentified(false);
        toast.info("Your session has expired. Please log in again.");
      }
    } catch {
      localStorage.removeItem("authToken");
      setTokenState("");
    }
  }, [token]);

  useEffect(() => {
    setCartCount(cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0));
  }, [cartItems]);

  useEffect(() => {
    setFavouriteCount(favoriteItems.reduce((acc, item) => acc + (item.quantity || 0), 0));
  }, [favoriteItems]);

  const setToken = (t) => {
    if (t) localStorage.setItem("authToken", t);
    else localStorage.removeItem("authToken");
    setTokenState(t || "");
  };

  const HandleGetProducts = async () => {
    try {
      const res = await fetch(`${baseUrl}getAllProduct`);
      const data = await res.json();
      if (res.ok && data.data) {
        setProductData(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  useEffect(() => {
    HandleGetProducts();
  }, []);

  const fetchServerCart = useCallback(async () => {
    if (!user?.id || !token) return [];
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
  }, [user, token]);

  const mergeLocalCartToServer = useCallback(async () => {
    if (!user?.id || !token) return;
    if (localCartMerged) {
      await fetchServerCart();
      return;
    }

    const localCart = getLocalData("cartItems", []);
    if (!localCart.length) {
      await fetchServerCart();
      setLocalCartMerged(true);
      localStorage.setItem("localCartMerged", "true");
      return;
    }

    try {
      setLoading(true);
      // Fix 14: read from localStorage snapshot, not stale closure
      await Promise.all(
        localCart.map((item) =>
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
        )
      );
      await fetchServerCart();
      setLocalCartMerged(true);
      localStorage.setItem("localCartMerged", "true");
      toast.success("Your cart has been synced to your account!");
    } catch (err) {
      console.error("mergeLocalCartToServer error:", err);
      toast.error("Failed to sync your cart");
    } finally {
      setLoading(false);
    }
  }, [user, token, localCartMerged, fetchServerCart]);

  useEffect(() => {
    if (isAuthentified && token && user?.id) {
      mergeLocalCartToServer();
    } else if (!isAuthentified) {
      setCartItems(getLocalData("cartItems", []));
    }
  }, [isAuthentified, token, user]);

  const HandleAddTCart = async (product, quantity = 1, size, color) => {
    if (!isAuthentified) {
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

  const HandleUpdateCart = async (updatedProd) => {
    if (!isAuthentified) {
      const updatedCart = cartItems.map((i) =>
        i.id === updatedProd.id && i.size === updatedProd.size && i.color === updatedProd.color
          ? { ...i, ...updatedProd }
          : i
      );
      setCartItems(updatedCart);
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      toast.success("Cart updated!");
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
        toast.success(data.message || "Cart updated!");
        return { success: true, data: updatedCart };
      }
      toast.error(data.message || "Failed to update cart");
      return { success: false };
    } catch (err) {
      console.error("HandleUpdateCart error:", err);
      toast.error("Failed to update cart");
      return { success: false };
    }
  };

  const HandleDeleteCart = async (prod) => {
    if (!isAuthentified) {
      const updatedCart = cartItems.filter(
        (i) => !(i.id === prod.id && i.size === prod.size && i.color === prod.color)
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
        toast.success("Item removed!");
        return { success: true, data: updatedCart };
      }
      toast.error(data.message || "Failed to remove item");
      return { success: false };
    } catch (err) {
      console.error("Delete cart error:", err);
      toast.error("Failed to delete item");
      return { success: false };
    }
  };

  const HandleAddFavouriteCart = (prod) => {
    const exists = favoriteItems.find(
      (i) => i.id === prod.id && i.size === prod.size && i.color === prod.color
    );
    const updatedFav = exists
      ? favoriteItems.filter(
          (i) => !(i.id === prod.id && i.size === prod.size && i.color === prod.color)
        )
      : [...favoriteItems, prod];
    setFavoriteItems(updatedFav);
    localStorage.setItem("favouriteCart", JSON.stringify(updatedFav));
    toast[exists ? "info" : "success"](
      exists ? "Removed from favourites" : "Added to favourites!"
    );
    return updatedFav;
  };

  return (
    <ProductContext.Provider
      value={{
        // Fix 13: expose productData (was filteredProducts which never existed)
        productData,
        filteredProducts: productData,
        cartItems,
        cartCount,
        favoriteItems,
        favouriteCount,
        isAuthentified,
        loading,
        setLoading,
        setUser: (u) => {
          if (u) localStorage.setItem("user", JSON.stringify(u));
          else localStorage.removeItem("user");
          setUser(u);
        },
        setToken,
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
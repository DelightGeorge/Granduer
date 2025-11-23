import React, { createContext, useState, useEffect } from "react";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [productData, setProductData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Selected product states for editing/viewing
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  // ----------------------------
  // Products Fetch
  // ----------------------------
  const HandleGetProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/getAllProduct");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const result = await res.json();
      setProductData(result.data);
      setFilteredProducts(result.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // Filter products by search term
  useEffect(() => {
    if (!searchTerm) setFilteredProducts(productData);
    else {
      const filtered = productData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, productData]);

  // ----------------------------
  // Cart Functions
  // ----------------------------
  const updateCartCount = (cartArray) => {
    const total = cartArray.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(total);
  };

  const HandleAddTCart = (prod, qty = 1, size = "", color = "") => {
    if (!prod) return;

    const itemSize = size || "";
    const itemColor = color || "";

    let updatedCart = [...cart];
    const existingIndex = updatedCart.findIndex(
      (item) =>
        item.id === prod.id &&
        (item.size || "") === itemSize &&
        (item.color || "") === itemColor
    );

    if (existingIndex >= 0) {
      updatedCart[existingIndex].quantity += qty;
    } else {
      updatedCart.push({ ...prod, quantity: qty, size: itemSize, color: itemColor });
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateCartCount(updatedCart);
  };

  const HandleUpdateCart = (prodId, newQty, size = "", color = "") => {
    let updatedCart = cart.map((item) => {
      if (
        item.id === prodId &&
        (item.size || "") === (size || "") &&
        (item.color || "") === (color || "")
      ) {
        return { ...item, quantity: newQty };
      }
      return item;
    });

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateCartCount(updatedCart);
  };

  const HandleDeleteCart = (prodId, size = "", color = "") => {
    let updatedCart = cart.filter(
      (item) =>
        !(item.id === prodId && (item.size || "") === (size || "") && (item.color || "") === (color || ""))
    );

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateCartCount(updatedCart);
  };

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCart(parsedCart);
      updateCartCount(parsedCart);
    }
  }, []);

  return (
    <ProductContext.Provider
      value={{
        productData,
        filteredProducts,
        HandleGetProducts,
        HandleAddTCart,
        HandleUpdateCart,
        HandleDeleteCart,
        cart,
        cartCount,
        searchTerm,
        setSearchTerm,
        selectedProduct,
        setSelectedProduct,
        quantity,
        setQuantity,
        selectedSize,
        setSelectedSize,
        selectedColor,
        setSelectedColor,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

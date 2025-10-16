import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [productData, setProductData] = useState(null);
  const [isAuthentified, setisAuthentified] = useState(false);
  const [cartcout, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cartItems")) || []
  );

  // ✅ Sync from localStorage when app starts
  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedCartItems);
  }, []);

  // ✅ Recalculate count anytime cart changes
  useEffect(() => {
    const count = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
    setCartCount(count);
  }, [cartItems]);

  const HandleAddTCart = (prod, quantity = 1, size = null, color = null) => {
    if (!isAuthentified) {
      const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

      const existingItem = storedCartItems.find(
        (item) => parseInt(item.id) === parseInt(prod.id)
      );

      let updatedCartItems;

      if (existingItem) {
        updatedCartItems = storedCartItems.map((item) =>
          parseInt(item.id) === parseInt(prod.id)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        toast.info("Existing item quantity added to cart Successfully");
      } else {
        updatedCartItems = [
          ...storedCartItems,
          { ...prod, quantity, size, color },
        ];
        toast.success("Product added to cart Successfully");
      }

      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      setCartItems(updatedCartItems);
    } else {
      console.log("User is authenticated - handle API cart instead");
    }
  };

  const HandleGetProducts = async () => {
    try {
      const res = await fetch("http://localhost:8000/products");
      const data = await res.json();
      if (res.ok) setProductData(data);
      else console.log("Unable to fetch data");
    } catch (error) {
      console.log(error.message);
    }
  };


  const HandleUpdateCart = async() => {
    try {
      if (!isAuthentified) {

      }else {
        console.log("Authentified");
        
      }
    }catch (error) {
      console.log(error.message);
    }
  }

  return (
    <ProductContext.Provider
      value={{
        HandleGetProducts,
        HandleAddTCart,
        productData,
        cartItems,
        cartcout,
        setisAuthentified,
        HandleUpdateCart
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
export { ProductContext };

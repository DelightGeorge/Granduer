import { createContext, useState } from "react";
const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [productData, setProductData] = useState(null);

const [isAuthentified, setisAuthentified] = useState(false);


  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cartItems")) || []
  );
  const HandleGetProducts = async () => {
    try {
      const res = await fetch("http://localhost:8000/products", {
        method: "GET",
      });

      const data = await res.json();

      if (res.ok) {
        console.log(data);
        setProductData(data)
      }else{
        console.log("Unable to fetch data");
        
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <ProductContext.Provider value={{ HandleGetProducts, productData}} >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
export { ProductContext };

import { useContext, useEffect, useState } from "react";
import { ProductContext } from "../Context/ProductContext";
import { useParams } from "react-router-dom";
import Layout from "../Shared/Layout";
import { toast } from "react-toastify";

const SingleProduct = () => {
  const { id } = useParams();
  const { productData, HandleGetProducts, HandleAddTCart, cartItems } =
    useContext(ProductContext);

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false);
  const [currentCartQuantity, setCurrentCartQuantity] = useState(0);

  // Fetch products if not already loaded
  useEffect(() => {
    if (!productData?.length) {
      HandleGetProducts();
    }
  }, [HandleGetProducts, productData]);

  // Set current product based on id
  useEffect(() => {
    if (productData?.length > 0) {
      const found = productData.find(
        (item) => parseInt(item.id) === parseInt(id)
      );
      setProduct(found);
      setSelectedColor(found?.defaultColor || "");
      setSelectedSize(found?.defaultSize || "");
    }
  }, [productData, id]);

  // Update cart status when cartItems or product selection changes
  useEffect(() => {
    if (product) {
      const existingItem = cartItems?.find(
        (item) =>
          parseInt(item.id) === parseInt(product.id) &&
          item.size === selectedSize &&
          item.color === selectedColor
      );

      if (existingItem) {
        setIsInCart(true);
        setCurrentCartQuantity(existingItem.quantity || 0);
      } else {
        setIsInCart(false);
        setCurrentCartQuantity(0);
      }
    }
  }, [cartItems, product, selectedSize, selectedColor]);

  const handleAddToCart = (e) => {
    e.preventDefault();

    if (!selectedSize || !selectedColor) {
      toast.warning("Please select size and color");
      return;
    }

    HandleAddTCart(product, quantity, selectedSize, selectedColor);
    toast.success("Item added to cart 🛒");
  };

  if (!product) {
    return (
      <p className="text-center text-gray-500 mt-10">Loading product...</p>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gray-100 rounded-2xl overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-3">{product.description}</p>

              <p className="text-xl font-semibold text-green-700 mb-4">
                ${product.price}
              </p>

              {/* Sizes */}
              {product.sizes?.length > 0 && (
                <div className="mb-4">
                  <h2 className="font-semibold mb-1">Select Size:</h2>
                  <div className="flex gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`border rounded-md px-3 py-1 cursor-pointer ${
                          selectedSize === size
                            ? "bg-black text-white"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {product.colors?.length > 0 && (
                <div className="mb-4">
                  <h2 className="font-semibold mb-1">Select Color:</h2>
                  <div className="flex gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-7 h-7 rounded-full border-2 cursor-pointer ${
                          selectedColor === color
                            ? "border-black scale-110"
                            : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {isInCart && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  ✓ Already in cart (Qty: {currentCartQuantity})
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                  className="px-3 py-1"
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1"
                >
                  +
                </button>
              </div>

              {!isInCart ? (
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 cursor-pointer"
                >
                  Add to Cart
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-3 bg-green-100 text-green-700 rounded-md cursor-not-allowed"
                >
                  ✓ Added to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SingleProduct;

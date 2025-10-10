import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductContext } from "../Context/ProductContext";
import Layout from "../Shared/Layout";
import { FaStar } from "react-icons/fa";

const SingleProduct = () => {
  const { id } = useParams();
  const { productData, HandleGetProducts } = useContext(ProductContext);
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const colorOptions = ["#000000", "#ff0000", "#0000ff", "#008000", "#ff69b4"];
  const sizeOptions = ["S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    HandleGetProducts();
  }, [HandleGetProducts]);

  useEffect(() => {
    if (productData?.length > 0) {
      const found = productData.find(
        (item) => parseInt(item?.id) === parseInt(id)
      );
      setProduct(found);
    }
  }, [productData, id]);

  const handleQuantityChange = (value) => {
    if (value < 1) return;
    setQuantity(value);
  };

  if (!product) {
    return (
      <p className="text-center text-gray-500 mt-10">Loading product...</p>
    );
  }

  return (
    <Layout>
      <div className="md:px-10 lg:px-24 mb-3 mt-3 py-5">
        <div className="px-6 md:px-10 lg:px-20 flex flex-col md:flex-row justify-center items-center shadow-2xl gap-6 bg-white rounded-xl p-6">
          {/* Product Image */}
          <img
            src={product.image}
            alt={product.name}
            className="w-96 h-[28rem] object-cover rounded-lg"
          />

          {/* Product Details */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-primary mb-2">
              {product.name}
            </h1>

            {/* ⭐ Rating */}
            <div className="flex justify-center md:justify-start gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400 text-xl" />
              ))}
            </div>

            {/* 📝 Description */}
            <p className="text-gray-700 mb-4">{product.description}</p>

            {/* 🎨 Color Options */}
            <div className="mb-6">
              <p className="font-semibold mb-2">Available Colors:</p>
              <div className="flex justify-center md:justify-start gap-3">
                {colorOptions.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition ${
                      selectedColor === color
                        ? "border-primary scale-110"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              {selectedColor && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected color:{" "}
                  <span
                    className="inline-block w-4 h-4 rounded-full ml-1"
                    style={{ backgroundColor: selectedColor }}
                  ></span>
                </p>
              )}
            </div>

            {/* 📏 Size Options */}
            <div className="mb-6">
              <p className="font-semibold mb-2">Select Size:</p>
              <div className="flex justify-center md:justify-start gap-3 flex-wrap">
                {sizeOptions.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-md border-2 transition ${
                      selectedSize === size
                        ? "bg-primary text-white border-primary scale-105"
                        : "border-gray-300 text-gray-700 hover:border-primary"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {selectedSize && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected size:{" "}
                  <span className="font-semibold">{selectedSize}</span>
                </p>
              )}
            </div>

            {/* 🧮 Quantity + Add to Cart */}
            <div className="flex flex-col md:flex-row justify-center md:justify-start items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-4 py-2 bg-gray-200 text-lg rounded-md hover:bg-gray-300 transition"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityChange(Number(e.target.value))
                    }
                    className="w-16 text-center border border-gray-300 rounded-md py-2"
                    min="1"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-4 py-2 bg-gray-200 text-lg rounded-md hover:bg-gray-300 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 🛒 Add to Cart beside amount */}
              <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition">
                Add to Cart
              </button>
            </div>

            {/* 💵 Price */}
            <p className="text-2xl font-semibold text-primary mb-6">
              ${product.price}
            </p>

            {/* 🛍 Buy Now below */}
            <div className="flex justify-center md:justify-start">
              <button className="bg-primary text-white px-8 py-3 rounded-lg text-lg hover:bg-primary transition">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SingleProduct;

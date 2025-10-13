import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { ProductContext } from "../Context/ProductContext";
import Layout from "../shared/Layout";




const Men = () => {
  const { productData, HandleGetProducts, HandleAddTCart } = useContext(ProductContext);
  const [menProducts, setMenProducts] = useState([]);

  // Fetch products from context
  useEffect(() => {
    HandleGetProducts();
  }, [HandleGetProducts]);

  // Filter only men’s products
  useEffect(() => {
    if (productData?.length > 0) {
      const filtered = productData.filter(
        (product) => product.category === "men"
      );
      setMenProducts(filtered);
    }
  }, [productData]);

  return (
   <Layout>
     <div>
      <div className="w-full px-6 md:px-16 py-10 bg-gray-50">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 text-center">
          Men’s Collection 
        </h2>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {menProducts.map((item) => (
            <Link
              to={`/product/${item.id}`}
              key={item.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition duration-300 overflow-hidden group block"
            >
              {/* Image */}
              <div className="relative w-full h-64 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                {item.discount > 0 && (
                  <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                    -{item.discount}%
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col gap-2">
                <h3 className="text-lg font-medium text-gray-800 line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {item.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 text-yellow-500 text-sm mt-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`${
                        i < Math.round(item.rating)
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-gray-600 ml-2">{item.rating}</span>
                </div>

                {/* Price + Add to Cart */}
                <div className="flex items-center justify-between mt-2">
                  <p className="text-lg font-semibold text-gray-800">
                    ${item.price}
                  </p>
                  <button
                    onClick={() => HandleAddTCart(item, 1, item?.size, item?.color)}
                    className="bg-black text-white text-sm px-3 py-2 rounded-full hover:bg-blue-600 transition">
                    Add to Cart
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
   </Layout>
  );
};

export default Men;
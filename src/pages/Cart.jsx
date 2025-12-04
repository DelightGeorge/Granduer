import React, { useContext, useEffect, useState } from "react";
import { ProductContext } from "../Context/ProductContext";

import { RiDeleteBin3Fill, RiEditCircleFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { ImCancelCircle } from "react-icons/im";
import { toast } from "react-toastify";
import Edit from "../Context/Edit";
import Layout from "../Shared/Layout";
import { baseUrl } from "../App";

const Cart = () => {
  const {
    cartItems,
    cartCount,
    HandleDeleteCart,
    user,
    isAuthentified,
    setCartItems,
    token,
  } = useContext(ProductContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prod, setProd] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Sync modal selections with product
  useEffect(() => {
    if (prod) {
      setProd((prev) => ({
        ...prev,
        size: selectedSize || prev.size,
        color: selectedColor || prev.color,
        quantity: quantity || prev.quantity,
      }));
    }
  }, [selectedSize, selectedColor, quantity]);

  const handleOpenModal = (item) => {
    setProd(item);
    setSelectedSize(item.size || "");
    setSelectedColor(item.color || "");
    setQuantity(item.quantity || 1);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleGuestDelete = (item) => {
    const exists = cartItems.find(
      (i) => i.id === item.id && i.size === item.size && i.color === item.color
    );

    if (!exists) return;

    let updatedCart;
    if (exists.quantity > 1) {
      updatedCart = cartItems.map((i) =>
        i.id === item.id && i.size === item.size && i.color === item.color
          ? { ...i, quantity: i.quantity - 1 }
          : i
      );
      toast.info(`Decreased quantity of ${item.name || item.product?.name}`);
    } else {
      updatedCart = cartItems.filter(
        (i) =>
          !(i.id === item.id && i.size === item.size && i.color === item.color)
      );
      toast.success(`${item.name || item.product?.name} removed from cart`);
    }

    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const handleDelete = (item) => {
    if (isAuthentified && token) {
      HandleDeleteCart({ userid: user.id, productid: item.id });
      toast.success(`${item.name || item.product?.name} removed from cart`);
    } else {
      handleGuestDelete(item);
    }
  };

  // PAYMENT INITIALIZATION
  const HandleInitializePayment = async (e) => {
    e.preventDefault();

    if (!isAuthentified || !token) {
      toast.error("You must log in to proceed with checkout");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${baseUrl}initialize-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // use token from context
        },
        body: JSON.stringify({
          email: user?.email,
          amount: cartItems.reduce(
            (sum, i) => sum + (i.price || i.product?.price) * i.quantity,
            0
          ),
        }),
      });

      const data = await res.json();

      if (res.ok && data?.link) {
        toast.success("Redirecting to payment...");
        window.location.href = data.link;
      } else {
        toast.error(data?.message || "Payment failed");
      }
    } catch (error) {
      console.error("Init Pay Error:", error);
      toast.error("Payment initialization failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white py-10 px-4 md:px-10 relative flex flex-col">
        <h1 className="text-3xl font-bold text-center mb-8">Your Cart</h1>

        {/* Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={handleCloseModal}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            <div
              className="relative bg-white rounded-xl shadow-lg w-full max-w-lg p-6 z-10 animate-fadeIn"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition"
              >
                <ImCancelCircle className="h-8 w-8" />
              </button>

              <Edit
                prod={prod}
                setSelectedSize={setSelectedSize}
                setSelectedColor={setSelectedColor}
                setQuantity={setQuantity}
                quantity={quantity}
                closeModal={handleCloseModal}
              />
            </div>
          </div>
        )}

        {/* Cart Items */}
        {cartItems?.length > 0 ? (
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="hidden md:table min-w-full border border-gray-200 rounded-xl shadow-sm">
              <thead className="bg-gray-100">
                <tr className="text-left text-gray-700">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={item.image || item.product?.image}
                        alt={item.name || item.product?.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <span className="font-medium">
                        {item.name || item.product?.name}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      ${item.price || item.product?.price}
                    </td>
                    <td className="py-3 px-4">{item.quantity}</td>
                    <td className="py-3 px-4 font-semibold">
                      ${(item.price || item.product?.price) * item.quantity}
                    </td>
                    <td className="text-center flex justify-between gap-2">
                      <span
                        onClick={() => handleOpenModal(item)}
                        className="bg-black text-white px-2 py-1 rounded-md cursor-pointer hover:bg-gray-800"
                      >
                        <RiEditCircleFill />
                      </span>
                      <span
                        onClick={() => handleDelete(item)}
                        className="bg-black text-white px-2 py-1 rounded-md cursor-pointer hover:bg-gray-800"
                      >
                        <RiDeleteBin3Fill />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile */}
            <div className="space-y-4 md:hidden">
              {cartItems.map((item, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || item.product?.image}
                      alt={item.name || item.product?.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">
                        {item.name || item.product?.name}
                      </h3>
                      <p className="text-gray-600">
                        ${item.price || item.product?.price}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-sm">
                    <span>Quantity: {item.quantity}</span>
                    <span className="font-semibold">
                      Total: $
                      {(item.price || item.product?.price) * item.quantity}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="flex-1 bg-black text-white py-2 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="flex-1 bg-red-500 text-white py-2 rounded-md"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="flex justify-end mt-6">
              <div className="bg-gray-100 p-5 rounded-lg w-full sm:w-1/2 md:w-1/3 shadow-sm">
                <div className="flex justify-between mb-2 text-gray-700">
                  <span>Items in Cart:</span>
                  <span>{cartCount}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>
                    {cartItems
                      .reduce(
                        (sum, item) =>
                          sum +
                          (item.price || item.product?.price) * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={HandleInitializePayment}
                  className="mt-5 w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800"
                >
                  {isLoading ? "Processing..." : "Checkout"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-600">
            <p className="text-xl mb-4">Your cart is currently empty 🛒</p>
            <Link
              to="/"
              className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;

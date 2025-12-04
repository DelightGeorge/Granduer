import React, { useContext } from "react";
import { ProductContext } from "../Context/ProductContext";
import { FaHeart, FaTrash } from "react-icons/fa";

const FavouritesPage = () => {
  const { favourites, HandleToggleFavourite } = useContext(ProductContext);

  if (favourites.length === 0) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Your Favourites</h2>
        <p>No favourite products yet!</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Your Favourites</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favourites.map((prod) => (
          <div
            key={prod.id}
            className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition p-4 relative"
          >
            <img
              src={prod.image}
              alt={prod.name}
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <h3 className="font-semibold text-lg">{prod.name}</h3>
            <p className="text-gray-600 mb-2">${prod.price}</p>

            <button
              onClick={() => HandleToggleFavourite(prod)}
              className="absolute top-3 right-3 text-red-500 text-lg"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavouritesPage;

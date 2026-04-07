import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import LinesEllipsis from "react-lines-ellipsis";
import { ProductContext } from "../Context/ProductContext";
import Layout from "../Shared/Layout";

const Home = () => {
  const { productData, HandleGetProducts, HandleAddTCart } = useContext(ProductContext);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => { HandleGetProducts(); }, []);

  const bestSellers = productData?.filter(p => p.bestSeller) || [];
  const displayed = showAll
    ? (bestSellers.length > 0 ? bestSellers : productData)
    : (productData || []).slice(0, 3);

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-[#0f0f0f] min-h-[92vh] flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
        <span className="border border-white/20 text-white/60 text-xs tracking-widest uppercase px-4 py-1.5 rounded-full mb-8">
          New collection 2025
        </span>
        <h1 className="text-white text-4xl md:text-6xl font-medium text-center max-w-3xl leading-tight mb-5">
          Where style meets <span className="text-[#c9b99a]">expression</span> and fashion thrives
        </h1>
        <p className="text-white/50 text-base text-center max-w-md leading-relaxed mb-10">
          Step into a fashion haven where the latest trends meet your unique style. Redefine your wardrobe with Grandeur.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link to="/products" className="bg-white text-[#0f0f0f] px-7 py-3 rounded-full text-sm font-medium hover:opacity-85 transition">
            Shop now
          </Link>
          <Link to="/products" className="border border-white/25 text-white/70 px-7 py-3 rounded-full text-sm hover:border-white/50 transition">
            View all
          </Link>
        </div>

        {/* Scrolling strip */}
        <div className="w-full overflow-hidden mt-14">
          <div className="flex gap-3 animate-marquee w-max">
            {[...(productData || []), ...(productData || [])].map((p, i) => (
              <Link
                key={i}
                to={`/product/${p.id}`}
                className="w-40 h-52 rounded-xl overflow-hidden flex-shrink-0 bg-[#1e1e1e] flex items-end"
              >
                {p.image
                  ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  : <span className="text-white/40 text-xs p-3">{p.name}</span>}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="flex justify-center border-y border-gray-100 bg-gray-50">
        {[["2,400+", "Products"], ["180+", "Brands"], ["50k+", "Customers"], ["4.9", "Avg. rating"]].map(([n, l]) => (
          <div key={l} className="px-8 py-6 text-center border-r border-gray-100 last:border-r-0">
            <div className="text-2xl font-medium text-gray-900">{n}</div>
            <div className="text-xs text-gray-500 mt-0.5">{l}</div>
          </div>
        ))}
      </div>

      {/* Best Sellers */}
      <section className="bg-white px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-medium text-gray-900">Best sellers</h2>
          <p className="text-sm text-gray-500 mt-1">Our most-loved pieces, season after season</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {displayed.map(item => (
            <div key={item.id} className="border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-300 transition">
              <Link to={`/product/${item.id}`} className="block w-full h-64 bg-gray-50 overflow-hidden">
                {item.image
                  ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center"><div className="w-12 h-12 rounded-full bg-gray-200" /></div>}
              </Link>
              <div className="p-4">
                <p className="font-medium text-gray-900 truncate">{item.name}</p>
                <div className="text-sm text-gray-400 truncate mb-3">
                  <LinesEllipsis text={item.description} maxLine="1" ellipsis="..." trimRight />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">${item.price}</span>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-400 transition">
                      <FaHeart size={13} />
                    </button>
                    <button
                      onClick={() => HandleAddTCart(item, 1, item.defaultSize, item.defaultColor)}
                      className="w-8 h-8 rounded-full bg-[#0f0f0f] text-white flex items-center justify-center hover:opacity-75 transition"
                    >
                      <FaShoppingCart size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAll(!showAll)}
            className="border border-gray-300 text-gray-700 px-7 py-2.5 rounded-full text-sm hover:bg-gray-50 transition"
          >
            {showAll ? "See less" : "See more"}
          </button>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
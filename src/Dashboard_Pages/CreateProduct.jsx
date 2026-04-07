import { useState } from "react";
import { toast } from "react-toastify";
import { baseUrl } from "../App";

// Fix 16: removed ToastContainer — parent already renders one

const CreateProduct = ({ closeModal }) => {
  const emptyForm = {
    name: "",
    description: "",
    price: "",
    currency: "NGN",
    sizes: "",
    defaultSize: "",
    colors: "",
    defaultColor: "",
    bestSeller: false,
    subcategory: "",
    rating: 0,
    discount: 0,
    newArrival: false,
    tags: "",
    // Fix 17: match controller field name exactly (categoryId not categoryid)
    categoryId: "",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setImage(files[0]);
    } else {
      setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Fix 15: use baseUrl from env, not hardcoded localhost
    // Fix 17: send as FormData so image upload works with multer
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "sizes" || key === "colors" || key === "tags") {
        // Send as JSON string so controller can parse it
        data.append(key, JSON.stringify(value.split(",").map((s) => s.trim()).filter(Boolean)));
      } else {
        data.append(key, value);
      }
    });
    if (image) data.append("image", image);

    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${baseUrl}createProduct`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const result = await res.json();
      if (res.ok) {
        toast.success("Product created successfully!");
        setFormData(emptyForm);
        setImage(null);
        if (closeModal) closeModal();
      } else {
        toast.error(result.message || "Failed to create product");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Add New Product</h2>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[80vh] overflow-auto pr-2"
        onSubmit={handleSubmit}
      >
        <input name="name" placeholder="Product Name" value={formData.name}
          onChange={handleChange} className="border rounded p-2 focus:ring-2 focus:ring-primary" required />
        <input name="subcategory" placeholder="Subcategory" value={formData.subcategory}
          onChange={handleChange} className="border rounded p-2 focus:ring-2 focus:ring-primary" />
        <textarea name="description" placeholder="Product Description" value={formData.description}
          onChange={handleChange} className="border rounded p-2 col-span-1 md:col-span-2 focus:ring-2 focus:ring-primary" />
        <input type="number" name="price" placeholder="Price (kobo, e.g. 500000 = ₦5,000)"
          value={formData.price} onChange={handleChange}
          className="border rounded p-2 focus:ring-2 focus:ring-primary" required />
        <input name="currency" placeholder="Currency" value={formData.currency}
          onChange={handleChange} className="border rounded p-2 focus:ring-2 focus:ring-primary" />
        <input name="sizes" placeholder="Sizes (comma-separated, e.g. S,M,L,XL)"
          value={formData.sizes} onChange={handleChange}
          className="border rounded p-2 focus:ring-2 focus:ring-primary" />
        <input name="defaultSize" placeholder="Default Size" value={formData.defaultSize}
          onChange={handleChange} className="border rounded p-2 focus:ring-2 focus:ring-primary" />
        <input name="colors" placeholder="Colors (comma-separated, e.g. red,blue)"
          value={formData.colors} onChange={handleChange}
          className="border rounded p-2 focus:ring-2 focus:ring-primary" />
        <input name="defaultColor" placeholder="Default Color" value={formData.defaultColor}
          onChange={handleChange} className="border rounded p-2 focus:ring-2 focus:ring-primary" />
        <input type="number" name="rating" placeholder="Rating (0-5)" value={formData.rating}
          onChange={handleChange} className="border rounded p-2 focus:ring-2 focus:ring-primary" />
        <input type="number" name="discount" placeholder="Discount (%)" value={formData.discount}
          onChange={handleChange} className="border rounded p-2 focus:ring-2 focus:ring-primary" />
        <input name="tags" placeholder="Tags (comma-separated)" value={formData.tags}
          onChange={handleChange} className="border rounded p-2 focus:ring-2 focus:ring-primary" />
        {/* Fix 17: field name is categoryId to match controller */}
        <input type="number" name="categoryId" placeholder="Category ID" value={formData.categoryId}
          onChange={handleChange} className="border rounded p-2 focus:ring-2 focus:ring-primary" required />

        {/* Image upload */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
          <input type="file" name="image" accept="image/*" onChange={handleChange}
            className="border rounded p-2 w-full" />
        </div>

        <div className="flex gap-4 col-span-1 md:col-span-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="bestSeller" checked={formData.bestSeller} onChange={handleChange} />
            Best Seller
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="newArrival" checked={formData.newArrival} onChange={handleChange} />
            New Arrival
          </label>
        </div>

        <button type="submit"
          className="bg-primary text-white px-4 py-2 col-span-1 md:col-span-2 rounded hover:bg-primary-dark transition font-semibold">
          Create Product
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
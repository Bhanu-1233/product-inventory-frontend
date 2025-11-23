import React, { useState } from "react";
import { createProduct } from "../api.js";

const AddProductModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({
    name: "",
    unit: "",
    category: "",
    brand: "",
    stock: 0,
    status: "In Stock",
    image: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        stock: Number(form.stock),
      };
      const created = await createProduct(payload);
      onCreated(created);
    } catch (err) {
      console.error(err);
      window.alert(err.response?.data?.error || "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="modal-header">
          <h2>New product</h2>
          <button className="sidebar-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="modal-field">
              <label>Name</label>
              <input
                required
                className="modal-input"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div className="modal-field">
              <label>Unit</label>
              <input
                required
                className="modal-input"
                placeholder="e.g. pcs, box"
                value={form.unit}
                onChange={(e) => handleChange("unit", e.target.value)}
              />
            </div>
            <div className="modal-field">
              <label>Category</label>
              <input
                required
                className="modal-input"
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
              />
            </div>
            <div className="modal-field">
              <label>Brand</label>
              <input
                required
                className="modal-input"
                value={form.brand}
                onChange={(e) => handleChange("brand", e.target.value)}
              />
            </div>
            <div className="modal-field">
              <label>Stock</label>
              <input
                required
                type="number"
                min="0"
                className="modal-input"
                value={form.stock}
                onChange={(e) => handleChange("stock", e.target.value)}
              />
            </div>
            <div className="modal-field">
              <label>Status</label>
              <select
                className="modal-select"
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <option>In Stock</option>
                <option>Out of Stock</option>
              </select>
            </div>
            <div className="modal-field" style={{ gridColumn: "1 / -1" }}>
              <label>Image URL (optional)</label>
              <input
                className="modal-input"
                placeholder="https://…"
                value={form.image}
                onChange={(e) => handleChange("image", e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn-xs"
              style={{ borderRadius: 999 }}
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-xs btn-xs-primary"
              style={{ borderRadius: 999, paddingInline: 14 }}
              disabled={submitting}
            >
              {submitting ? "Saving…" : "Save product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;

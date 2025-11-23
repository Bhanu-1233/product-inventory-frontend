import React, { useState } from "react";

const ProductsTable = ({ products, onRowClick, onDelete, onSaveRow }) => {
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditValues({
      name: product.name,
      unit: product.unit,
      category: product.category,
      brand: product.brand,
      stock: product.stock,
      status: product.status,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleChange = (field, value) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const saveEdit = async (id) => {
    const result = await onSaveRow(id, {
      ...editValues,
      stock: Number(editValues.stock),
    });
    if (result.success) cancelEdit();
  };

  const getStatusClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "in stock") return "status-badge status-in";
    if (s === "out of stock") return "status-badge status-out";
    return "status-badge status-default";
  };

  return (
    <table className="products-table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Unit</th>
          <th>Category</th>
          <th>Brand</th>
          <th className="cell-right">Stock</th>
          <th className="cell-center">Status</th>
          <th className="cell-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.length === 0 && (
          <tr>
            <td colSpan={8} style={{ padding: "16px", textAlign: "center" }}>
              No products yet. Try importing a CSV or adding one manually.
            </td>
          </tr>
        )}
        {products.map((product) => {
          const isEditing = editingId === product.id;
          return (
            <tr
              key={product.id}
              onClick={(e) => {
                if (e.target.closest("button")) return;
                onRowClick(product);
              }}
              style={{ cursor: "pointer" }}
            >
              <td className="cell-center">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                ) : (
                  <div className="product-image-placeholder">
                    {product.name ? product.name.charAt(0).toUpperCase() : "?"}
                  </div>
                )}
              </td>
              <td>
                {isEditing ? (
                  <input
                    className="input-inline"
                    value={editValues.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                ) : (
                  <div>
                    <div>{product.name}</div>
                    <div className="chip-muted">#{product.id}</div>
                  </div>
                )}
              </td>
              <td>
                {isEditing ? (
                  <input
                    className="input-inline"
                    value={editValues.unit}
                    onChange={(e) => handleChange("unit", e.target.value)}
                  />
                ) : (
                  product.unit
                )}
              </td>
              <td>
                {isEditing ? (
                  <input
                    className="input-inline"
                    value={editValues.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                  />
                ) : (
                  product.category
                )}
              </td>
              <td>
                {isEditing ? (
                  <input
                    className="input-inline"
                    value={editValues.brand}
                    onChange={(e) => handleChange("brand", e.target.value)}
                  />
                ) : (
                  product.brand
                )}
              </td>
              <td className="cell-right">
                {isEditing ? (
                  <input
                    type="number"
                    min="0"
                    className="input-inline"
                    value={editValues.stock}
                    onChange={(e) => handleChange("stock", e.target.value)}
                  />
                ) : (
                  product.stock
                )}
              </td>
              <td className="cell-center">
                {isEditing ? (
                  <select
                    className="select-inline"
                    value={editValues.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                  >
                    <option>In Stock</option>
                    <option>Out of Stock</option>
                  </select>
                ) : (
                  <span className={getStatusClass(product.status)}>
                    {product.status}
                  </span>
                )}
              </td>
              <td className="cell-center">
                {isEditing ? (
                  <div className="action-group">
                    <button
                      className="btn-xs btn-xs-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        saveEdit(product.id);
                      }}
                    >
                      Save
                    </button>
                    <button
                      className="btn-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelEdit();
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="action-group">
                    <button
                      className="btn-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(product);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-xs btn-xs-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(product.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ProductsTable;

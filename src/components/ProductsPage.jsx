import React, { useEffect, useState } from "react";
import {
  fetchProducts,
  searchProducts,
  importCSV,
  exportCSV,
  deleteProduct,
  updateProduct,
  fetchHistory,
} from "../api.js";
import ProductsTable from "./ProductsTable.jsx";
import HistorySidebar from "./HistorySidebar.jsx";
import AddProductModal from "./AddProductModal.jsx";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      let data;
      if (search.trim()) {
        data = await searchProducts(search.trim());
      } else {
        const params = {};
        if (categoryFilter !== "All") params.category = categoryFilter;
        data = await fetchProducts(params);
      }
      setProducts(data);

      const cats = Array.from(new Set(data.map((p) => p.category).filter(Boolean)));
      setCategories(["All", ...cats]);
    } catch (err) {
      console.error(err);
      window.alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [search, categoryFilter]);

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const res = await importCSV(file);
        const data = res.data;
        window.alert(
          `Import completed\nAdded: ${data.added}\nSkipped: ${data.skipped}\nDuplicates: ${data.duplicates.length}`
        );
        loadProducts();
      } catch (err) {
        console.error(err);
        window.alert("Failed to import CSV");
      }
    };
    input.click();
  };

  const handleExport = async () => {
    try {
      const res = await exportCSV();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "products_export.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
      window.alert("Failed to export CSV");
    }
  };

  const handleRowSelect = async (product) => {
    setSelectedProduct(product);
    setHistory([]);
    if (!product) return;
    try {
      setHistoryLoading(true);
      const logs = await fetchHistory(product.id);
      setHistory(logs);
    } catch (err) {
      console.error(err);
      window.alert("Failed to load history");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (selectedProduct && selectedProduct.id === id) {
        setSelectedProduct(null);
        setHistory([]);
      }
    } catch (err) {
      console.error(err);
      window.alert("Failed to delete product");
    }
  };

  const handleInlineSave = async (id, updatedFields) => {
    try {
      const current = products.find((p) => p.id === id);
      const payload = { ...current, ...updatedFields };
      const updated = await updateProduct(id, payload);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      if (selectedProduct && selectedProduct.id === id) {
        setSelectedProduct(updated);
      }
      if (
        updatedFields.stock !== undefined &&
        Number(updatedFields.stock) !== Number(current.stock)
      ) {
        handleRowSelect(updated);
      }
      return { success: true };
    } catch (err) {
      console.error(err);
      window.alert(err.response?.data?.error || "Failed to update product");
      return { success: false };
    }
  };

  const handleCreated = (created) => {
    setShowAddModal(false);
    setProducts((prev) => [created, ...prev]);
    if (!categories.includes(created.category)) {
      setCategories((prev) => [...prev, created.category]);
    }
  };

  return (
    <div className="products-page">
      <div className="products-card">
        <div className="products-header">
          <div className="products-header-left">
            <input
              className="search-input"
              placeholder="Search products by name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="select-input"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="products-header-right">
            <button
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <span className="icon">＋</span>
              <span>Add product</span>
            </button>
            <button className="btn btn-ghost" onClick={handleImport}>
              <span className="icon">⤒</span>
              <span>Import</span>
            </button>
            <button className="btn btn-ghost" onClick={handleExport}>
              <span className="icon">⤓</span>
              <span>Export</span>
            </button>
          </div>
        </div>

        <div className="products-table-wrapper">
          {loading ? (
            <div className="loading-state">Loading products…</div>
          ) : (
            <ProductsTable
              products={products}
              onRowClick={handleRowSelect}
              onDelete={handleDelete}
              onSaveRow={handleInlineSave}
            />
          )}
        </div>
      </div>

      <HistorySidebar
        product={selectedProduct}
        history={history}
        loading={historyLoading}
        onClose={() => handleRowSelect(null)}
      />

      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
};

export default ProductsPage;

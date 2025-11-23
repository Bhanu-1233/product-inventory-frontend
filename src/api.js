import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000",
});

export const fetchProducts = (params = {}) =>
  api.get("/api/products", { params }).then((res) => res.data);

export const searchProducts = (name) =>
  api.get("/api/products/search", { params: { name } }).then((res) => res.data);

export const createProduct = (data) =>
  api.post("/api/products", data).then((res) => res.data);

export const updateProduct = (id, data) =>
  api.put(`/api/products/${id}`, data).then((res) => res.data);

export const deleteProduct = (id) =>
  api.delete(`/api/products/${id}`).then((res) => res.data);

export const fetchHistory = (id) =>
  api.get(`/api/products/${id}/history`).then((res) => res.data);

export const importCSV = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/api/products/import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const exportCSV = () =>
  api.get("/api/products/export", { responseType: "blob" });

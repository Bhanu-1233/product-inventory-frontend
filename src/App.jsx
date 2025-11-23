import React from "react";
import ProductsPage from "./components/ProductsPage.jsx";

const App = () => {
  return (
    <div className="app-root">
      <header className="app-header">
        <div>
          <h1>Skillwise Inventory</h1>
          <p>Product Inventory Management System</p>
        </div>
        <div className="app-header-tag">
          Full-stack assignment • React + Node.js + SQLite
        </div>
      </header>
      <main className="app-main">
        <ProductsPage />
      </main>
      <footer className="app-footer">
        <span>Built for Skillwise assignment</span>
      </footer>
    </div>
  );
};

export default App;

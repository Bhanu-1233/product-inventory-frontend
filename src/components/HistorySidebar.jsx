import React from "react";

const HistorySidebar = ({ product, history, loading, onClose }) => {
  const isOpen = !!product;

  return (
    <div className="sidebar-card">
      <div className="sidebar-header">
        <div className="sidebar-title">Inventory history</div>
        {isOpen && (
          <button className="sidebar-close" onClick={onClose}>
            ×
          </button>
        )}
      </div>

      {!isOpen && (
        <div className="sidebar-empty">
          Select a product row to inspect its stock change history.
        </div>
      )}

      {isOpen && (
        <>
          <div className="sidebar-product-meta">
            <strong>{product.name}</strong>
            <span>
              {product.brand} • {product.category}
            </span>
          </div>

          {loading ? (
            <div className="loading-state">Loading history…</div>
          ) : history.length === 0 ? (
            <div className="sidebar-empty">
              No stock changes have been recorded yet.
            </div>
          ) : (
            <table className="sidebar-history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th className="cell-right">Old</th>
                  <th className="cell-right">New</th>
                  <th>By</th>
                </tr>
              </thead>
              <tbody>
                {history.map((log) => (
                  <tr key={log.id}>
                    <td>
                      {new Date(log.timestamp).toLocaleString(undefined, {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="cell-right">{log.oldStock}</td>
                    <td className="cell-right">{log.newStock}</td>
                    <td>{log.changedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default HistorySidebar;

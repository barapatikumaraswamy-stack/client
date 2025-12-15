// src/components/Analytics/RevenueSummary.jsx
export default function RevenueSummary({ data, period }) {
  // calculate totals
  let totalCost = 0;
  let totalRevenue = 0;

  data.forEach(item => {
    if (item._id.type === "purchase") {
      totalCost += Math.abs(item.revenue);
    } else if (item._id.type === "sale") {
      totalRevenue += Math.abs(item.revenue);
    }
  });

  const totalProfit = totalRevenue - totalCost;

  return (
    <div className="summary-cards">
      <div className="summary-card">
        <div className="summary-label">Cost</div>
        <div className="summary-value summary-cost">
          ${totalCost.toFixed(2)}
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-label">Revenue</div>
        <div className="summary-value summary-revenue">
          ${totalRevenue.toFixed(2)}
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-label">Profit</div>
        <div className={`summary-value ${totalProfit >= 0 ? "summary-profit" : "summary-loss"}`}>
          ${totalProfit.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

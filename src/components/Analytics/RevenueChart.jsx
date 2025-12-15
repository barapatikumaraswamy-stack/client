// src/components/Analytics/RevenueChart.jsx
export default function RevenueChart({ data }) {
  // group by date, calculate buy vs sell
  const byDate = {};
  data.forEach(item => {
    const date = item._id.date;
    if (!byDate[date]) {
      byDate[date] = { purchase: 0, sale: 0 };
    }
    // revenue is already positive from backend
    byDate[date][item._id.type] += Math.abs(item.revenue);
  });

  const dates = Object.keys(byDate).sort();

  return (
    <div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Purchases (Cost)</th>
            <th>Sales (Revenue)</th>
            <th>Net Profit</th>
          </tr>
        </thead>
        <tbody>
          {dates.map(date => {
            const purchases = byDate[date].purchase || 0;
            const sales = byDate[date].sale || 0;
            const net = sales - purchases; // sales - cost = profit
            return (
              <tr key={date}>
                <td>{date}</td>
                <td>${purchases.toFixed(2)}</td>
                <td>${sales.toFixed(2)}</td>
                <td className={net >= 0 ? "qty-positive" : "qty-negative"}>
                  ${net.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

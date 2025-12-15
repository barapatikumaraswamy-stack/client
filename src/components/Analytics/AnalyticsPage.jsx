import { useEffect, useState } from "react";
import api from "../../api/client";
import PageShell from "../../layout/PageShell";
import RevenueChart from "./RevenueChart";
import RevenueSummary from "./RevenueSummary";

export default function AnalyticsPage() {
  const [weekData, setWeekData] = useState([]);
  const [monthData, setMonthData] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [wRes, mRes] = await Promise.all([
        api.get("/analytics/revenue-by-period?period=week"),
        api.get("/analytics/revenue-by-period?period=month")
      ]);
      setWeekData(wRes.data);
      setMonthData(mRes.data);
    } catch (err) {
      console.error("Failed to load analytics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <PageShell
      title="Analytics"
      subtitle="Revenue overview"
      actions={
        <button className="primary-btn" onClick={load} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      }
    >
      <div className="page-body">
        {/* Week Summary Cards */}
        <RevenueSummary data={weekData} period="This Week" />

        <section className="card">
          <header className="card-header">
            <h3>Revenue - This Week</h3>
          </header>
          <div className="card-body">
            {weekData.length > 0 ? (
              <RevenueChart data={weekData} />
            ) : (
              <p>No data available</p>
            )}
          </div>
        </section>

        {/* Month Summary Cards */}
        <RevenueSummary data={monthData} period="This Month" />

        <section className="card">
          <header className="card-header">
            <h3>Revenue - This Month</h3>
          </header>
          <div className="card-body">
            {monthData.length > 0 ? (
              <RevenueChart data={monthData} />
            ) : (
              <p>No data available</p>
            )}
          </div>
        </section>
      </div>
    </PageShell>
  );
}

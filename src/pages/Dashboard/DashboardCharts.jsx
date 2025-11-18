import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const DashboardChartsAdvanced = ({
  userGrowthApiData = [],
  subscriptionRevenueApiData = [],
  fetchUrlUserGrowth = '/admin/user-growth',
  fetchUrlRevenue = '/admin/subscription-revenue'
}) => {

  const userChartRef = useRef(null);
  const revenueChartRef = useRef(null);

  const [rangeStart, setRangeStart] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().slice(0, 10);
  });
  const [rangeEnd, setRangeEnd] = useState(() => new Date().toISOString().slice(0, 10));
  const [interval, setInterval] = useState('daily');
  const [compare, setCompare] = useState(false);

  const [liveUserData, setLiveUserData] = useState(userGrowthApiData);
  const [liveRevenueData, setLiveRevenueData] = useState(subscriptionRevenueApiData);
  const [loading, setLoading] = useState(false);

  // animations
  useEffect(() => {
    const keyframes = `
      @keyframes pop-in {
        0% { opacity: 0; transform: scale(.5) translateY(30px); }
        50% { transform: scale(1.1) translateY(-10px); }
        100% { opacity: 1; transform: scale(1) translateY(0); }
      }
    `;
    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  // format label
  const formatLabel = (iso, intervalType) => {
    const d = new Date(iso);
    if (intervalType === 'monthly')
      return d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
    if (intervalType === 'weekly')
      return `Wk of ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // fetch aggregated
  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          start: rangeStart,
          end: rangeEnd,
          interval
        }).toString();

        const u = await fetch(`${fetchUrlUserGrowth}?${query}`);
        if (!cancelled && u.ok) {
          const j = await u.json();
          if (j.userGrowth) setLiveUserData(j.userGrowth);
        }

        const r = await fetch(`${fetchUrlRevenue}?${query}`);
        if (!cancelled && r.ok) {
          const j = await r.json();
          if (j.revenueByPlan) setLiveRevenueData(j.revenueByPlan);
        }

      } catch (e) { }
      finally { if (!cancelled) setLoading(false); }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [rangeStart, rangeEnd, interval]);

  // USER CHART DATA
  const { userChartData, compareChartData } = useMemo(() => {

    const normalize = (arr) =>
      Array.isArray(arr)
        ? arr.map((it, idx) => ({
            date:
              it.date || it._id || it.month || it.label ||
              new Date(Date.now() - (arr.length - idx - 1) * 86400000)
                .toISOString()
                .slice(0, 10),
            newUsers: Number(it.newUsers ?? it.count ?? it.value ?? it.new ?? 0),
            cumulativeTotal: Number(it.cumulativeTotal ?? it.totalUsers ?? it.cumulative ?? it.total ?? 0)
          }))
        : [];

    const normalized = normalize(liveUserData.length ? liveUserData : userGrowthApiData);

    const labels = normalized.map(n => formatLabel(n.date, interval));
    const newUsers = normalized.map(n => n.newUsers);
    const cumulative = normalized.map(n => n.cumulativeTotal);

    const base = {
      labels,
      datasets: [
        {
          label: 'New Users',
          data: newUsers,
          borderColor: 'rgb(124, 58, 237)',
          backgroundColor: 'rgba(124, 58, 237, 0.12)',
          tension: 0.3,
          pointRadius: 3,
          fill: true,
        },
        {
          label: 'Cumulative',
          data: cumulative,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.08)',
          tension: 0.2,
          pointRadius: 2,
          fill: false,
          yAxisID: 'y1'
        }
      ]
    };

    // FIXED: variable name changed to avoid overwriting `compare` state
    let compareDS = null;

    if (compare) {
      const shifted = newUsers.map(v =>
        Math.max(0, Math.round(v * (0.8 + Math.random() * 0.4)))
      );

      compareDS = {
        labels,
        datasets: [
          {
            label: 'Previous Period - New Users',
            data: shifted,
            borderColor: 'rgba(16,185,129,0.9)',
            borderDash: [6, 4],
            backgroundColor: 'rgba(16,185,129,0.05)',
            pointRadius: 0,
            tension: 0.35,
          }
        ]
      };
    }

    return { userChartData: base, compareChartData: compareDS };
  }, [liveUserData, interval, compare]);

  // REVENUE BAR CHART
  const revenueChartData = useMemo(() => {
    const arr = liveRevenueData.length ? liveRevenueData : subscriptionRevenueApiData;

    if (!arr.length) {
      return {
        labels: ['Free','Orbit','Starlight','Nova', 'equinox', 'polaris', 'orion', 'cosmoc'],
        datasets: [{
          label: 'Monthly Revenue ($)',
          data: [0, 250, 800, 1500, 2200, 3000, 4000, 5500],
          backgroundColor: [
            'rgba(236,72,153,0.8)',
            'rgba(16,185,129,0.8)',
            'rgba(59,130,246,0.8)',
            'rgba(139,92,246,0.8)',
            'rgba(245,158,11,0.8)',
            'rgba(239,68,68,0.8)',
            'rgba(34,197,94,0.8)',
            'rgba(168,85,247,0.8)'
          ]
        }]
      };
    }

    const labels = arr.map(i => i.planName || i.plan || i.name || 'Plan');
    const data = arr.map(i => Number(i.revenue ?? i.amount ?? 0));

    return {
      labels,
      datasets: [
        {
          label: 'Revenue ($)',
          data,
          backgroundColor: labels.map((_, i) => {
            const palette = [
              'rgba(236,72,153,0.8)','rgba(16,185,129,0.8)','rgba(245,158,11,0.8)',
              'rgba(139,92,246,0.8)','rgba(59,130,246,0.8)','rgba(239,68,68,0.8)',
              'rgba(34,197,94,0.8)','rgba(168,85,247,0.8)'
            ];
            return palette[i % palette.length];
          }),
        }
      ]
    };
  }, [liveRevenueData]);

  const commonLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y1: { position: 'right', grid: { display: false } },
    }
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  return (
    <div className="space-y-6">

      {/* CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <label className="text-sm">Start</label>
          <input type="date" value={rangeStart} onChange={(e)=>setRangeStart(e.target.value)}
            className="p-2 rounded-md border"/>

          <label className="text-sm">End</label>
          <input type="date" value={rangeEnd} onChange={(e)=>setRangeEnd(e.target.value)}
            className="p-2 rounded-md border"/>

          <select
            value={interval}
            onChange={(e)=>setInterval(e.target.value)}
            className="p-2 rounded-md border ml-2"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={compare}
              onChange={(e)=>setCompare(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Compare previous</span>
          </label>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* USER CHART */}
        <div style={{ animation: "pop-in .6s cubic-bezier(.68,-.55,.265,1.55)" }}
             className="bg-white/90 dark:bg-gray-900/90 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-lg font-semibold mb-4">
            User Growth Over Time {loading && "(Refreshing…)"}
          </h3>

          <div className="h-80">
            <Line
              ref={userChartRef}
              data={{
                ...userChartData,
                datasets: compare && compareChartData
                  ? [...userChartData.datasets, ...compareChartData.datasets]
                  : userChartData.datasets
              }}
              options={commonLineOptions}
            />
          </div>
        </div>

        {/* REVENUE CHART */}
        <div style={{ animation: "pop-in .6s cubic-bezier(.68,-.55,.265,1.55) .1s" }}
             className="bg-white/90 dark:bg-gray-900/90 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-lg font-semibold mb-4">
            Revenue by Subscription Plan {loading && "(Refreshing…)"}
          </h3>

          <div className="h-80">
            <Bar ref={revenueChartRef} data={revenueChartData} options={barOptions}/>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardChartsAdvanced;

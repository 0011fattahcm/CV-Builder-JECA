import React, { useEffect, useMemo, useState } from "react";
import AdminChart from "../components/AdminCharts.jsx";
import ActivityLog from "../components/ActivityLog.jsx";
import AdminLayout from "../components/AdminLayout.jsx";
import axios from "../../utils/axios.js";
import {
  TrendingUp,
  Users,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react";

const bulanMap = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const fmtIDR = (v) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v || 0);

const toSortKey = (bulanStr) => {
  // dukung "YYYY-MM" atau Date
  if (bulanStr instanceof Date)
    return bulanStr.getFullYear() * 12 + bulanStr.getMonth();
  if (typeof bulanStr === "string" && bulanStr.includes("-")) {
    const [y, m] = bulanStr.split("-");
    return Number(y) * 12 + (Number(m) - 1);
  }
  return -1;
};

const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [rawStats, setRawStats] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("adminToken");

        const [statRes, logRes, incomeRes] = await Promise.all([
          axios.get("/api/rx78gpo1p6/stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/rx78gpo1p6/logs?page=1&limit=20", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/payment/total-income", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const statsArr = Array.isArray(statRes.data) ? statRes.data : [];

        // Simpan raw (untuk hitung tren)
        const sorted = [...statsArr].sort(
          (a, b) => toSortKey(a.bulan) - toSortKey(b.bulan)
        );
        setRawStats(sorted);

        // Format label bulan untuk chart
        const formatted = sorted.map((item) => {
          let label = "Unknown";
          if (item.bulan instanceof Date) {
            const d = new Date(item.bulan);
            label = `${bulanMap[d.getMonth()]} ${d.getFullYear()}`;
          } else if (
            typeof item.bulan === "string" &&
            item.bulan.includes("-")
          ) {
            const [year, month] = item.bulan.split("-");
            const idx = parseInt(month, 10) - 1;
            if (idx >= 0 && idx < 12) label = `${bulanMap[idx]} ${year}`;
          } else if (typeof item.bulan === "string") {
            label = item.bulan;
          }
          return { ...item, bulan: label };
        });
        setChartData(formatted);

        setLogs(Array.isArray(logRes.data?.logs) ? logRes.data.logs : []);
        setTotalIncome(incomeRes.data?.total || 0);
      } catch (err) {
        console.error("❌ Gagal ambil data dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Hitung ringkasan & tren dari rawStats
  const summary = useMemo(() => {
    if (!rawStats.length) {
      return {
        thisMonth: { user: 0, exportAll: 0, utilities: 0 },
        prevMonth: { user: 0, exportAll: 0, utilities: 0 },
      };
    }
    const last = rawStats[rawStats.length - 1];
    const prev = rawStats[rawStats.length - 2] || {
      user: 0,
      cvExcel: 0,
      cvPdf: 0,
      jpgPdf: 0,
      merger: 0,
    };

    const thisMonth = {
      user: last.user || 0,
      exportAll: (last.cvExcel || 0) + (last.cvPdf || 0),
      utilities: (last.jpgPdf || 0) + (last.merger || 0),
    };
    const prevMonth = {
      user: prev.user || 0,
      exportAll: (prev.cvExcel || 0) + (prev.cvPdf || 0),
      utilities: (prev.jpgPdf || 0) + (prev.merger || 0),
    };
    return { thisMonth, prevMonth };
  }, [rawStats]);

  // TOTAL KUMULATIF dari rawStats
  const totals = useMemo(() => {
    return rawStats.reduce(
      (acc, it) => {
        acc.user += it.user || 0;
        acc.exportAll += (it.cvExcel || 0) + (it.cvPdf || 0);
        acc.utilities += (it.jpgPdf || 0) + (it.merger || 0);
        return acc;
      },
      { user: 0, exportAll: 0, utilities: 0 }
    );
  }, [rawStats]);

  const diffBadge = (curr, prev) => {
    const diff = curr - prev;
    const pct =
      prev === 0
        ? diff > 0
          ? 100
          : diff < 0
          ? -100
          : 0
        : Math.round((diff / prev) * 100);
    const Up = diff >= 0;
    return (
      <span
        className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
          Up ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
        }`}
      >
        {Up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {Math.abs(pct)}%
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Admin</h1>
          <button
            onClick={() => location.reload()}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            Reload
          </button>
        </div>

        {loading ? (
          // Skeleton loading
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow p-5 animate-pulse"
              >
                <div className="h-4 w-28 bg-gray-200 rounded mb-3" />
                <div className="h-7 w-40 bg-gray-200 rounded mb-2" />
                <div className="h-5 w-24 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Stat cards */}
            {/* Stat cards (TOTAL) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow p-5 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Pemasukan</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {fmtIDR(totalIncome)}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-green-100 text-green-700">
                    <Wallet size={22} />
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  Akumulasi sampai saat ini
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow p-5 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total User</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {totals.user}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
                    <Users size={22} />
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  Akumulasi sampai saat ini
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow p-5 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Total Export (XLSX + PDF)
                    </p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {totals.exportAll}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
                    <FileSpreadsheet size={22} />
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  Akumulasi sampai saat ini
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow p-5 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Total Utilities (JPG/PDF)
                    </p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {totals.utilities}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-violet-100 text-violet-700">
                    <FileText size={22} />
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  Akumulasi sampai saat ini
                </p>
              </div>
            </div>

            {/* Chart (selector metric di komponen) */}
            <div className="mb-10">
              <AdminChart data={chartData} />
            </div>

            {/* Activity log (tetap memakai komponenmu) */}
            <ActivityLog logs={logs} />
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;

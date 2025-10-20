import React, { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import axios from "../../utils/axios.js";
import { toast } from "react-toastify";

const chartTabs = [
  { key: "user", color: "#ef4444", label: "Registrasi User Baru" },
  { key: "cvExcel", color: "#10b981", label: "Export CV Excel" },
  { key: "cvPdf", color: "#3b82f6", label: "Export CV PDF" },
  { key: "jpgPdf", color: "#f59e0b", label: "Convert JPG → PDF" },
  { key: "merger", color: "#8b5cf6", label: "Merge PDF" },
];

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
const toSortKey = (bulan) => {
  if (bulan instanceof Date) return bulan.getFullYear() * 12 + bulan.getMonth();
  if (typeof bulan === "string" && bulan.includes("-")) {
    const [y, m] = bulan.split("-");
    return Number(y) * 12 + (Number(m) - 1);
  }
  return -1;
};

const AdminChart = ({ data: propData }) => {
  const [data, setData] = useState(Array.isArray(propData) ? propData : []);
  const [active, setActive] = useState("user");

  // fallback fetch kalau tidak diberi props
  useEffect(() => {
    if (Array.isArray(propData) && propData.length) {
      setData(propData);
      return;
    }
    const go = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get("/api/rx78gpo1p6/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const arr = Array.isArray(res.data) ? res.data : [];
        const sorted = [...arr].sort(
          (a, b) => toSortKey(a.bulan) - toSortKey(b.bulan)
        );
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
            label =
              idx >= 0 && idx < 12 ? `${bulanMap[idx]} ${year}` : item.bulan;
          } else if (typeof item.bulan === "string") {
            label = item.bulan;
          }
          return { ...item, bulan: label };
        });
        setData(formatted);
      } catch (e) {
        console.error(
          "Gagal ambil data statistik:",
          e?.response?.data || e.message
        );
        toast.error("Gagal ambil data statistik");
      }
    };
    go();
  }, [propData]);

  const series = useMemo(
    () => chartTabs.find((t) => t.key === active) || chartTabs[0],
    [active]
  );

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          📊 Statistik Aktivitas Bulanan
        </h2>
        <div className="flex flex-wrap gap-2">
          {chartTabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`px-3 py-1.5 rounded-full border text-sm ${
                active === t.key
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white hover:bg-gray-50 border-gray-300"
              }`}
              title={t.label}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-200 p-3">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart
            data={data}
            margin={{ top: 16, right: 24, left: 0, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="bulan" stroke="#6b7280" />
            <YAxis stroke="#6b7280" allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={series.key}
              name={series.label}
              stroke={series.color}
              strokeWidth={3}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminChart;

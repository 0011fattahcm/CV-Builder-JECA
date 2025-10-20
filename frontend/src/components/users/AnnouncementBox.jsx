// src/components/users/AnnouncementBox.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "../../utils/axios.js";
import {
  Megaphone,
  X,
  ChevronDown,
  ChevronUp,
  Pin,
  AlertTriangle,
  Info,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

const DISMISS_DAYS = 1; // disembunyikan 1 hari setelah di-dismiss

// util kecil
const safeText = (v) => (typeof v === "string" ? v : v ?? "");
const isPinned = (a) => !!(a?.pinned || a?.isPinned);
const toTime = (v) => (v ? new Date(v).getTime() : 0);

const pickLatest = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  // Prioritas pinned; kalau tidak ada pinned, ambil terbaru by updatedAt/createdAt
  const pinned = arr.filter(isPinned);
  const source = pinned.length ? pinned : arr;
  return source
    .slice()
    .sort(
      (a, b) =>
        toTime(b?.updatedAt || b?.createdAt) -
        toTime(a?.updatedAt || a?.createdAt)
    )[0];
};

const typeStyles = {
  info: {
    ring: "ring-sky-200",
    bg: "from-sky-50/80 to-white",
    chip: "bg-sky-100 text-sky-700",
    icon: <Info className="w-4 h-4" />,
    gradient: "from-sky-500 via-indigo-500 to-pink-500",
  },
  warning: {
    ring: "ring-amber-200",
    bg: "from-amber-50/80 to-white",
    chip: "bg-amber-100 text-amber-700",
    icon: <AlertTriangle className="w-4 h-4" />,
    gradient: "from-amber-500 via-orange-500 to-pink-500",
  },
  success: {
    ring: "ring-emerald-200",
    bg: "from-emerald-50/80 to-white",
    chip: "bg-emerald-100 text-emerald-700",
    icon: <CheckCircle className="w-4 h-4" />,
    gradient: "from-emerald-500 via-teal-500 to-blue-500",
  },
};

const AnnouncementBox = () => {
  const [loading, setLoading] = useState(true);
  const [ann, setAnn] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [hidden, setHidden] = useState(false);

  // fetch
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/announcement", {
          timeout: 15000,
        });
        // data bisa array atau object; normalisasi ke array
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.announcements)
          ? data.announcements
          : data
          ? [data]
          : [];
        const latest = pickLatest(list);

        if (!latest) {
          if (!cancelled) setAnn(null);
          return;
        }

        // cek dismissed
        const annId =
          latest._id ||
          latest.id ||
          `${safeText(latest.title)}-${toTime(
            latest.updatedAt || latest.createdAt
          )}`;
        const storeKey = `announcement:dismiss:${annId}`;
        const raw = localStorage.getItem(storeKey);
        if (raw) {
          try {
            const { at } = JSON.parse(raw);
            const diffDays = (Date.now() - at) / (1000 * 60 * 60 * 24);
            if (diffDays < DISMISS_DAYS) {
              if (!cancelled) setHidden(true);
            } else {
              localStorage.removeItem(storeKey);
            }
          } catch {
            localStorage.removeItem(storeKey);
          }
        }

        if (!cancelled) setAnn({ ...latest, __storeKey: storeKey });
      } catch (e) {
        // diam-diam jika gagal; jangan ganggu halaman login/register
        if (!cancelled) setAnn(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const content = useMemo(() => {
    if (!ann) return { title: "", message: "", type: "info", link: "" };
    const title = safeText(ann.title || ann.judul || "Pengumuman");
    const message = safeText(
      ann.message || ann.deskripsi || ann.content || ann.body || ""
    );
    const type = (ann.type || ann.tipe || "info").toLowerCase();
    const link = safeText(ann.link || ann.ctaUrl || "");
    return {
      title,
      message,
      type: ["info", "warning", "success"].includes(type) ? type : "info",
      link,
    };
  }, [ann]);

  if (loading || hidden || !ann) return null;

  const s = typeStyles[content.type];
  const short = content.message.length < 160; // kontrol expand
  const dateStr =
    ann?.updatedAt || ann?.createdAt
      ? new Date(ann.updatedAt || ann.createdAt).toLocaleString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

  const onDismiss = () => {
    try {
      localStorage.setItem(ann.__storeKey, JSON.stringify({ at: Date.now() }));
    } catch {}
    setHidden(true);
  };

  return (
    <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 mb-3">
      <div
        className={`relative mx-auto max-w-10xl rounded-2xl ring-1 ${s.ring} overflow-hidden shadow-[0_10px_25px_-10px_rgba(0,0,0,0.3)]`}
        role="region"
        aria-label="Pengumuman"
      >
        {/* header strip */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${s.gradient}`} />

        {/* body */}
        <div className={`bg-gradient-to-b ${s.bg} backdrop-blur p-2 sm:p-4`}>
          <div className="flex items-start gap-3">
            {/* ikon leading */}
            <div className="shrink-0 inline-flex items-center justify-center rounded-xl bg-white shadow border border-gray-200 w-10 h-10">
              <Megaphone className="w-5 h-5 text-gray-800" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${s.chip}`}
                >
                  {s.icon}
                  {content.type === "info"
                    ? "Info"
                    : content.type === "warning"
                    ? "Peringatan"
                    : "Sukses"}
                </span>
                {isPinned(ann) && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-fuchsia-100 text-fuchsia-700">
                    <Pin className="w-4 h-4" />
                    Pinned
                  </span>
                )}
                {dateStr && (
                  <span className="text-xs text-gray-500">• {dateStr}</span>
                )}
              </div>

              <h3 className="mt-2 text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">
                {content.title}
              </h3>

              {/* message */}
              <div
                className={`mt-2 text-sm text-gray-700 ${
                  !expanded && !short ? "line-clamp-3" : ""
                }`}
              >
                {content.message}
              </div>

              {/* footer actions */}
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                {!short && (
                  <button
                    type="button"
                    onClick={() => setExpanded((v) => !v)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900"
                    aria-expanded={expanded}
                  >
                    {expanded ? (
                      <>
                        Sembunyikan <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Lihat selengkapnya <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}

                {content.link && (
                  <a
                    href={content.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-800"
                  >
                    Buka
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* dismiss */}
            <button
              type="button"
              onClick={onDismiss}
              className="shrink-0 text-gray-500 hover:text-gray-800 p-1 rounded-md hover:bg-white/60"
              aria-label="Tutup pengumuman"
              title="Tutup pengumuman"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBox;

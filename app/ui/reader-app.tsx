import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY_WPM = "reader:wpm";
const STORAGE_KEY_QUESTION = "reader:question";

const MIN_WPM = 80;
const MAX_WPM = 900;
const DEFAULT_WPM = 250;

const QUESTIONS = [
  { id: "main-idea", label: "Quel est le sujet principal du texte ?" },
  { id: "key-points", label: "Quels sont les 3 points clés ?" },
  { id: "who-what-when", label: "Qui / quoi / quand : que retenir ?" },
  { id: "why", label: "Pourquoi ce sujet est-il important ?" },
  { id: "opinion", label: "Quelle est la position de l’auteur ?" },
  { id: "summary", label: "Peux-tu résumer en 2 phrases ?" },
] as const;

type Mode = "config" | "reading" | "done";

function clampInt(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.trunc(value)));
}

function textToWords(text: string) {
  return text
    .trim()
    .split(/\s+/g)
    .map((w) => w.trim())
    .filter(Boolean);
}

function formatTime(secondsTotal: number) {
  const minutes = Math.floor(secondsTotal / 60);
  const seconds = Math.floor(secondsTotal % 60);
  if (minutes <= 0) return `${seconds}s`;
  return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}

export default function ReaderApp() {
  const [mode, setMode] = useState<Mode>("config");
  const [text, setText] = useState("");

  const [wpm, setWpm] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_WPM);
      if (stored) {
        const parsed = Number.parseInt(stored, 10);
        if (Number.isFinite(parsed)) {
          return clampInt(parsed, MIN_WPM, MAX_WPM);
        }
      }
    } catch {
      // Ignore storage errors
    }
    return DEFAULT_WPM;
  });

  const [questionId, setQuestionId] = useState<
    (typeof QUESTIONS)[number]["id"]
  >(() => {
    try {
      const storedQuestion = localStorage.getItem(STORAGE_KEY_QUESTION);
      if (storedQuestion && QUESTIONS.some((q) => q.id === storedQuestion)) {
        return storedQuestion as (typeof QUESTIONS)[number]["id"];
      }
    } catch {
      // Ignore storage errors
    }
    return QUESTIONS[0].id;
  });

  const words = useMemo(() => textToWords(text), [text]);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const question = useMemo(
    () => QUESTIONS.find((q) => q.id === questionId) ?? QUESTIONS[0],
    [questionId],
  );

  const intervalMs = useMemo(() => Math.round(60000 / Math.max(1, wpm)), [wpm]);
  const estimatedSeconds = useMemo(
    () => (words.length / Math.max(1, wpm)) * 60,
    [words.length, wpm],
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WPM, String(wpm));
    } catch {
      // Ignore storage errors
    }
  }, [wpm]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_QUESTION, questionId);
    } catch {
      // Ignore storage errors
    }
  }, [questionId]);

  useEffect(() => {
    if (mode !== "reading") return;
    if (!isPlaying) return;
    if (words.length === 0) return;

    const atLastWord = index >= words.length - 1;
    const id = window.setTimeout(() => {
      if (atLastWord) {
        setIsPlaying(false);
        setMode("done");
        return;
      }
      setIndex((current) => Math.min(current + 1, words.length - 1));
    }, intervalMs);

    return () => window.clearTimeout(id);
  }, [index, intervalMs, isPlaying, mode, words.length]);

  function startReading() {
    if (words.length === 0) return;
    setIndex(0);
    setMode("reading");
    setIsPlaying(true);
  }

  function stopReading() {
    setIsPlaying(false);
    setMode("config");
    setIndex(0);
  }

  function togglePlay() {
    if (words.length === 0) return;
    setIsPlaying((p) => !p);
  }

  const currentWord = words[Math.min(index, Math.max(0, words.length - 1))] ?? "";
  const progress = words.length === 0 ? 0 : Math.min(1, index / words.length);

  return (
    <div className="w-full max-w-xl">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Lecteur de texte</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Régle ta vitesse de lecture (mots/min), choisis une question, colle ton
          texte, puis lance la lecture.
        </p>
      </header>

      {mode === "config" && (
        <div className="space-y-4">
          <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-end justify-between gap-4">
              <div className="flex-1">
                <label
                  htmlFor="wpm"
                  className="block text-sm font-medium text-zinc-900 dark:text-zinc-50"
                >
                  Vitesse de lecture
                </label>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Entre {MIN_WPM} et {MAX_WPM} mots/min. Estimation :{" "}
                  {formatTime(estimatedSeconds)} pour ce texte.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="wpm"
                  inputMode="numeric"
                  className="h-11 w-24 rounded-xl border border-zinc-200 bg-white px-3 text-base font-medium text-zinc-900 shadow-sm outline-none ring-0 focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                  type="number"
                  min={MIN_WPM}
                  max={MAX_WPM}
                  value={wpm}
                  onChange={(e) => {
                    const next = Number.parseInt(e.target.value || "0", 10);
                    if (!Number.isFinite(next)) return;
                    setWpm(clampInt(next, MIN_WPM, MAX_WPM));
                  }}
                />
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  wpm
                </span>
              </div>
            </div>

            <input
              className="mt-4 w-full"
              type="range"
              min={MIN_WPM}
              max={MAX_WPM}
              value={wpm}
              onChange={(e) => {
                const next = Number.parseInt(e.target.value || "0", 10);
                if (!Number.isFinite(next)) return;
                setWpm(clampInt(next, MIN_WPM, MAX_WPM));
              }}
            />
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <label
              htmlFor="question"
              className="block text-sm font-medium text-zinc-900 dark:text-zinc-50"
            >
              Question
            </label>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Une question pour guider ta compréhension pendant la lecture.
            </p>
            <select
              id="question"
              className="mt-3 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-base text-zinc-900 shadow-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
              value={questionId}
              onChange={(e) =>
                setQuestionId(
                  e.target.value as (typeof QUESTIONS)[number]["id"],
                )
              }
            >
              {QUESTIONS.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.label}
                </option>
              ))}
            </select>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-start justify-between gap-4">
              <div>
                <label
                  htmlFor="text"
                  className="block text-sm font-medium text-zinc-900 dark:text-zinc-50"
                >
                  Texte à lire
                </label>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {words.length} mot{words.length > 1 ? "s" : ""}.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                disabled={words.length === 0}
                onClick={startReading}
              >
                Démarrer
              </button>
            </div>

            <textarea
              id="text"
              className="mt-3 min-h-40 w-full resize-y rounded-xl border border-zinc-200 bg-white p-3 text-base leading-6 text-zinc-900 shadow-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
              placeholder="Colle ton texte ici…"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </section>
        </div>
      )}

      {mode === "reading" && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                Question : {question.label}
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {Math.min(index + 1, words.length)} / {words.length} · {wpm} wpm
              </p>
            </div>
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
              onClick={stopReading}
            >
              Quitter
            </button>
          </div>

          <div className="mt-4 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
            <div
              className="h-2 bg-zinc-900 dark:bg-white"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>

          <div className="mt-8 flex items-center justify-center">
            <div className="w-full select-none rounded-3xl border border-zinc-200 bg-zinc-50 px-4 py-10 text-center shadow-inner dark:border-zinc-800 dark:bg-black">
              <p className="text-5xl font-semibold tracking-tight sm:text-6xl">
                {currentWord || "—"}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-200 bg-white text-sm font-semibold text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
              disabled={index <= 0}
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
            >
              ←
            </button>

            <button
              type="button"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-zinc-900 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
              onClick={togglePlay}
            >
              {isPlaying ? "Pause" : "Reprendre"}
            </button>

            <button
              type="button"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-200 bg-white text-sm font-semibold text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
              disabled={index >= words.length - 1}
              onClick={() => setIndex((i) => Math.min(words.length - 1, i + 1))}
            >
              →
            </button>
          </div>
        </div>
      )}

      {mode === "done" && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-semibold">Lecture terminée</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Question : <span className="font-medium">{question.label}</span>
          </p>

          <div className="mt-4 grid gap-3">
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
              onClick={() => {
                setMode("reading");
                setIndex(0);
                setIsPlaying(true);
              }}
            >
              Relire
            </button>
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
              onClick={() => {
                setMode("config");
                setIndex(0);
                setIsPlaying(false);
              }}
            >
              Modifier le texte
            </button>
          </div>
        </div>
      )}

      <footer className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
        La vitesse est mémorisée sur cet appareil.
      </footer>
    </div>
  );
}

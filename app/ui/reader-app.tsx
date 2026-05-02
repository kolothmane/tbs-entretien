"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY_SPEED = "reader:speed";
const STORAGE_KEY_QUESTION = "reader:question";

const MIN_SPEED = 1;
const MAX_SPEED = 100;
const DEFAULT_SPEED = 45;

const QUESTIONS = [
  {
    id: "presentation",
    label: "Présentation",
    answer: `Je m'appelle Salma Lahniche, j'ai 23 ans et je suis actuellement en MSc Digital Business Analytics à l'EMLV, en double diplôme avec un Master en gestion financière à l'ENCG de Settat. La finance m'a donné des bases solides pour comprendre la performance des entreprises et analyser les indicateurs financiers.

Au fil de mes expériences, j'ai eu l'opportunité de développer des compétences solides dans des environnements exigeants. J'ai notamment travaillé en tant qu'analyste financière chez Aradei Capital, puis comme Data Analyst chez Centrale Danone, où j'ai conçu des tableaux de bord destinés à accompagner la prise de décision. Plus récemment, j'ai occupé le poste d'auditrice financière chez SFM Conseil, où j'ai contribué à automatiser le reporting tout en réduisant les écarts de 10 %.

Ce qui me distingue, c'est ma rigueur ainsi que mon sens du résultat. J'aime analyser les données des entreprises et proposer des solutions pour améliorer leurs processus à l'aide d'outils comme Python, Power BI ou SQL.

À terme, je souhaite me spécialiser dans les domaines de la banque et de l'ingénierie financière. Le MS de TBS Education représente pour moi l'opportunité idéale pour atteindre cet objectif et renforcer mon expertise.`,
  },
  {
    id: "why-ms",
    label: "Pourquoi ce MS ?",
    answer: `Ce qui m'a vraiment attirée vers ce MS, c'est sa double dimension : des fondamentaux techniques solides, comme le calcul stochastique, les produits dérivés et la gestion des risques, mais aussi une forte orientation opérationnelle avec l'accès à Bloomberg, Refinitiv et la certification AMF.

Mes expériences en analyse de données financières, reporting et audit m'ont permis de développer une méthodologie rigoureuse, mais il me manque encore des compétences en ingénierie financière, notamment en structuration de produits et en gestion de portefeuille. Ce MS comble cette lacune et me permet de renforcer mon expertise.

J'ai choisi TBS pour son réseau international, ses intervenants professionnels et son approche concrète, qui me garantissent une formation en phase avec le marché.`,
  },
  {
    id: "professional-project",
    label: "Projet professionnel",
    answer: `À court terme, mon objectif est d'intégrer ce MS, d'obtenir la certification AMF, et de décrocher un stage ou une alternance dans une banque d'investissement ou une société de gestion, idéalement dans un département de structuration, gestion d'actifs ou risques de marché.

À moyen terme, je me vois évoluer vers un poste d'analyste financière dans des institutions comme BNP Paribas, Société Générale, Natixis, ou des acteurs internationaux comme HSBC ou Lazard. Ces métiers m'attirent pour leur combinaison d'analyse quantitative, de produits financiers complexes et de prise de décision stratégique.

À long terme, mon ambition est de contribuer à la création de solutions financières innovantes et responsables. Avec ma sensibilité pour la finance durable, je suis convaincue que l'alliance de la data et de l'ingénierie financière sera un atout différenciant dans les années à venir.`,
  },
  {
    id: "friends-perception",
    label: "Comment tes amis te perçoivent ?",
    answer: `Mes amis me décrivent souvent comme quelqu'un de fiable et d'organisé. Lors d'un projet de groupe, ils savent que je m'y impliquerai pleinement et que je ne laisserai pas une tâche inachevée.

Ils disent aussi que je suis curieuse. J'aime comprendre les choses en profondeur et non en surface, ce qui se reflète dans mes conversations où j'aime poser des questions et challenger les idées reçues.

Cependant, si je devais être honnête, ils ajouteraient que je suis parfois trop exigeante envers moi-même. Je cherche à ce que tout soit parfait, ce qui peut parfois me mettre une pression inutile. C'est quelque chose que je travaille à mieux gérer en apprenant à déléguer et à avoir davantage confiance dans les autres membres de l'équipe.`,
  },
  {
    id: "negative-answers",
    label: "Comment réagis-tu face aux réponses négatives ?",
    answer: `Pour moi, une réponse négative est avant tout une information. Bien sûr, la première réaction peut être une légère déception, mais je ne me laisse pas bloquer par cela.

Par exemple, lors de ma candidature pour un stage dans un grand cabinet, j'ai eu plusieurs refus. J'ai demandé des retours quand cela était possible, et j'ai analysé ce qui me manquait. C'est ce qui m'a poussée à renforcer mes compétences en data, ce qui m'a permis de décrocher un poste chez Centrale Danone.

Je considère que les refus font partie du parcours. Ce qui importe, c'est de ne pas les laisser définir notre valeur, mais de les utiliser comme levier pour avancer.`,
  },
  {
    id: "interests",
    label: "Centres d'intérêt",
    answer: `J'ai plusieurs centres d'intérêt qui se croisent avec mon projet professionnel et personnel. D'abord, je suis passionnée par l'actualité des marchés financiers. Je suis de près les évolutions macroéconomiques, les décisions des banques centrales, ainsi que les mouvements sur les marchés de taux.

J'aime aussi beaucoup voyager et découvrir de nouvelles cultures. Cela m'a appris à m'adapter et à communiquer de manière différente selon les contextes, ce qui est un atout précieux dans un environnement bancaire international.

Enfin, mon engagement associatif me tient particulièrement à coeur. J'ai participé au Grand Voyage Humanitaire organisé par le Club 6Days, où j'ai occupé le rôle de cheffe de projet. Nous avons mené des actions concrètes sur le terrain, comme la distribution de paniers alimentaires, la rénovation d'une école, ou encore des caravanes dentaires et vétérinaires. Cette expérience m'a beaucoup apporté, tant humainement qu'en termes de leadership.`,
  },
  {
    id: "achievements",
    label: "Your biggest achievements",
    answer: `On the professional side, one of my proudest achievements was during my financial audit internship at SFM Conseil. I identified inefficiencies in the reporting process and took the initiative to redesign it using Excel and Power BI, without being asked to. This resulted in a 30% reduction in production time. It was incredibly rewarding to see the finance team actually adopt a tool I built from scratch. It showed me how I can leverage my analytical skills to make a real operational impact.

On a personal level, my most meaningful achievement was leading a humanitarian trip with Club 6Days as Project Manager. We carried out a full field mission: distributing 1,000 food baskets to families in need, renovating a primary school, and organizing both a dental and veterinary caravan for rural communities. Coordinating such a large number of actions with a volunteer team, tight logistics, and real human stakes taught me more about leadership, resilience, and teamwork than any classroom ever could.

That experience also reminded me of why I want to work in finance, not just for the technical challenges, but to create tangible value for people and organizations.`,
  },
] as const;

type Mode = "config" | "reading" | "done";
type QuestionId = (typeof QUESTIONS)[number]["id"];

function clampInt(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.trunc(value)));
}

function countWords(text: string) {
  return text.trim().split(/\s+/g).filter(Boolean).length;
}

function speedToPixelsPerSecond(speed: number) {
  return 8 + speed * 1.35;
}

function isQuestionId(value: string): value is QuestionId {
  return QUESTIONS.some((q) => q.id === value);
}

function findQuestion(id: QuestionId) {
  return QUESTIONS.find((q) => q.id === id) ?? QUESTIONS[0];
}

function getInitialQuestionId() {
  try {
    const storedQuestion = localStorage.getItem(STORAGE_KEY_QUESTION);
    if (storedQuestion && isQuestionId(storedQuestion)) {
      return storedQuestion;
    }
  } catch {
    // Ignore storage errors
  }
  return QUESTIONS[0].id;
}

export default function ReaderApp() {
  const [questionId, setQuestionId] = useState<QuestionId>(() =>
    getInitialQuestionId(),
  );
  const [mode, setMode] = useState<Mode>("config");
  const [text, setText] = useState<string>(() =>
    findQuestion(getInitialQuestionId()).answer,
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  const prompterRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);
  const progressRef = useRef(0);

  const [speed, setSpeed] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SPEED);
      if (stored) {
        const parsed = Number.parseInt(stored, 10);
        if (Number.isFinite(parsed)) {
          return clampInt(parsed, MIN_SPEED, MAX_SPEED);
        }
      }
    } catch {
      // Ignore storage errors
    }
    return DEFAULT_SPEED;
  });

  const wordCount = useMemo(() => countWords(text), [text]);
  const question = useMemo(() => findQuestion(questionId), [questionId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SPEED, String(speed));
    } catch {
      // Ignore storage errors
    }
  }, [speed]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_QUESTION, questionId);
    } catch {
      // Ignore storage errors
    }
  }, [questionId]);

  useEffect(() => {
    if (mode === "reading") {
      prompterRef.current?.scrollTo({ top: 0 });
    }
  }, [mode]);

  useEffect(() => {
    if (mode !== "reading" || !isPlaying) return;

    const pixelsPerSecond = speedToPixelsPerSecond(speed);

    function tick(timestamp: number) {
      const prompter = prompterRef.current;
      if (!prompter) return;

      const lastFrame = lastFrameRef.current ?? timestamp;
      const elapsedSeconds = (timestamp - lastFrame) / 1000;
      const maxScroll = Math.max(0, prompter.scrollHeight - prompter.clientHeight);

      lastFrameRef.current = timestamp;

      if (maxScroll === 0) {
        progressRef.current = 100;
        setProgressPercent(100);
        setIsPlaying(false);
        setMode("done");
        return;
      }

      prompter.scrollTop = Math.min(
        maxScroll,
        prompter.scrollTop + pixelsPerSecond * elapsedSeconds,
      );

      const nextProgress = Math.round((prompter.scrollTop / maxScroll) * 100);
      if (nextProgress !== progressRef.current) {
        progressRef.current = nextProgress;
        setProgressPercent(nextProgress);
      }

      if (prompter.scrollTop >= maxScroll) {
        setIsPlaying(false);
        setMode("done");
        return;
      }

      animationRef.current = window.requestAnimationFrame(tick);
    }

    lastFrameRef.current = null;
    animationRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, mode, speed]);

  function updateSpeed(value: string) {
    const next = Number.parseInt(value || "0", 10);
    if (!Number.isFinite(next)) return;
    setSpeed(clampInt(next, MIN_SPEED, MAX_SPEED));
  }

  function startReading() {
    if (wordCount === 0) return;
    progressRef.current = 0;
    setProgressPercent(0);
    setMode("reading");
    setIsPlaying(true);
  }

  function stopReading() {
    setIsPlaying(false);
    setMode("config");
    progressRef.current = 0;
    setProgressPercent(0);
  }

  function restartReading() {
    progressRef.current = 0;
    setProgressPercent(0);
    prompterRef.current?.scrollTo({ top: 0 });
    setMode("reading");
    setIsPlaying(true);
  }

  return (
    <div className="w-full max-w-xl">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Lecteur de texte</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Mode téléprompteur avec une vitesse mémorisée sur cet appareil.
        </p>
      </header>

      {mode === "config" && (
        <div className="space-y-4">
          <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-end justify-between gap-4">
              <div className="flex-1">
                <label
                  htmlFor="speed"
                  className="block text-sm font-medium text-zinc-900 dark:text-zinc-50"
                >
                  Vitesse
                </label>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Ajustable de {MIN_SPEED} à {MAX_SPEED}.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="speed"
                  inputMode="numeric"
                  className="h-11 w-20 rounded-lg border border-zinc-200 bg-white px-3 text-base font-medium text-zinc-900 shadow-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                  type="number"
                  min={MIN_SPEED}
                  max={MAX_SPEED}
                  value={speed}
                  onChange={(e) => updateSpeed(e.target.value)}
                />
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  /100
                </span>
              </div>
            </div>

            <input
              className="mt-4 w-full accent-zinc-900 dark:accent-white"
              type="range"
              min={MIN_SPEED}
              max={MAX_SPEED}
              value={speed}
              onChange={(e) => updateSpeed(e.target.value)}
            />
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <label
              htmlFor="question"
              className="block text-sm font-medium text-zinc-900 dark:text-zinc-50"
            >
              Question d&apos;entretien
            </label>
            <select
              id="question"
              className="mt-3 h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-base text-zinc-900 shadow-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
              value={questionId}
              onChange={(e) => {
                const nextQuestionId = e.target.value as QuestionId;
                setQuestionId(nextQuestionId);
                setText(findQuestion(nextQuestionId).answer);
              }}
            >
              {QUESTIONS.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.label}
                </option>
              ))}
            </select>
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-start justify-between gap-4">
              <div>
                <label
                  htmlFor="text"
                  className="block text-sm font-medium text-zinc-900 dark:text-zinc-50"
                >
                  Réponse
                </label>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {wordCount} mot{wordCount > 1 ? "s" : ""}.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                disabled={wordCount === 0}
                onClick={startReading}
              >
                Démarrer
              </button>
            </div>

            <textarea
              id="text"
              className="mt-3 min-h-44 w-full resize-y rounded-lg border border-zinc-200 bg-white p-3 text-base leading-6 text-zinc-900 shadow-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
              placeholder="Sélectionne une question ou colle ta réponse ici..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </section>
        </div>
      )}

      {mode === "reading" && (
        <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between gap-3 px-1">
            <div className="min-w-0">
              <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                {question.label}
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {progressPercent}% · vitesse {speed}/100
              </p>
            </div>
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
              onClick={stopReading}
            >
              Quitter
            </button>
          </div>

          <div className="mt-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
            <div
              className="h-1.5 bg-zinc-900 transition-[width] dark:bg-white"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <label
              htmlFor="reading-speed"
              className="shrink-0 text-xs font-medium text-zinc-500 dark:text-zinc-400"
            >
              Vitesse
            </label>
            <input
              id="reading-speed"
              className="w-full accent-zinc-900 dark:accent-white"
              type="range"
              min={MIN_SPEED}
              max={MAX_SPEED}
              value={speed}
              onChange={(e) => updateSpeed(e.target.value)}
            />
            <span className="w-9 text-right text-xs text-zinc-500 dark:text-zinc-400">
              {speed}
            </span>
          </div>

          <div className="relative mt-4 h-[62vh] min-h-96 overflow-hidden rounded-lg bg-zinc-950 text-zinc-50 shadow-inner">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-zinc-950 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-zinc-950 to-transparent" />
            <div className="pointer-events-none absolute inset-x-4 top-1/2 z-10 h-px bg-emerald-300/70" />
            <div
              ref={prompterRef}
              className="h-full overflow-hidden"
              aria-label="Téléprompteur"
            >
              <article className="px-5 py-[44vh] text-2xl font-medium leading-relaxed sm:px-8 sm:text-3xl">
                {text}
              </article>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
              onClick={() => setIsPlaying((playing) => !playing)}
            >
              {isPlaying ? "Pause" : "Reprendre"}
            </button>

            <button
              type="button"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
              onClick={restartReading}
            >
              Recommencer
            </button>
          </div>
        </div>
      )}

      {mode === "done" && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-semibold">Lecture terminée</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Question : <span className="font-medium">{question.label}</span>
          </p>

          <div className="mt-4 grid gap-3">
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
              onClick={restartReading}
            >
              Relire
            </button>
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
              onClick={stopReading}
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

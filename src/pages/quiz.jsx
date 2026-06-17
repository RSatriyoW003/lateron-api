import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import l2 from "../assets/logo2.jpg";
import logo from "../assets/logo.png";

const normalize = (value) =>
  (value || "").toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, " ");

const shuffle = (array) => array.sort(() => Math.random() - 0.5);

const createMcq = (question, answer, options) => ({
  type: "mcq",
  question,
  options: shuffle([answer, ...options]).slice(0, 4),
  answer,
});

const createFill = (question, answer) => ({
  type: "fill",
  question,
  answer,
});

const createReadingQuestion = (question, answer, passage, mode = "fill", options = []) => ({
  type: "reading",
  mode,
  question,
  passage,
  answer,
  options: mode === "mcq" ? shuffle([answer, ...options]).slice(0, 4) : [],
});

const getTopicKeyword = (day) => {
  const title = (day?.title || "").toLowerCase();
  const patterns = [
    { regex: /simple present|present tense|present/i, label: "present tense" },
    { regex: /past tense|past|lampau/i, label: "past tense" },
    { regex: /reading|dokkai|membaca/i, label: "reading comprehension" },
    { regex: /listening|choukai|mendengarkan|audio/i, label: "listening" },
    { regex: /writing|essay|proposal/i, label: "writing" },
    { regex: /grammar|struktur|sentence/i, label: "grammar" },
    { regex: /particle|partikel/i, label: "particle" },
    { regex: /kanji|katakana|hiragana/i, label: "kanji" },
    { regex: /pinyin|mandarin|hsk/i, label: "pinyin" },
    { regex: /vocabulary|kosakata|words/i, label: "vocabulary" },
  ];
  const found = patterns.find(({ regex }) => regex.test(title));
  return found ? found.label : day?.title?.split(" ")[0] || "materi";
};

const getCoreConcept = (day) => {
  const title = (day?.title || "").toLowerCase();
  if (/simple present|present tense|present/i.test(title)) return "present";
  if (/past tense|past|lampau/i.test(title)) return "past";
  if (/reading|dokkai|membaca/i.test(title)) return "reading";
  if (/listening|choukai|mendengarkan|audio/i.test(title)) return "listening";
  if (/writing|essay|proposal/i.test(title)) return "writing";
  if (/grammar|struktur|sentence/i.test(title)) return "grammar";
  if (/particle|partikel/i.test(title)) return "particle";
  if (/kanji|katakana|hiragana/i.test(title)) return "kanji";
  if (/pinyin|mandarin|hsk/i.test(title)) return "pinyin";
  if (/vocabulary|kosakata|words/i.test(title)) return "vocabulary";
  return title.split(" ")[0] || "materi";
};

const buildQuestions = (day, weekTitle) => {
  const title = day?.title || "Materi Belajar";
  const description = day?.description || "Materi ini menyiapkan kamu untuk latihan ujian.";
  const topic = getTopicKeyword(day);
  const concept = getCoreConcept(day);
  const formula = day?.formula || "Gunakan materi ini untuk meningkatkan pemahaman.";

  const mcqQuestions = [
    createMcq(
      `Apa fokus utama dari materi hari ini: "${title}"?`,
      title,
      [
        "Penggunaan kata kerja",
        "Menerjemahkan kalimat panjang",
        "Menebak arti kosakata baru"
      ]
    ),
    createMcq(
      `Manakah pernyataan yang paling sesuai dengan tujuan pembelajaran ini?`,
      `Memahami ${topic} dan aplikasinya dalam ujian`,
      [
        "Menghafal semua contoh tanpa memahami",
        "Mendengarkan audio tanpa catatan",
        "Mengulang materi lain terlebih dahulu"
      ]
    ),
    createMcq(
      `Dalam konteks ${weekTitle}, kegiatan mana yang paling tepat?`,
      `Melakukan latihan ${topic} secara terstruktur`,
      [
        "Mengerjakan soal secara acak",
        "Membaca teks tanpa menganalisis",
        "Mengabaikan rumus dasar"
      ]
    ),
    createMcq(
      `Apa yang harus ditingkatkan setelah mempelajari topik ini?`,
      `Kemampuan ${topic} dalam soal ujian`,
      [
        "Hanya menghafal jawaban",
        "Fokus pada kecepatan menulis saja",
        "Membaca materi lain secara cepat"
      ]
    ),
    createMcq(
      `Pernyataan mana yang paling menggambarkan materi ini?`,
      description,
      [
        "Menjelaskan semua variasi kosakata saja",
        "Hanya praktik mendengar tanpa membaca",
        "Mengabaikan struktur kalimat"
      ]
    ),
  ];

  const fillQuestions = [
    createFill(
      `Lengkapi: "Topik utama hari ini adalah ____."`,
      topic
    ),
    createFill(
      `Lengkapi: "Fokus latihan ini adalah meningkatkan kemampuan ____."`,
      concept
    ),
    createFill(
      `Tuliskan kata kunci materi: "${title}" -> ____`,
      concept
    ),
    createFill(
      `Lengkapi: "Dalam soal ujian, kamu harus memperhatikan ____."`,
      topic
    ),
    createFill(
      `Fokus utama rumus ini adalah ____.`,
      formula.split(" ").slice(0, 3).join(" ")
    ),
  ];

  const readingQuestions = [
    createReadingQuestion(
      `Baca teks berikut dan jawab: apa topik utama dari bacaan tersebut?`,
      topic,
      description,
      "mcq",
      [
        "Metode pembelajaran acak",
        "Latihan tanpa konteks",
        "Latihan kecepatan saja"
      ]
    ),
    createReadingQuestion(
      `Menurut teks, hal apa yang perlu ditingkatkan?`,
      `Kemampuan ${topic}`,
      description,
      "fill"
    ),
    createReadingQuestion(
      `Apa yang paling penting untuk dilakukan setelah mempelajari materi ini?`,
      `Menggunakan ${topic} dalam latihan ujian`,
      description,
      "mcq",
      [
        "Mengingat seluruh kalimat",
        "Mencari jawaban cepat tanpa memahami",
        "Mengabaikan aturan dasar"
      ]
    ),
    createReadingQuestion(
      `Tema bacaan ini berkaitan dengan ____`,
      topic,
      description,
      "fill"
    ),
  ];

  if (day.id <= 2) {
    return mcqQuestions.slice(0, 5);
  }

  if (day.id <= 4) {
    return [
      ...mcqQuestions.slice(0, 3),
      ...fillQuestions.slice(0, 2),
    ];
  }

  if (day.id <= 6) {
    return [
      ...fillQuestions.slice(0, 2),
      ...readingQuestions.slice(0, 3),
    ];
  }

  const mixedQuestions = [
    ...mcqQuestions.slice(0, 3),
    ...fillQuestions.slice(0, 3),
    ...readingQuestions.slice(0, 4),
  ];

  return mixedQuestions.slice(0, 10);
};

export default function Quiz() {
  const navigate = useNavigate();
  const [quizContext, setQuizContext] = useState(null);
  const [currentDay, setCurrentDay] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const [needsFix, setNeedsFix] = useState(false);
  const [lockedQuestions, setLockedQuestions] = useState({});
  const [quizError, setQuizError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => { 
    setQuizError(null);

    const savedContextRaw = localStorage.getItem("roadmap_quiz_context");
    const savedContext = savedContextRaw ? JSON.parse(savedContextRaw) : null;
    if (!savedContext) {
      setQuizError('roadmap_quiz_context tidak ditemukan. Jalankan Quiz lewat tombol "Start Quiz" dari My Roadmap.');
      setCurrentDay(null);
      return;
    }

    const testTypeKey = (() => {
      const t = (savedContext.testType || '').toString().trim();
      if (t.toUpperCase() === 'TOEFL ITP' || t.toUpperCase() === 'TOEFL') return 'TOEFL';
      if (t.toUpperCase() === 'IELTS') return 'IELTS';
      return t;
    })();

    // Gunakan emailKey dari context agar key localStorage cocok dengan yang disimpan myroadmap
    const emailKey = savedContext.emailKey || 'guest';
    const roadmapStorageKey = `roadmap_${emailKey}_${testTypeKey}`;

    const roadmapData = JSON.parse(localStorage.getItem(roadmapStorageKey) || "[]");
    
    // PERBAIKAN 1: Membungkus ID dengan Number() untuk menghindari error perbedaan tipe data (string vs number)
    const week = roadmapData.find((item) => Number(item.id) === Number(savedContext.weekId));
    const day = week?.days?.find((item) => Number(item.id) === Number(savedContext.dayId));

    if (!week || !day) {
      navigate("/my-roadmap");
      return;
    }

    setQuizContext(savedContext);
    setCurrentDay({ ...day, weekTitle: week.weekLabel, weekTitleFull: week.title });
  }, [navigate]);

  useEffect(() => {
    if (currentDay && quizContext) {
      setQuestions(buildQuestions(currentDay, currentDay.weekTitleFull));
    }
  }, [currentDay, quizContext]);

  const handleAnswerChange = (index, value) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const handleFixAnswers = () => {
    setSubmitted(false);
    setNeedsFix(false);
    setFeedback([]);
  };

  const handleSubmit = () => {
    const feedbackResult = questions.map((question, index) => {
      const answer = answers[index] || "";
      const isCorrect = question.type === "mcq"
        ? answer === question.answer
        : normalize(answer) === normalize(question.answer);

      return {
        questionText: question.question,
        selectedAnswer: answer,
        correctAnswer: question.answer,
        isCorrect,
      };
    });

    const calculated = feedbackResult.filter((item) => item.isCorrect).length;
    const wrongCount = feedbackResult.filter((item) => !item.isCorrect).length;
    const locked = feedbackResult.reduce((acc, item, index) => {
      if (item.isCorrect) acc[index] = true;
      return acc;
    }, {});
    const persistedAnswers = feedbackResult.reduce((acc, item, index) => {
      if (item.isCorrect) acc[index] = item.selectedAnswer;
      return acc;
    }, {});

    setScore(calculated);
    setFeedback(feedbackResult);
    setSubmitted(true);
    setLockedQuestions(locked);
    setAnswers(persistedAnswers);
    setNeedsFix(wrongCount > 0);

    if (wrongCount > 0) {
  return;
}

fetch("http://localhost:3000/quiz/submit", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    user_id: localStorage.getItem("user_id"),
    week_id: quizContext.weekId,
    day_id: quizContext.dayId,
    score: calculated,
    total_questions: questions.length,
    completed: true,
  }),
});

// ===== UPDATE STREAK =====
const emailKey = quizContext?.emailKey || "guest";
const streakKey = `streak_log_${emailKey}`;

const today = new Date().toISOString().slice(0, 10);

const streakLog = JSON.parse(
  localStorage.getItem(streakKey) || "[]"
);

if (!streakLog.includes(today)) {
  streakLog.push(today);
  localStorage.setItem(
    streakKey,
    JSON.stringify(streakLog)
  );
}
// ===== END STREAK =====

if (quizContext) {
  const emailKey = quizContext.emailKey || 'guest';
  const storageKey = `roadmap_${emailKey}_${quizContext.testType}`;
  const roadmapData = JSON.parse(localStorage.getItem(storageKey) || "[]");

  const updatedRoadmap = roadmapData.map((week) => {
    if (Number(week.id) !== Number(quizContext.weekId)) return week;

    return {
      ...week,
      days: week.days.map((day) =>
        Number(day.id) === Number(quizContext.dayId)
          ? { ...day, completed: true }
          : day
      ),
    };
  });

  localStorage.setItem(storageKey, JSON.stringify(updatedRoadmap));
}

localStorage.removeItem("roadmap_quiz_context");

    if (quizContext) {
      const emailKey = quizContext.emailKey || 'guest';
      const storageKey = `roadmap_${emailKey}_${quizContext.testType}`;
      const roadmapData = JSON.parse(localStorage.getItem(storageKey) || "[]");
      const updatedRoadmap = roadmapData.map((week) => {
        if (Number(week.id) !== Number(quizContext.weekId)) return week;
        return {
          ...week,
          days: week.days.map((day) =>
            Number(day.id) === Number(quizContext.dayId) ? { ...day, completed: true } : day
          ),
        };
      });
      localStorage.setItem(storageKey, JSON.stringify(updatedRoadmap));
    }
    localStorage.removeItem("roadmap_quiz_context");
  };

  const totalQuestions = questions.length;
  const finished = submitted;
  const wrongCount = feedback.filter((item) => !item.isCorrect).length;

  return (
    <div className="min-h-screen bg-white antialiased flex flex-col">

      {/* NAVBAR */}
      <nav className="bg-[#2471A3] flex items-center px-16 py-5 sticky top-0 z-50 shadow-sm text-white">
        <div className="shrink-0 cursor-pointer" onClick={() => navigate("/dashboard")}>
          <img src={logo} alt="Lateron" className="w-[100px] h-auto object-contain brightness-0 invert" />
        </div>
        <div className="flex-1 flex items-center justify-end gap-6 text-[15px] text-white/70 mr-14">
          <Link to="/dashboard" className="hover:text-white transition-colors">Home</Link>
          <span className="w-1 h-1 rounded-full bg-white/40" />
          <Link to="/generate" className="hover:text-white transition-colors">Generate</Link>
          <span className="w-1 h-1 rounded-full bg-white/40" />
          <Link to="/my-roadmap" className="hover:text-white transition-colors">My Roadmap</Link>
          <span className="w-1 h-1 rounded-full bg-white/40" />
          <Link to="/profile" className="hover:text-white transition-colors">Profile</Link>
        </div>
      </nav>

      <main className="flex-grow bg-white">

        {!currentDay && quizError ? (
          <div className="max-w-3xl mx-auto py-16 px-8">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
              <h2 className="text-[18px] font-bold text-red-700 mb-3">Quiz Error</h2>
              <p className="text-[14px] text-red-600">{quizError}</p>
              <Link to="/my-roadmap" className="mt-6 inline-block text-[#2471A3] font-semibold hover:underline">← Kembali ke My Roadmap</Link>
            </div>
          </div>

        ) : currentDay ? (
          finished ? (
            <div className="max-w-2xl mx-auto py-16 px-8">
              <div className="rounded-2xl bg-white border border-[#D0E9F4] p-8 shadow-sm">
                <h2 className="text-[22px] font-bold text-[#143F5E] mb-2">Hasil Quiz</h2>
                <p className="text-[15px] text-[#2471A3] mb-1">Skor: <span className="font-bold">{score} / {totalQuestions}</span></p>
                <p className="text-[13px] text-gray-500 mb-6">
                  {wrongCount > 0 ? "Masih ada jawaban yang perlu diperbaiki." : "Semua jawaban benar. Materi hari ini selesai!"}
                </p>
                {wrongCount > 0 && (
                  <div className="space-y-3 mb-6">
                    {feedback.filter(f => !f.isCorrect).map((item, idx) => (
                      <div key={idx} className="rounded-xl bg-red-50 border border-red-100 p-4">
                        <p className="text-[13px] text-red-800 mb-1"><span className="font-semibold">Soal:</span> {item.questionText}</p>
                        <p className="text-[13px] text-gray-700"><span className="font-semibold">Jawabanmu:</span> {item.selectedAnswer || "Tidak terisi"}</p>
                        <p className="text-[13px] text-emerald-700"><span className="font-semibold">Jawaban benar:</span> {item.correctAnswer}</p>
                      </div>
                    ))}
                  </div>
                )}
                {needsFix ? (
                  <button onClick={handleFixAnswers} className="bg-[#2471A3] text-white px-8 py-3 rounded-full text-[14px] font-semibold hover:bg-[#1C5D86] transition-colors cursor-pointer">
                    Perbaiki Jawaban
                  </button>
                ) : (
                  <button onClick={() => navigate("/my-roadmap")} className="bg-[#2471A3] text-white px-8 py-3 rounded-full text-[14px] font-semibold hover:bg-[#1C5D86] transition-colors cursor-pointer">
                    Kembali ke Roadmap
                  </button>
                )}
              </div>
            </div>

          ) : (
            /* ===== QUIZ AKTIF ===== */
            <div className="flex min-h-[calc(100vh-72px)] bg-white px-14 py-10 gap-10">

              {/* ── PANEL KIRI: kotak dengan border tipis biru ── */}
              <div className="w-[260px] shrink-0">

                <button
                  onClick={() => navigate("/my-roadmap")}
                  className="flex items-center gap-1.5 text-[13px] text-gray-500 font-medium hover:text-[#2471A3] bg-transparent cursor-pointer w-fit transition-colors mb-6"
                >
                  ← Kembali ke roadmap
                </button>

                {/* Kotak border tipis biru berisi judul + nomor soal */}
                <div className="rounded-2xl border border-[#B8D4EC] bg-white px-5 py-5">
                  <p className="text-[17px] font-bold text-[#2471A3] mb-0.5">{currentDay?.title || "Quiz"}</p>
                  <p className="text-[13px] text-gray-400 mb-5">{currentDay?.weekTitle || "Simple Present Tense"}</p>

                  <div className="grid grid-cols-5 gap-3">
                    {questions.map((_, qIdx) => (
                      <button
                        key={qIdx}
                        onClick={() => setCurrentIndex(qIdx)}
                        className={`w-11 h-11 rounded-xl text-[13px] font-semibold transition-all cursor-pointer
                          ${answers[qIdx] !== undefined || qIdx === currentIndex
                            ? "bg-[#2471A3] text-white"
                            : "bg-[#DDEAF7] text-[#2471A3]"}`}
                      >
                        {qIdx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── AREA SOAL KANAN ── */}
              <div className="flex-1 flex flex-col">
                <p className="text-[13px] text-gray-400 mb-6 font-medium">Pilih Jawaban yang paling tepat!</p>

                {(() => {
                  const item = questions[currentIndex];
                  if (!item) return null;
                  const index = currentIndex;
                  return (
                    <div className="flex-1 flex flex-col">

                      <p className="text-[16px] font-medium text-gray-800 mb-8 leading-relaxed max-w-2xl">
                        {item.question}
                      </p>

                      {/* MCQ */}
                      {item.type === "mcq" && (
                        <div className="space-y-3 max-w-[560px]">
                          {lockedQuestions[index] ? (
                            <div className="rounded-full bg-emerald-50 border border-emerald-200 px-6 py-4 text-[14px] text-emerald-700">
                              Jawaban benar: <span className="font-semibold">{answers[index]}</span>
                            </div>
                          ) : (
                            item.options.map((option, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleAnswerChange(index, option)}
                                className={`w-full flex items-center gap-4 rounded-full border px-4 py-3 text-[14px] text-left transition-all cursor-pointer
                                  ${answers[index] === option
                                    ? "bg-[#2471A3] text-white border-[#2471A3]"
                                    : "bg-white text-gray-700 border-gray-200 hover:border-[#2471A3]"}`}
                              >
                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-bold shrink-0
                                  ${answers[index] === option ? "bg-white/20 text-white" : "bg-[#EBF4FB] text-[#2471A3]"}`}>
                                  {["A","B","C","D"][idx]}
                                </span>
                                {option}
                              </button>
                            ))
                          )}
                        </div>
                      )}

                      {/* FILL */}
                      {item.type === "fill" && (
                        lockedQuestions[index] ? (
                          <div className="rounded-full bg-emerald-50 border border-emerald-200 px-6 py-4 text-[14px] text-emerald-700">
                            Jawaban benar: <span className="font-semibold">{answers[index]}</span>
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={answers[index] || ""}
                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                            placeholder="Tuliskan jawaban kamu di sini..."
                            className="w-full max-w-[560px] rounded-xl border border-gray-200 px-5 py-3.5 text-[14px] text-gray-700 focus:border-[#2471A3] focus:outline-none bg-white"
                          />
                        )
                      )}

                      {/* READING */}
                      {item.type === "reading" && (
                        <div className="space-y-3 max-w-[560px]">
                          <div className="rounded-xl bg-white border border-[#D0E9F4] px-5 py-4 text-[13px] text-gray-700 leading-relaxed">
                            {item.passage}
                          </div>
                          {item.mode === "mcq" ? (
                            lockedQuestions[index] ? (
                              <div className="rounded-full bg-emerald-50 border border-emerald-200 px-6 py-4 text-[14px] text-emerald-700">
                                Jawaban benar: <span className="font-semibold">{answers[index]}</span>
                              </div>
                            ) : (
                              item.options.map((option, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleAnswerChange(index, option)}
                                  className={`w-full flex items-center gap-4 rounded-full border px-4 py-3 text-[14px] text-left transition-all cursor-pointer
                                    ${answers[index] === option
                                      ? "bg-[#2471A3] text-white border-[#2471A3]"
                                      : "bg-white text-gray-700 border-gray-200 hover:border-[#2471A3]"}`}
                                >
                                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-bold shrink-0
                                    ${answers[index] === option ? "bg-white/20 text-white" : "bg-[#EBF4FB] text-[#2471A3]"}`}>
                                    {["A","B","C","D"][idx]}
                                  </span>
                                  {option}
                                </button>
                              ))
                            )
                          ) : (
                            lockedQuestions[index] ? (
                              <div className="rounded-full bg-emerald-50 border border-emerald-200 px-6 py-4 text-[14px] text-emerald-700">
                                Jawaban benar: <span className="font-semibold">{answers[index]}</span>
                              </div>
                            ) : (
                              <input
                                type="text"
                                value={answers[index] || ""}
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                placeholder="Tuliskan jawaban kamu di sini..."
                                className="w-full rounded-xl border border-gray-200 px-5 py-3.5 text-[14px] text-gray-700 focus:border-[#2471A3] focus:outline-none bg-white"
                              />
                            )
                          )}
                        </div>
                      )}

                      {/* TOMBOL NAVIGASI */}
                      <div className="flex justify-between items-center mt-auto pt-12">
                        <button
                          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                          disabled={currentIndex === 0}
                          className="px-8 py-3 rounded-full border border-gray-300 text-[14px] text-gray-500 hover:border-[#2471A3] hover:text-[#2471A3] disabled:opacity-30 transition-all cursor-pointer bg-white font-medium"
                        >
                          Previous
                        </button>
                        {currentIndex < questions.length - 1 ? (
                          <button
                            onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                            className="px-8 py-3 rounded-full bg-[#2471A3] text-[14px] text-white font-semibold hover:bg-[#1C5D86] transition-all cursor-pointer"
                          >
                            Next
                          </button>
                        ) : (
                          <button
                            onClick={handleSubmit}
                            className="px-8 py-3 rounded-full bg-[#2471A3] text-[14px] text-white font-semibold hover:bg-[#1C5D86] transition-all cursor-pointer"
                          >
                            Kirim Jawaban
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })()}
              </div>
            </div>
          )

        ) : (
          <div className="max-w-3xl mx-auto py-16 px-8">
            <div className="rounded-2xl border border-[#D0E9F4] bg-[#EBF7FB] p-8">
              <p className="text-[15px] text-[#143F5E]">Sedang memuat quiz... Kembali ke <Link className="text-[#2471A3] underline" to="/my-roadmap">My Roadmap</Link> jika tidak otomatis.</p>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER — sama persis dengan myroadmap */}
      <footer className="px-16 pt-14 pb-8 bg-[#EBF2F7] w-full">
        <div className="flex justify-between mb-10 max-w-6xl mx-auto">
          <div className="w-[30%]">
            <img src={l2} alt="Lateron" className="w-[90px] h-auto object-contain mb-4" />
            <p className="text-[13px] text-[#5A92B5] leading-relaxed">
              Helping learners achieve their language goals with personalized roadmaps and smarter preparation.
            </p>
          </div>
          <div>
            <p className="text-[14px] font-bold text-[#143F5E] mb-4">Quick Links</p>
            {["Home", "About Us", "Roadmap", "Dashboard"].map((l) => (
              <button key={l} disabled className="block text-[13px] text-[#5A92B5] mb-2.5 bg-transparent p-0 border-none transition-colors cursor-default opacity-70">{l}</button>
            ))}
          </div>
          <div>
            <p className="text-[14px] font-bold text-[#143F5E] mb-4">Support</p>
            {["Language Test", "Progress Tracker", "Contact", "FAQ"].map((l) => (
              <span key={l} className="block text-[13px] text-[#5A92B5] mb-2.5 transition-colors opacity-70 cursor-default">{l}</span>
            ))}
          </div>
        </div>
        <div className="border-t border-slate-300/40 pt-6">
          <p className="text-center text-[12px] text-[#5A92B5]">
            © 2026 Lateron. All Rights Reserved. Your Language Learning Partner.
          </p>
        </div>
      </footer>

    </div>
  );
}
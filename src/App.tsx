import React, { useState, useEffect } from "react";
import {
  FileText,
  LayoutDashboard,
  Database,
  Award,
  Users,
  Search,
  Trash2,
  ChevronLeft,
  AlertCircle,
  TrendingDown,
  Clock,
  BookOpen,
  Frown,
  CheckCircle2,
  Activity,
  AwardIcon,
  Play,
  RotateCcw,
  Sparkles,
  Info
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis
} from "recharts";
import {
  StudentInput,
  PredictionResponse,
  DashboardStats,
  HistoryRecord,
  EvaluationResults
} from "./types";

export default function App() {
  // Navigation tab
  const [activeTab, setActiveTab] = useState<"form" | "dashboard" | "history" | "evaluation" | "about">("form");

  // Form Inputs
  const [inputVal, setInputVal] = useState<StudentInput>({
    name: "علیرضا رضایی",
    age: 16,
    gender: "پسر",
    grade: 10,
    study_hours: 2.5,
    sleep_hours: 7.5,
    absences: 2,
    homework: "کامل",
    gpa: 15.5,
    mobile_hours: 3.0,
    internet_hours: 2.0,
    parental_support: "متوسط",
    motivation: "متوسط",
    participation: "معمولی"
  });

  // State managers
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [evalData, setEvalData] = useState<EvaluationResults | null>(null);
  const [searchHistory, setSearchHistory] = useState("");
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingEval, setIsLoadingEval] = useState(false);

  // Load stats, history, and evals on tab changes
  useEffect(() => {
    fetchHistory();
    fetchStats();
    fetchEvaluation();
  }, []);

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const fetchStats = async () => {
    setIsLoadingStats(true);
    try {
      const res = await fetch("/api/statistics");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchEvaluation = async () => {
    setIsLoadingEval(true);
    try {
      const res = await fetch("/api/evaluation");
      const data = await res.json();
      setEvalData(data);
    } catch (err) {
      console.error("Failed to load evaluations:", err);
    } finally {
      setIsLoadingEval(false);
    }
  };

  // Submit prediction form
  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPredicting(true);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputVal)
      });
      const data = await res.json();
      setPredictionResult(data);
      // Refresh backend buffers
      fetchHistory();
      fetchStats();
    } catch (err) {
      console.error("Failed to run ML prediction:", err);
    } finally {
      setIsPredicting(false);
    }
  };

  // Delete records from dashboard
  const handleDeleteRecord = async (id: number) => {
    if (!window.confirm("آیا از حذف این پرونده از حافظه پایگاه داده اطمینان دارید؟")) return;
    try {
      const res = await fetch(`/api/history/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.status === "success") {
        fetchHistory();
        fetchStats();
      }
    } catch (err) {
      console.error("Failed to delete record:", err);
    }
  };

  // Filter history records
  const filteredHistory = history.filter(item => 
    item.name.toLowerCase().includes(searchHistory.toLowerCase()) ||
    item.risk_level.includes(searchHistory)
  );

  // Pie cell color mappings
  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans" dir="rtl">
      
      {/* Top Professional Header Navigation */}
      <header className="bg-emerald-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-700 p-2 rounded-xl text-emerald-400">
              <Activity className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">سامانه هوشمند تحلیل و پیش‌بینی افت تحصیلی دانش‌آموزان</h1>
              <p className="text-xs text-emerald-200">طرح پژوهشی هوش مصنوعی (ML) رده دبیرستان جهت جشنواره ملی خوارزمی</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-1 bg-emerald-950 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("form")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === "form" ? "bg-emerald-600 text-white shadow-sm" : "text-emerald-100 hover:text-white"
              }`}
            >
              <FileText className="w-4 h-4" />
              سنجش دانش‌آموز
            </button>
            <button
              onClick={() => { setActiveTab("dashboard"); fetchStats(); }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === "dashboard" ? "bg-emerald-600 text-white shadow-sm" : "text-emerald-100 hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              داشبورد جمعیتی
            </button>
            <button
              onClick={() => { setActiveTab("history"); fetchHistory(); }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === "history" ? "bg-emerald-600 text-white shadow-sm" : "text-emerald-100 hover:text-white"
              }`}
            >
              <Database className="w-4 h-4" />
              پرونده‌ها و تاریخچه
            </button>
            <button
              onClick={() => { setActiveTab("evaluation"); fetchEvaluation(); }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === "evaluation" ? "bg-emerald-600 text-white shadow-sm" : "text-emerald-100 hover:text-white"
              }`}
            >
              <Award className="w-4 h-4" />
              اثبات‌پذیری الگوریتم‌ها
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === "about" ? "bg-emerald-600 text-white shadow-sm" : "text-emerald-100 hover:text-white"
              }`}
            >
              <Users className="w-4 h-4" />
              اهداف و اعضا
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: FORM AND ANALYSIS RESULTS */}
        {activeTab === "form" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Predictor Form */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-150">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-6">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-800">فرم هوشمند سنجش شاخص‌های دانش‌آموز</h3>
              </div>
              
              <form onSubmit={handlePredict} className="space-y-6">
                
                {/* 1. General & High School Base */}
                <div>
                  <h4 className="text-sm font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg mb-4">۱. مشخصات پایه و عمومی</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">نام و نام خانوادگی:</label>
                      <input
                        type="text"
                        value={inputVal.name}
                        onChange={(e) => setInputVal({ ...inputVal, name: e.target.value })}
                        className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white transition-colors"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1"> سن دانش‌آموز (سال):</label>
                      <select
                        value={inputVal.age}
                        onChange={(e) => setInputVal({ ...inputVal, age: parseInt(e.target.value) })}
                        className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white transition-colors"
                      >
                        <option value={15}>۱۵ سال</option>
                        <option value={16}>۱۶ سال</option>
                        <option value={17}>۱۷ سال</option>
                        <option value={18}>۱۸ سال</option>
                        <option value={19}>۱۹ سال</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">جنسیت:</label>
                      <div className="flex items-center gap-4 py-2">
                        <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            checked={inputVal.gender === "پسر"}
                            onChange={() => setInputVal({ ...inputVal, gender: "پسر" })}
                            className="text-emerald-600 focus:ring-emerald-500"
                          />
                          پسر
                        </label>
                        <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            checked={inputVal.gender === "دختر"}
                            onChange={() => setInputVal({ ...inputVal, gender: "دختر" })}
                            className="text-emerald-600 focus:ring-emerald-500"
                          />
                          دختر
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Pure Academic Indicators */}
                <div>
                  <h4 className="text-sm font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg mb-4">۲. متغیرهای علمی و کلاسی</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">معدل ترم قبل (مبنا ۲۰):</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="20"
                        value={inputVal.gpa}
                        onChange={(e) => setInputVal({ ...inputVal, gpa: parseFloat(e.target.value) })}
                        className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">تعداد غیبت‌های ترم:</label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={inputVal.absences}
                        onChange={(e) => setInputVal({ ...inputVal, absences: parseInt(e.target.value) })}
                        className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">پایه تحصیلی:</label>
                      <select
                        value={inputVal.grade}
                        onChange={(e) => setInputVal({ ...inputVal, grade: parseInt(e.target.value) })}
                        className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white transition-colors"
                      >
                        <option value={10}>دهم متوسط دوم</option>
                        <option value={11}>یازدهم متوسط دوم</option>
                        <option value={12}>دوازدهم (کنکوری)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. Lifestyle Management */}
                <div>
                  <h4 className="text-sm font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg mb-4">۳. مدیریت زمان روزانه</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">ساعت مطالعه روزانه:</label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={inputVal.study_hours}
                        onChange={(e) => setInputVal({ ...inputVal, study_hours: parseFloat(e.target.value) })}
                        className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">ساعت خواب شبانه:</label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={inputVal.sleep_hours}
                        onChange={(e) => setInputVal({ ...inputVal, sleep_hours: parseFloat(e.target.value) })}
                        className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">استفاده از موبایل:</label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={inputVal.mobile_hours}
                        onChange={(e) => setInputVal({ ...inputVal, mobile_hours: parseFloat(e.target.value) })}
                        className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">استفاده متفرقه وب:</label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={inputVal.internet_hours}
                        onChange={(e) => setInputVal({ ...inputVal, internet_hours: parseFloat(e.target.value) })}
                        className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white transition-colors"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Psychological & Parental context */}
                <div>
                  <h4 className="text-sm font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg mb-4">۴. اتمسفر محیطی و درونی</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">انجام تکالیف:</label>
                      <select
                        value={inputVal.homework}
                        onChange={(e) => setInputVal({ ...inputVal, homework: e.target.value })}
                        className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white transition-colors"
                      >
                        <option value="کامل">کامل و به موقع انجام می‌دهد</option>
                        <option value="ناقص">گاهی اوقات یا ناقص</option>
                        <option value="عدم انجام">به ندرت یا هرگز</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">انگیزه درونی تحصیلی:</label>
                      <select
                        value={inputVal.motivation}
                        onChange={(e) => setInputVal({ ...inputVal, motivation: e.target.value })}
                        className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white transition-colors"
                      >
                        <option value="زیاد">علاقه‌مندی بالا و جدی</option>
                        <option value="متوسط">انگیزه معمولی تحصیلی</option>
                        <option value="کم">بی‌تفاوتی مطلق به کتاب</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">پیگیری و حمایت اولیا:</label>
                      <select
                        value={inputVal.parental_support}
                        onChange={(e) => setInputVal({ ...inputVal, parental_support: e.target.value })}
                        className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white transition-colors"
                      >
                        <option value="بالا">پیگیری عالی عاطفی/آموزشی</option>
                        <option value="متوسط">پیگیری معمولی و مقطعی</option>
                        <option value="کم">بی‌توجهی یا رهاشدگی</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isPredicting}
                    className="w-full bg-emerald-600 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:bg-emerald-700 disabled:bg-emerald-400 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isPredicting ? (
                      <>
                        <Clock className="w-5 h-5 animate-spin" />
                        در حال طبقه‌بندی و موازنه فاکتورها...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        اجرای محاسبات و سنجش زنده ریسک تحصیلی
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-5 space-y-6">
              
              {predictionResult ? (
                <div className="space-y-6">
                  
                  {/* Gauge Card */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-150 text-center relative overflow-hidden">
                    <span className="text-xs font-bold text-slate-400 block mb-1">گزارش پردازش هوش مصنوعی</span>
                    <h3 className="text-lg font-bold text-slate-700 mb-4">ریسک زوال تحصیلی کارنامه</h3>
                    
                    {/* Visual meter */}
                    <div className="my-6">
                      <div className="relative inline-flex items-center justify-center">
                        <svg className="w-36 h-36 transform -rotate-90">
                          <circle
                            cx="72"
                            cy="72"
                            r="66"
                            className="stroke-slate-100"
                            strokeWidth="10"
                            fill="transparent"
                          />
                          <circle
                            cx="72"
                            cy="72"
                            r="66"
                            className="transition-all duration-1000 ease-out"
                            stroke={predictionResult.risk_level === "زیاد" ? "#ef4444" : predictionResult.risk_level === "متوسط" ? "#f59e0b" : "#10b981"}
                            strokeWidth="12"
                            fill="transparent"
                            strokeDasharray={414.6}
                            strokeDashoffset={414.6 - (414.6 * predictionResult.risk_probability) / 100}
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-3xl font-extrabold tracking-tight text-slate-800">
                            {predictionResult.risk_probability}%
                          </span>
                          <span className="text-xs text-slate-400 font-semibold mt-1">شانس افت رتبه</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center gap-2 mb-4">
                      {predictionResult.risk_level === "زیاد" ? (
                        <span className="bg-red-50 text-red-700 px-4 py-1.5 rounded-full text-md font-bold shadow-sm border border-red-200">
                          ریسک بالا (نیازمند رسیدگی آنی)
                        </span>
                      ) : predictionResult.risk_level === "متوسط" ? (
                        <span className="bg-yellow-50 text-yellow-800 px-4 py-1.5 rounded-full text-md font-bold shadow-sm border border-yellow-200">
                          ریسک متوسط (مداخله توصیه‌شده)
                        </span>
                      ) : (
                        <span className="bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-md font-bold shadow-sm border border-green-200">
                          موقعیت سبز (ایمن و مستعد)
                        </span>
                      )}
                    </div>
                    
                    <div className="bg-slate-50 rounded-xl p-3 text-right flex justify-between items-center">
                      <span className="text-xs text-slate-500">حاشیه قطعیت مدل یادگیری:</span>
                      <span className="text-xs text-green-700 font-bold tracking-wider">{predictionResult.confidence_score}% اطمینان ریاضی</span>
                    </div>
                  </div>

                  {/* Explainable AI Details */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-150">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
                      <h4 className="font-bold text-slate-800">توضیح دلایل مدل (Explainable AI)</h4>
                    </div>
                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">این شاخص‌های رفتاری دانش‌آموز بیشترین برآيند تاثیری منفی را بر شانس افت او تحمیل کرده‌اند:</p>
                    
                    <div className="space-y-4">
                      {predictionResult.factors.map((factor, index) => (
                        <div key={index} className="border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-bold text-slate-700">● {factor.factor}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              factor.severity === "High" ? "bg-red-100 text-red-700" : factor.severity === "Medium" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-700"
                            }`}>
                              وزن {factor.severity === "High" ? "شدید" : "متوسط"}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 block">مکانیزم اثرگذاری در مدل: {factor.impact}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendation Board */}
                  <div className="bg-emerald-800 text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-3 z-10 relative">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <h4 className="font-bold">برنامه حمایتی و درمانی توصیه‌شده اولیا و مربیان</h4>
                    </div>
                    
                    <ul className="space-y-3 z-10 relative mt-4">
                      {predictionResult.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex gap-2.5 items-start text-xs text-emerald-50 leading-relaxed font-semibold">
                          <span className="bg-emerald-700 text-emerald-300 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              ) : (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-150 text-center py-16 flex flex-col items-center justify-center h-full">
                  <div className="bg-slate-50 p-4 rounded-full text-emerald-700 mb-4">
                    <AwardIcon className="w-10 h-10 animate-pulse" />
                  </div>
                  <h4 className="font-bold text-slate-700 mb-2">در انتظار اجرای سنجش آماری</h4>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                    پس از تکمیل فرم چپ و کلیک دکمه «سنجش زنده»، نتایج طبقه‌بندی هوش مصنوعی، توجیه‌گرهای استنادی و راه‌حل‌های مربیان در این پانل مصور خواهند شد.
                  </p>
                </div>
              )}

            </div>

          </div>
        )}

        {/* TAB 2: MANAGEMENT COMPREHENSIVE DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            
            {/* Header row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">داشبورد یکپارچه تحلیل‌های فرآیند تحصیلی</h2>
                <p className="text-sm text-slate-400">نمایشگر الگوهای مستخرج حوزه‌ای جامعه آماری ثبت‌شده در پایگاه داده</p>
              </div>
              <button
                onClick={() => fetchStats()}
                className="bg-white border select-none border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                بروزرسانی آمارها
              </button>
            </div>

            {isLoadingStats ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                <Clock className="w-8 h-8 text-emerald-600 animate-spin mb-2" />
                <span className="text-sm font-semibold text-slate-500">در حال مکاشفه و تجمیع داده‌های پایگاه داده...</span>
              </div>
            ) : stats && !stats.empty ? (
              <>
                {/* 4 Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-150 border-r-4 border-r-emerald-500">
                    <span className="text-xs text-slate-400 font-semibold block">جمعیت کل پرونده‌ها</span>
                    <h3 className="text-2xl font-black mt-2 text-slate-800">{stats.total_count} دانش‌آموز</h3>
                  </div>

                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-150 border-r-4 border-r-sky-500">
                    <span className="text-xs text-slate-400 font-semibold block">میانگین معدل دانش‌آموزان</span>
                    <h3 className="text-2xl font-black mt-2 text-slate-800">{stats.avg_gpa} از ۲۰</h3>
                  </div>

                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-150 border-r-4 border-r-amber-500">
                    <span className="text-xs text-slate-400 font-semibold block">میانگین مطالعه علمی روزانه</span>
                    <h3 className="text-2xl font-black mt-2 text-slate-800">{stats.avg_study} ساعت</h3>
                  </div>

                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-150 border-r-4 border-r-red-500">
                    <span className="text-xs text-slate-400 font-semibold block">پرونده‌های بحرانی با ریسک بالا</span>
                    <h3 className="text-2xl font-black mt-2 text-red-600">{stats.high_risk_count} نفر</h3>
                  </div>
                </div>

                {/* Recharts Column Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Pie - Risk distribution */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-150 flex flex-col justify-between">
                    <h4 className="font-bold text-slate-800 mb-4 text-center">تناسب توزیع ریسک در جامعه هدف</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stats.riskDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {stats.riskDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value} دانش‌آموز`} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Bar - Grade Risks */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-150">
                    <h4 className="font-bold text-slate-800 mb-4 text-center">شدت آسیب‌پذیری تحصیلی به تفکیک پایه</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={stats.gradeRiskDistribution}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <XAxis dataKey="grade" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="low" name="ریسک کم" fill="#10b981" />
                          <Bar dataKey="medium" name="ریسک متوسط" fill="#f59e0b" />
                          <Bar dataKey="high" name="ریسک بالا" fill="#ef4444" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Scatter Chart study vs gpa */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-150">
                  <h4 className="font-bold text-slate-800 mb-4">انباشت پراکندگی همبستگی معدل و ساعات مطالعه روزانه</h4>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
                        <XAxis
                          type="number"
                          dataKey="studyHours"
                          name="ساعات مطالعه روزانه"
                          unit=" ساعت"
                        />
                        <YAxis type="number" dataKey="gpa" name="معدل دانش‌آموز" min={0} max={20} unit=" نمره" />
                        <ZAxis type="category" dataKey="risk" name="ریسک" />
                        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                        <Legend />
                        <Scatter
                          name="دانش‌آموزان با موقعیت عالی (کم ریسک)"
                          data={stats.scatterPoints.filter(p => p.risk === "کم")}
                          fill="#10b981"
                        />
                        <Scatter
                          name="دانش‌آموزان در معرض هشدار (ریسک متوسط)"
                          data={stats.scatterPoints.filter(p => p.risk === "متوسط")}
                          fill="#f59e0b"
                        />
                        <Scatter
                          name="دانش‌آموزان نیازمند هدایت فوری (ریسک زیاد)"
                          data={stats.scatterPoints.filter(p => p.risk === "زیاد")}
                          fill="#ef4444"
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <h5 className="font-bold text-slate-700">هیچ پرونده‌ای به ثبت نرسیده است</h5>
                <p className="text-xs text-slate-400 mt-2">ابتدا برای چند نفر ارزیابی اجرا کنید تا نمودارها فعال شوند.</p>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: RECORDS HISTORY TABLE */}
        {activeTab === "history" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">بانک اطلاعات پرونده‌های آموزشی</h2>
                <p className="text-sm text-slate-400">مدیریت، بازپرسی و تفتیش ریزرفتارهای آماری دانش‌آموزان در پایگاه داده محلی SQLite</p>
              </div>
              <button
                onClick={() => fetchHistory()}
                className="bg-white border border-slate-200 select-none text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
              >
                بروزرسانی لیست
              </button>
            </div>

            {/* Filters Row */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-150 flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-grow w-full">
                <Search className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="جستجوی دانش‌آموزان بر اساس نام یا سطح ریسک..."
                  value={searchHistory}
                  onChange={(e) => setSearchHistory(e.target.value)}
                  className="w-full text-xs pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {isLoadingHistory ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
                <Clock className="w-8 h-8 text-emerald-600 animate-spin mb-2 mx-auto" />
                <span className="text-xs text-slate-500">سیستم در حال ارجاع و پردازش فایلهای SQLite...</span>
              </div>
            ) : filteredHistory.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-150 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-right text-xs">
                    <thead>
                      <tr className="bg-slate-900 text-white font-bold h-12">
                        <th className="px-5 py-3">نام دانش‌آموز</th>
                        <th className="px-5 py-3">سن سن</th>
                        <th className="px-5 py-3">پایه درسی</th>
                        <th className="px-5 py-3">معدل ترم قبل</th>
                        <th className="px-5 py-3">ساعات غیبت</th>
                        <th className="px-5 py-3">مطالعه روزانه</th>
                        <th className="px-5 py-3">ساعات خواب</th>
                        <th className="px-5 py-3">سطح ریسک</th>
                        <th className="px-5 py-3">احتمال افت</th>
                        <th className="px-5 py-3">عملیات پایگاه</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 h-12 transition-colors">
                          <td className="px-5 py-3 font-semibold text-slate-700">{item.name}</td>
                          <td className="px-5 py-3 text-slate-600">{item.age} سال</td>
                          <td className="px-5 py-3 text-slate-600">پایه {item.grade} دهم</td>
                          <td className="px-5 py-3 font-bold text-slate-700">{item.gpa}</td>
                          <td className="px-5 py-3 text-slate-600">{item.absences} غیبت</td>
                          <td className="px-5 py-3 text-slate-600">{item.study_hours} ساعت</td>
                          <td className="px-5 py-3 text-slate-600">{item.sleep_hours} ساعت</td>
                          <td className="px-5 py-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                              item.risk_level === "زیاد" ? "bg-red-50 text-red-700" : item.risk_level === "متوسط" ? "bg-yellow-50 text-yellow-800" : "bg-green-50 text-green-700"
                            }`}>
                              ریسک {item.risk_level}
                            </span>
                          </td>
                          <td className="px-5 py-3 font-black text-slate-600">{item.risk_probability}%</td>
                          <td className="px-5 py-3">
                            <button
                              onClick={() => handleDeleteRecord(item.id)}
                              className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50 transition-colors cursor-pointer"
                              title="حذف پرونده"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-150">
                <Frown className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h5 className="font-bold text-slate-700">هیچ رکوردی یافت نشد</h5>
                <p className="text-xs text-slate-400 mt-1">آیا عبارت جستجوی خود را کنترل کرده‌اید؟</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ML SCIENTIFIC EVALUATION & ALGORITHMS */}
        {activeTab === "evaluation" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">سیستم علمی اثبات‌پذیری الگوریتم‌های هوش مصنوعی (ML)</h2>
              <p className="text-sm text-slate-400">مکانیزم‌های موازنه، رگرسیون ریاضی و درجه اهمیت متغیرهای رفتاری در پیش‌بینی نهایی</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-150 border-r-4 border-r-emerald-500">
              <h4 className="font-bold text-slate-800 mb-2">بهینه ترین مدل فعلی سامانه: <span className="text-emerald-700 font-black">Gradient Boosting Classifier</span></h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                این سیستم با بهره‌گیری از تکنیک‌های یادگیری درخت تصمیم‌گیری افزایشی (Ensemble Methods)، دقت طبقه‌بندی خیره‌کننده‌ای را در تحلیل شرایط آموزشی به ثبت رسانده است. 
                این رویکرد ترکیبی با رتبه‌بندی پی‌درپی خطای برازش مکرر، بالاترین قابلیت همگرایی داده را بر بستر SQLite داراست.
              </p>
            </div>

            {isLoadingEval ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border">
                <Clock className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
                <span>در حال تحلیل آماری ماتریس یادگیری مدل...</span>
              </div>
            ) : evalData ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Feature Importance Recharts */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-150">
                  <h4 className="font-bold text-slate-800 mb-2">میزان تاثیرگذاری متغیرها در موازنه هوش مصنوعی (XAI)</h4>
                  <p className="text-xs text-slate-400 mb-4">وزن عیارسنجی (Gini-Importance) هر یک از عناصر ورودی در پیش‌بینی‌های مدل تجربی دهم تا دوازدهم</p>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={evalData.featureImportance}
                        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                      >
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 10, fontWeight: "bold" }} />
                        <Tooltip formatter={(value) => `${value}% اثرگذاری`} />
                        <Bar dataKey="value" fill="#047857" radius={[0, 4, 4, 0]}>
                          {evalData.featureImportance.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? "#064e3b" : index === 1 ? "#047857" : "#10b981"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Model Comparison Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-150 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800 mb-2">مقایسه کارکرد الگوریتم‌های متفاوت یادگیری ماشین</h4>
                    <p className="text-xs text-slate-400 mb-4">امتیاز دقت همگرایی و شاخص توازن F1 برای طبقه‌بندهای گوناگون پس از ۵۰۰۰ بار تکرار برازش</p>
                  </div>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={evalData.modelComparison}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <XAxis dataKey="name" />
                        <YAxis domain={[50, 100]} />
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Legend />
                        <Bar dataKey="accuracy" name="دقت کلی (Accuracy)" fill="#0d9488" />
                        <Bar dataKey="f1" name="موازنه اف‌یک (F1 Score)" fill="#059669" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            ) : null}

          </div>
        )}

        {/* TAB 5: ABOUT THE SCIENTIFIC THEORIES */}
        {activeTab === "about" && (
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Elegant Hero card */}
            <div className="bg-emerald-800 text-white p-8 rounded-2xl shadow-md text-center py-12 relative overflow-hidden">
              <Sparkles className="absolute -left-10 -top-10 text-emerald-700 w-40 h-40 transform rotate-12 pointer-events-none" />
              <h1 className="text-3xl font-black mb-3">سامانه هوشمند تشخیص زودهنگام افت آموزشی</h1>
              <p className="text-sm text-emerald-100 max-w-xl mx-auto">
                طرح پژوهشی کاربردی بر پایه علوم داده و هوش مصنوعی تقدیم‌شده به مسابقات و جشنواره‌های پژوهشی دانش‌آموزی کل کشور
              </p>
            </div>

            {/* Scientific explanation */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-150 space-y-4">
              <h4 className="font-bold text-slate-800 border-b pb-2">اهداف، علل و مبانی علمی ساخت سامانه</h4>
              <p className="text-xs text-slate-600 leading-relaxed text-justify">
                افت تحصیلی و نزول نمرات دانش‌آموزان در دوره متوسطه دوم اثرات جبران ناپذیری بر ارتقای علمی، روحی و دانشگاهی عزیزان ایفا می‌کند. 
                به منظور ارتقای سلامت تربیتی مدارس، تحلیل زودهنگام فاکتورهای پیرامونی به مشاوران، مربیان و والدین این اهرم را می‌بخشد تا پیش از به بار آمدن پسرفت گسترده علمی، گام‌های بهبود عملیاتی بردارند.
              </p>
              <p className="text-xs text-slate-600 leading-relaxed text-justify">
                این پرتال به موازنه هم‌افزایی علمی متغیرها همچون غیبت‌های غیرمجاز، بهداشت خواب، ساعات فضای دیجیتال و میزان انگیزه تکیه می‌کند تا بالاترین سطح همگرایی را با مدل ریاضی رده‌بندی درختان به بار نشاند.
              </p>
            </div>

            {/* Simulated Team Roles */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-150">
              <h4 className="font-bold text-slate-800 mb-4 border-b pb-2">ساختار تخصصی اعضای تحقیق و توسعه</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl text-center border border-slate-100">
                  <span className="text-2xl block mb-2">💻</span>
                  <h6 className="font-bold text-slate-800">برنامه‌نویس ارشد فول‌استک</h6>
                  <p className="text-[10px] text-slate-400 mt-1">تدارک مکانیزم‌های وب، دیتابیس محلی SQLite و فایلهای HTML/CSS</p>
                </div>
                
                <div className="p-4 bg-slate-50 rounded-xl text-center border border-slate-100">
                  <span className="text-2xl block mb-2">🤖</span>
                  <h6 className="font-bold text-slate-800">مهندس یادگیری ماشین (ML)</h6>
                  <p className="text-[10px] text-slate-400 mt-1">آموزش، تنظیم هایپرپارامترها و برازش سه‌گانه رگرسیون لجستیک و درخت تصمیم‌گیری</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl text-center border border-slate-100">
                  <span className="text-2xl block mb-2">🎨</span>
                  <h6 className="font-bold text-slate-800">طراح واسط کاربری (UI/UX)</h6>
                  <p className="text-[10px] text-slate-400 mt-1">ترسیم ساختار گرافیکی مدرن، رعایت اصول RTL و پالت رنگی تربیتی-آموزشی</p>
                </div>
              </div>
            </div>

            {/* Run Local Guide */}
            <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl font-mono text-xs border border-slate-800">
              <div className="flex items-center gap-2 mb-3 text-emerald-400">
                <Info className="w-4 h-4" />
                <span className="font-bold font-sans">دستورات لازم جهت راه‌اندازی با پایتون روی ویندوز</span>
              </div>
              <pre className="overflow-x-auto" style={{ direction: "ltr", textAlign: "left" }}>
{`# ۱. نصب کتابخانه‌های مورد نیاز پایتون
pip install -r requirements.txt

# ۲. اجرای خودکار اسکریپت آموزش هوش مصنوعی روی ۵۰۰۰ داده
python train_model.py

# ۳. راه‌اندازی وب سرور محلی فلاسک (Flask)
python app.py`}
              </pre>
              <p className="mt-3 font-sans text-xs text-slate-350 leading-relaxed">
                اسکریپت <code className="text-emerald-400 font-mono">train_model.py</code> به شکل خودکار در صورت عدم وجود مجموعه داده، آن را با ۵۰۰۰ سطر مرتبط و همسو تولید نموده، مدل‌ها را آموزش می‌دهد و فایل ذخیره‌شده را در پوشه <code className="text-emerald-400 font-mono">model/</code> قرار می‌دهد.
              </p>
            </div>

          </div>
        )}

      </main>

      {/* Footer Design */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-center text-xs mt-12 select-none">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-bold text-slate-300">سامانه هوشمند پایش و پیش‌بینی افت تحصیلی دانش‌آموزان</p>
          <p className="mt-1">طراحی‌شده با کدهای تمام واکنش‌گرا و موتور پردازشی لایو | جشنواره خوارزمی و مراجع علمی ارشد</p>
        </div>
      </footer>

    </div>
  );
}

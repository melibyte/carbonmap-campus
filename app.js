const factors = {
  "Elektrik": {
    unit: "kWh",
    factor: 0.5,
    scope: "Scope 2",
    description: "Demo elektrik şebeke katsayısı"
  },
  "Ulaşım": {
    unit: "km",
    factor: 0.18,
    scope: "Scope 3",
    description: "Araç/km tahmini demo katsayısı"
  },
  "Yemekhane": {
    unit: "öğün",
    factor: 2.5,
    scope: "Scope 3",
    description: "Öğün başı demo katsayısı"
  },
  "Etkinlik": {
    unit: "kişi",
    factor: 1.2,
    scope: "Scope 3",
    description: "Katılımcı başı demo katsayısı"
  },
  "Satın Alma": {
    unit: "adet",
    factor: 5,
    scope: "Scope 3",
    description: "Ürün/adet demo katsayısı"
  },
  "Yakıt": {
    unit: "L",
    factor: 2.68,
    scope: "Scope 1",
    description: "Litre yakıt başı demo katsayısı"
  }
};

const dataSourceScores = {
  "Fatura": 95,
  "Sayaç verisi": 90,
  "CSV yükleme": 85,
  "Manuel giriş": 70,
  "Tahmini veri": 50
};

const locations = [
  // Düzce Üniversitesi Konuralp Yerleşkesi için genişletilmiş harita noktaları.
  // Not: Koordinatlar sunum/prototip amaçlı yaklaşık konumlardır; gerçek bina girişleriyle istenirse hassaslaştırılabilir.
  { name: "Rektörlük", type: "Yönetim", lat: 40.90445, lng: 31.18215, budget: 3600, icon: "🏢", floor: "Yönetim binası", area: "4.800 m²" },
  { name: "Mühendislik Fakültesi", type: "Akademik bina", lat: 40.90380, lng: 31.18230, budget: 5200, icon: "🏛️", floor: "Fakülte", area: "12.400 m²" },
  { name: "Eğitim Fakültesi", type: "Akademik bina", lat: 40.90515, lng: 31.18325, budget: 4400, icon: "🎓", floor: "Fakülte", area: "10.800 m²" },
  { name: "Fen Edebiyat Fakültesi", type: "Akademik bina", lat: 40.90470, lng: 31.17945, budget: 4700, icon: "🔬", floor: "Fakülte", area: "14.000 m²" },
  { name: "Orman Fakültesi", type: "Akademik bina", lat: 40.90420, lng: 31.17795, budget: 4100, icon: "🌲", floor: "Fakülte", area: "14.200 m²" },
  { name: "Tıp Fakültesi", type: "Sağlık akademik bina", lat: 40.90275, lng: 31.17935, budget: 6200, icon: "⚕️", floor: "Fakülte", area: "12.000 m²" },
  { name: "Düzce Üniversitesi Hastanesi", type: "Sağlık tesisi", lat: 40.90190, lng: 31.17840, budget: 9800, icon: "🏥", floor: "Hastane", area: "Yüksek enerji kullanımı" },
  { name: "Eczacılık Fakültesi", type: "Akademik bina", lat: 40.90595, lng: 31.18190, budget: 3900, icon: "💊", floor: "Fakülte", area: "Laboratuvar alanları" },
  { name: "İlahiyat Fakültesi", type: "Akademik bina", lat: 40.90625, lng: 31.18345, budget: 3000, icon: "📖", floor: "Fakülte", area: "Derslik alanları" },
  { name: "İşletme Fakültesi", type: "Akademik bina", lat: 40.90425, lng: 31.18735, budget: 3300, icon: "📊", floor: "Fakülte", area: "Derslik alanları" },
  { name: "Sağlık Bilimleri Fakültesi", type: "Akademik bina", lat: 40.90285, lng: 31.18485, budget: 3800, icon: "🩺", floor: "Fakülte", area: "Uygulama alanları" },
  { name: "Spor Bilimleri Fakültesi", type: "Akademik bina", lat: 40.90215, lng: 31.18360, budget: 3500, icon: "🏃", floor: "Fakülte", area: "Spor akademik alanı" },
  { name: "Ziraat Fakültesi", type: "Akademik bina", lat: 40.90645, lng: 31.18515, budget: 4000, icon: "🌾", floor: "Fakülte", area: "Uygulama/lab alanları" },
  { name: "Lisansüstü Eğitim Enstitüsü", type: "Enstitü", lat: 40.90535, lng: 31.18110, budget: 2300, icon: "🎓", floor: "Enstitü", area: "Akademik destek" },
  { name: "Hakime Erciyas Yabancı Diller Yüksekokulu", type: "Yüksekokul", lat: 40.90480, lng: 31.18855, budget: 2600, icon: "🌐", floor: "Yüksekokul", area: "Dil eğitim alanı" },
  { name: "Ormancılık Meslek Yüksekokulu", type: "Meslek yüksekokulu", lat: 40.90355, lng: 31.17720, budget: 2400, icon: "🪵", floor: "MYO", area: "Mesleki eğitim" },
  { name: "Sağlık Hizmetleri Meslek Yüksekokulu", type: "Meslek yüksekokulu", lat: 40.90210, lng: 31.18540, budget: 2800, icon: "🧪", floor: "MYO", area: "Sağlık uygulama alanı" },
  { name: "Mehmet Akif Ersoy Eğitim ve Kültür Merkezi", type: "Eğitim ve kültür merkezi", lat: 40.90225, lng: 31.18235, budget: 4200, icon: "🎭", floor: "4 kat", area: "1.745 kişi kapasite" },
  { name: "Cumhuriyet Konferans Salonu", type: "Etkinlik alanı", lat: 40.90395, lng: 31.18155, budget: 2000, icon: "🎤", floor: "Konferans salonu", area: "Etkinlik alanı" },
  { name: "Kütüphane", type: "Akademik destek", lat: 40.90295, lng: 31.18325, budget: 3000, icon: "📚", floor: "Kütüphane", area: "Çalışma alanları" },
  { name: "Yemekhane", type: "Sosyal tesis", lat: 40.90325, lng: 31.18105, budget: 4300, icon: "🍽️", floor: "Yemekhane", area: "Merkez mutfak/sosyal alan" },
  { name: "Kapalı Spor Salonu", type: "Spor tesisi", lat: 40.90110, lng: 31.18155, budget: 3100, icon: "🏟️", floor: "Spor tesisi", area: "Kapalı spor alanı" },
  { name: "Kapalı Yüzme Havuzu", type: "Spor tesisi", lat: 40.90135, lng: 31.18250, budget: 5200, icon: "🏊", floor: "Spor tesisi", area: "Havuz" },
  { name: "Kampüs Halı Saha", type: "Spor alanı", lat: 40.90185, lng: 31.18175, budget: 1800, icon: "⚽", floor: "Açık alan", area: "Spor alanı" },
  { name: "Düzce Teknopark", type: "AR-GE alanı", lat: 40.90075, lng: 31.17665, budget: 3600, icon: "💡", floor: "Teknopark", area: "AR-GE ofisleri" },
  { name: "Otopark", type: "Ulaşım alanı", lat: 40.90510, lng: 31.17980, budget: 2600, icon: "🅿️", floor: "Açık alan", area: "6.000 m²" }
]

const baseTargetEmission = 22000;
const targetReductionPercent = 10;

let emissions = [];
let charts = {};
let parsedCsvRows = [];
let csvHeaders = [];

const storageKey = "carbonmapCampusDemo.records.v1";

const apiBaseCandidates = window.location.protocol === "file:"
  ? ["http://127.0.0.1:8000/api"]
  : Array.from(new Set([`${window.location.origin}/api`, "http://127.0.0.1:8000/api"]));
let activeApiBaseUrl = apiBaseCandidates[0];
let backendEnabled = false;
let backendCheckFinished = false;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function formatNumber(value, fraction = 0) {
  return Number(value || 0).toLocaleString("tr-TR", {
    maximumFractionDigits: fraction,
    minimumFractionDigits: fraction
  });
}

function formatKg(value) {
  return `${formatNumber(value, 1)} kg CO₂e`;
}

function slugify(value) {
  return String(value || "")
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function normalizeCategory(value) {
  const clean = slugify(value);
  const pairs = {
    elektrik: "Elektrik",
    enerji: "Elektrik",
    kwh: "Elektrik",
    ulasim: "Ulaşım",
    servis: "Ulaşım",
    arac: "Ulaşım",
    km: "Ulaşım",
    yemekhane: "Yemekhane",
    yemek: "Yemekhane",
    ogun: "Yemekhane",
    etkinlik: "Etkinlik",
    konferans: "Etkinlik",
    satin: "Satın Alma",
    satinalma: "Satın Alma",
    malzeme: "Satın Alma",
    yakit: "Yakıt",
    dogalgaz: "Yakıt",
    gaz: "Yakıt"
  };
  return pairs[clean] || Object.keys(factors).find((item) => slugify(item) === clean) || "Elektrik";
}

function normalizeLocation(value) {
  const clean = slugify(value);
  const direct = locations.find((item) => slugify(item.name) === clean);
  if (direct) return direct.name;

  const aliases = [
    ["rektor", "Rektörlük"],
    ["muhendislik", "Mühendislik Fakültesi"],
    ["egitimfakultesi", "Eğitim Fakültesi"],
    ["egitim", "Eğitim Fakültesi"],
    ["fenedebiyat", "Fen Edebiyat Fakültesi"],
    ["fen", "Fen Edebiyat Fakültesi"],
    ["orman", "Orman Fakültesi"],
    ["tip", "Tıp Fakültesi"],
    ["hastane", "Düzce Üniversitesi Hastanesi"],
    ["eczacilik", "Eczacılık Fakültesi"],
    ["ilahiyat", "İlahiyat Fakültesi"],
    ["isletme", "İşletme Fakültesi"],
    ["saglikbilimleri", "Sağlık Bilimleri Fakültesi"],
    ["sporbilimleri", "Spor Bilimleri Fakültesi"],
    ["ziraat", "Ziraat Fakültesi"],
    ["lisansustu", "Lisansüstü Eğitim Enstitüsü"],
    ["yabancidiller", "Hakime Erciyas Yabancı Diller Yüksekokulu"],
    ["hakimeerciyas", "Hakime Erciyas Yabancı Diller Yüksekokulu"],
    ["ormancilik", "Ormancılık Meslek Yüksekokulu"],
    ["saglikhizmetleri", "Sağlık Hizmetleri Meslek Yüksekokulu"],
    ["mehmetakifersoy", "Mehmet Akif Ersoy Eğitim ve Kültür Merkezi"],
    ["kultur", "Mehmet Akif Ersoy Eğitim ve Kültür Merkezi"],
    ["konferans", "Cumhuriyet Konferans Salonu"],
    ["salon", "Cumhuriyet Konferans Salonu"],
    ["kutuphane", "Kütüphane"],
    ["yemekhane", "Yemekhane"],
    ["kapalispor", "Kapalı Spor Salonu"],
    ["yuzme", "Kapalı Yüzme Havuzu"],
    ["halisaha", "Kampüs Halı Saha"],
    ["teknopark", "Düzce Teknopark"],
    ["otopark", "Otopark"]
  ];
  const match = aliases.find(([alias]) => clean.includes(alias));
  return match ? match[1] : locations[0].name;
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function loadRecords() {
  try {
    const raw = localStorage.getItem(storageKey);
    emissions = raw ? JSON.parse(raw) : [];
  } catch (error) {
    emissions = [];
  }
}

function saveRecords() {
  localStorage.setItem(storageKey, JSON.stringify(emissions));
}

function setBackendStatus(isOnline, message) {
  const badge = document.getElementById("backendStatusBadge");
  const card = document.getElementById("backendInfoCard");
  const text = document.getElementById("backendInfoText");
  if (badge) {
    badge.textContent = isOnline ? "Backend: Aktif" : "Backend: Kapalı";
    badge.classList.toggle("online", isOnline);
    badge.classList.toggle("offline", !isOnline);
  }
  if (card) {
    card.classList.toggle("backend-online", isOnline);
    card.classList.toggle("backend-offline", !isOnline);
  }
  if (text) text.textContent = message;
}

async function apiRequest(path, options = {}, baseUrl = activeApiBaseUrl) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `API hatası: ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

async function connectBackend() {
  for (const candidate of apiBaseCandidates) {
    try {
      await apiRequest("/health", {}, candidate);
      activeApiBaseUrl = candidate;
      backendEnabled = true;
      backendCheckFinished = true;
      setBackendStatus(true, "Backend açık: kayıtlar FastAPI üzerinden SQLite veritabanına yazılıyor.");
      await syncFromBackend();
      return;
    } catch (error) {
      // Bir sonraki olası API adresini dene. Örn: Live Server 5500 + backend 8000.
    }
  }
  backendEnabled = false;
  backendCheckFinished = true;
  setBackendStatus(false, "Backend kapalı: demo güvenli şekilde tarayıcı localStorage modu ile çalışıyor.");
}

async function syncFromBackend() {
  if (!backendEnabled) return;
  try {
    emissions = await apiRequest("/records");
    saveRecords();
    renderAll();
  } catch (error) {
    backendEnabled = false;
    setBackendStatus(false, "Backend bağlantısı kesildi: localStorage moduna geçildi.");
    showToast("Backend bağlantısı kesildi, demo modu devam ediyor.");
  }
}

function getActiveRecords() {
  return emissions.filter((item) => item.status !== "Reddedildi" && item.status !== "Taslak");
}

function sumBy(records, key) {
  return records.reduce((acc, item) => {
    const group = item[key] || "Belirsiz";
    acc[group] = (acc[group] || 0) + Number(item.totalEmission || 0);
    return acc;
  }, {});
}

function getTopEntry(grouped) {
  const entries = Object.entries(grouped);
  if (!entries.length) return ["-", 0];
  return entries.sort((a, b) => b[1] - a[1])[0];
}

function getWeightedConfidence(records) {
  const total = records.reduce((sum, item) => sum + Number(item.totalEmission || 0), 0);
  if (!records.length || total === 0) return 0;
  const weighted = records.reduce((sum, item) => {
    return sum + Number(item.totalEmission || 0) * Number(item.confidence || 0);
  }, 0);
  return weighted / total;
}

function getLocationTotal(locationName) {
  return getActiveRecords()
    .filter((item) => item.location === locationName)
    .reduce((sum, item) => sum + Number(item.totalEmission || 0), 0);
}

function getLocationCategoryTotal(locationName, categoryName) {
  return getActiveRecords()
    .filter((item) => item.location === locationName && item.category === categoryName)
    .reduce((sum, item) => sum + Number(item.totalEmission || 0), 0);
}

function getRiskLevel(total, budget = 3000) {
  if (total >= budget * 1.1 || total >= 6000) return "high";
  if (total >= budget * 0.65 || total >= 2500) return "medium";
  return "low";
}

function getRiskLabel(risk) {
  return {
    low: "Düşük",
    medium: "Orta",
    high: "Yüksek"
  }[risk] || "Düşük";
}

function getCampusGrade(total, confidence) {
  let score = 100;
  if (total > baseTargetEmission * 0.95) score -= 35;
  else if (total > baseTargetEmission * 0.75) score -= 20;
  else if (total > baseTargetEmission * 0.55) score -= 10;
  if (confidence < 70) score -= 15;
  else if (confidence < 82) score -= 8;
  const alarmCount = buildAlarms().length;
  score -= Math.min(20, alarmCount * 4);
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  return "D";
}


function getMonthlyTrend(records) {
  const monthlyData = records.reduce((acc, item) => {
    const month = String(item.date || "").slice(0, 7) || "Belirsiz";
    acc[month] = (acc[month] || 0) + Number(item.totalEmission || 0);
    return acc;
  }, {});
  const months = Object.keys(monthlyData).sort();
  if (months.length < 2) {
    return { label: "Yeterli veri yok", direction: "stable", change: 0 };
  }
  const previous = monthlyData[months[months.length - 2]] || 0;
  const current = monthlyData[months[months.length - 1]] || 0;
  const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;
  if (change > 5) return { label: `%${formatNumber(change, 1)} artış`, direction: "up", change };
  if (change < -5) return { label: `%${formatNumber(Math.abs(change), 1)} azalış`, direction: "down", change };
  return { label: "Dengeli", direction: "stable", change };
}

function buildCarbonTwin() {
  const records = getActiveRecords();
  if (!records.length) {
    return {
      score: 0,
      state: "twin-neutral",
      stage: "normal",
      emoji: "🌱",
      title: "Kampüs Ruhu Verileri Bekliyor",
      message: "Demo verisi üretildiğinde veya yeni kayıt eklendiğinde kampüsün karbon sağlığı burada canlı olarak gösterilir.",
      stateLabel: "Bekleniyor",
      trendLabel: "Trend: -"
    };
  }

  const total = records.reduce((sum, item) => sum + Number(item.totalEmission || 0), 0);
  const confidence = getWeightedConfidence(records);
  const alarms = buildAlarms();
  const highRiskLocations = locations.filter((loc) => getRiskLevel(getLocationTotal(loc.name), loc.budget) === "high").length;
  const budgetExceeded = locations.some((loc) => getLocationTotal(loc.name) > loc.budget);
  const trend = getMonthlyTrend(records);

  let score = 100;
  if (total > baseTargetEmission * 0.9) score -= 18;
  if (budgetExceeded) score -= 20;
  score -= Math.min(28, alarms.length * 7);
  score -= Math.min(24, highRiskLocations * 6);
  if (trend.direction === "up") score -= 10;
  if (trend.direction === "down") score += 6;
  if (confidence < 60) score -= 12;
  else if (confidence < 80) score -= 6;

  score = Math.max(0, Math.min(100, Math.round(score)));

  if (score >= 85) {
    return {
      score,
      state: "twin-blooming",
      stage: "blooming",
      emoji: "🌸🌳",
      title: "Kampüs Ruhu Çiçek Açıyor",
      message: "Emisyonlar kontrol altında. Kampüs sürdürülebilirlik hedeflerine güçlü şekilde yaklaşıyor.",
      stateLabel: "Çok iyi",
      trendLabel: `Trend: ${trend.label}`
    };
  }
  if (score >= 70) {
    return {
      score,
      state: "twin-healthy",
      stage: "healthy",
      emoji: "🌳",
      title: "Kampüs Ruhu Sağlıklı",
      message: "Genel karbon görünümü olumlu. Yine de yüksek emisyonlu lokasyonlar düzenli izlenmeli.",
      stateLabel: "İyi",
      trendLabel: `Trend: ${trend.label}`
    };
  }
  if (score >= 50) {
    return {
      score,
      state: "twin-normal",
      stage: "normal",
      emoji: "🌿",
      title: "Kampüs Ruhu Dengede",
      message: "Kampüs karbon sağlığı orta seviyede. Bazı kategoriler için azaltım aksiyonu planlanmalı.",
      stateLabel: "Orta",
      trendLabel: `Trend: ${trend.label}`
    };
  }
  if (score >= 30) {
    return {
      score,
      state: "twin-risk",
      stage: "leaf-fall",
      emoji: "🍂",
      title: "Kampüs Ruhu Yaprak Döküyor",
      message: "Karbon bütçesi, alarm sayısı veya yüksek riskli binalar nedeniyle kampüs sağlığı zayıflıyor.",
      stateLabel: "Riskli",
      trendLabel: `Trend: ${trend.label}`
    };
  }
  return {
    score,
    state: "twin-critical",
    stage: "dry",
    emoji: "🥀",
    title: "Kampüs Ruhu Alarm Veriyor",
    message: "Emisyon baskısı kritik seviyede. Öncelikli aksiyon planı ve veri doğrulama acilen uygulanmalı.",
    stateLabel: "Kritik",
    trendLabel: `Trend: ${trend.label}`
  };
}

function renderCarbonTwin() {
  const twin = buildCarbonTwin();
  const panel = document.getElementById("carbon-twin");
  if (!panel) return;

  panel.className = `carbon-twin-panel map-twin-card ${twin.state}`;
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  setText("carbonTwinEmoji", twin.emoji);
  setText("carbonTwinTitle", twin.title);
  setText("carbonTwinMessage", twin.message);
  setText("carbonTwinScore", twin.score);
  setText("carbonTwinState", `Durum: ${twin.stateLabel}`);
  setText("carbonTwinTrend", twin.trendLabel);

  const meter = document.getElementById("carbonTwinMeter");
  if (meter) meter.style.width = `${twin.score}%`;

  const tree = document.getElementById("campusTree");
  if (tree) tree.className = `campus-tree ${twin.stage}`;

  updateLiveEnergyPulse();
}

function updateLiveEnergyPulse() {
  const target = document.getElementById("carbonTwinEnergy");
  if (!target) return;
  const records = getActiveRecords();
  const electricTotal = records
    .filter((item) => item.category === "Elektrik")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const base = electricTotal > 0 ? Math.max(80, electricTotal / 22) : 0;
  const wave = Math.sin(Date.now() / 2500) * 18;
  const simulated = Math.max(0, base + wave);
  target.textContent = simulated > 0
    ? `Enerji Nabzı: ${formatNumber(simulated, 0)} kWh/simülasyon`
    : "Enerji Nabzı: Veri bekleniyor";
}

function populateSelects() {
  const locationOptions = locations.map((loc) => `<option value="${loc.name}">${loc.name}</option>`).join("");
  const categoryOptions = Object.keys(factors).map((cat) => `<option value="${cat}">${cat}</option>`).join("");

  ["#locationInput", "#scenarioLocation"].forEach((id) => {
    $(id).innerHTML = locationOptions;
  });
  ["#categoryInput", "#scenarioCategory"].forEach((id) => {
    $(id).innerHTML = categoryOptions;
  });
  updateUnitInput();
}

function updateUnitInput() {
  const category = $("#categoryInput").value;
  $("#unitInput").value = factors[category]?.unit || "";
}

async function seedDemoData() {
  if (backendEnabled) {
    try {
      const result = await apiRequest("/seed", { method: "POST", body: JSON.stringify({}) });
      emissions = result.records || [];
      saveRecords();
      renderAll();
      showToast("Demo verileri backend veritabanına yazıldı. Dashboard güncellendi.");
      return;
    } catch (error) {
      backendEnabled = false;
      setBackendStatus(false, "Backend isteği başarısız oldu: localStorage moduna geçildi.");
      showToast("Backend yanıt vermedi, demo verisi tarayıcıya yazılıyor.");
    }
  }
  emissions = [
    createRecord("Mühendislik Fakültesi", "Elektrik", 12800, "Fatura", "Onaylandı", "2026-04-10", "EF-MUH-0426"),
    createRecord("Mühendislik Fakültesi", "Satın Alma", 120, "Manuel giriş", "İncelemede", "2026-04-12", "Laboratuvar sarf malzemesi"),
    createRecord("Eğitim Fakültesi", "Elektrik", 6400, "Sayaç verisi", "Onaylandı", "2026-04-11", "Sayaç-EGT-0426"),
    createRecord("Fen Edebiyat Fakültesi", "Elektrik", 7200, "Sayaç verisi", "Onaylandı", "2026-04-09", "Laboratuvar ve derslik tüketimi"),
    createRecord("Orman Fakültesi", "Elektrik", 4800, "Fatura", "Onaylandı", "2026-04-08", "OF-0426"),
    createRecord("Tıp Fakültesi", "Elektrik", 8400, "Fatura", "Onaylandı", "2026-04-07", "Morfoloji binası tüketimi"),
    createRecord("Düzce Üniversitesi Hastanesi", "Elektrik", 18500, "Sayaç verisi", "Onaylandı", "2026-04-07", "Hastane enerji kullanımı"),
    createRecord("Düzce Üniversitesi Hastanesi", "Yakıt", 620, "Fatura", "Onaylandı", "2026-04-07", "Jeneratör/ısıtma yakıtı demo"),
    createRecord("Eczacılık Fakültesi", "Elektrik", 4200, "Sayaç verisi", "Onaylandı", "2026-04-13", "Laboratuvar tüketimi"),
    createRecord("İlahiyat Fakültesi", "Elektrik", 2600, "Fatura", "Onaylandı", "2026-04-13", "Derslik tüketimi"),
    createRecord("İşletme Fakültesi", "Elektrik", 3100, "Fatura", "Onaylandı", "2026-04-12", "Derslik/ofis tüketimi"),
    createRecord("Sağlık Bilimleri Fakültesi", "Elektrik", 3900, "Sayaç verisi", "Onaylandı", "2026-04-14", "Uygulama alanları"),
    createRecord("Spor Bilimleri Fakültesi", "Elektrik", 2800, "Fatura", "Onaylandı", "2026-04-14", "Fakülte tüketimi"),
    createRecord("Ziraat Fakültesi", "Elektrik", 4500, "Sayaç verisi", "Onaylandı", "2026-04-12", "Uygulama/lab alanı"),
    createRecord("Lisansüstü Eğitim Enstitüsü", "Elektrik", 1500, "Fatura", "Onaylandı", "2026-04-10", "Enstitü tüketimi"),
    createRecord("Hakime Erciyas Yabancı Diller Yüksekokulu", "Elektrik", 2300, "Fatura", "Onaylandı", "2026-04-11", "Yüksekokul tüketimi"),
    createRecord("Ormancılık Meslek Yüksekokulu", "Elektrik", 1900, "Tahmini veri", "İncelemede", "2026-04-11", "MYO tahmini tüketim"),
    createRecord("Sağlık Hizmetleri Meslek Yüksekokulu", "Elektrik", 2400, "Sayaç verisi", "Onaylandı", "2026-04-15", "MYO tüketimi"),
    createRecord("Mehmet Akif Ersoy Eğitim ve Kültür Merkezi", "Elektrik", 7600, "Sayaç verisi", "Onaylandı", "2026-04-16", "Amfi/derslik tüketimi"),
    createRecord("Cumhuriyet Konferans Salonu", "Etkinlik", 620, "Manuel giriş", "Onaylandı", "2026-04-17", "Yapay Zekâ Zirvesi"),
    createRecord("Cumhuriyet Konferans Salonu", "Elektrik", 680, "Sayaç verisi", "Onaylandı", "2026-04-17", "Etkinlik salon elektrik"),
    createRecord("Kütüphane", "Elektrik", 3900, "Tahmini veri", "İncelemede", "2026-04-07", "Anomali için demo veri"),
    createRecord("Yemekhane", "Yemekhane", 1200, "Manuel giriş", "Onaylandı", "2026-04-08", "Nisan öğün sayısı"),
    createRecord("Yemekhane", "Elektrik", 2600, "Sayaç verisi", "Onaylandı", "2026-04-09", "Merkez mutfak elektrik"),
    createRecord("Kapalı Spor Salonu", "Elektrik", 2800, "Fatura", "Onaylandı", "2026-04-15", "Spor salonu tüketimi"),
    createRecord("Kapalı Yüzme Havuzu", "Elektrik", 5600, "Fatura", "Onaylandı", "2026-04-15", "Havuz tesis tüketimi"),
    createRecord("Kampüs Halı Saha", "Elektrik", 900, "Tahmini veri", "İncelemede", "2026-04-16", "Aydınlatma tahmini"),
    createRecord("Düzce Teknopark", "Elektrik", 3200, "Sayaç verisi", "Onaylandı", "2026-04-13", "AR-GE ofisleri"),
    createRecord("Otopark", "Ulaşım", 9200, "CSV yükleme", "Onaylandı", "2026-04-13", "Servis + araç km tahmini"),
    createRecord("Otopark", "Ulaşım", 2600, "Tahmini veri", "Taslak", "2026-04-20", "Taslak veri rapora dahil edilmez")
  ];
  saveRecords();
  renderAll();
  showToast("Demo verileri üretildi. Dashboard, harita ve alarmlar güncellendi.");
}

function createRecord(location, category, amount, source, status, date, description = "") {
  const factor = factors[category] || factors["Elektrik"];
  const numericAmount = Number(amount || 0);
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
    location,
    category,
    amount: numericAmount,
    unit: factor.unit,
    factor: factor.factor,
    scope: factor.scope,
    totalEmission: numericAmount * factor.factor,
    source,
    confidence: dataSourceScores[source] || 70,
    status,
    date,
    description
  };
}

function renderAll() {
  renderDashboard();
  renderCharts();
  renderRecordsTable();
  renderMap();
  renderMapSidebarStats();
  renderCarbonTwin();
  renderAlarms();
  renderActions();
  renderFactorTable();
}

function renderDashboard() {
  const records = getActiveRecords();
  const total = records.reduce((sum, item) => sum + Number(item.totalEmission || 0), 0);
  const topCategory = getTopEntry(sumBy(records, "category"));
  const topLocation = getTopEntry(sumBy(records, "location"));
  const confidence = getWeightedConfidence(records);
  const alarms = buildAlarms();
  const targetEmission = baseTargetEmission * (1 - targetReductionPercent / 100);
  const targetChange = total === 0 ? 0 : ((baseTargetEmission - total) / baseTargetEmission) * 100;
  const grade = getCampusGrade(total, confidence);

  $("#totalEmission").textContent = formatKg(total);
  $("#topCategory").textContent = topCategory[0];
  $("#topLocation").textContent = topLocation[0];
  $("#confidenceScore").textContent = `${formatNumber(confidence, 0)}%`;
  $("#activeAlarmCount").textContent = alarms.length;
  $("#targetStatus").textContent = total === 0 ? "-" : `${formatNumber(targetChange, 1)}% değişim`;
  $("#heroTotal").textContent = formatNumber(total, 0);
  $("#heroGrade").textContent = grade;
  $("#lastUpdateBadge").textContent = emissions.length ? `${emissions.length} kayıt yüklü` : "Henüz veri yok";

  if (total > targetEmission) {
    $("#targetStatus").title = `Hedef emisyon: ${formatKg(targetEmission)}`;
  }
}

function createOrUpdateChart(id, config) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  if (charts[id]) {
    charts[id].data = config.data;
    charts[id].options = config.options;
    charts[id].update();
  } else {
    charts[id] = new Chart(canvas, config);
  }
}

function chartColors(count) {
  const base = ["#0b6b4b", "#f08c00", "#2f9e44", "#1971c2", "#d9480f", "#7048e8", "#0c8599"];
  return Array.from({ length: count }, (_, index) => base[index % base.length]);
}

function renderCharts() {
  const records = getActiveRecords();
  const categoryData = sumBy(records, "category");
  const locationData = sumBy(records, "location");
  const scopeData = sumBy(records, "scope");
  const monthlyData = records.reduce((acc, item) => {
    const month = String(item.date || "").slice(0, 7) || "Belirsiz";
    acc[month] = (acc[month] || 0) + Number(item.totalEmission || 0);
    return acc;
  }, {});

  createOrUpdateChart("categoryChart", {
    type: "doughnut",
    data: {
      labels: Object.keys(categoryData),
      datasets: [{ data: Object.values(categoryData), backgroundColor: chartColors(Object.keys(categoryData).length), borderWidth: 0 }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }
  });

  createOrUpdateChart("locationChart", {
    type: "bar",
    data: {
      labels: Object.keys(locationData),
      datasets: [{ label: "kg CO₂e", data: Object.values(locationData), backgroundColor: chartColors(Object.keys(locationData).length) }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  });

  const sortedMonths = Object.keys(monthlyData).sort();
  createOrUpdateChart("monthlyChart", {
    type: "line",
    data: {
      labels: sortedMonths,
      datasets: [{ label: "kg CO₂e", data: sortedMonths.map((month) => monthlyData[month]), borderColor: "#0b6b4b", backgroundColor: "rgba(11,107,75,.14)", fill: true, tension: 0.38 }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  });

  createOrUpdateChart("scopeChart", {
    type: "pie",
    data: {
      labels: Object.keys(scopeData),
      datasets: [{ data: Object.values(scopeData), backgroundColor: chartColors(Object.keys(scopeData).length), borderWidth: 0 }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }
  });
}

function renderRecordsTable() {
  const table = $("#recordsTable");
  const recent = [...emissions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
  if (!recent.length) {
    table.innerHTML = `<tr><td colspan="5" class="muted">Henüz kayıt yok. Demo verisi üret veya yeni veri gir.</td></tr>`;
    return;
  }

  table.innerHTML = recent.map((item) => {
    const statusClass = item.status === "İncelemede" ? "pending" : item.status === "Reddedildi" ? "rejected" : "";
    return `
      <tr>
        <td>${item.location}<br><small class="muted">${item.date}</small></td>
        <td>${item.category}<br><span class="status-chip ${statusClass}">${item.status}</span></td>
        <td><strong>${formatKg(item.totalEmission)}</strong></td>
        <td>${item.confidence}%</td>
        <td><button class="row-btn" data-explain="${item.id}">Hesaplamayı Gör</button></td>
      </tr>
    `;
  }).join("");

  $$('[data-explain]').forEach((button) => {
    button.addEventListener("click", () => openExplanation(button.dataset.explain));
  });
}

// ─── Leaflet harita state ───────────────────────────────────
let leafletMap = null;
let leafletMarkers = {};

const riskColors = {
  low:    { bg: "#2f9e44", ring: "#b2f2bb", label: "Düşük Risk",  text: "#1a5c29" },
  medium: { bg: "#f08c00", ring: "#ffe8b8", label: "Orta Risk",   text: "#7c4800" },
  high:   { bg: "#d9480f", ring: "#ffd8c0", label: "Yüksek Risk", text: "#7a2406" }
};

function createMarkerIcon(risk, emoji) {
  const c = riskColors[risk] || riskColors.low;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="54" viewBox="0 0 44 54">
      <defs>
        <filter id="sh${risk}" x="-30%" y="-20%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="${c.bg}" flood-opacity="0.35"/>
        </filter>
      </defs>
      <path d="M22 2 C12 2 4 10 4 20 C4 32 22 52 22 52 C22 52 40 32 40 20 C40 10 32 2 22 2Z"
            fill="${c.bg}" filter="url(#sh${risk})" />
      <circle cx="22" cy="20" r="12" fill="white" opacity="0.92"/>
      <text x="22" y="25" text-anchor="middle" font-size="13">${emoji}</text>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: "cm-marker",
    iconSize: [44, 54],
    iconAnchor: [22, 54],
    popupAnchor: [0, -56]
  });
}

function buildPopupHtml(loc) {
  const total = getLocationTotal(loc.name);
  const risk = getRiskLevel(total, loc.budget);
  const c = riskColors[risk];
  const records = getActiveRecords().filter((r) => r.location === loc.name);
  const byCategory = sumBy(records, "category");
  const topCategory = getTopEntry(byCategory);
  const confidence = getWeightedConfidence(records);
  const grade = getLocationGrade(total, confidence, loc.budget);
  const budgetPct = loc.budget > 0 ? Math.min(150, Math.round((total / loc.budget) * 100)) : 0;
  const barColor = risk === "high" ? "#d9480f" : risk === "medium" ? "#f08c00" : "#2f9e44";

  const categoryRows = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([cat, val]) => `
      <div class="cm-popup-cat-row">
        <span class="cm-popup-cat-name">${cat}</span>
        <span class="cm-popup-cat-val">${formatKg(val)}</span>
      </div>`).join("") || `<p class="cm-popup-empty">Kayıt yok</p>`;

  return `
    <div class="cm-popup">
      <div class="cm-popup-header" style="background:${c.bg}">
        <span class="cm-popup-icon">${loc.icon}</span>
        <div>
          <h4 class="cm-popup-title">${loc.name}</h4>
          <span class="cm-popup-type">${loc.type} · ${loc.floor} · ${loc.area}</span>
        </div>
        <span class="cm-popup-grade">${grade}</span>
      </div>
      <div class="cm-popup-body">
        <div class="cm-popup-kpi-row">
          <div class="cm-popup-kpi">
            <span class="cm-popup-kpi-label">Toplam Emisyon</span>
            <strong class="cm-popup-kpi-val">${formatKg(total)}</strong>
          </div>
          <div class="cm-popup-kpi">
            <span class="cm-popup-kpi-label">Bütçe</span>
            <strong class="cm-popup-kpi-val">${formatKg(loc.budget)}</strong>
          </div>
          <div class="cm-popup-kpi">
            <span class="cm-popup-kpi-label">Veri Güveni</span>
            <strong class="cm-popup-kpi-val">${formatNumber(confidence, 0)}%</strong>
          </div>
        </div>
        <div class="cm-popup-budget-label">
          <span>Bütçe Kullanımı</span>
          <span style="color:${barColor};font-weight:800">${budgetPct}%</span>
        </div>
        <div class="cm-popup-bar-bg">
          <div class="cm-popup-bar-fill" style="width:${Math.min(100, budgetPct)}%;background:${barColor}"></div>
        </div>
        <div class="cm-popup-risk-pill" style="background:${c.ring};color:${c.text}">
          <span class="cm-popup-risk-dot" style="background:${c.bg}"></span>
          ${c.label}${budgetPct > 100 ? ` · Bütçe %${budgetPct - 100} aşıldı` : ""}
        </div>
        <div class="cm-popup-section-title">Kategori Dağılımı</div>
        <div class="cm-popup-cats">${categoryRows}</div>
        <div class="cm-popup-suggestion">${getLocationSuggestion(loc.name, topCategory[0])}</div>
      </div>
    </div>`;
}

function renderMap() {
  if (typeof L === "undefined") {
    document.getElementById("campusMap").innerHTML =
      `<div class="cm-map-fallback">Harita yüklenemedi. İnternet bağlantısını kontrol edin.</div>`;
    return;
  }

  if (!leafletMap) {
    const centerLat = locations.reduce((s, l) => s + l.lat, 0) / locations.length;
    const centerLng = locations.reduce((s, l) => s + l.lng, 0) / locations.length;

    leafletMap = L.map("campusMap", {
      center: [centerLat, centerLng],
      zoom: 16,
      zoomControl: true,
      scrollWheelZoom: true
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(leafletMap);

    const lats = locations.map((l) => l.lat);
    const lngs = locations.map((l) => l.lng);
    L.rectangle(
      [[Math.min(...lats) - 0.001, Math.min(...lngs) - 0.001],
       [Math.max(...lats) + 0.001, Math.max(...lngs) + 0.001]],
      { color: "#0b6b4b", weight: 2, opacity: 0.4, fillColor: "#0b6b4b", fillOpacity: 0.04, dashArray: "6 4" }
    ).addTo(leafletMap);

    // Leaflet bazen sayfa ilk açıldığında container genişliğini geç hesaplayabiliyor.
    // Bu çağrı gri/kaymış harita görünümünü düzeltir.
    setTimeout(() => leafletMap.invalidateSize(), 150);
  }

  Object.values(leafletMarkers).forEach((m) => m.remove());
  leafletMarkers = {};

  locations.forEach((loc) => {
    const total = getLocationTotal(loc.name);
    const risk = getRiskLevel(total, loc.budget);
    const icon = createMarkerIcon(risk, loc.icon);

    const marker = L.marker([loc.lat, loc.lng], { icon })
      .addTo(leafletMap)
      .bindPopup(buildPopupHtml(loc), {
        maxWidth: 360, minWidth: 320,
        className: "cm-leaflet-popup",
        closeButton: true, autoPan: true, autoPanPadding: [40, 40]
      });

    marker.on("popupopen",  () => marker.getElement()?.classList.add("cm-marker-active"));
    marker.on("popupclose", () => marker.getElement()?.classList.remove("cm-marker-active"));
    leafletMarkers[loc.name] = marker;
  });

  renderMapLegend();
  setTimeout(() => leafletMap?.invalidateSize(), 150);
}

function renderMapLegend() {
  const legendEl = document.getElementById("mapLegendList");
  if (!legendEl) return;
  legendEl.innerHTML = locations.map((loc) => {
    const total = getLocationTotal(loc.name);
    const risk = getRiskLevel(total, loc.budget);
    const c = riskColors[risk];
    const budgetPct = loc.budget > 0 ? Math.round((total / loc.budget) * 100) : 0;
    return `
      <button class="cm-legend-item" onclick="focusLocation('${loc.name}')">
        <span class="cm-legend-dot" style="background:${c.bg}"></span>
        <span class="cm-legend-icon">${loc.icon}</span>
        <div class="cm-legend-text">
          <strong>${loc.name}</strong>
          <span>${formatKg(total)}</span>
        </div>
        <span class="cm-legend-pct" style="color:${c.text};background:${c.ring}">${budgetPct}%</span>
      </button>`;
  }).join("");
}

function focusLocation(locationName) {
  const loc = locations.find((l) => l.name === locationName);
  const marker = leafletMarkers[locationName];
  if (!loc || !marker || !leafletMap) return;
  leafletMap.flyTo([loc.lat, loc.lng], 18, { animate: true, duration: 0.8 });
  setTimeout(() => marker.openPopup(), 850);
}

function renderMapSidebarStats() {
  const records = getActiveRecords();
  const total = records.reduce((sum, r) => sum + Number(r.totalEmission || 0), 0);
  const confidence = getWeightedConfidence(records);
  const alarms = buildAlarms();
  const riskLevels = locations.map((loc) => ({ risk: getRiskLevel(getLocationTotal(loc.name), loc.budget) }));
  const highCount = riskLevels.filter((l) => l.risk === "high").length;
  const highestRiskText = highCount > 0 ? `${highCount} Kritik`
    : riskLevels.filter((l) => l.risk === "medium").length > 0 ? "Orta" : "Düşük";

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set("mapTotalEmission", total > 0 ? formatKg(total) : "—");
  set("mapAlarmCount", alarms.length || "0");
  set("mapHighestRisk", records.length ? highestRiskText : "—");
  set("mapAvgConfidence", records.length ? `%${formatNumber(confidence, 0)}` : "—");
}

function fitMapToCampus() {
  if (!leafletMap || !locations.length) return;
  leafletMap.flyToBounds(locations.map((l) => [l.lat, l.lng]), { padding: [50, 50], animate: true, duration: 0.8 });
}


function getLocationGrade(total, confidence, budget) {
  let score = 100;
  if (total > budget * 1.2) score -= 40;
  else if (total > budget) score -= 25;
  else if (total > budget * 0.7) score -= 12;
  if (confidence < 70) score -= 12;
  else if (confidence < 82) score -= 6;
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  return "D";
}

function getLocationSuggestion(locationName, categoryName) {
  if (categoryName === "Elektrik") return `${locationName} için LED dönüşümü, hareket sensörleri ve mesai dışı cihaz kapatma politikası önerilir.`;
  if (categoryName === "Ulaşım") return `${locationName} için servis optimizasyonu, toplu taşıma teşviki ve bisiklet park alanları önerilir.`;
  if (categoryName === "Yemekhane") return `${locationName} için gıda israfı takibi ve bitki bazlı menü günü önerilir.`;
  if (categoryName === "Etkinlik") return `${locationName} etkinliklerinde dijital katılım, QR broşür ve düşük atık politikası önerilir.`;
  if (categoryName === "Satın Alma") return `${locationName} için düşük karbonlu ve yerel tedarik seçenekleri değerlendirilebilir.`;
  return `${locationName} için ilgili kategoriye özel azaltım aksiyonu planlanmalıdır.`;
}

function openExplanation(id) {
  const item = emissions.find((record) => record.id === id);
  if (!item) return;
  $("#modalContent").innerHTML = `
    <p class="eyebrow">Hesaplama açıklanabilirliği</p>
    <h2>Bu sonuç nasıl hesaplandı?</h2>
    <div class="calc-box">
      <p><strong>Lokasyon:</strong> ${item.location}</p>
      <p><strong>Kategori:</strong> ${item.category}</p>
      <p><strong>Veri kaynağı:</strong> ${item.source} / güven skoru: ${item.confidence}%</p>
      <p><strong>Scope:</strong> ${item.scope}</p>
      <code>${formatNumber(item.amount, 2)} ${item.unit} × ${item.factor} = ${formatKg(item.totalEmission)}</code>
    </div>
    <p class="muted">Bu panel jüriye hesaplamanın kara kutu olmadığını gösterir. Gerçek kullanımda faktör kaynakları resmi veri setleriyle güncellenebilir.</p>
  `;
  $("#modalBackdrop").classList.add("show");
}

function closeModal() {
  $("#modalBackdrop").classList.remove("show");
}

function buildAlarms() {
  const records = getActiveRecords();
  const alarms = [];

  locations.forEach((loc) => {
    const total = getLocationTotal(loc.name);
    if (total > loc.budget) {
      alarms.push({
        severity: total > loc.budget * 1.25 ? "high" : "medium",
        title: "Karbon bütçesi aşıldı",
        message: `${loc.name} için aylık karbon bütçesi ${formatKg(loc.budget)}, gerçekleşen değer ${formatKg(total)}. Aşım oranı %${formatNumber(((total - loc.budget) / loc.budget) * 100, 1)}.`
      });
    }
  });

  const grouped = {};
  records.forEach((item) => {
    const key = `${item.location}__${item.category}`;
    grouped[key] = grouped[key] || [];
    grouped[key].push(item);
  });

  Object.values(grouped).forEach((items) => {
    if (items.length < 3) return;
    const sorted = items.sort((a, b) => new Date(a.date) - new Date(b.date));
    const latest = sorted[sorted.length - 1];
    const previous = sorted.slice(0, -1);
    const avg = previous.reduce((sum, item) => sum + Number(item.amount || 0), 0) / previous.length;
    if (avg > 0 && latest.amount > avg * 1.5) {
      alarms.push({
        severity: "high",
        title: "Anomali tespit edildi",
        message: `${latest.location} / ${latest.category} verisi önceki ortalamanın %${formatNumber(((latest.amount - avg) / avg) * 100, 1)} üzerinde. Veri kaynağı kontrol edilmeli.`
      });
    }
  });

  const lowConfidenceCount = records.filter((item) => item.confidence < 70).length;
  if (lowConfidenceCount) {
    alarms.push({
      severity: "medium",
      title: "Düşük güvenli kayıt var",
      message: `${lowConfidenceCount} kayıt tahmini veya düşük güvenli veriyle girilmiş. Rapor öncesi belge/sayaç doğrulaması önerilir.`
    });
  }

  return alarms;
}

function renderAlarms() {
  const alarms = buildAlarms();
  const container = $("#alarmsList");
  if (!alarms.length) {
    container.innerHTML = `<div class="empty-state">Aktif alarm yok. Demo verisi üretince bütçe aşımı ve anomali örneklerini görebilirsiniz.</div>`;
    return;
  }
  container.innerHTML = alarms.map((alarm) => `
    <article class="alarm-card ${alarm.severity}">
      <span class="mini-label">${alarm.severity === "high" ? "Yüksek öncelik" : "Orta öncelik"}</span>
      <h4>${alarm.title}</h4>
      <p>${alarm.message}</p>
    </article>
  `).join("");
}

function buildActions() {
  const records = getActiveRecords();
  const locCategoryTotals = {};
  records.forEach((item) => {
    const key = `${item.location}__${item.category}`;
    locCategoryTotals[key] = (locCategoryTotals[key] || 0) + Number(item.totalEmission || 0);
  });

  const suggestionsByCategory = {
    "Elektrik": { title: "LED dönüşümü ve cihaz kapatma politikası", difficulty: 65, saving: 80, owner: "Yapı İşleri / Bilgi İşlem" },
    "Ulaşım": { title: "Servis optimizasyonu ve bisiklet teşviki", difficulty: 72, saving: 58, owner: "İdari İşler" },
    "Yemekhane": { title: "Gıda israfı takibi ve bitki bazlı menü", difficulty: 62, saving: 70, owner: "SKS / Yemekhane" },
    "Etkinlik": { title: "QR broşür ve düşük atık etkinlik standardı", difficulty: 82, saving: 46, owner: "Kültür / Kulüpler" },
    "Satın Alma": { title: "Düşük karbonlu tedarik politikası", difficulty: 55, saving: 65, owner: "Satın Alma" },
    "Yakıt": { title: "Araç kullanım planı ve yakıt takibi", difficulty: 68, saving: 74, owner: "İdari İşler" }
  };

  return Object.entries(locCategoryTotals)
    .map(([key, emission]) => {
      const [location, category] = key.split("__");
      const suggestion = suggestionsByCategory[category] || suggestionsByCategory["Elektrik"];
      const emissionImpact = Math.min(100, (emission / 6500) * 100);
      const priority = Math.round(emissionImpact * 0.5 + suggestion.difficulty * 0.2 + suggestion.saving * 0.3);
      return {
        location,
        category,
        emission,
        priority,
        title: suggestion.title,
        owner: suggestion.owner,
        estimatedReduction: emission * 0.15
      };
    })
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 6);
}

function renderActions() {
  const actions = buildActions();
  const container = $("#actionList");
  if (!actions.length) {
    container.innerHTML = `<div class="empty-state">Aksiyon planı oluşturmak için önce veri girin veya demo verisi üretin.</div>`;
    return;
  }

  container.innerHTML = actions.map((action, index) => `
    <article class="action-card">
      <span class="mini-label">Öncelik #${index + 1}</span>
      <h4>${action.title}</h4>
      <p><strong>${action.location}</strong> / ${action.category}</p>
      <p>Sorumlu birim: ${action.owner}</p>
      <p>Tahmini azaltım: ${formatKg(action.estimatedReduction)}</p>
      <div class="score-line"><span style="width: ${action.priority}%"></span></div>
      <p>Öncelik puanı: <strong>${action.priority}/100</strong></p>
    </article>
  `).join("");
}

function renderFactorTable() {
  $("#factorTable").innerHTML = Object.entries(factors).map(([category, item]) => `
    <tr>
      <td><strong>${category}</strong></td>
      <td>${item.unit}</td>
      <td>${item.factor} kg CO₂e/${item.unit}</td>
      <td>${item.scope}</td>
      <td>${item.description}</td>
    </tr>
  `).join("");
}

async function handleFormSubmit(event) {
  event.preventDefault();
  const category = $("#categoryInput").value;
  const payload = {
    location: $("#locationInput").value,
    category,
    amount: Number($("#amountInput").value),
    source: $("#sourceInput").value,
    status: $("#statusInput").value,
    date: $("#dateInput").value,
    description: $("#descriptionInput").value
  };

  if (backendEnabled) {
    try {
      await apiRequest("/records", { method: "POST", body: JSON.stringify(payload) });
      await syncFromBackend();
      event.target.reset();
      $("#dateInput").valueAsDate = new Date();
      $("#categoryInput").value = category;
      updateUnitInput();
      showToast("Kayıt backend veritabanına kaydedildi ve karbon emisyonu hesaplandı.");
      return;
    } catch (error) {
      backendEnabled = false;
      setBackendStatus(false, "Backend isteği başarısız oldu: localStorage moduna geçildi.");
      showToast("Backend yanıt vermedi, kayıt localStorage modunda saklandı.");
    }
  }

  const record = createRecord(
    payload.location,
    payload.category,
    payload.amount,
    payload.source,
    payload.status,
    payload.date,
    payload.description
  );
  emissions.push(record);
  saveRecords();
  renderAll();
  event.target.reset();
  $("#dateInput").valueAsDate = new Date();
  $("#categoryInput").value = category;
  updateUnitInput();
  showToast("Kayıt eklendi ve karbon emisyonu hesaplandı.");
}

function handleScenario(event) {
  event.preventDefault();
  const locationName = $("#scenarioLocation").value;
  const categoryName = $("#scenarioCategory").value;
  const reduction = Number($("#reductionInput").value || 0) / 100;
  const price = Number($("#priceInput").value || 0);
  const currentEmission = getLocationCategoryTotal(locationName, categoryName);
  const factor = factors[categoryName];
  const reductionEmission = currentEmission * reduction;
  const newEmission = currentEmission - reductionEmission;
  const reducedActivity = factor.factor > 0 ? reductionEmission / factor.factor : 0;
  const costSaving = categoryName === "Elektrik" ? reducedActivity * price : 0;

  $("#scenarioResult").innerHTML = `
    <span class="mini-label">Senaryo sonucu</span>
    <h4>${locationName} / ${categoryName}</h4>
    <div class="detail-stat"><span>Mevcut emisyon</span><strong>${formatKg(currentEmission)}</strong></div>
    <div class="detail-stat"><span>Azaltım oranı</span><strong>%${formatNumber(reduction * 100, 0)}</strong></div>
    <div class="detail-stat"><span>Tahmini karbon azaltımı</span><strong>${formatKg(reductionEmission)}</strong></div>
    <div class="detail-stat"><span>Yeni emisyon</span><strong>${formatKg(newEmission)}</strong></div>
    <div class="detail-stat"><span>Azaltılacak aktivite</span><strong>${formatNumber(reducedActivity, 1)} ${factor.unit}</strong></div>
    ${categoryName === "Elektrik" ? `<div class="detail-stat"><span>Tahmini maliyet tasarrufu</span><strong>${formatNumber(costSaving, 0)} TL</strong></div>` : ""}
    <p>${getLocationSuggestion(locationName, categoryName)}</p>
  `;
}

function handleCsvUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (typeof Papa === "undefined") {
    showToast("PapaParse kütüphanesi yüklenemedi. İnternet bağlantısını kontrol edin.");
    return;
  }

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (result) => {
      parsedCsvRows = result.data;
      csvHeaders = result.meta.fields || [];
      renderMappingArea();
      showToast(`${parsedCsvRows.length} CSV satırı okundu. Kolonları eşleştirin.`);
    },
    error: () => showToast("CSV okunamadı.")
  });
}

function guessField(header) {
  const clean = slugify(header);
  if (["bina", "lokasyon", "location", "yer", "kampus"].some((item) => clean.includes(item))) return "location";
  if (["tur", "kategori", "category", "kaynak"].some((item) => clean.includes(item))) return "category";
  if (["tuketim", "miktar", "amount", "deger", "adet"].some((item) => clean.includes(item))) return "amount";
  if (["tarih", "date", "donem"].some((item) => clean.includes(item))) return "date";
  if (["verikaynagi", "kaynak", "source"].some((item) => clean.includes(item))) return "source";
  return "ignore";
}

function renderMappingArea() {
  const targetFields = [
    ["ignore", "Yok say"],
    ["location", "Lokasyon"],
    ["category", "Kategori"],
    ["amount", "Miktar"],
    ["date", "Tarih"],
    ["source", "Veri Kaynağı"]
  ];

  $("#mappingArea").innerHTML = csvHeaders.map((header) => {
    const guessed = guessField(header);
    const options = targetFields.map(([value, label]) => `<option value="${value}" ${value === guessed ? "selected" : ""}>${label}</option>`).join("");
    return `
      <div class="mapping-row">
        <strong>${header}</strong>
        <select data-csv-map="${header}">${options}</select>
      </div>
    `;
  }).join("");
  $("#importCsvBtn").disabled = !parsedCsvRows.length;
}

async function importCsvRows() {
  if (!parsedCsvRows.length) return;
  const mapping = {};
  $$('[data-csv-map]').forEach((select) => {
    if (select.value !== "ignore") mapping[select.value] = select.dataset.csvMap;
  });

  if (!mapping.location || !mapping.category || !mapping.amount) {
    showToast("Lokasyon, kategori ve miktar kolonlarını eşleştirmeniz gerekiyor.");
    return;
  }

  const preparedRecords = [];
  parsedCsvRows.forEach((row) => {
    const location = normalizeLocation(row[mapping.location]);
    const category = normalizeCategory(row[mapping.category]);
    const amount = Number(String(row[mapping.amount] || "0").replace(",", "."));
    const sourceRaw = mapping.source ? row[mapping.source] : "CSV yükleme";
    const source = dataSourceScores[sourceRaw] ? sourceRaw : "CSV yükleme";
    const date = mapping.date && row[mapping.date] ? row[mapping.date] : new Date().toISOString().slice(0, 10);
    if (!Number.isFinite(amount) || amount <= 0) return;
    preparedRecords.push({ location, category, amount, source, status: "İncelemede", date, description: "CSV içe aktarma" });
  });

  if (backendEnabled) {
    try {
      const result = await apiRequest("/records/bulk", {
        method: "POST",
        body: JSON.stringify({ records: preparedRecords })
      });
      emissions = await apiRequest("/records");
      saveRecords();
      renderAll();
      parsedCsvRows = [];
      csvHeaders = [];
      $("#mappingArea").innerHTML = "";
      $("#csvFile").value = "";
      $("#importCsvBtn").disabled = true;
      showToast(`${result.inserted} CSV kaydı backend veritabanına aktarıldı.`);
      return;
    } catch (error) {
      backendEnabled = false;
      setBackendStatus(false, "Backend isteği başarısız oldu: localStorage moduna geçildi.");
      showToast("Backend yanıt vermedi, CSV kayıtları tarayıcıya yazılıyor.");
    }
  }

  let imported = 0;
  preparedRecords.forEach((item) => {
    emissions.push(createRecord(item.location, item.category, item.amount, item.source, item.status, item.date, item.description));
    imported += 1;
  });

  saveRecords();
  renderAll();
  parsedCsvRows = [];
  csvHeaders = [];
  $("#mappingArea").innerHTML = "";
  $("#csvFile").value = "";
  $("#importCsvBtn").disabled = true;
  showToast(`${imported} CSV kaydı içeri aktarıldı.`);
}

function generatePdfReport() {
  if (typeof window.jspdf === "undefined") {
    showToast("jsPDF kütüphanesi yüklenemedi. İnternet bağlantısını kontrol edin.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const records = getActiveRecords();
  const total = records.reduce((sum, item) => sum + Number(item.totalEmission || 0), 0);
  const categoryData = sumBy(records, "category");
  const locationData = sumBy(records, "location");
  const scopeData = sumBy(records, "scope");
  const confidence = getWeightedConfidence(records);
  const actions = buildActions().slice(0, 4);
  const alarms = buildAlarms().slice(0, 4);

  let y = 16;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("CarbonMap Campus - Aylik Karbon Envanteri", 14, y);
  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Rapor tarihi: ${new Date().toLocaleDateString("tr-TR")}`, 14, y);
  y += 7;
  doc.text(`Toplam emisyon: ${formatKg(total)}`, 14, y);
  y += 7;
  doc.text(`Veri guven skoru: %${formatNumber(confidence, 0)}`, 14, y);
  y += 10;

  doc.setFont("helvetica", "bold");
  doc.text("Yonetici Ozeti", 14, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  const summary = `Bu rapor kampus genelindeki elektrik, ulasim, yemekhane, etkinlik, satin alma ve yakit kayitlarina gore olusturulmustur. Sistem karbon hesaplama, veri guveni, alarm ve aksiyon onceliklendirme yaklasimi sunar.`;
  doc.text(doc.splitTextToSize(summary, 180), 14, y);
  y += 18;

  function writeSection(title, data) {
    if (y > 250) {
      doc.addPage();
      y = 16;
    }
    doc.setFont("helvetica", "bold");
    doc.text(title, 14, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    if (!Object.keys(data).length) {
      doc.text("Veri yok", 18, y);
      y += 7;
      return;
    }
    Object.entries(data).sort((a, b) => b[1] - a[1]).forEach(([key, value]) => {
      doc.text(`- ${key}: ${formatKg(value)}`, 18, y);
      y += 6;
    });
    y += 4;
  }

  writeSection("Kategori Bazli Dagilim", categoryData);
  writeSection("Lokasyon Bazli Dagilim", locationData);
  writeSection("Scope Dagilimi", scopeData);

  doc.setFont("helvetica", "bold");
  doc.text("Aktif Alarmlar", 14, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  if (!alarms.length) {
    doc.text("Aktif alarm yok.", 18, y);
    y += 7;
  } else {
    alarms.forEach((alarm) => {
      doc.text(doc.splitTextToSize(`- ${alarm.title}: ${alarm.message}`, 180), 18, y);
      y += 12;
    });
  }

  if (y > 235) {
    doc.addPage();
    y = 16;
  }
  doc.setFont("helvetica", "bold");
  doc.text("Oncelikli Aksiyon Plani", 14, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  actions.forEach((action, index) => {
    doc.text(`${index + 1}. ${action.location} / ${action.category}`, 18, y);
    y += 6;
    doc.text(doc.splitTextToSize(`${action.title} - Oncelik puani: ${action.priority}/100 - Tahmini azaltim: ${formatKg(action.estimatedReduction)}`, 172), 22, y);
    y += 12;
  });

  doc.save("CarbonMap-Campus-Rapor.pdf");
  showToast("PDF rapor oluşturuldu.");
}

async function resetData() {
  const ok = confirm("Tüm demo verileri silinsin mi?");
  if (!ok) return;

  if (backendEnabled) {
    try {
      await apiRequest("/records", { method: "DELETE" });
      emissions = [];
      saveRecords();
      renderAll();
      showToast("Backend veritabanındaki kayıtlar sıfırlandı.");
      return;
    } catch (error) {
      backendEnabled = false;
      setBackendStatus(false, "Backend isteği başarısız oldu: localStorage moduna geçildi.");
      showToast("Backend yanıt vermedi, localStorage sıfırlanıyor.");
    }
  }

  emissions = [];
  saveRecords();
  renderAll();
  showToast("Veriler sıfırlandı.");
}

function setupNavObserver() {
  const links = [...$$('.nav-link')];
  const sections = links.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-25% 0px -65% 0px' });
  sections.forEach((section) => observer.observe(section));
}

function init() {
  populateSelects();
  loadRecords();
  renderAll();
  setupNavObserver();
  setBackendStatus(false, "Backend kontrol ediliyor...");
  connectBackend();
  $("#dateInput").valueAsDate = new Date();
  $("#categoryInput").addEventListener("change", updateUnitInput);
  $("#emissionForm").addEventListener("submit", handleFormSubmit);
  $("#scenarioForm").addEventListener("submit", handleScenario);
  $("#seedDemoBtn").addEventListener("click", seedDemoData);
  $("#resetBtn").addEventListener("click", resetData);
  $("#pdfBtn").addEventListener("click", generatePdfReport);
  $("#modalClose").addEventListener("click", closeModal);
  $("#modalBackdrop").addEventListener("click", (event) => {
    if (event.target.id === "modalBackdrop") closeModal();
  });
  $("#csvFile").addEventListener("change", handleCsvUpload);
  $("#importCsvBtn").addEventListener("click", importCsvRows);
  document.getElementById("mapFitBtn")?.addEventListener("click", fitMapToCampus);
  window.setInterval(updateLiveEnergyPulse, 4000);
}

document.addEventListener("DOMContentLoaded", init);

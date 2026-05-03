const factors = {
  "Elektrik": {
    unit: "kWh",
    factor: 0.434,
    scope: "Scope 2",
    source: "T.C. Enerji ve Tabii Kaynaklar Bakanlığı",
    sourceYear: "2023/2025",
    sourceType: "Resmi Türkiye kaynağı",
    confidence: "Yüksek",
    description: "Türkiye elektrik üretimi/tüketimi emisyon faktörü. 0,434 tCO₂e/MWh = 0,434 kg CO₂e/kWh."
  },
  "Ulaşım": {
    unit: "km",
    factor: 0.18,
    scope: "Scope 3",
    source: "UK GOV / EPA ulaşım faktörleri",
    sourceYear: "2025",
    sourceType: "Uluslararası dönüşüm faktörleri + demo ortalama",
    confidence: "Orta",
    description: "Araç türü ayrıştırılmadan kullanılan ortalama demo katsayısı. Gerçek kullanımda araç türüne göre güncellenmelidir."
  },
  "Yemekhane": {
    unit: "öğün",
    factor: 2.5,
    scope: "Scope 3",
    source: "ADEME/Agribalyse + akademik literatür",
    sourceYear: "2026 demo",
    sourceType: "Ortalama öğün varsayımı",
    confidence: "Orta",
    description: "Ortalama öğün demo faktörü. Gerçek kullanımda menü türüne ve gıda atığına göre ayrı faktör tanımlanmalıdır."
  },
  "Etkinlik": {
    unit: "kişi",
    factor: 1.2,
    scope: "Scope 3",
    source: "GHG Protocol yaklaşımı + demo varsayım",
    sourceYear: "2026 demo",
    sourceType: "Kişi başı demo katsayısı",
    confidence: "Düşük/Orta",
    description: "Etkinlik emisyonu kişi başı basitleştirilmiştir. Gerçek kullanımda ulaşım, ikram, atık ve elektrik ayrı hesaplanmalıdır."
  },
  "Satın Alma": {
    unit: "adet",
    factor: 5,
    scope: "Scope 3",
    source: "GHG Protocol Scope 3 / ADEME / tedarikçi verisi",
    sourceYear: "2026 demo",
    sourceType: "Ürün/adet demo katsayısı",
    confidence: "Düşük",
    description: "Genel demo katsayısı. Gerçek kullanımda kağıt, elektronik, temizlik ve sarf malzeme gibi ürün türlerine ayrılmalıdır."
  },
  "Yakıt": {
    unit: "L",
    factor: 2.68,
    scope: "Scope 1",
    source: "IPCC / GHG Protocol / EPA yakıt faktörleri",
    sourceYear: "2025 demo",
    sourceType: "Yakıt türüne göre güncellenebilir katsayı",
    confidence: "Orta/Yüksek",
    description: "Litre başı demo yakıt katsayısı. Gerçek kullanımda dizel, benzin veya doğalgaz türüne göre ayrı faktör girilmelidir."
  }
};

const dataSourceScores = {
  "Fatura": 95,
  "Sayaç verisi": 90,
  "CSV yükleme": 85,
  "Manuel giriş": 70,
  "Tahmini veri": 50
};

const categoryCostAssumptions = {
  "Elektrik": { unitCost: 5, unitLabel: "TL/kWh", activityLabel: "kWh", note: "elektrik faturası" },
  "Ulaşım": { unitCost: 4, unitLabel: "TL/km", activityLabel: "km", note: "ulaşım/servis maliyeti" },
  "Yemekhane": { unitCost: 35, unitLabel: "TL/öğün", activityLabel: "öğün", note: "öğün ve israf maliyeti" },
  "Etkinlik": { unitCost: 10, unitLabel: "TL/kişi", activityLabel: "kişi", note: "etkinlik operasyon maliyeti" },
  "Satın Alma": { unitCost: 50, unitLabel: "TL/adet", activityLabel: "adet", note: "satın alma maliyeti" },
  "Yakıt": { unitCost: 45, unitLabel: "TL/L", activityLabel: "L", note: "yakıt maliyeti" }
};

const scenarioTemplates = [
  {
    "id": "elec_led",
    "title": "LED aydınlatmaya geçiş",
    "category": "Elektrik",
    "defaultReduction": 12,
    "difficulty": "Orta",
    "cost": "Orta",
    "duration": "1-3 ay",
    "tag": "Yüksek Etki",
    "owner": "Yapı İşleri / İdari Mali İşler",
    "approval": "Yönetim onayı önerilir",
    "description": "Bina aydınlatmalarının LED sistemlerle değiştirilmesi."
  },
  {
    "id": "elec_device_shutdown",
    "title": "Mesai dışı cihaz kapatma politikası",
    "category": "Elektrik",
    "defaultReduction": 8,
    "difficulty": "Kolay",
    "cost": "Düşük",
    "duration": "Hemen / 1 ay",
    "tag": "Hızlı Kazanım",
    "owner": "Bilgi İşlem / Birim Sorumluları",
    "approval": "Birim içi uygulama ile başlatılabilir",
    "description": "Bilgisayar, yazıcı, projeksiyon ve aydınlatmaların mesai dışında kapatılması."
  },
  {
    "id": "elec_motion_sensor",
    "title": "Hareket sensörlü aydınlatma",
    "category": "Elektrik",
    "defaultReduction": 10,
    "difficulty": "Orta",
    "cost": "Orta",
    "duration": "1-3 ay",
    "tag": "Yüksek Etki",
    "owner": "Yapı İşleri",
    "approval": "Yönetim onayı önerilir",
    "description": "Koridor, sınıf ve ortak alanlarda gereksiz aydınlatmayı azaltmak için sensörlü sistem kurulması."
  },
  {
    "id": "elec_hvac_hours",
    "title": "Klima ve ısıtma saatlerini düzenleme",
    "category": "Elektrik",
    "defaultReduction": 9,
    "difficulty": "Kolay",
    "cost": "Düşük",
    "duration": "1 ay",
    "tag": "Hızlı Kazanım",
    "owner": "İdari İşler / Teknik Birim",
    "approval": "Birim kararıyla başlatılabilir",
    "description": "Klima, ısıtma ve soğutma sistemlerinin mesai saatlerine göre planlanması."
  },
  {
    "id": "elec_building_metering",
    "title": "Bina bazlı enerji izleme",
    "category": "Elektrik",
    "defaultReduction": 6,
    "difficulty": "Orta",
    "cost": "Orta",
    "duration": "1-2 ay",
    "tag": "Kontrol ve İzleme",
    "owner": "Teknik Birim / Yapı İşleri",
    "approval": "Yönetim değerlendirmesi önerilir",
    "description": "Bina bazında tüketim takibi yapılarak yüksek tüketim noktalarının belirlenmesi."
  },
  {
    "id": "elec_checklist",
    "title": "Sınıf ve ofislerde cihaz kontrol listesi",
    "category": "Elektrik",
    "defaultReduction": 5,
    "difficulty": "Kolay",
    "cost": "Düşük",
    "duration": "Hemen",
    "tag": "Hızlı Kazanım",
    "owner": "Birim Sorumluları",
    "approval": "Birim içi uygulama yeterli olabilir",
    "description": "Gün sonunda cihaz, ışık ve iklimlendirme kontrol listesi uygulanması."
  },
  {
    "id": "elec_low_load_mode",
    "title": "Yoğun olmayan saatlerde enerji tasarruf modu",
    "category": "Elektrik",
    "defaultReduction": 7,
    "difficulty": "Kolay",
    "cost": "Düşük",
    "duration": "Hemen / 1 ay",
    "tag": "Düşük Maliyet",
    "owner": "Bilgi İşlem / Teknik Birim",
    "approval": "Birim koordinasyonu ile başlatılabilir",
    "description": "Az kullanılan saatlerde bilgisayar, ekran ve ortak cihazlarda tasarruf modunun etkinleştirilmesi."
  },
  {
    "id": "elec_renewable_pilot",
    "title": "Yenilenebilir enerji pilot uygulaması",
    "category": "Elektrik",
    "defaultReduction": 18,
    "difficulty": "Zor",
    "cost": "Yüksek",
    "duration": "6-12 ay",
    "tag": "Uzun Vadeli Yatırım",
    "owner": "Yönetim / Yapı İşleri",
    "approval": "Yönetim ve bütçe onayı gerekir",
    "description": "Kampüs içinde küçük ölçekli yenilenebilir enerji pilot uygulaması planlanması."
  },
  {
    "id": "elec_solar_feasibility",
    "title": "Güneş paneli ön fizibilite çalışması",
    "category": "Elektrik",
    "defaultReduction": 20,
    "difficulty": "Zor",
    "cost": "Yüksek",
    "duration": "6-12 ay",
    "tag": "Uzun Vadeli Yatırım",
    "owner": "Yönetim / Teknik Birim",
    "approval": "Yönetim onayı gerekir",
    "description": "Çatı veya açık alanlar için güneş paneli potansiyelinin ön değerlendirmesinin yapılması."
  },
  {
    "id": "elec_lab_plan",
    "title": "Laboratuvar cihaz kullanım planı",
    "category": "Elektrik",
    "defaultReduction": 7,
    "difficulty": "Orta",
    "cost": "Düşük",
    "duration": "1-2 ay",
    "tag": "Operasyonel İyileştirme",
    "owner": "Fakülte / Laboratuvar Sorumluları",
    "approval": "Birim koordinasyonu gerekir",
    "description": "Laboratuvar cihazlarının kullanım saatlerinin ve bekleme modlarının planlanması."
  },
  {
    "id": "food_waste_tracking",
    "title": "Gıda israfı takibi",
    "category": "Yemekhane",
    "defaultReduction": 15,
    "difficulty": "Orta",
    "cost": "Düşük",
    "duration": "1-2 ay",
    "tag": "Düşük Maliyet",
    "owner": "SKS / Yemekhane",
    "approval": "Birim onayıyla başlatılabilir",
    "description": "Günlük çıkan yemek, tüketilen öğün ve atık miktarının düzenli izlenmesi."
  },
  {
    "id": "food_portion",
    "title": "Porsiyon optimizasyonu",
    "category": "Yemekhane",
    "defaultReduction": 8,
    "difficulty": "Kolay",
    "cost": "Düşük",
    "duration": "1 ay",
    "tag": "Hızlı Kazanım",
    "owner": "Yemekhane",
    "approval": "Birim içi karar yeterli olabilir",
    "description": "Öğün planlama ve porsiyon kontrolüyle gıda kaynaklı israfın azaltılması."
  },
  {
    "id": "food_plant_based",
    "title": "Bitki bazlı menü günü",
    "category": "Yemekhane",
    "defaultReduction": 10,
    "difficulty": "Orta",
    "cost": "Düşük",
    "duration": "1-2 ay",
    "tag": "Düşük Maliyet",
    "owner": "SKS / Yemekhane",
    "approval": "Yönetim veya birim onayı önerilir",
    "description": "Haftanın belirli günlerinde düşük karbon etkili bitki bazlı menü alternatifleri sunulması."
  },
  {
    "id": "food_meal_planning",
    "title": "Günlük öğün sayısı planlama",
    "category": "Yemekhane",
    "defaultReduction": 7,
    "difficulty": "Kolay",
    "cost": "Düşük",
    "duration": "Hemen / 1 ay",
    "tag": "Hızlı Kazanım",
    "owner": "Yemekhane",
    "approval": "Birim içi uygulama ile başlatılabilir",
    "description": "Önceki tüketim kayıtlarına göre günlük üretim miktarının daha doğru planlanması."
  },
  {
    "id": "food_leftover_report",
    "title": "Artan yemek miktarı raporlama",
    "category": "Yemekhane",
    "defaultReduction": 6,
    "difficulty": "Kolay",
    "cost": "Düşük",
    "duration": "Hemen",
    "tag": "Kontrol ve İzleme",
    "owner": "Yemekhane",
    "approval": "Birim kararı yeterli olabilir",
    "description": "Gün sonunda artan yemek miktarının kayıt altına alınması ve raporlanması."
  },
  {
    "id": "food_local_supplier",
    "title": "Yerel tedarikçi tercihleri",
    "category": "Yemekhane",
    "defaultReduction": 5,
    "difficulty": "Orta",
    "cost": "Orta",
    "duration": "1-3 ay",
    "tag": "Tedarik İyileştirme",
    "owner": "Satın Alma / Yemekhane",
    "approval": "Satın alma süreci değerlendirmesi gerekir",
    "description": "Taşıma etkisini azaltmak için mümkün olduğunda yerel tedarikçi seçeneklerinin değerlendirilmesi."
  },
  {
    "id": "food_single_use_reduce",
    "title": "Tek kullanımlık ürünleri azaltma",
    "category": "Yemekhane",
    "defaultReduction": 6,
    "difficulty": "Kolay",
    "cost": "Düşük",
    "duration": "1 ay",
    "tag": "Hızlı Kazanım",
    "owner": "Yemekhane / Temizlik Birimi",
    "approval": "Birim uygulaması ile başlatılabilir",
    "description": "Tek kullanımlık plastik, bardak, çatal ve benzeri ürünlerin azaltılması."
  },
  {
    "id": "food_waste_separation",
    "title": "Gıda atığı ayrıştırma",
    "category": "Yemekhane",
    "defaultReduction": 7,
    "difficulty": "Orta",
    "cost": "Orta",
    "duration": "1-3 ay",
    "tag": "Kontrol ve İzleme",
    "owner": "Yemekhane / Temizlik Birimi",
    "approval": "Birimler arası koordinasyon gerekir",
    "description": "Gıda atıklarının diğer atıklardan ayrıştırılarak daha doğru takip edilmesi."
  },
  {
    "id": "food_menu_carbon",
    "title": "Haftalık menü karbon değerlendirmesi",
    "category": "Yemekhane",
    "defaultReduction": 5,
    "difficulty": "Orta",
    "cost": "Düşük",
    "duration": "1-2 ay",
    "tag": "Kontrol ve İzleme",
    "owner": "SKS / Yemekhane",
    "approval": "Birim koordinasyonu gerekir",
    "description": "Haftalık menülerin karbon etkisi açısından karşılaştırılması ve düşük etkili alternatiflerin değerlendirilmesi."
  },
  {
    "id": "food_awareness",
    "title": "Personel ve öğrenci farkındalık duyuruları",
    "category": "Yemekhane",
    "defaultReduction": 3,
    "difficulty": "Kolay",
    "cost": "Düşük",
    "duration": "Hemen",
    "tag": "Farkındalık",
    "owner": "SKS / İletişim",
    "approval": "Birim kararıyla başlatılabilir",
    "description": "Gıda israfını azaltmak için yemekhane içinde duyuru ve yönlendirme yapılması."
  },
  {
    "id": "transport_route",
    "title": "Servis güzergâhı optimizasyonu",
    "category": "Ulaşım",
    "defaultReduction": 10,
    "difficulty": "Orta",
    "cost": "Orta",
    "duration": "1-3 ay",
    "tag": "Operasyonel İyileştirme",
    "owner": "İdari İşler",
    "approval": "Yönetim ve birim koordinasyonu gerekir",
    "description": "Servis güzergâhlarının, doluluk oranlarının ve toplam kilometrenin gözden geçirilmesi."
  },
  {
    "id": "transport_public",
    "title": "Toplu taşıma teşviki",
    "category": "Ulaşım",
    "defaultReduction": 7,
    "difficulty": "Kolay",
    "cost": "Düşük",
    "duration": "1-2 ay",
    "tag": "Farkındalık + Hızlı Kazanım",
    "owner": "İdari İşler",
    "approval": "Duyuru ve koordinasyon ile başlatılabilir",
    "description": "Personel ve öğrenciler için toplu taşıma kullanımının teşvik edilmesi."
  },
  {
    "id": "transport_bike",
    "title": "Bisiklet kullanım teşviki",
    "category": "Ulaşım",
    "defaultReduction": 6,
    "difficulty": "Kolay",
    "cost": "Düşük",
    "duration": "1-2 ay",
    "tag": "Düşük Maliyet",
    "owner": "Sağlık Kültür Spor / İdari İşler",
    "approval": "Birim koordinasyonu yeterli olabilir",
    "description": "Bisiklet kullanımı için duyuru, park alanı ve kampüs içi yönlendirmelerin artırılması."
  },
  {
    "id": "transport_carpool",
    "title": "Araç paylaşım uygulaması",
    "category": "Ulaşım",
    "defaultReduction": 8,
    "difficulty": "Orta",
    "cost": "Düşük",
    "duration": "1-3 ay",
    "tag": "Operasyonel İyileştirme",
    "owner": "İdari İşler",
    "approval": "Birimler arası koordinasyon gerekir",
    "description": "Benzer güzergâhlardaki personelin araç paylaşımına yönlendirilmesi."
  },
  {
    "id": "transport_ring",
    "title": "Kampüs içi ring planlaması",
    "category": "Ulaşım",
    "defaultReduction": 9,
    "difficulty": "Orta",
    "cost": "Orta",
    "duration": "1-3 ay",
    "tag": "Operasyonel İyileştirme",
    "owner": "İdari İşler",
    "approval": "Yönetim onayı önerilir",
    "description": "Kampüs içi kısa mesafe araç kullanımını azaltmak için ring planının gözden geçirilmesi."
  },
  {
    "id": "transport_parking_monitor",
    "title": "Otopark kullanım yoğunluğu takibi",
    "category": "Ulaşım",
    "defaultReduction": 5,
    "difficulty": "Kolay",
    "cost": "Düşük",
    "duration": "1 ay",
    "tag": "Kontrol ve İzleme",
    "owner": "Güvenlik / İdari İşler",
    "approval": "Birim kararıyla başlatılabilir",
    "description": "Otopark yoğunluğunun izlenmesiyle araç kullanım eğilimlerinin takip edilmesi."
  },
  {
    "id": "transport_shuttle_occupancy",
    "title": "Personel servis doluluk takibi",
    "category": "Ulaşım",
    "defaultReduction": 6,
    "difficulty": "Orta",
    "cost": "Düşük",
    "duration": "1-2 ay",
    "tag": "Kontrol ve İzleme",
    "owner": "İdari İşler",
    "approval": "Birim takibi gerekir",
    "description": "Servislerin doluluk oranlarının kaydedilmesi ve düşük verimli seferlerin gözden geçirilmesi."
  },
  {
    "id": "transport_walk_bike_paths",
    "title": "Yaya yolları ve bisiklet park alanı iyileştirmesi",
    "category": "Ulaşım",
    "defaultReduction": 5,
    "difficulty": "Orta",
    "cost": "Orta",
    "duration": "1-3 ay",
    "tag": "Altyapı İyileştirme",
    "owner": "Yapı İşleri / İdari İşler",
    "approval": "Yönetim değerlendirmesi önerilir",
    "description": "Yürüme ve bisiklet kullanımını kolaylaştıracak alanların iyileştirilmesi."
  },
  {
    "id": "transport_ev_charging",
    "title": "Elektrikli araç şarj noktası planlama",
    "category": "Ulaşım",
    "defaultReduction": 8,
    "difficulty": "Zor",
    "cost": "Yüksek",
    "duration": "6-12 ay",
    "tag": "Uzun Vadeli Yatırım",
    "owner": "Yönetim / Teknik Birim",
    "approval": "Yönetim ve bütçe onayı gerekir",
    "description": "Kampüste elektrikli araç kullanımına hazırlık için şarj noktası planlaması yapılması."
  },
  {
    "id": "transport_short_trip_policy",
    "title": "Kısa mesafe araç kullanımını azaltma politikası",
    "category": "Ulaşım",
    "defaultReduction": 6,
    "difficulty": "Kolay",
    "cost": "Düşük",
    "duration": "Hemen / 1 ay",
    "tag": "Hızlı Kazanım",
    "owner": "İdari İşler",
    "approval": "Birim kararı ile başlatılabilir",
    "description": "Kampüs içinde kısa mesafelerde araç yerine yürüme veya ring kullanımının teşvik edilmesi."
  },
  {
    "id": "event_qr",
    "title": "QR broşür kullanımı",
    "category": "Etkinlik",
    "defaultReduction": 6,
    "difficulty": "Kolay",
    "cost": "Düşük",
    "duration": "Hemen",
    "tag": "Düşük Maliyet",
    "owner": "Kültür / Etkinlik Birimi",
    "approval": "Etkinlik sorumlusu kararı yeterli olabilir",
    "description": "Etkinliklerde basılı broşür yerine QR kod ve dijital program kullanılması."
  },
  {
    "id": "event_digital_form",
    "title": "Dijital katılım formu",
    "category": "Etkinlik",
    "defaultReduction": 5,
    "difficulty": "Kolay",
    "cost": "Düşük",
    "duration": "Hemen",
    "tag": "Hızlı Kazanım",
    "owner": "Etkinlik Birimi / Bilgi İşlem",
    "approval": "Birim kararıyla başlatılabilir",
    "description": "Katılımcı listeleri ve geri bildirim formlarının dijital olarak toplanması."
  },
  {
    "id": "event_low_waste",
    "title": "Düşük atıklı etkinlik planı",
    "category": "Etkinlik",
    "defaultReduction": 8,
    "difficulty": "Orta",
    "cost": "Düşük",
    "duration": "1 ay",
    "tag": "Düşük Maliyet",
    "owner": "Etkinlik Birimi",
    "approval": "Birim koordinasyonu gerekir",
    "description": "Etkinliklerde gereksiz baskı, tek kullanımlık ürün ve atık oluşumunun azaltılması."
  },
  {
    "id": "event_single_use",
    "title": "Tek kullanımlık ürünleri azaltma",
    "category": "Etkinlik",
    "defaultReduction": 7,
    "difficulty": "Kolay",
    "cost": "Düşük",
    "duration": "Hemen / 1 ay",
    "tag": "Hızlı Kazanım",
    "owner": "Etkinlik Birimi / Satın Alma",
    "approval": "Etkinlik sorumlusu kararı yeterli olabilir",
    "description": "Etkinliklerde tek kullanımlık bardak, tabak ve plastik ürünlerin azaltılması."
  },
  {
    "id": "event_waste_tracking",
    "title": "Etkinlik sonrası atık takibi",
    "category": "Etkinlik",
    "defaultReduction": 6,
    "difficulty": "Orta",
    "cost": "Düşük",
    "duration": "1 ay",
    "tag": "Kontrol ve İzleme",
    "owner": "Etkinlik / Temizlik Birimi",
    "approval": "Birimler arası takip gerekir",
    "description": "Etkinlik sonrası oluşan atık miktarının kayıt altına alınması."
  },
  {
    "id": "event_hybrid",
    "title": "Online veya hibrit katılım seçeneği",
    "category": "Etkinlik",
    "defaultReduction": 10,
    "difficulty": "Orta",
    "cost": "Düşük",
    "duration": "1-2 ay",
    "tag": "Yüksek Etki",
    "owner": "Bilgi İşlem / Etkinlik Birimi",
    "approval": "Birim koordinasyonu ve teknik hazırlık gerekir",
    "description": "Bazı etkinliklerde fiziksel ulaşım ihtiyacını azaltmak için online katılım seçeneği sunulması."
  },
  {
    "id": "event_local_catering",
    "title": "Yerel tedarikçi ile ikram planlama",
    "category": "Etkinlik",
    "defaultReduction": 5,
    "difficulty": "Orta",
    "cost": "Orta",
    "duration": "1 ay",
    "tag": "Tedarik İyileştirme",
    "owner": "Satın Alma / Etkinlik Birimi",
    "approval": "Satın alma süreci değerlendirilir",
    "description": "İkram ve etkinlik malzemelerinde yerel tedarikçi seçeneklerinin değerlendirilmesi."
  },
  {
    "id": "event_transport_guidance",
    "title": "Toplu taşıma yönlendirmesi",
    "category": "Etkinlik",
    "defaultReduction": 6,
    "difficulty": "Kolay",
    "cost": "Düşük",
    "duration": "Hemen",
    "tag": "Hızlı Kazanım",
    "owner": "Etkinlik Birimi",
    "approval": "Duyuru ile başlatılabilir",
    "description": "Etkinlik duyurularında toplu taşıma ve kampüs içi yönlendirmelerin eklenmesi."
  },
  {
    "id": "event_zero_carbon_checklist",
    "title": "Karbonsuz etkinlik kontrol listesi",
    "category": "Etkinlik",
    "defaultReduction": 5,
    "difficulty": "Kolay",
    "cost": "Düşük",
    "duration": "Hemen",
    "tag": "Kontrol Listesi",
    "owner": "Etkinlik Birimi",
    "approval": "Etkinlik sorumlusu tarafından uygulanabilir",
    "description": "Etkinlik öncesi basılı materyal, ikram, ulaşım ve atık başlıklarının kontrol edilmesi."
  },
  {
    "id": "event_carbon_report",
    "title": "Etkinlik başına karbon raporu oluşturma",
    "category": "Etkinlik",
    "defaultReduction": 4,
    "difficulty": "Orta",
    "cost": "Düşük",
    "duration": "1-2 ay",
    "tag": "Kontrol ve İzleme",
    "owner": "Sürdürülebilirlik Birimi / Etkinlik Birimi",
    "approval": "Birim koordinasyonu gerekir",
    "description": "Her etkinlik sonrası katılımcı, tüketim ve atık bilgilerinden küçük karbon özeti hazırlanması."
  },
  {
    "id": "purchase_digital_doc",
    "title": "Dijital belge kullanımı",
    "category": "Satın Alma",
    "defaultReduction": 7,
    "difficulty": "Kolay",
    "cost": "Düşük",
    "duration": "Hemen",
    "tag": "Hızlı Kazanım",
    "owner": "İdari Mali İşler / Yazı İşleri",
    "approval": "Birim içi uygulama ile başlatılabilir",
    "description": "Kağıt tüketimini azaltmak için formların, duyuruların ve raporların dijital yönetilmesi."
  },
  {
    "id": "purchase_recycled",
    "title": "Geri dönüştürülmüş ürün tercihleri",
    "category": "Satın Alma",
    "defaultReduction": 8,
    "difficulty": "Orta",
    "cost": "Orta",
    "duration": "1-3 ay",
    "tag": "Tedarik İyileştirme",
    "owner": "Satın Alma",
    "approval": "Satın alma kriterlerinin güncellenmesi gerekir",
    "description": "Kağıt ve sarf malzemelerinde geri dönüştürülmüş ürünlerin tercih edilmesi."
  },
  {
    "id": "purchase_local_supplier",
    "title": "Yerel tedarikçi seçimi",
    "category": "Satın Alma",
    "defaultReduction": 6,
    "difficulty": "Orta",
    "cost": "Orta",
    "duration": "1-3 ay",
    "tag": "Tedarik İyileştirme",
    "owner": "Satın Alma",
    "approval": "Tedarikçi değerlendirmesi gerekir",
    "description": "Taşıma kaynaklı emisyonu azaltmak için yerel tedarikçi seçeneklerinin değerlendirilmesi."
  },
  {
    "id": "purchase_bulk_planning",
    "title": "Toplu satın alma planlaması",
    "category": "Satın Alma",
    "defaultReduction": 5,
    "difficulty": "Kolay",
    "cost": "Düşük",
    "duration": "1 ay",
    "tag": "Operasyonel İyileştirme",
    "owner": "Satın Alma",
    "approval": "Birim koordinasyonu ile başlatılabilir",
    "description": "Parça parça alım yerine planlı ve toplu satın alma yapılarak lojistik etkisinin azaltılması."
  },
  {
    "id": "purchase_low_carbon",
    "title": "Düşük karbonlu ürün tercihleri",
    "category": "Satın Alma",
    "defaultReduction": 9,
    "difficulty": "Orta",
    "cost": "Orta",
    "duration": "1-3 ay",
    "tag": "Yüksek Etki",
    "owner": "Satın Alma",
    "approval": "Yönetim veya satın alma kriteri onayı önerilir",
    "description": "Ürün seçiminde enerji verimliliği ve düşük karbon kriterlerinin dikkate alınması."
  },
  {
    "id": "purchase_paper_reduce",
    "title": "Kağıt tüketimini azaltma",
    "category": "Satın Alma",
    "defaultReduction": 6,
    "difficulty": "Kolay",
    "cost": "Düşük",
    "duration": "Hemen / 1 ay",
    "tag": "Hızlı Kazanım",
    "owner": "Tüm Birimler",
    "approval": "Duyuru ve birim uygulaması yeterli olabilir",
    "description": "Baskı, fotokopi ve basılı doküman ihtiyacının azaltılması."
  },
  {
    "id": "purchase_print_quota",
    "title": "Yazıcı kullanım kotası",
    "category": "Satın Alma",
    "defaultReduction": 5,
    "difficulty": "Kolay",
    "cost": "Düşük",
    "duration": "1 ay",
    "tag": "Kontrol ve İzleme",
    "owner": "Bilgi İşlem",
    "approval": "Birim kararı ile uygulanabilir",
    "description": "Birim bazlı yazıcı kullanımının izlenmesi ve gereksiz çıktıların azaltılması."
  },
  {
    "id": "purchase_electronic_consumables",
    "title": "Elektronik sarf malzeme takibi",
    "category": "Satın Alma",
    "defaultReduction": 4,
    "difficulty": "Orta",
    "cost": "Düşük",
    "duration": "1-2 ay",
    "tag": "Kontrol ve İzleme",
    "owner": "Bilgi İşlem / Satın Alma",
    "approval": "Birimler arası takip gerekir",
    "description": "Kartuş, toner, pil ve elektronik sarf malzemelerin tüketim takibinin yapılması."
  },
  {
    "id": "purchase_supplier_criteria",
    "title": "Tedarikçi karbon kriteri ekleme",
    "category": "Satın Alma",
    "defaultReduction": 8,
    "difficulty": "Zor",
    "cost": "Orta",
    "duration": "3-6 ay",
    "tag": "Yönetim Onayı Gerekir",
    "owner": "Satın Alma / Yönetim",
    "approval": "Yönetim ve satın alma politikası onayı gerekir",
    "description": "Tedarikçi seçiminde sürdürülebilirlik veya karbon kriterinin değerlendirme sürecine eklenmesi."
  },
  {
    "id": "purchase_stock_planning",
    "title": "Depo ve stok planlaması",
    "category": "Satın Alma",
    "defaultReduction": 5,
    "difficulty": "Orta",
    "cost": "Düşük",
    "duration": "1-3 ay",
    "tag": "Operasyonel İyileştirme",
    "owner": "Satın Alma / Depo",
    "approval": "Birimler arası koordinasyon gerekir",
    "description": "Gereksiz satın alımı ve tekrar siparişleri azaltmak için stok takibinin güçlendirilmesi."
  },
  {
    "id": "fuel_route",
    "title": "Rota optimizasyonu",
    "category": "Yakıt",
    "defaultReduction": 8,
    "difficulty": "Orta",
    "cost": "Düşük",
    "duration": "1-2 ay",
    "tag": "Operasyonel İyileştirme",
    "owner": "İdari İşler",
    "approval": "Birim planlaması gerekir",
    "description": "Kampüs araçlarının görev rotalarının yakıt tüketimini azaltacak şekilde düzenlenmesi."
  },
  {
    "id": "fuel_tracking",
    "title": "Yakıt tüketim takibi",
    "category": "Yakıt",
    "defaultReduction": 7,
    "difficulty": "Kolay",
    "cost": "Düşük",
    "duration": "1 ay",
    "tag": "Kontrol ve İzleme",
    "owner": "İdari İşler",
    "approval": "Birim takibi ile başlatılabilir",
    "description": "Araç bazlı yakıt tüketim kayıtlarının düzenli takip edilmesi."
  },
  {
    "id": "fuel_maintenance",
    "title": "Araç bakım planı",
    "category": "Yakıt",
    "defaultReduction": 6,
    "difficulty": "Kolay",
    "cost": "Orta",
    "duration": "1-2 ay",
    "tag": "Operasyonel İyileştirme",
    "owner": "Teknik Birim / İdari İşler",
    "approval": "Bakım takvimi onayı gerekir",
    "description": "Düzenli bakım ile yakıt tüketimini artıran mekanik sorunların önlenmesi."
  },
  {
    "id": "fuel_efficient_vehicle",
    "title": "Düşük yakıt tüketimli araç tercihi",
    "category": "Yakıt",
    "defaultReduction": 10,
    "difficulty": "Zor",
    "cost": "Yüksek",
    "duration": "6-12 ay",
    "tag": "Uzun Vadeli Yatırım",
    "owner": "Yönetim / Satın Alma",
    "approval": "Yönetim ve bütçe onayı gerekir",
    "description": "Yeni araç alımlarında düşük yakıt tüketimli modellerin değerlendirilmesi."
  },
  {
    "id": "fuel_usage_permission",
    "title": "Araç kullanım izin süreci",
    "category": "Yakıt",
    "defaultReduction": 5,
    "difficulty": "Orta",
    "cost": "Düşük",
    "duration": "1 ay",
    "tag": "Kontrol ve İzleme",
    "owner": "İdari İşler",
    "approval": "Birim prosedürü gerekir",
    "description": "Araç kullanım taleplerinin amaç ve mesafe bakımından daha planlı değerlendirilmesi."
  },
  {
    "id": "fuel_weekly_report",
    "title": "Haftalık araç kullanım raporu",
    "category": "Yakıt",
    "defaultReduction": 4,
    "difficulty": "Kolay",
    "cost": "Düşük",
    "duration": "Hemen",
    "tag": "Kontrol ve İzleme",
    "owner": "İdari İşler",
    "approval": "Birim içi raporlama ile başlanabilir",
    "description": "Araç kullanımı ve km bilgilerinin haftalık raporlanması."
  },
  {
    "id": "fuel_short_distance",
    "title": "Gereksiz kısa mesafe araç kullanımını azaltma",
    "category": "Yakıt",
    "defaultReduction": 6,
    "difficulty": "Kolay",
    "cost": "Düşük",
    "duration": "Hemen / 1 ay",
    "tag": "Hızlı Kazanım",
    "owner": "İdari İşler",
    "approval": "Duyuru ve birim kararı yeterli olabilir",
    "description": "Kısa mesafelerde araç yerine yürüme, ring veya dijital işlem kullanımının teşvik edilmesi."
  },
  {
    "id": "fuel_ev_transition",
    "title": "Elektrikli araç dönüşüm planı",
    "category": "Yakıt",
    "defaultReduction": 15,
    "difficulty": "Zor",
    "cost": "Yüksek",
    "duration": "6-12 ay",
    "tag": "Uzun Vadeli Yatırım",
    "owner": "Yönetim",
    "approval": "Yönetim ve bütçe onayı gerekir",
    "description": "Kampüs araç filosunda elektrikli araçlara geçiş için kademeli dönüşüm planı hazırlanması."
  },
  {
    "id": "fuel_occupancy",
    "title": "Araç doluluk oranı takibi",
    "category": "Yakıt",
    "defaultReduction": 5,
    "difficulty": "Orta",
    "cost": "Düşük",
    "duration": "1-2 ay",
    "tag": "Kontrol ve İzleme",
    "owner": "İdari İşler",
    "approval": "Birim koordinasyonu gerekir",
    "description": "Tek kişiyle yapılan araç görevlerini azaltmak için doluluk oranlarının izlenmesi."
  },
  {
    "id": "fuel_invoice_km_compare",
    "title": "Yakıt faturası ve km karşılaştırması",
    "category": "Yakıt",
    "defaultReduction": 4,
    "difficulty": "Kolay",
    "cost": "Düşük",
    "duration": "Hemen",
    "tag": "Kontrol ve İzleme",
    "owner": "İdari İşler / Mali İşler",
    "approval": "Birim raporlaması ile başlanabilir",
    "description": "Yakıt faturaları ile km kayıtlarının karşılaştırılarak anormal tüketimlerin tespit edilmesi."
  },
  {
    "id": "campus_energy_awareness",
    "title": "Kampüs genelinde enerji farkındalık kampanyası",
    "category": "Elektrik",
    "defaultReduction": 5,
    "difficulty": "Kolay",
    "cost": "Düşük",
    "duration": "Hemen / 1 ay",
    "tag": "Farkındalık",
    "owner": "Sürdürülebilirlik Birimi / İletişim",
    "approval": "Duyuru ile başlatılabilir",
    "description": "Tüm birimlerde enerji tasarrufu farkındalığı için kısa duyuru ve bilgilendirme yapılması."
  },
  {
    "id": "campus_monthly_control",
    "title": "Tüm birimler için aylık veri kontrol takvimi",
    "category": "Satın Alma",
    "defaultReduction": 3,
    "difficulty": "Kolay",
    "cost": "Düşük",
    "duration": "Hemen",
    "tag": "Kontrol ve İzleme",
    "owner": "İdari Birimler",
    "approval": "Birim takvimi oluşturulabilir",
    "description": "Her ay veri giriş ve kontrol tarihinin belirlenerek rapor disiplininin artırılması."
  },
  {
    "id": "campus_management_agenda",
    "title": "Karbon raporunu aylık yönetim gündemine ekleme",
    "category": "Etkinlik",
    "defaultReduction": 4,
    "difficulty": "Kolay",
    "cost": "Düşük",
    "duration": "Hemen",
    "tag": "Yönetim Raporlama",
    "owner": "Yönetim / Sürdürülebilirlik Birimi",
    "approval": "Yönetim kararı önerilir",
    "description": "Karbon raporlarının düzenli yönetim toplantılarında kısa gündem maddesi olarak ele alınması."
  },
  {
    "id": "campus_unit_responsible",
    "title": "Birim bazlı karbon sorumlusu belirleme",
    "category": "Satın Alma",
    "defaultReduction": 5,
    "difficulty": "Orta",
    "cost": "Düşük",
    "duration": "1-2 ay",
    "tag": "Organizasyonel İyileştirme",
    "owner": "Yönetim / Tüm Birimler",
    "approval": "Yönetim onayı önerilir",
    "description": "Her birimden veri giriş ve kontrol için sorumlu personel belirlenmesi."
  },
  {
    "id": "campus_paperless_process",
    "title": "Kampüs genelinde kağıtsız süreç planı",
    "category": "Satın Alma",
    "defaultReduction": 7,
    "difficulty": "Orta",
    "cost": "Düşük",
    "duration": "1-3 ay",
    "tag": "Düşük Maliyet",
    "owner": "Tüm Birimler / Bilgi İşlem",
    "approval": "Yönetim ve birim koordinasyonu gerekir",
    "description": "Form, dilekçe, iç yazışma ve raporların dijital süreçlere taşınması."
  },
  {
    "id": "campus_transport_announcement",
    "title": "Kampüs içi sürdürülebilir ulaşım duyuruları",
    "category": "Ulaşım",
    "defaultReduction": 5,
    "difficulty": "Kolay",
    "cost": "Düşük",
    "duration": "Hemen",
    "tag": "Farkındalık",
    "owner": "İdari İşler / İletişim",
    "approval": "Duyuru ile başlatılabilir",
    "description": "Toplu taşıma, ring, bisiklet ve yürüyüş seçeneklerinin düzenli duyurulması."
  },
  {
    "id": "campus_building_targets",
    "title": "Bina bazlı karbon hedefi belirleme",
    "category": "Elektrik",
    "defaultReduction": 6,
    "difficulty": "Orta",
    "cost": "Düşük",
    "duration": "1-3 ay",
    "tag": "Yönetim Onayı Gerekir",
    "owner": "Yönetim / Sürdürülebilirlik Birimi",
    "approval": "Yönetim onayı önerilir",
    "description": "Her bina için dönemsel karbon azaltım hedeflerinin belirlenmesi."
  },
  {
    "id": "campus_annual_report_prep",
    "title": "Yıllık sürdürülebilirlik raporu hazırlığı",
    "category": "Etkinlik",
    "defaultReduction": 3,
    "difficulty": "Orta",
    "cost": "Düşük",
    "duration": "3-6 ay",
    "tag": "Yönetim Raporlama",
    "owner": "Sürdürülebilirlik Birimi / İdari Birimler",
    "approval": "Yönetim planlaması önerilir",
    "description": "Yıl boyunca toplanan verilerle yıllık sürdürülebilirlik raporu altyapısının hazırlanması."
  }
];

const defaultCampusProfiles = {
  "duzce-konuralp": {
    id: "duzce-konuralp",
    name: "Düzce Üniversitesi Konuralp Yerleşkesi",
    city: "Düzce",
    source: "Hazır kampüs verisi",
    center: { lat: 40.90385, lng: 31.18235 },
    zoom: 16,
    locations: [
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
  },
  "odtu": {
    id: "odtu",
    name: "Orta Doğu Teknik Üniversitesi",
    city: "Ankara",
    source: "Hazır örnek kampüs şablonu",
    center: { lat: 39.8910, lng: 32.7847 },
    zoom: 15,
    locations: makeGenericCampusLocations({ lat: 39.8910, lng: 32.7847 }, "ODTÜ")
  },
  "itu-maslak": {
    id: "itu-maslak",
    name: "İstanbul Teknik Üniversitesi Ayazağa Kampüsü",
    city: "İstanbul",
    source: "Hazır örnek kampüs şablonu",
    center: { lat: 41.1056, lng: 29.0253 },
    zoom: 15,
    locations: makeGenericCampusLocations({ lat: 41.1056, lng: 29.0253 }, "İTÜ")
  }
};

const campusProfileStorageKey = "carbonmapCampusDemo.currentCampus.v2";
let currentCampus = loadSavedCampusProfile() || cloneCampusProfile(defaultCampusProfiles["duzce-konuralp"]);
let locations = currentCampus.locations;

function cloneCampusProfile(profile) {
  return JSON.parse(JSON.stringify(profile));
}

function saveCurrentCampusProfile() {
  try {
    localStorage.setItem(campusProfileStorageKey, JSON.stringify(currentCampus));
  } catch (error) {
    console.warn("Kampüs profili kaydedilemedi", error);
  }
}

function loadSavedCampusProfile() {
  try {
    const raw = localStorage.getItem(campusProfileStorageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.locations?.length) return null;
    return parsed;
  } catch (error) {
    return null;
  }
}

function getCampusRecordsStorageKey(campusId) {
  return `carbonmapCampusDemo.records.${slugify(campusId || "kampus")}.v2`;
}

function makeGenericCampusLocations(center, label = "Kampüs") {
  const baseLat = Number(center.lat);
  const baseLng = Number(center.lng);
  const templates = [
    { name: "Rektörlük", type: "Yönetim", icon: "🏢", budget: 3600, floor: "Yönetim", area: "İdari birimler", lat: 0.0000, lng: 0.0000 },
    { name: "Mühendislik Fakültesi", type: "Akademik bina", icon: "🏛️", budget: 5200, floor: "Fakülte", area: "Derslik/lab", lat: 0.0010, lng: 0.0006 },
    { name: "Fen Edebiyat Fakültesi", type: "Akademik bina", icon: "🔬", budget: 4700, floor: "Fakülte", area: "Laboratuvar", lat: -0.0009, lng: 0.0009 },
    { name: "Kütüphane", type: "Akademik destek", icon: "📚", budget: 3000, floor: "Kütüphane", area: "Çalışma alanı", lat: 0.0007, lng: -0.0008 },
    { name: "Yemekhane", type: "Sosyal tesis", icon: "🍽️", budget: 4300, floor: "Sosyal tesis", area: "Yemek hizmeti", lat: -0.0006, lng: -0.0007 },
    { name: "Sağlık Merkezi", type: "Sağlık tesisi", icon: "🏥", budget: 6400, floor: "Sağlık", area: "Klinik/servis", lat: -0.0014, lng: 0.0001 },
    { name: "Konferans Salonu", type: "Etkinlik alanı", icon: "🎤", budget: 2200, floor: "Salon", area: "Etkinlik", lat: 0.0015, lng: -0.0002 },
    { name: "Spor Salonu", type: "Spor tesisi", icon: "🏟️", budget: 3200, floor: "Spor", area: "Kapalı spor", lat: -0.0012, lng: -0.0012 },
    { name: "Teknopark / AR-GE", type: "AR-GE alanı", icon: "💡", budget: 3600, floor: "Ofis", area: "AR-GE", lat: 0.0017, lng: 0.0014 },
    { name: "Otopark", type: "Ulaşım alanı", icon: "🅿️", budget: 2600, floor: "Açık alan", area: "Ulaşım", lat: -0.0018, lng: 0.0013 }
  ];
  return templates.map((item) => ({
    ...item,
    name: `${label} ${item.name}`.trim(),
    lat: Number((baseLat + item.lat).toFixed(6)),
    lng: Number((baseLng + item.lng).toFixed(6))
  }));
}

function dedupeLocations(list) {
  const seen = new Set();
  return list.filter((item) => {
    const key = slugify(item.name);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return Number.isFinite(Number(item.lat)) && Number.isFinite(Number(item.lng));
  });
}

function inferLocationIcon(typeText = "") {
  const clean = slugify(typeText);
  if (clean.includes("hospital") || clean.includes("saglik") || clean.includes("tip")) return "🏥";
  if (clean.includes("library") || clean.includes("kutuphane")) return "📚";
  if (clean.includes("sport") || clean.includes("spor")) return "🏟️";
  if (clean.includes("parking") || clean.includes("otopark")) return "🅿️";
  if (clean.includes("restaurant") || clean.includes("yemekhane") || clean.includes("cafe")) return "🍽️";
  if (clean.includes("research") || clean.includes("teknopark") || clean.includes("arge")) return "💡";
  if (clean.includes("conference") || clean.includes("auditorium") || clean.includes("salon")) return "🎤";
  if (clean.includes("faculty") || clean.includes("fakulte") || clean.includes("school")) return "🏛️";
  return "📍";
}

function inferBudget(typeText = "") {
  const clean = slugify(typeText);
  if (clean.includes("hospital") || clean.includes("saglik") || clean.includes("tip")) return 7600;
  if (clean.includes("laboratory") || clean.includes("lab") || clean.includes("research")) return 5200;
  if (clean.includes("sport") || clean.includes("spor")) return 3600;
  if (clean.includes("restaurant") || clean.includes("yemekhane")) return 4300;
  if (clean.includes("parking") || clean.includes("otopark")) return 2600;
  return 3400;
}

function normalizeDynamicLocation(raw, center, index) {
  const tags = raw.tags || {};
  const lat = Number(raw.lat || raw.center?.lat);
  const lng = Number(raw.lon || raw.center?.lon);
  const fallbackName = `${currentCampus?.name || "Kampüs"} Lokasyon ${index + 1}`;
  const name = tags.name || tags["name:tr"] || tags.amenity || tags.building || fallbackName;
  const type = tags.amenity || tags.building || tags.office || tags.leisure || "Kampüs lokasyonu";
  return {
    name: String(name).slice(0, 70),
    type: String(type).replace(/_/g, " "),
    lat: Number.isFinite(lat) ? lat : center.lat,
    lng: Number.isFinite(lng) ? lng : center.lng,
    budget: inferBudget(`${name} ${type}`),
    icon: inferLocationIcon(`${name} ${type}`),
    floor: tags.levels ? `${tags.levels} kat` : "Kampüs birimi",
    area: tags.operator || tags["addr:street"] || "OSM/şablon verisi"
  };
}


const baseTargetEmission = 22000;
const targetReductionPercent = 10;

let emissions = [];
let charts = {};
let parsedCsvRows = [];
let csvHeaders = [];
let editingRecordId = null;

let storageKey = getCampusRecordsStorageKey(currentCampus.id);

const apiBaseCandidates = window.location.protocol === "file:"
  ? ["http://127.0.0.1:8000/api"]
  : Array.from(new Set([`${window.location.origin}/api`, "http://127.0.0.1:8000/api"]));
let activeApiBaseUrl = apiBaseCandidates[0];
let backendEnabled = false;
let backendCheckFinished = false;
const customScenarioStorageKey = "carbonmapCampusDemo.customScenarios.v1";
let customScenarioTemplates = [];

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


function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getRecordFormPayload() {
  const category = $("#categoryInput").value;
  const statusInput = document.getElementById("statusInput");
  const existingRecord = editingRecordId ? emissions.find((record) => record.id === editingRecordId) : null;
  return {
    location: $("#locationInput").value,
    category,
    amount: Number($("#amountInput").value),
    source: $("#sourceInput").value,
    status: statusInput?.value || existingRecord?.status || "Onaylandı",
    date: $("#dateInput").value,
    description: $("#descriptionInput").value
  };
}

function setRecordFormMode(mode = "create") {
  const isEdit = mode === "edit";
  const title = document.getElementById("recordFormTitle");
  const submitBtn = document.getElementById("recordSubmitBtn");
  const cancelBtn = document.getElementById("cancelEditBtn");

  if (title) title.textContent = isEdit ? "Karbon Kaydını Düzenle" : "Karbon Kaydı Ekle";
  if (submitBtn) submitBtn.textContent = isEdit ? "Değişiklikleri Kaydet" : "Emisyonu Hesapla ve Kaydet";
  if (cancelBtn) cancelBtn.classList.toggle("hidden", !isEdit);
}

function resetRecordForm() {
  const form = document.getElementById("emissionForm");
  if (form) form.reset();
  editingRecordId = null;
  setRecordFormMode("create");
  const dateInput = document.getElementById("dateInput");
  if (dateInput) dateInput.valueAsDate = new Date();
  updateUnitInput();
}

function applyPayloadToLocalRecord(record, payload) {
  const factor = factors[payload.category] || factors["Elektrik"];
  const amount = Number(payload.amount || 0);
  return {
    ...record,
    location: payload.location,
    category: payload.category,
    amount,
    unit: factor.unit,
    factor: factor.factor,
    scope: factor.scope,
    totalEmission: amount * factor.factor,
    source: payload.source,
    confidence: dataSourceScores[payload.source] || 70,
    status: payload.status,
    date: payload.date,
    description: payload.description || ""
  };
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
  if (!locations.length) return "Genel Kampüs";
  if (!clean) return locations[0].name;

  const direct = locations.find((item) => slugify(item.name) === clean);
  if (direct) return direct.name;

  const partial = locations.find((item) => {
    const locSlug = slugify(item.name);
    const typeSlug = slugify(`${item.type || ""} ${item.floor || ""} ${item.area || ""}`);
    return locSlug.includes(clean) || clean.includes(locSlug) || typeSlug.includes(clean);
  });
  if (partial) return partial.name;

  const typeAliases = [
    ["rektor", "yonetim"],
    ["muhendislik", "muhendislik"],
    ["kutuphane", "kutuphane"],
    ["hastane", "saglik"],
    ["saglik", "saglik"],
    ["yemekhane", "yemek"],
    ["yemek", "yemek"],
    ["spor", "spor"],
    ["otopark", "ulasim"],
    ["konferans", "etkinlik"],
    ["salon", "etkinlik"],
    ["teknopark", "arge"],
    ["arge", "arge"]
  ];
  for (const [alias, target] of typeAliases) {
    if (!clean.includes(alias)) continue;
    const matched = locations.find((item) => slugify(`${item.name} ${item.type} ${item.area}`).includes(target));
    if (matched) return matched.name;
  }

  return locations[0].name;
}

function getCampusDisplayName() {
  return currentCampus?.name || "Seçili Kampüs";
}

function updateCampusText() {
  const name = getCampusDisplayName();
  const titleEl = document.getElementById("currentCampusTitle");
  const subEl = document.getElementById("currentCampusSubtitle");
  const countEl = document.getElementById("campusLocationCount");
  if (titleEl) titleEl.textContent = name;
  if (subEl) subEl.textContent = "";
  if (countEl) countEl.textContent = `${locations.length} lokasyon`;
}

function setCampusStatus(message, type = "info") {
  const el = document.getElementById("campusMapStatus");
  if (!el) return;
  el.textContent = message;
  el.className = `campus-map-status ${type}`;
}

function getCampusPresetOptions() {
  return Object.values(defaultCampusProfiles).map((profile) => ({ id: profile.id, name: profile.name }));
}

function initializeCampusControls() {
  const preset = document.getElementById("campusPresetSelect");
  const input = document.getElementById("campusSearchInput");
  const loadBtn = document.getElementById("campusLoadBtn");
  if (!preset || !input || !loadBtn) return;

  preset.innerHTML = [
    ...getCampusPresetOptions().map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`),
    `<option value="custom">Başka üniversite ara...</option>`
  ].join("");

  const currentIsPreset = Boolean(defaultCampusProfiles[currentCampus.id]);
  preset.value = currentIsPreset ? currentCampus.id : "custom";
  input.value = currentIsPreset ? "" : getCampusDisplayName();
  input.disabled = currentIsPreset;
  input.placeholder = currentIsPreset ? "Hazır üniversite seçili" : "Örn: Boğaziçi Üniversitesi İstanbul";
  updateCampusText();

  preset.addEventListener("change", () => {
    if (preset.value === "custom") {
      input.disabled = false;
      input.value = "";
      input.placeholder = "Üniversite adı + şehir yazın";
      input.focus();
      setCampusStatus("Üniversite adını yazıp 'Üniversiteyi Yükle' butonuna basın.", "info");
      return;
    }
    input.disabled = true;
    input.value = "";
    applyCampusProfile(cloneCampusProfile(defaultCampusProfiles[preset.value]), { message: "Hazır kampüs profili yüklendi." });
  });

  loadBtn.addEventListener("click", () => {
    if (preset.value !== "custom") {
      applyCampusProfile(cloneCampusProfile(defaultCampusProfiles[preset.value]), { message: "Hazır kampüs profili yüklendi." });
      return;
    }
    loadUniversityByName(input.value.trim());
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      loadUniversityByName(input.value.trim());
    }
  });
}

function applyCampusProfile(profile, options = {}) {
  if (!profile?.locations?.length) {
    setCampusStatus("Kampüs lokasyon bilgisi bulunamadı.", "error");
    return;
  }

  saveRecords();
  currentCampus = cloneCampusProfile(profile);
  locations = dedupeLocations(currentCampus.locations);
  currentCampus.locations = locations;
  storageKey = getCampusRecordsStorageKey(currentCampus.id);
  saveCurrentCampusProfile();

  // Backend tek veritabanı kullandığı için kampüs değiştirirken demo güvenli local moda alınır.
  if (backendEnabled) {
    backendEnabled = false;
    setBackendStatus(false, "Dinamik kampüs seçildi: kayıtlar bu üniversite için tarayıcı localStorage modunda tutuluyor.");
  }

  if (leafletMap) {
    leafletMap.remove();
    leafletMap = null;
    leafletMarkers = {};
  }

  loadRecords();
  populateSelects();
  resetRecordForm();
  updateCampusText();
  renderAll();
  setCampusStatus(options.message || `${currentCampus.name} haritaya yüklendi.`, "success");
}

async function loadUniversityByName(query) {
  if (!query || query.length < 3) {
    setCampusStatus("Lütfen üniversite adı ve mümkünse şehir bilgisini yazın.", "error");
    return;
  }

  const loadBtn = document.getElementById("campusLoadBtn");
  const oldText = loadBtn?.textContent;
  if (loadBtn) {
    loadBtn.disabled = true;
    loadBtn.textContent = "Yükleniyor...";
  }
  setCampusStatus("Üniversite aranıyor. İnternet varsa OpenStreetMap üzerinden gerçek merkez ve bina verisi çekilecek.", "info");

  try {
    const geocode = await fetchNominatimCampus(query);
    let dynamicLocations = [];
    let usedOsmLocations = false;
    try {
      dynamicLocations = await fetchOsmCampusLocations(geocode.center, query);
      usedOsmLocations = dynamicLocations.length >= 4;
    } catch (error) {
      console.warn("OSM bina/lokasyon verisi alınamadı", error);
    }

    if (!usedOsmLocations) {
      dynamicLocations = makeGenericCampusLocations(geocode.center, geocode.shortName || query);
    }

    const profile = {
      id: `dynamic-${slugify(query)}-${Math.round(geocode.center.lat * 1000)}-${Math.round(geocode.center.lng * 1000)}`,
      name: geocode.shortName || query,
      city: geocode.city || "Dinamik kampüs",
      source: usedOsmLocations ? "OpenStreetMap lokasyon verisi" : "Otomatik kampüs şablonu",
      center: geocode.center,
      zoom: 16,
      locations: dynamicLocations.slice(0, 30)
    };
    applyCampusProfile(profile, { message: `${profile.name} için ${profile.locations.length} lokasyon yüklendi.` });
    const preset = document.getElementById("campusPresetSelect");
    if (preset) preset.value = "custom";
  } catch (error) {
    console.error(error);
    const fallbackCenter = currentCampus?.center || { lat: 39.9255, lng: 32.8663 };
    const profile = {
      id: `fallback-${slugify(query)}`,
      name: query,
      city: "Manuel/Demo",
      source: "İnternet yoksa otomatik kampüs şablonu",
      center: fallbackCenter,
      zoom: 16,
      locations: makeGenericCampusLocations(fallbackCenter, query)
    };
    applyCampusProfile(profile, { message: "OpenStreetMap verisi alınamadı; demo için otomatik kampüs şablonu oluşturuldu." });
  } finally {
    if (loadBtn) {
      loadBtn.disabled = false;
      loadBtn.textContent = oldText || "Üniversiteyi Yükle";
    }
  }
}

async function fetchNominatimCampus(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&q=${encodeURIComponent(query)}`;
  const response = await fetch(url, { headers: { "Accept": "application/json" } });
  if (!response.ok) throw new Error("Üniversite arama servisi yanıt vermedi.");
  const results = await response.json();
  if (!results.length) throw new Error("Üniversite bulunamadı.");
  const item = results[0];
  const address = item.address || {};
  return {
    shortName: (item.display_name || query).split(",")[0],
    city: address.city || address.town || address.province || address.state || address.country || "",
    center: { lat: Number(item.lat), lng: Number(item.lon) }
  };
}

async function fetchOsmCampusLocations(center, query) {
  const radius = 1100;
  const overpassQuery = `
    [out:json][timeout:18];
    (
      node(around:${radius},${center.lat},${center.lng})[amenity~"university|college|library|hospital|clinic|restaurant|cafe|parking",i];
      way(around:${radius},${center.lat},${center.lng})[amenity~"university|college|library|hospital|clinic|restaurant|cafe|parking",i];
      relation(around:${radius},${center.lat},${center.lng})[amenity~"university|college|library|hospital|clinic|restaurant|cafe|parking",i];
      way(around:${radius},${center.lat},${center.lng})[building][name];
      relation(around:${radius},${center.lat},${center.lng})[building][name];
      way(around:${radius},${center.lat},${center.lng})[leisure~"sports_centre|stadium|pitch",i];
    );
    out center tags 40;
  `;
  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: `data=${encodeURIComponent(overpassQuery)}`
  });
  if (!response.ok) throw new Error("OSM lokasyon servisi yanıt vermedi.");
  const data = await response.json();
  const normalized = (data.elements || [])
    .map((item, index) => normalizeDynamicLocation(item, center, index))
    .filter((item) => {
      const haystack = slugify(`${item.name} ${item.type} ${item.area}`);
      const querySlug = slugify(query);
      return item.name && (haystack.length > 2 || querySlug.length > 2);
    });
  return dedupeLocations(normalized).slice(0, 30);
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

function loadCustomScenarios() {
  try {
    const raw = localStorage.getItem(customScenarioStorageKey);
    customScenarioTemplates = raw ? JSON.parse(raw) : [];
  } catch (error) {
    customScenarioTemplates = [];
  }
}

function saveCustomScenarios() {
  localStorage.setItem(customScenarioStorageKey, JSON.stringify(customScenarioTemplates));
}

function createCustomScenarioId() {
  if (window.crypto && crypto.randomUUID) return `custom_${crypto.randomUUID()}`;
  return `custom_${Date.now()}_${Math.round(Math.random() * 100000)}`;
}

function toggleCustomScenarioPanel(forceOpen = null) {
  const panel = document.getElementById("customScenarioPanel");
  if (!panel) return;
  const shouldOpen = forceOpen === null ? panel.hidden : forceOpen;
  panel.hidden = !shouldOpen;
  if (shouldOpen) {
    const categoryInput = document.getElementById("customScenarioCategory");
    if (categoryInput && document.getElementById("scenarioCategory")) {
      categoryInput.value = document.getElementById("scenarioCategory").value;
    }
    renderCustomScenarioList();
    document.getElementById("customScenarioTitle")?.focus();
  }
}

function clearCustomScenarioForm() {
  ["customScenarioTitle", "customScenarioOwner", "customScenarioDescription"].forEach((id) => {
    const input = document.getElementById(id);
    if (input) input.value = "";
  });
  const reduction = document.getElementById("customScenarioReduction");
  if (reduction) reduction.value = 6;
  const cost = document.getElementById("customScenarioCost");
  if (cost) cost.value = "Düşük";
  const difficulty = document.getElementById("customScenarioDifficulty");
  if (difficulty) difficulty.value = "Kolay";
  const duration = document.getElementById("customScenarioDuration");
  if (duration) duration.value = "Hemen / 1 ay";
  const approval = document.getElementById("customScenarioApproval");
  if (approval) approval.value = "Gerekli değil";
}

function saveCustomScenarioFromForm() {
  const title = document.getElementById("customScenarioTitle")?.value.trim();
  const category = document.getElementById("customScenarioCategory")?.value || document.getElementById("scenarioCategory")?.value || "Elektrik";
  const defaultReduction = Number(document.getElementById("customScenarioReduction")?.value || 0);
  const cost = document.getElementById("customScenarioCost")?.value || "Düşük";
  const difficulty = document.getElementById("customScenarioDifficulty")?.value || "Kolay";
  const duration = document.getElementById("customScenarioDuration")?.value || "Hemen / 1 ay";
  const owner = document.getElementById("customScenarioOwner")?.value.trim() || "İlgili idari birim";
  const approval = document.getElementById("customScenarioApproval")?.value || "Gerekli değil";
  const description = document.getElementById("customScenarioDescription")?.value.trim() || "Kurum tarafından tanımlanan özel azaltım aksiyonu.";

  if (!title) {
    showToast("Özel senaryo için bir ad yazın.");
    return;
  }
  if (!defaultReduction || defaultReduction < 1 || defaultReduction > 90) {
    showToast("Azaltım oranı 1 ile 90 arasında olmalı.");
    return;
  }

  const scenario = {
    id: createCustomScenarioId(),
    title,
    category,
    defaultReduction,
    difficulty,
    cost,
    duration,
    tag: "Özel Senaryo",
    owner,
    approval,
    description,
    custom: true
  };

  customScenarioTemplates.push(scenario);
  saveCustomScenarios();

  const categorySelect = document.getElementById("scenarioCategory");
  if (categorySelect) categorySelect.value = category;
  populateScenarioTemplates();

  const templateSelect = document.getElementById("scenarioTemplate");
  if (templateSelect) templateSelect.value = scenario.id;
  updateScenarioInputs();
  syncScenarioPickerUI("category");
  syncScenarioPickerUI("template");
  renderCustomScenarioList();
  clearCustomScenarioForm();
  toggleCustomScenarioPanel(false);
  showToast("Özel senaryo kaydedildi ve seçildi.");
}

function deleteCustomScenario(id) {
  const selectedId = document.getElementById("scenarioTemplate")?.value;
  customScenarioTemplates = customScenarioTemplates.filter((item) => item.id !== id);
  saveCustomScenarios();
  populateScenarioTemplates();
  renderCustomScenarioList();
  if (selectedId === id) {
    updateScenarioInputs();
  }
  showToast("Özel senaryo silindi.");
}

function selectCustomScenario(id) {
  const scenario = customScenarioTemplates.find((item) => item.id === id);
  if (!scenario) return;
  const categorySelect = document.getElementById("scenarioCategory");
  const templateSelect = document.getElementById("scenarioTemplate");
  if (categorySelect) categorySelect.value = scenario.category;
  populateScenarioTemplates();
  if (templateSelect) templateSelect.value = scenario.id;
  updateScenarioInputs();
  syncScenarioPickerUI("category");
  syncScenarioPickerUI("template");
  toggleCustomScenarioPanel(false);
  showToast("Özel senaryo seçildi.");
}

function renderCustomScenarioList() {
  const list = document.getElementById("customScenarioList");
  if (!list) return;
  if (!customScenarioTemplates.length) {
    list.innerHTML = `<div class="empty-state">Henüz özel senaryo eklenmedi. Kendi aksiyonunuzu yazıp kaydedebilirsiniz.</div>`;
    return;
  }
  list.innerHTML = customScenarioTemplates.map((item) => `
    <div class="custom-scenario-item">
      <div>
        <strong>${item.title}</strong>
        <small>${item.category} • %${item.defaultReduction} • ${item.cost} maliyet • ${item.duration}</small>
      </div>
      <button type="button" data-select-custom-scenario="${item.id}">Seç</button>
      <button type="button" class="danger" data-delete-custom-scenario="${item.id}">Sil</button>
    </div>
  `).join("");
  list.querySelectorAll("[data-select-custom-scenario]").forEach((button) => {
    button.addEventListener("click", () => selectCustomScenario(button.dataset.selectCustomScenario));
  });
  list.querySelectorAll("[data-delete-custom-scenario]").forEach((button) => {
    button.addEventListener("click", () => deleteCustomScenario(button.dataset.deleteCustomScenario));
  });
}

function setupCustomScenarioControls() {
  document.getElementById("customScenarioToggle")?.addEventListener("click", () => toggleCustomScenarioPanel());
  document.getElementById("cancelCustomScenarioBtn")?.addEventListener("click", () => toggleCustomScenarioPanel(false));
  document.getElementById("saveCustomScenarioBtn")?.addEventListener("click", saveCustomScenarioFromForm);
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
  if (currentCampus?.id !== "duzce-konuralp") {
    backendEnabled = false;
    backendCheckFinished = true;
    setBackendStatus(false, "Dinamik kampüs seçili: kayıtlar bu üniversite için localStorage üzerinde ayrı tutuluyor.");
    return;
  }

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
  const scenarioLocationOptions = `<option value="Kampüs Geneli">Kampüs Geneli</option>` + locationOptions;
  const categoryOptions = Object.keys(factors).map((cat) => `<option value="${cat}">${cat}</option>`).join("");

  $("#locationInput").innerHTML = locationOptions;
  $("#scenarioLocation").innerHTML = scenarioLocationOptions;
  ["#categoryInput", "#scenarioCategory"].forEach((id) => {
    $(id).innerHTML = categoryOptions;
  });
  const customCategorySelect = document.getElementById("customScenarioCategory");
  if (customCategorySelect) {
    customCategorySelect.innerHTML = categoryOptions;
  }
  updateUnitInput();
  populateScenarioTemplates();
  renderCustomScenarioList();
}

function updateUnitInput() {
  const category = $("#categoryInput").value;
  $("#unitInput").value = factors[category]?.unit || "";
}

function getAllScenarioTemplates() {
  return [...scenarioTemplates, ...customScenarioTemplates];
}

function getScenarioTemplatesForCategory(category) {
  return getAllScenarioTemplates().filter((item) => item.category === category || item.category === "Genel");
}

function populateScenarioTemplates() {
  const select = $("#scenarioTemplate");
  if (!select) return;

  const category = $("#scenarioCategory")?.value || "Elektrik";
  const templates = getScenarioTemplatesForCategory(category);

  if (!templates.length) {
    select.innerHTML = `<option value="custom">Özel senaryo / elle oran gir</option>`;
    updateScenarioInputs();
    return;
  }

  select.innerHTML = templates.map((item) => {
    return `<option value="${item.id}">[${item.tag}] ${item.title} - %${item.defaultReduction}</option>`;
  }).join("");

  updateScenarioInputs();
  syncScenarioPickerUI("template");
}

function getSelectedScenarioTemplate() {
  const templateId = $("#scenarioTemplate")?.value;
  const category = $("#scenarioCategory")?.value || "Elektrik";
  return getAllScenarioTemplates().find((item) => item.id === templateId) || getScenarioTemplatesForCategory(category)[0] || null;
}

function getCategoryCostAssumption(categoryName) {
  return categoryCostAssumptions[categoryName] || {
    unitCost: 0,
    unitLabel: "TL/birim",
    activityLabel: "birim",
    note: "tahmini maliyet"
  };
}

function updateScenarioInputs() {
  const template = getSelectedScenarioTemplate();
  const reductionInput = $("#reductionInput");
  const priceInput = $("#priceInput");
  const category = $("#scenarioCategory")?.value || "Elektrik";
  const costAssumption = getCategoryCostAssumption(category);

  if (template && reductionInput) {
    reductionInput.value = template.defaultReduction;
  }

  if (priceInput) {
    priceInput.value = costAssumption.unitCost;
    priceInput.title = `${category} için demo birim maliyet varsayımı: ${costAssumption.unitCost} ${costAssumption.unitLabel}`;
  }
  syncScenarioPickerUI("template");
  renderScenarioSelectionSummary();
}


const scenarioPickerConfig = {
  location: {
    selectId: "#scenarioLocation",
    inputId: "#scenarioLocationSearch",
    suggestionsId: "#scenarioLocationSuggestions",
    chipId: "#scenarioLocationChip",
    getItems: () => {
      return ["Kampüs Geneli", ...locations.map((loc) => loc.name)].map((name) => ({
        value: name,
        label: name,
        meta: name === "Kampüs Geneli" ? "Tüm lokasyonlardaki seçili kategori kayıtları" : "Bina / lokasyon"
      }));
    }
  },
  category: {
    selectId: "#scenarioCategory",
    inputId: "#scenarioCategorySearch",
    suggestionsId: "#scenarioCategorySuggestions",
    chipId: "#scenarioCategoryChip",
    getItems: () => Object.keys(factors).map((name) => ({
      value: name,
      label: name,
      meta: `${factors[name].unit} bazlı hesaplama`
    }))
  },
  template: {
    selectId: "#scenarioTemplate",
    inputId: "#scenarioTemplateSearch",
    suggestionsId: "#scenarioTemplateSuggestions",
    chipId: "#scenarioTemplateChip",
    getItems: () => {
      const category = $("#scenarioCategory")?.value || "Elektrik";
      const templates = getScenarioTemplatesForCategory(category);
      return templates.map((item) => ({
        value: item.id,
        label: item.title,
        meta: `${item.tag} • %${item.defaultReduction} • ${item.cost} maliyet • ${item.duration}`,
        searchText: `${item.title} ${item.tag} ${item.category} ${item.description || ""} ${item.owner || ""}`
      }));
    }
  }
};

function getScenarioPickerDisplay(type, value) {
  const config = scenarioPickerConfig[type];
  if (!config) return value || "";
  const item = config.getItems().find((entry) => entry.value === value);
  return item?.label || value || "";
}

function getScenarioPickerItems(type, query = "") {
  const config = scenarioPickerConfig[type];
  if (!config) return [];
  const q = slugify(query);
  const items = config.getItems();
  if (!q) return items.slice(0, 8);
  return items.filter((item) => {
    const searchable = slugify(`${item.label} ${item.meta || ""} ${item.searchText || ""}`);
    return searchable.includes(q) || q.split(" ").filter(Boolean).some((word) => searchable.includes(word));
  }).slice(0, 8);
}

function renderScenarioSuggestions(type, query = "") {
  const config = scenarioPickerConfig[type];
  if (!config) return;
  const suggestions = document.querySelector(config.suggestionsId);
  if (!suggestions) return;

  const items = getScenarioPickerItems(type, query);
  if (!items.length) {
    suggestions.innerHTML = `<button type="button" class="scenario-suggestion-btn" disabled>Uygun seçenek bulunamadı</button>`;
    suggestions.classList.add("show");
    return;
  }

  suggestions.innerHTML = items.map((item) => `
    <button type="button" class="scenario-suggestion-btn" data-picker-type="${type}" data-picker-value="${String(item.value).replace(/"/g, "&quot;")}">
      ${item.label}
      ${item.meta ? `<small>${item.meta}</small>` : ""}
    </button>
  `).join("");
  suggestions.classList.add("show");

  suggestions.querySelectorAll("[data-picker-value]").forEach((button) => {
    button.addEventListener("click", () => {
      selectScenarioPickerValue(type, button.dataset.pickerValue);
    });
  });
}

function closeScenarioSuggestions(type) {
  const config = scenarioPickerConfig[type];
  const suggestions = config ? document.querySelector(config.suggestionsId) : null;
  if (suggestions) suggestions.classList.remove("show");
}

function selectScenarioPickerValue(type, value) {
  const config = scenarioPickerConfig[type];
  if (!config) return;
  const select = document.querySelector(config.selectId);
  if (!select) return;

  select.value = value;
  syncScenarioPickerUI(type);
  closeScenarioSuggestions(type);

  if (type === "category") {
    select.dispatchEvent(new Event("change", { bubbles: true }));
    syncScenarioPickerUI("category");
  } else if (type === "template") {
    select.dispatchEvent(new Event("change", { bubbles: true }));
  } else {
    renderScenarioSelectionSummary();
  }
}

function syncScenarioPickerUI(type) {
  const config = scenarioPickerConfig[type];
  if (!config) return;
  const select = document.querySelector(config.selectId);
  const input = document.querySelector(config.inputId);
  const chip = document.querySelector(config.chipId);
  if (!select || !input || !chip) return;

  const label = getScenarioPickerDisplay(type, select.value);
  input.value = label;
  chip.innerHTML = label
    ? `<button type="button" class="selected-chip" data-chip-picker="${type}" title="Önerileri tekrar aç">${label}<span>↺</span></button>`
    : "";

  const chipButton = chip.querySelector("[data-chip-picker]");
  if (chipButton) {
    chipButton.addEventListener("click", () => {
      input.focus();
      input.select();
      renderScenarioSuggestions(type, input.value);
    });
  }
  renderScenarioSelectionSummary();
}

function renderScenarioSelectionSummary() {
  const form = document.getElementById("scenarioForm");
  if (!form) return;
  let summary = document.getElementById("scenarioFilterSummary");
  if (!summary) {
    summary = document.createElement("div");
    summary.id = "scenarioFilterSummary";
    summary.className = "scenario-filter-summary";
    const submitButton = form.querySelector(".form-submit");
    form.insertBefore(summary, submitButton);
  }

  const location = getScenarioPickerDisplay("location", $("#scenarioLocation")?.value);
  const category = getScenarioPickerDisplay("category", $("#scenarioCategory")?.value);
  const template = getScenarioPickerDisplay("template", $("#scenarioTemplate")?.value);

  summary.innerHTML = `
    <span>Aktif seçimler:</span>
    <strong>${location || "Lokasyon seçilmedi"}</strong>
    <strong>${category || "Kategori seçilmedi"}</strong>
    <strong>${template || "Senaryo seçilmedi"}</strong>
  `;
}

function setupScenarioSearchPickers() {
  Object.keys(scenarioPickerConfig).forEach((type) => {
    const config = scenarioPickerConfig[type];
    const input = document.querySelector(config.inputId);
    if (!input || input.dataset.pickerReady === "true") return;
    input.dataset.pickerReady = "true";

    input.addEventListener("input", () => {
      renderScenarioSuggestions(type, input.value);
    });
    input.addEventListener("focus", () => {
      renderScenarioSuggestions(type, input.value);
    });
    input.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      const firstItem = getScenarioPickerItems(type, input.value)[0];
      if (firstItem) selectScenarioPickerValue(type, firstItem.value);
    });
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest(".scenario-combo")) return;
    Object.keys(scenarioPickerConfig).forEach(closeScenarioSuggestions);
  });

  ["location", "category", "template"].forEach(syncScenarioPickerUI);
}


async function seedDemoData() {
  const demoRecords = buildDemoRecordsForCurrentCampus();

  if (backendEnabled) {
    try {
      await apiRequest("/records", { method: "DELETE" });
      for (const item of demoRecords) {
        await apiRequest("/records", {
          method: "POST",
          body: JSON.stringify({
            location: item.location,
            category: item.category,
            amount: item.amount,
            source: item.source,
            status: item.status,
            date: item.date,
            description: item.description
          })
        });
      }
      emissions = await apiRequest("/records");
      saveRecords();
      renderAll();
      showToast(`${getCampusDisplayName()} için demo verileri backend veritabanına yazıldı.`);
      return;
    } catch (error) {
      backendEnabled = false;
      setBackendStatus(false, "Backend isteği başarısız oldu: localStorage moduna geçildi.");
      showToast("Backend yanıt vermedi, demo verisi tarayıcıya yazılıyor.");
    }
  }

  emissions = demoRecords;
  saveRecords();
  renderAll();
  showToast(`${getCampusDisplayName()} için demo verileri üretildi. Dashboard ve harita güncellendi.`);
}

function buildDemoRecordsForCurrentCampus() {
  const activeLocations = locations.length ? locations : makeGenericCampusLocations(currentCampus.center || { lat: 40.9, lng: 31.18 }, "Kampüs");
  const selected = activeLocations.slice(0, Math.min(12, activeLocations.length));
  const month = "2026-04";
  const records = [];

  selected.forEach((loc, index) => {
    const base = Math.max(900, Math.round(Number(loc.budget || 3000) * (0.62 + (index % 5) * 0.09)));
    const date = `${month}-${String(7 + (index % 14)).padStart(2, "0")}`;
    records.push(createRecord(loc.name, "Elektrik", base, index % 3 === 0 ? "Sayaç verisi" : "Fatura", "Onaylandı", date, `${loc.name} elektrik tüketimi demo`));

    if (index % 4 === 0) {
      records.push(createRecord(loc.name, "Yakıt", Math.round(120 + index * 18), "Fatura", "Onaylandı", date, `${loc.name} yakıt/ısıtma demo`));
    }
    if (slugify(`${loc.name} ${loc.type}`).includes("yemek") || index === 4) {
      records.push(createRecord(loc.name, "Yemekhane", 900 + index * 80, "Manuel giriş", "Onaylandı", date, "Öğün sayısı demo"));
    }
    if (slugify(`${loc.name} ${loc.type}`).includes("otopark") || index === selected.length - 1) {
      records.push(createRecord(loc.name, "Ulaşım", 4200 + index * 250, "CSV yükleme", "Onaylandı", date, "Servis + araç km demo"));
    }
    if (slugify(`${loc.name} ${loc.type}`).includes("salon") || index === 6) {
      records.push(createRecord(loc.name, "Etkinlik", 450 + index * 20, "Manuel giriş", "İncelemede", date, "Etkinlik katılımcı demo"));
    }
  });

  // Jürinin haritada risk renklerini görebilmesi için ilk lokasyona kontrollü bir bütçe aşımı örneği eklenir.
  if (selected[0]) {
    records.push(createRecord(selected[0].name, "Elektrik", Math.round(Number(selected[0].budget || 3000) * 1.15), "Tahmini veri", "İncelemede", "2026-04-24", "Kontrollü alarm örneği"));
  }

  return records;
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
  /*
  renderAlarms();
  renderActions();
  */
  renderFactorTable();
  renderAiInsight();
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
  const heroTotal = document.getElementById("heroTotal");
  const heroGrade = document.getElementById("heroGrade");
  if (heroTotal) heroTotal.textContent = formatNumber(total, 0);
  if (heroGrade) heroGrade.textContent = grade;
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
  const monthlyFilter = document.getElementById("monthlyFilter")?.value || "monthly";
  const monthlyData = records.reduce((acc, item) => {
    const dateValue = String(item.date || "");
    const period = monthlyFilter === "yearly" ? dateValue.slice(0, 4) : dateValue.slice(0, 7);
    const label = period || "Belirsiz";
    acc[label] = (acc[label] || 0) + Number(item.totalEmission || 0);
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

  const locationLabels = Object.keys(locationData);
  const wrapAxisLabel = (label, maxLength = 16) => {
    const words = String(label).split(" ");
    const lines = [];
    let currentLine = "";

    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (testLine.length <= maxLength) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });

    if (currentLine) lines.push(currentLine);
    return lines;
  };

  createOrUpdateChart("locationChart", {
    type: "bar",
    data: {
      labels: locationLabels.map((label) => wrapAxisLabel(label)),
      datasets: [{ label: "kg CO₂e", data: Object.values(locationData), backgroundColor: chartColors(locationLabels.length) }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { autoSkip: false, font: { size: 9 }, maxRotation: 0, minRotation: 0, padding: 6 } },
        y: { beginAtZero: true }
      }
    }
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
  const records = [...emissions].sort((a, b) => new Date(b.date) - new Date(a.date));
  if (!records.length) {
    table.innerHTML = `<tr><td colspan="5" class="muted">Henüz kayıt yok. Demo verisi üret veya yeni veri gir.</td></tr>`;
    return;
  }

  table.innerHTML = records.map((item) => {
    const statusClass = item.status === "İncelemede" ? "pending" : item.status === "Reddedildi" ? "rejected" : item.status === "Taslak" ? "draft" : "";
    return `
      <tr class="${editingRecordId === item.id ? "editing-row" : ""}">
        <td data-label="Lokasyon">${escapeHtml(item.location)}<br><small class="muted">${escapeHtml(item.date)}</small></td>
        <td data-label="Kategori">${escapeHtml(item.category)}<br><span class="status-chip ${statusClass}">${escapeHtml(item.status)}</span></td>
        <td data-label="Emisyon"><strong>${formatKg(item.totalEmission)}</strong></td>
        <td data-label="Güven">${item.confidence}%</td>
        <td data-label="İşlemler">
          <div class="record-actions">
            <button class="row-btn" data-explain="${item.id}">Hesaplamayı Gör</button>
            <button class="row-btn edit" data-edit="${item.id}">Düzenle</button>
            <button class="row-btn danger" data-delete="${item.id}">Sil</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  $$('[data-explain]').forEach((button) => {
    button.addEventListener("click", () => openExplanation(button.dataset.explain));
  });
  $$('[data-edit]').forEach((button) => {
    button.addEventListener("click", () => startEditRecord(button.dataset.edit));
  });
  $$('[data-delete]').forEach((button) => {
    button.addEventListener("click", () => deleteSingleRecord(button.dataset.delete));
  });
}

function startEditRecord(id) {
  const item = emissions.find((record) => record.id === id);
  if (!item) return;
  editingRecordId = id;
  setRecordFormMode("edit");

  $("#locationInput").value = item.location;
  $("#categoryInput").value = item.category;
  $("#amountInput").value = item.amount;
  $("#unitInput").value = item.unit;
  $("#sourceInput").value = item.source;
  const statusInput = document.getElementById("statusInput");
  if (statusInput) statusInput.value = item.status;
  $("#dateInput").value = item.date;
  $("#descriptionInput").value = item.description || "";
  updateUnitInput();
  renderRecordsTable();

  document.getElementById("data-entry")?.scrollIntoView({ behavior: "smooth", block: "start" });
  showToast("Kayıt düzenleme moduna alındı. Değişiklikleri formdan kaydedebilirsin.");
}

async function deleteSingleRecord(id) {
  const item = emissions.find((record) => record.id === id);
  if (!item) return;

  const ok = confirm(`${item.location} / ${item.category} kaydı silinsin mi?`);
  if (!ok) return;

  if (backendEnabled) {
    try {
      await apiRequest(`/records/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (editingRecordId === id) resetRecordForm();
      await syncFromBackend();
      showToast("Kayıt backend veritabanından silindi.");
      return;
    } catch (error) {
      backendEnabled = false;
      setBackendStatus(false, "Backend isteği başarısız oldu: localStorage moduna geçildi.");
      showToast("Backend yanıt vermedi, kayıt localStorage modunda siliniyor.");
    }
  }

  emissions = emissions.filter((record) => record.id !== id);
  if (editingRecordId === id) resetRecordForm();
  saveRecords();
  renderAll();
  showToast("Kayıt silindi.");
}


// ─── Leaflet harita state ───────────────────────────────────
let leafletMap = null;
let leafletMarkers = {};
let campusBoundaryLayer = null;

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
        <span class="cm-popup-icon">${escapeHtml(loc.icon)}</span>
        <div>
          <h4 class="cm-popup-title">${escapeHtml(loc.name)}</h4>
          <span class="cm-popup-type">${escapeHtml(loc.type)} · ${escapeHtml(loc.floor)} · ${escapeHtml(loc.area)}</span>
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
        <div class="cm-popup-suggestion">${escapeHtml(getLocationSuggestion(loc.name, topCategory[0]))}</div>
      </div>
    </div>`;
}

function renderMap() {
  const mapEl = document.getElementById("campusMap");
  if (!mapEl) return;
  if (typeof L === "undefined") {
    mapEl.innerHTML = `<div class="cm-map-fallback">Harita yüklenemedi. İnternet bağlantısını kontrol edin.</div>`;
    return;
  }

  if (!locations.length) {
    mapEl.innerHTML = `<div class="cm-map-fallback">Bu kampüs için lokasyon bulunamadı.</div>`;
    return;
  }

  if (!leafletMap) {
    const centerLat = currentCampus?.center?.lat || (locations.reduce((s, l) => s + Number(l.lat), 0) / locations.length);
    const centerLng = currentCampus?.center?.lng || (locations.reduce((s, l) => s + Number(l.lng), 0) / locations.length);

    leafletMap = L.map("campusMap", {
      center: [centerLat, centerLng],
      zoom: currentCampus?.zoom || 16,
      zoomControl: true,
      scrollWheelZoom: true
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(leafletMap);

    // Leaflet bazen sayfa ilk açıldığında container genişliğini geç hesaplayabiliyor.
    // Bu çağrı gri/kaymış harita görünümünü düzeltir.
    setTimeout(() => leafletMap.invalidateSize(), 150);
  }

  Object.values(leafletMarkers).forEach((m) => m.remove());
  leafletMarkers = {};
  if (campusBoundaryLayer) {
    campusBoundaryLayer.remove();
    campusBoundaryLayer = null;
  }

  const lats = locations.map((l) => Number(l.lat)).filter(Number.isFinite);
  const lngs = locations.map((l) => Number(l.lng)).filter(Number.isFinite);
  if (lats.length && lngs.length) {
    campusBoundaryLayer = L.rectangle(
      [[Math.min(...lats) - 0.001, Math.min(...lngs) - 0.001],
       [Math.max(...lats) + 0.001, Math.max(...lngs) + 0.001]],
      { color: "#0b6b4b", weight: 2, opacity: 0.4, fillColor: "#0b6b4b", fillOpacity: 0.04, dashArray: "6 4" }
    ).addTo(leafletMap);
  }

  locations.forEach((loc) => {
    const total = getLocationTotal(loc.name);
    const risk = getRiskLevel(total, loc.budget);
    const icon = createMarkerIcon(risk, loc.icon);

    const marker = L.marker([Number(loc.lat), Number(loc.lng)], { icon })
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
  fitMapToCampus(false);
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
      <button class="cm-legend-item" data-focus-location="${escapeHtml(loc.name)}">
        <span class="cm-legend-dot" style="background:${c.bg}"></span>
        <span class="cm-legend-icon">${escapeHtml(loc.icon)}</span>
        <div class="cm-legend-text">
          <strong>${escapeHtml(loc.name)}</strong>
          <span>${formatKg(total)}</span>
        </div>
        <span class="cm-legend-pct" style="color:${c.text};background:${c.ring}">${budgetPct}%</span>
      </button>`;
  }).join("");

  legendEl.querySelectorAll("[data-focus-location]").forEach((button) => {
    button.addEventListener("click", () => focusLocation(button.dataset.focusLocation));
  });
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

function fitMapToCampus(animate = true) {
  if (!leafletMap || !locations.length) return;
  const bounds = locations.map((l) => [Number(l.lat), Number(l.lng)]);
  if (animate) {
    leafletMap.flyToBounds(bounds, { padding: [50, 50], animate: true, duration: 0.8 });
  } else {
    leafletMap.fitBounds(bounds, { padding: [50, 50], animate: false });
  }
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
  const table = $("#factorTable");
  if (!table) return;

  table.innerHTML = Object.entries(factors).map(([category, item]) => `
    <tr>
      <td data-label="Kategori"><strong>${category}</strong></td>
      <td data-label="Birim">${item.unit}</td>
      <td data-label="Faktör">${item.factor} kg CO₂e/${item.unit}</td>
      <td data-label="Scope">${item.scope}</td>
      <td data-label="Kaynak"><strong>${item.source || "Demo"}</strong><br><small>${item.sourceType || ""}</small></td>
      <td data-label="Yıl">${item.sourceYear || "-"}</td>
      <td data-label="Güven"><span class="status-chip">${item.confidence || "Demo"}</span></td>
      <td data-label="Açıklama">${item.description}</td>
    </tr>
  `).join("");
}


/* Entegre Yardım Asistanı */
function hasAny(text, words) {
  return words.some((word) => text.includes(word));
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatAnswerHtml(message) {
  return escapeHtml(message).replace(/\n/g, "<br>");
}

const helpTopics = [
  {
    title: "Bu sistem ne işe yarıyor?",
    keywords: ["bu sistem", "ne ise yarar", "nedir", "neden kullan", "excel yerine", "carbonmap", "dashboard neden", "panel ne", "amac"],
    answer: `CarbonMap Campus, idari personelin Excel dosyalarında tuttuğu kampüs tüketim verilerini tek bir dashboard üzerinden yönetmesi için hazırlanmıştır.

Bu sistemle:
1. Elektrik, yemekhane, ulaşım, etkinlik, satın alma ve yakıt verileri tek yerde tutulur.
2. Girilen miktarlar otomatik olarak karbon emisyonuna çevrilir.
3. Dashboard, grafikler ve kampüs haritası üzerinden sonuçlar hızlıca görülür.
4. Excel dosyasındaki veriler CSV olarak toplu aktarılabilir.
5. Yöneticiye sunmak için PDF rapor alınabilir.

Kısaca: Excel’de dağınık duran veriler burada düzenli, görsel, kontrol edilebilir ve raporlanabilir hale gelir.`,
    followUps: [
      "Sistemi hangi sırayla kullanmalıyım?",
      "Excel yerine bu paneli kullanmanın avantajı nedir?",
      "Hangi veriler bu sisteme girilir?",
      "Backend aktif ne demek?"
    ]
  },
  {
    title: "Veri nasıl eklerim?",
    keywords: ["veri ekle", "kayit ekle", "yeni kayit", "veri gir", "manuel giris", "kaydet", "miktar gir", "form", "veri nasil"],
    answer: `Yeni veri eklemek için:

1. Sol menüden “Veri Girişi” bölümüne gidin.
2. Lokasyon seçin. Örneğin: Mühendislik Fakültesi, Yemekhane veya Rektörlük.
3. Kategori seçin. Örneğin: Elektrik, Ulaşım, Yemekhane, Etkinlik, Satın Alma veya Yakıt.
4. Miktar alanına tüketim değerini yazın.
5. Birim alanı kategoriye göre otomatik gelir. Örneğin elektrik için kWh.
6. Veri kaynağını seçin. Fatura veya sayaç verisi daha güvenilir kabul edilir.
7. Kayıt durumunu seçin. Genelde doğru veri için “Onaylandı” seçilebilir.
8. Tarihi girin.
9. “Emisyonu Hesapla ve Kaydet” butonuna basın.

Kayıt eklendiğinde sistem karbon emisyonunu otomatik hesaplar, tabloya ekler ve dashboard’u günceller.`,
    followUps: [
      "Lokasyon seçerken neye dikkat etmeliyim?",
      "Miktar alanına ne yazmalıyım?",
      "Kayıt durumu ne anlama geliyor?",
      "Veri ekledikten sonra nereden kontrol ederim?"
    ]
  },
  {
    title: "Elektrik verisini nasıl girerim?",
    keywords: ["elektrik", "elektrik verisi", "kwh", "fatura", "enerji", "sayac", "elektrik faturasi", "elektrik gir"],
    answer: `Elektrik verisi girmek için:

1. “Veri Girişi” bölümüne gidin.
2. Lokasyon olarak ilgili binayı seçin. Örneğin: Mühendislik Fakültesi.
3. Kategori olarak “Elektrik” seçin.
4. Miktar alanına faturadaki veya sayaçtaki kWh değerini yazın.
5. Veri kaynağı olarak mümkünse “Fatura” veya “Sayaç verisi” seçin.
6. Tarih alanına ilgili dönemi girin.
7. Belge No / Açıklama alanına fatura numarası veya dönem bilgisini yazabilirsiniz.
8. “Emisyonu Hesapla ve Kaydet” butonuna basın.

Not: Elektrik verisinde fatura veya sayaç verisi kullanılması veri güven skorunu yükseltir.`,
    followUps: [
      "Elektrik faturasında hangi değeri yazmalıyım?",
      "kWh değeri nerede yazar?",
      "Fatura numarasını nereye yazacağım?",
      "Elektrik kaydı dashboard’u nasıl etkiler?"
    ]
  },
  {
    title: "Yemekhane verisi nasıl eklenir?",
    keywords: ["yemekhane", "yemek", "ogun", "gida", "porsiyon", "yemekhane verisi", "yemekhane gir"],
    answer: `Yemekhane verisi girmek için:

1. “Veri Girişi” bölümüne gidin.
2. Lokasyon olarak “Yemekhane” seçin.
3. Kategori olarak “Yemekhane” seçin.
4. Miktar alanına ilgili dönemdeki öğün sayısını yazın.
5. Veri kaynağı olarak varsa yemekhane kayıtları, CSV yükleme veya manuel giriş seçilebilir.
6. Tarih alanına ilgili günü veya ayı girin.
7. Açıklama alanına “Nisan ayı öğün sayısı” gibi kısa bilgi yazabilirsiniz.
8. “Emisyonu Hesapla ve Kaydet” butonuna basın.

Bu veri dashboard’da yemekhane kaynaklı emisyonların izlenmesini sağlar.`,
    followUps: [
      "Öğün sayısını nereden almalıyım?",
      "Yemekhane verisinin birimi ne olmalı?",
      "Aylık yemek verisi nasıl girilir?",
      "Yemekhane verisini CSV ile yükleyebilir miyim?"
    ]
  },
  {
    title: "Ulaşım verisi nasıl eklenir?",
    keywords: ["ulasim", "otopark", "servis", "arac", "km", "kilometre", "ulasim verisi", "servis verisi"],
    answer: `Ulaşım verisi girmek için:

1. “Veri Girişi” bölümüne gidin.
2. Lokasyon olarak Otopark veya ilgili kampüs alanını seçin.
3. Kategori olarak “Ulaşım” seçin.
4. Miktar alanına toplam kilometre bilgisini yazın.
5. Veri kaynağı olarak CSV yükleme, manuel giriş veya tahmini veri seçilebilir.
6. Tarih alanını doldurun.
7. Açıklama alanına servis güzergâhı, araç km tahmini veya dönem bilgisi yazabilirsiniz.
8. “Emisyonu Hesapla ve Kaydet” butonuna basın.

Gerçek kullanımda servis kayıtları, araç kilometre bilgileri veya personel ulaşım verileri kullanılabilir.`,
    followUps: [
      "Servis kilometre bilgisini nasıl girmeliyim?",
      "Tahmini ulaşım verisi girilebilir mi?",
      "Ulaşım verisinde lokasyon ne seçilmeli?",
      "Ulaşım verisini CSV ile aktarabilir miyim?"
    ]
  },
  {
    title: "Excel dosyasını nasıl yüklerim?",
    keywords: ["excel", "csv", "dosya", "yukle", "toplu", "aktar", "excel yukle", "csv yukle", "dosya yukleme", "toplu veri"],
    answer: `Excel dosyası doğrudan değil, CSV formatında sisteme aktarılır.

Adımlar:
1. Excel dosyanızı açın.
2. “Farklı Kaydet” seçeneğinden CSV formatını seçin.
3. CarbonMap Campus panelinde “Akıllı CSV” bölümüne gidin.
4. CSV dosyasını seçin.
5. Sistem kolon başlıklarını okuyacaktır.
6. Kolon eşleştirmelerini kontrol edin.
7. “CSV Verilerini Aktar” butonuna basın.

Bu işlem Excel’de tuttuğunuz verileri toplu şekilde sisteme aktarır. Böylece tek tek veri girmek zorunda kalmazsınız.`,
    followUps: [
      "CSV kolon eşleştirme nedir?",
      "Excel’i CSV olarak nasıl kaydederim?",
      "CSV yüklerken tarih formatı nasıl olmalı?",
      "Toplu aktarım sonrası kayıtları nereden görürüm?"
    ]
  },
  {
    title: "Haritadaki renkler ne anlama geliyor?",
    keywords: ["harita", "renk", "kirmizi", "sari", "turuncu", "yesil", "bina", "risk", "lokasyon"],
    answer: `Kampüs haritası, binaların karbon riskini renklerle gösterir.

Renk anlamları:
- Yeşil: Düşük risk
- Sarı/Turuncu: Orta risk
- Kırmızı: Yüksek risk

Bir binaya tıkladığınızda şu bilgiler görüntülenir:
- Toplam emisyon
- Karbon bütçesi
- Risk seviyesi
- Karbon karnesi
- En yüksek kategori
- Veri güveni
- Kısa öneri

Bu ekran, hangi binaya öncelik verilmesi gerektiğini hızlıca anlamak için kullanılır.`,
    followUps: [
      "Kırmızı bina görünürse ne yapmalıyım?",
      "Haritadaki binaya tıklayınca ne olur?",
      "Karbon bütçesi ne demek?",
      "Risk seviyeleri nasıl oluşuyor?"
    ]
  },
  {
    title: "PDF rapor nasıl alırım?",
    keywords: ["pdf", "rapor", "cikti", "yonetici", "indir", "belge", "rapor al", "pdf al", "pdf rapor"],
    answer: `PDF rapor almak için sağ üstteki “PDF Rapor Al” butonuna basın.

PDF raporda şunlar yer alır:
- Toplam karbon emisyonu
- Kategori bazlı dağılım
- Lokasyon bazlı dağılım
- Scope dağılımı
- Karbon alarmları
- Aksiyon planı
- Veri güven skoru
- Yönetici özeti

Bu rapor yöneticilere, sürdürülebilirlik birimine veya ilgili idari birime sunulabilecek özet çıktı olarak kullanılabilir.`,
    followUps: [
      "Rapor almadan önce ne kontrol etmeliyim?",
      "PDF raporda hangi bilgiler var?",
      "PDF rapor boş gelirse ne yapmalıyım?",
      "Raporu yönetime nasıl sunabilirim?"
    ]
  },
  {
    title: "Hatalı kayıt girdim, ne yapmalıyım?",
    keywords: ["hata", "yanlis", "duzelt", "sil", "hatalı", "hatali", "yanlis veri", "kaydi sil", "kayit duzelt", "yanlis miktar"],
    answer: `Hatalı kayıt girildiyse şu adımları izleyebilirsiniz:

1. Yanlış kayıt rapora dahil edilmemeliyse kayıt durumunu “Reddedildi” yapın.
2. Doğru bilgiyle yeni bir kayıt oluşturun.
3. Eğer sadece test yapıyorsanız “Sıfırla” butonu ile demo kayıtlarını temizleyebilirsiniz.
4. Gerçek kullanımda kayıt silme veya düzeltme yetkisi yalnızca yetkili personele verilmelidir.

Öneri: Hatalı kaydı tamamen silmek yerine “Reddedildi” durumuna almak, veri geçmişinin takip edilmesini kolaylaştırır.`,
    followUps: [
      "Yanlış kaydı silmek yerine neden reddediyoruz?",
      "Yanlış miktarı nasıl düzeltirim?",
      "Sıfırla butonu ne yapar?",
      "Kayıt durumu ne anlama geliyor?"
    ]
  },
  {
    title: "Senaryo simülatörü, karbon alarmları ve aksiyon planı nasıl kullanılır?",
    keywords: ["senaryo", "simulator", "azaltim", "tasarruf", "maliyet", "alarm", "uyari", "anomali", "aksiyon", "plan", "oneri", "oncelik", "senaryo simülatörü", "karbon alarmlari", "aksiyon plani"],
    answer: `Bu üç bölüm, girilen verileri yorumlamak ve karar desteği sağlamak için kullanılır.

1. Senaryo Simülatörü:
“Bir binada elektrik tüketimi %15 azaltılırsa ne olur?” gibi sorular için kullanılır. Lokasyon, kategori ve azaltım oranı seçilir; sistem tahmini karbon azaltımını ve elektrik için yaklaşık maliyet tasarrufunu hesaplar.

2. Karbon Alarmları:
Sistem bütçe aşımı, anormal veri veya düşük güvenli kayıt gibi dikkat edilmesi gereken durumları gösterir. Alarm varsa ilgili kayıt veya lokasyon kontrol edilmelidir.

3. Aksiyon Planı:
Sistem veriye göre öncelikli yapılması gereken adımları listeler. Bu bölüm yöneticiye sunulacak “önce ne yapalım?” listesini hazırlamak için kullanılabilir.`,
    followUps: [
      "Senaryo simülatörü ne işe yarar?",
      "Karbon alarmı çıkarsa ne yapmalıyım?",
      "Aksiyon planını yönetime nasıl aktarırım?",
      "Senaryo sonucu nasıl yorumlanır?"
    ]
  },
  {
    title: "CSV kolon eşleştirme nedir?",
    keywords: ["kolon", "eslestirme", "baslik", "sutun", "bina alani", "miktar alani", "kategori alani", "kolon eslestirme"],
    answer: `Kolon eşleştirme, CSV dosyanızdaki sütun başlıklarının sistemdeki alanlarla eşleştirilmesidir.

Örnek:
- bina, fakülte, lokasyon → Lokasyon
- tüketim, miktar, değer → Miktar
- tür, kategori, kaynak → Kategori
- tarih, dönem → Tarih

Eşleştirme doğru yapılırsa sistem verileri doğru okur ve karbon hesabını otomatik yapar.

Önemli: Miktar kolonu sayısal değer içermelidir. Tarih kolonu mümkünse yıl-ay-gün formatında olmalıdır.`,
    followUps: [
      "Excel dosyasını nasıl yüklerim?",
      "CSV’de miktar alanı yanlışsa ne olur?",
      "CSV yüklerken tarih formatı nasıl olmalı?",
      "Toplu aktarım sonrası kayıtları nereden görürüm?"
    ]
  },
  {
    title: "Dashboard ne gösterir?",
    keywords: ["dashboard", "panel", "kart", "grafik", "ana ekran", "toplam emisyon", "en yuksek kategori", "en yuksek lokasyon"],
    answer: `Dashboard ekranı kampüsün genel karbon durumunu özetler.

Burada şunları görebilirsiniz:
- Toplam Emisyon: Sisteme girilen aktif kayıtların toplam karbon değeri.
- En Yüksek Kategori: En çok emisyon oluşturan faaliyet türü.
- En Yüksek Lokasyon: En çok emisyon oluşturan bina veya alan.
- Veri Güven Skoru: Verilerin kaynağına göre güvenilirlik oranı.
- Aktif Alarm: Bütçe aşımı veya anormal veri uyarıları.
- Hedef Durumu: Kampüsün azaltım hedeflerine göre mevcut durumu.
- Grafikler: Kategori, lokasyon, aylık trend ve Scope dağılımlarını gösterir.

İdari personel bu ekranı genel durumu hızlıca görmek için kullanabilir.`,
    followUps: [
      "Toplam emisyon ne anlama geliyor?",
      "En yüksek kategori ne demek?",
      "Veri güven skoru nedir?",
      "Grafikler nasıl yorumlanır?"
    ]
  },
  {
    title: "Veri güven skoru nedir?",
    keywords: ["guven", "skor", "fatura", "sayac", "tahmini", "manuel", "dogruluk", "veri guven", "kaynak"],
    answer: `Veri güven skoru, girilen verinin kaynağına göre hesaplanan güvenilirlik oranıdır.

Genel mantık:
- Fatura: yüksek güven
- Sayaç verisi: yüksek güven
- CSV yükleme: güvenilir
- Manuel giriş: orta güvenilir
- Tahmini veri: düşük güvenilir

Güven skoru yüksekse raporun güvenilirliği artar. Tahmini veri çok fazlaysa rapor hazırlanmadan önce bu kayıtların kontrol edilmesi önerilir.`,
    followUps: [
      "Fatura ile manuel giriş farkı nedir?",
      "Tahmini veri ne demek?",
      "Veri güven skoru düşükse ne yapmalıyım?",
      "PDF raporda veri güven skoru görünür mü?"
    ]
  },
  {
    title: "Emisyon faktörü kaynağı nedir?",
    keywords: ["emisyon faktoru", "faktor kaynagi", "faktor nereden", "kaynak ne", "co2 faktoru", "hesaplama dayanak", "elektrik katsayisi", "kg co2e", "ton co2e", "petrol esdegeri", "tep", "toe"],
    answer: `Emisyon faktörü, girilen tüketim verisini kg CO₂e değerine çevirmek için kullanılan katsayıdır.

Örnek:
Elektrik tüketimi × elektrik emisyon faktörü = kg CO₂e

Bu projede ana birim kg CO₂e’dir. Yıllık raporlama için ton CO₂e/yıl kullanılabilir.

Faktör kaynakları:
- Elektrik: T.C. Enerji ve Tabii Kaynaklar Bakanlığı elektrik üretimi/tüketimi emisyon faktörü.
- Yakıt: IPCC / GHG Protocol / EPA yakıt faktörleri temel alınarak demo faktörü.
- Ulaşım: UK GOV / EPA ulaşım faktörleri baz alınarak demo ortalama.
- Yemekhane: ADEME/Agribalyse ve literatüre dayalı ortalama öğün varsayımı.
- Etkinlik ve Satın Alma: demo katsayıdır; gerçek kullanımda bileşen veya ürün türüne göre ayrıştırılmalıdır.

Faktörlerin kaynak, yıl ve güven bilgilerini “Faktörler” bölümünde görebilirsiniz.`,
    followUps: [
      "Elektrik faktörü neden değişti?",
      "kg CO₂e ne demek?",
      "Petrol eşdeğeri kullanmalı mıyız?",
      "Faktörler bölümünde neye bakmalıyım?"
    ]
  },
  {
    title: "Kayıt durumu ne anlama geliyor?",
    keywords: ["onaylandi", "incelemede", "taslak", "reddedildi", "durum", "kayit durumu", "onay", "kontrol"],
    answer: `Kayıt durumu, girilen verinin rapora dahil edilip edilmeyeceğini gösterir.

- Onaylandı: Raporlara dahil edilir.
- İncelemede: Kontrol edilmesi gereken kayıttır.
- Taslak: Henüz tamamlanmamış kayıttır.
- Reddedildi: Hatalı veya kullanılmayacak kayıttır.

Dashboard hesaplamalarında genellikle onaylı ve incelemedeki kayıtlar dikkate alınır.`,
    followUps: [
      "Hatalı kayıt girdim, ne yapmalıyım?",
      "Onaylandı ne zaman seçilir?",
      "İncelemede ne zaman seçilir?",
      "Reddedildi olan kayıt rapora girer mi?"
    ]
  },
  {
    title: "Backend aktif ne demek?",
    keywords: ["backend", "aktif", "kapali", "veritabani", "kaydediliyor", "sqlite", "database"],
    answer: `Backend durumu, sistemin verileri nereye kaydettiğini gösterir.

Backend Aktif:
Veriler SQLite veritabanına kaydedilir. Gerçek kullanımda istenen durum budur.

Backend Kapalı:
Sistem geçici olarak tarayıcı belleğinde çalışır. Bu mod test için uygundur fakat kalıcı kullanım için önerilmez.

İdari personelin gerçek kayıtlarla çalıştığı durumda sağ üstte “Backend: Aktif” yazması gerekir.`,
    followUps: [
      "Veriler gerçekten kaydediliyor mu?",
      "Backend kapalıysa ne olur?",
      "DB Browser ile kayıtları nasıl kontrol ederim?",
      "Demo verisi üret ne işe yarar?"
    ]
  },
  {
    title: "Demo verisi üret ne işe yarar?",
    keywords: ["demo", "demo verisi", "test", "ornek veri", "seed", "demo uret"],
    answer: `“Demo Verisi Üret” butonu, sistemi test etmek için örnek karbon kayıtları oluşturur.

Bu buton:
- Dashboard’u doldurur.
- Haritada renkli bina risklerini gösterir.
- Alarm örnekleri üretir.
- Aksiyon planını gösterir.
- PDF raporun nasıl görüneceğini test etmeyi sağlar.

Gerçek kullanımda demo verisi yerine kurumun gerçek elektrik, ulaşım, yemekhane, etkinlik ve satın alma verileri girilmelidir.`,
    followUps: [
      "Sıfırla butonu ne yapar?",
      "Demo verisi gerçek veri mi?",
      "Demo verisini ne zaman kullanmalıyım?",
      "PDF rapor nasıl alırım?"
    ]
  },
  {
    title: "Sıfırla butonu ne yapar?",
    keywords: ["sifirla", "temizle", "silinir mi", "sifirlarsam", "tum veri", "reset"],
    answer: `“Sıfırla” butonu mevcut test veya demo kayıtlarını temizler.

Bu buton özellikle demo sırasında veya test verilerini temizlemek için kullanılır.

Dikkat:
- Gerçek kullanımda bu buton dikkatli kullanılmalıdır.
- Canlı sistemde sıfırlama yetkisi yalnızca yetkili kullanıcıya verilmelidir.
- Yanlışlıkla sıfırlamayı önlemek için ileride onay penceresi veya yetki kontrolü eklenebilir.`,
    followUps: [
      "Hatalı kayıt girdim, ne yapmalıyım?",
      "Demo verisi üret ne işe yarar?",
      "Sıfırlama gerçek veriyi siler mi?",
      "Backend aktif ne demek?"
    ]
  },
  {
    title: "Sistemi hangi sırayla kullanmalıyım?",
    keywords: ["nereden basla", "nasil kullan", "sirayla", "ilk once", "adim", "sira", "kullanim sirasi", "baslangic"],
    answer: `Sistemi kullanmak için önerilen sıra şöyledir:

1. Önce sağ üstte Backend durumunun “Aktif” olduğunu kontrol edin.
2. Tek tek kayıt girecekseniz “Veri Girişi” bölümünü kullanın.
3. Excel’den veri aktaracaksanız Excel dosyanızı CSV olarak kaydedip “Akıllı CSV” bölümünden yükleyin.
4. Dashboard ekranından genel karbon durumunu kontrol edin.
5. Kampüs Haritası bölümünde riskli binaları inceleyin.
6. Karbon Alarmları bölümündeki uyarıları kontrol edin.
7. Aksiyon Planı bölümünde önerilen adımları görüntüleyin.
8. Gerekirse Senaryo Simülatörü ile azaltım etkisini hesaplayın.
9. Son olarak “PDF Rapor Al” butonuyla yönetici raporu oluşturun.`,
    followUps: [
      "Veri nasıl eklerim?",
      "Excel dosyasını nasıl yüklerim?",
      "Dashboard ne gösterir?",
      "PDF rapor nasıl alırım?"
    ]
  },

  {
    title: "Fakülte veya lokasyon seçimini nasıl yaparım?",
    keywords: ["fakulte", "fakülte", "bina", "lokasyon sec", "lokasyon seç", "hangi fakulte", "muhendislik", "rektorluk", "kutuphane", "kampus binasi", "kampüs binası", "alan secimi", "birim secimi"],
    answer: `Lokasyon seçimi, verinin hangi bina veya kampüs alanına ait olduğunu belirtir.

Nasıl seçilir?
1. Veri Girişi bölümüne gidin.
2. Lokasyon alanından ilgili binayı seçin. Örneğin: Mühendislik Fakültesi, Yemekhane, Kütüphane, Rektörlük, Otopark veya Konferans Salonu.
3. Eğer veri belirli bir binaya ait değilse, kurumunuzun belirlediği en yakın lokasyonu seçin.
4. Açıklama alanına daha detaylı bilgi yazabilirsiniz. Örneğin: “Mühendislik B Blok elektrik faturası”.

Önemli: Aynı faturayı birden fazla lokasyona bölüyorsanız, miktarı paylaştırarak ayrı kayıtlar halinde girmek daha doğru olur.`,
    followUps: [
      "Elektrik verisini nasıl girerim?",
      "Fatura numarasını nereye yazacağım?",
      "Haritadaki binaya tıklayınca ne olur?",
      "Yanlış lokasyon seçersem ne yapmalıyım?"
    ]
  },
  {
    title: "Fatura veya belge bilgisini nasıl girerim?",
    keywords: ["fatura", "fatura no", "fatura numarasi", "belge", "belge no", "evrak", "fis", "makbuz", "sayaç belgesi", "sayac belgesi", "kanit", "kanıt", "fatura bilgisi", "fatura kaydi", "fatura kayıt"],
    answer: `Fatura veya belge bilgisi, girilen verinin hangi kaynağa dayandığını göstermek için kullanılır.

Fatura bilgisi girmek için:
1. Veri Girişi bölümüne gidin.
2. Lokasyon, kategori ve miktarı doldurun.
3. Veri Kaynağı alanında mümkünse “Fatura” seçin.
4. Belge No / Açıklama alanına fatura numarasını, dönem bilgisini veya kısa açıklamayı yazın.

Örnek açıklama:
- EF-2026-04-001
- Nisan 2026 elektrik faturası
- Mühendislik Fakültesi sayaç verisi

Bu bilgi, daha sonra rapor kontrolü ve veri doğrulama için işe yarar.`,
    followUps: [
      "Fatura resmi yükleyebilir miyim?",
      "Elektrik faturasında hangi değeri yazmalıyım?",
      "Veri güven skoru nedir?",
      "Hatalı kayıt girdim, ne yapmalıyım?"
    ]
  },
  {
    title: "Fatura resmi veya görsel yükleyebilir miyim?",
    keywords: ["resim", "gorsel", "görsel", "foto", "fotograf", "fotoğraf", "fatura resmi", "fatura görseli", "fatura gorseli", "belge resmi", "ek dosya", "dosya ekle", "kanıt dosyası", "kanit dosyasi", "resim yukle", "gorsel yukle", "foto yukle"],
    answer: `Bu prototipte ana dosya yükleme alanı CSV/Excel aktarımı içindir. Fatura görseli veya belge resmi yükleme özelliği kurumsal sürüm için eklenebilir.

Şu an ne yapabilirsiniz?
1. Fatura bilgisini “Belge No / Açıklama” alanına yazın.
2. Açıklamaya dönem ve belge bilgisini ekleyin. Örneğin: “Nisan 2026 elektrik faturası / EF-2026-04-001”.
3. Eğer ekip belge dosyası takibi istiyorsa, sonraki sürümde “Kanıt Dosyası Yükle” alanı eklenebilir.

Not: Fatura görseli yükleme yoksa bu bir hata değildir; mevcut sürümde belge numarası ve açıklama alanı kullanılır.`,
    followUps: [
      "Fatura veya belge bilgisini nasıl girerim?",
      "Dosya yükleme çalışmıyor, ne yapmalıyım?",
      "Excel dosyasını nasıl yüklerim?",
      "Veri güven skoru nedir?"
    ]
  },
  {
    title: "Rapor sayfası ve sonuç raporu nerede?",
    keywords: ["rapor sayfasi", "rapor sayfası", "son rapor", "sonuc raporu", "sonuç raporu", "sonuc", "sonuç", "rapor sonucu", "rapor nerede", "raporu nereden gorecegim", "raporu nereden göreceğim", "rapor gorunmuyor", "rapor görünmüyor", "son ciktı", "son çıktı"],
    answer: `Bu sürümde rapor ayrı bir sayfa olarak açılmak yerine, sağ üstteki “PDF Rapor Al” butonu ile dosya çıktısı olarak oluşturulur.

Rapor almak için:
1. Önce veri girişi veya CSV yükleme ile kayıtların oluştuğundan emin olun.
2. Dashboard, harita ve alarmların dolduğunu kontrol edin.
3. Sağ üstteki “PDF Rapor Al” butonuna basın.
4. Tarayıcı PDF dosyasını indirir veya açar.

Rapor boş gelirse önce “Demo Verisi Üret” ya da gerçek veri girişi yapıldığından emin olun.`,
    followUps: [
      "PDF rapor nasıl alırım?",
      "PDF rapor boş gelirse ne yapmalıyım?",
      "Rapor almadan önce ne kontrol etmeliyim?",
      "Raporu yönetime nasıl sunabilirim?"
    ]
  },
  {
    title: "Dosya yükleme çalışmıyor, ne yapmalıyım?",
    keywords: ["dosya yukleme", "dosya yükleme", "dosya yukleyemiyorum", "dosya yükleyemiyorum", "yukleme sorunu", "yükleme sorunu", "yulkelem", "yüklem", "yuklem", "csv yuklenmiyor", "excel yuklenmiyor", "dosya secilmiyor", "dosya seçilmiyor", "aktar calismiyor", "aktar çalışmıyor", "import sorunu"],
    answer: `Dosya yükleme sorunu yaşıyorsanız şu kontrolleri yapın:

1. Dosyanın CSV formatında olduğundan emin olun. Excel dosyası önce CSV olarak kaydedilmelidir.
2. Dosya adında çok özel karakterler varsa sadeleştirin. Örneğin: elektrik_nisan_2026.csv
3. CSV içinde başlık satırı olduğundan emin olun. Örneğin: lokasyon, kategori, miktar, tarih.
4. Akıllı CSV bölümünde kolon eşleştirmelerini kontrol edin.
5. “CSV Verilerini Aktar” butonuna bastıktan sonra Son Kayıtlar tablosunu kontrol edin.
6. Hâlâ çalışmıyorsa sayfayı yenileyip tekrar deneyin.

Not: Fatura resmi, PDF ya da Word dosyası bu alandan içe aktarılmaz; bu alan karbon kayıtlarını CSV olarak almak içindir.`,
    followUps: [
      "Excel dosyasını nasıl yüklerim?",
      "CSV kolon eşleştirme nedir?",
      "Toplu aktarım sonrası kayıtları nereden görürüm?",
      "Fatura resmi yükleyebilir miyim?"
    ]
  },
  {
    title: "Butona tıklayamıyorum veya sayfa tepki vermiyor",
    keywords: ["tiklama", "tıklama", "tiklayamiyorum", "tıklayamıyorum", "buton calismiyor", "buton çalışmıyor", "sayfa acilmiyor", "sayfa açılmıyor", "tepki vermiyor", "dondu", "takildi", "tıkladım olmadı", "tikladim olmadi", "pdf butonu calismiyor", "rapor butonu çalışmıyor"],
    answer: `Bir butona tıkladığınızda işlem olmuyorsa şu adımları deneyin:

1. Sayfayı yenileyin ve tekrar deneyin.
2. Backend durumunun “Aktif” olup olmadığını kontrol edin.
3. Eğer PDF, grafik veya CSV alanı çalışmıyorsa internet bağlantısını kontrol edin; bazı kütüphaneler internet üzerinden yüklenir.
4. Veri yoksa bazı butonlar boş sonuç üretebilir. Önce Demo Verisi Üret veya Veri Girişi ile kayıt oluşturun.
5. Tarayıcı konsolunda hata varsa teknik ekibe ekran görüntüsü gönderin.

İdari personel için pratik çözüm: Önce sayfayı yenileyin, sonra Backend Aktif mi kontrol edin, ardından aynı işlemi tekrar deneyin.`,
    followUps: [
      "Backend aktif ne demek?",
      "PDF rapor boş gelirse ne yapmalıyım?",
      "Demo verisi üret ne işe yarar?",
      "Dosya yükleme çalışmıyor, ne yapmalıyım?"
    ]
  },
  {
    title: "Yönetime hangi raporu sunmalıyım?",
    keywords: ["yonetime rapor", "yonetim raporu", "hangi rapor", "yonetime hangi rapor", "aylik rapor", "idare raporu", "mudurluk raporu", "ust yonetim", "rapor sun"],
    answer: `Yönetime sunmak için PDF raporu kullanabilirsiniz. Raporu almadan önce kısa bir kontrol yapmanız önerilir.

Önerilen hazırlık sırası:
1. İlgili dönem için elektrik, yemekhane, ulaşım ve diğer verilerin girildiğini kontrol edin.
2. Hatalı kayıtlar varsa “Reddedildi” durumuna alın.
3. Tahmini veriler fazlaysa mümkünse fatura, sayaç veya resmi birim kaydıyla doğrulayın.
4. Dashboard’da toplam emisyon, en yüksek lokasyon ve en yüksek kategori bilgilerini kontrol edin.
5. Haritada kırmızı görünen binaları inceleyin.
6. Karbon Alarmları ve Aksiyon Planı bölümlerini gözden geçirin.
7. Senaryo Simülatörü ile yönetime sunulabilecek bir iyileştirme senaryosu oluşturun.
8. Son olarak “PDF Rapor Al” butonuyla yönetim çıktısını alın.

Yönetim için en uygun çıktı: PDF rapor + senaryo simülatöründeki Yönetici Özeti + Karar Notu alanlarıdır.`,
    followUps: [
      "Rapor almadan önce ne kontrol etmeliyim?",
      "Raporu yönetime nasıl açıklamalıyım?",
      "Senaryo sonucunu rapora nasıl eklerim?",
      "PDF rapor nasıl alırım?"
    ]
  },
  {
    title: "Rapor almadan önce ne kontrol etmeliyim?",
    keywords: ["rapor almadan", "rapor oncesi", "kontrol listesi", "rapor kontrol", "pdf oncesi", "rapor hazirlik", "raporu almadan", "son kontrol"],
    answer: `Rapor almadan önce şu kontrol listesini uygulayın:

1. İlgili dönem için tüm veriler girildi mi?
2. Demo veya test verisi gerçek rapordan önce temizlendi mi?
3. Hatalı kayıtlar “Reddedildi” durumuna alındı mı?
4. Tahmini veriler mümkünse fatura veya sayaç verisiyle kontrol edildi mi?
5. Veri güven skoru çok düşük mü?
6. Dashboard’da en yüksek lokasyon ve kategori incelendi mi?
7. Haritadaki kırmızı binalar kontrol edildi mi?
8. Karbon alarmları ve anomali uyarıları incelendi mi?
9. Aksiyon Planı güncel mi?
10. Senaryo Simülatörü sonucu yönetime sunulacaksa Yönetici Özeti kontrol edildi mi?

Bu kontrollerden sonra PDF rapor almak daha sağlıklı olur.`,
    followUps: [
      "PDF rapor nasıl alırım?",
      "Veri güven skoru nedir?",
      "Hatalı kayıt girdim, ne yapmalıyım?",
      "Karbon alarmı çıkarsa ne yapmalıyım?"
    ]
  },
  {
    title: "Raporu yönetime nasıl açıklamalıyım?",
    keywords: ["yonetime nasil aciklarim", "raporu nasil anlatirim", "yonetime anlat", "sunum metni", "aciklama metni", "raporu sun", "yoneticiye anlat", "ust yonetime", "müdüre anlat", "mudure anlat"],
    answer: `Raporu yönetime açıklarken şu sırayı izleyebilirsiniz:

1. Önce rapor dönemini belirtin.
2. Toplam karbon emisyonunu söyleyin.
3. En yüksek emisyon oluşturan lokasyonu açıklayın.
4. En yüksek kategoriyi belirtin. Örneğin elektrik, yemekhane veya ulaşım.
5. Haritadaki kırmızı/sarı/yeşil riskleri kısaca anlatın.
6. Aktif karbon alarmlarını gösterin.
7. Aksiyon Planı bölümündeki öncelikli iyileştirme önerisini söyleyin.
8. Senaryo Simülatörü sonucuyla seçilen önlemin tahmini etkisini aktarın.

Örnek yönetim açıklaması:
“Bu dönem kampüs genelinde en yüksek emisyon Mühendislik Fakültesi’nde görülmektedir. Öncelikli kaynak elektrik tüketimidir. LED dönüşümü veya mesai dışı cihaz kapatma politikasıyla belirli oranda azaltım sağlanabilir. Senaryo simülatörü bu azaltımın tahmini karbon ve maliyet etkisini göstermektedir.”`,
    followUps: [
      "Yönetime hangi raporu sunmalıyım?",
      "Senaryo sonucu ne anlama geliyor?",
      "Yönetici özeti nasıl oluşturulur?",
      "Haritadaki renkler ne anlama geliyor?"
    ]
  },
  {
    title: "Senaryo sonucu ne anlama geliyor?",
    keywords: ["senaryo sonucu", "sonuc ne demek", "tahmini azaltim", "yeni emisyon", "maliyet seviyesi", "senaryoyu yorumla", "simulator sonucu", "simülatör sonucu"],
    answer: `Senaryo sonucu, seçilen önlemin uygulanması durumunda yaklaşık ne kadar karbon azaltımı sağlayabileceğinizi gösterir.

Sonuç ekranında şu bilgiler bulunur:
- Mevcut emisyon: Seçilen bina/kategori için mevcut karbon değeri.
- Tahmini azaltım oranı: Seçilen senaryoya göre varsayılan veya sizin yazdığınız oran.
- Tahmini karbon azaltımı: Önlem uygulanırsa azalabilecek kg CO₂e miktarı.
- Yeni emisyon: Azaltımdan sonraki tahmini emisyon değeri.
- Maliyet seviyesi: Uygulamanın düşük/orta/yüksek maliyetli olup olmadığı.
- Uygulama zorluğu: İdari olarak kolay mı, orta mı, zor mu olduğunu gösterir.
- Tahmini süre: Uygulamanın ne kadar sürede başlatılabileceği.
- Sorumlu birim: Süreci takip etmesi beklenen idari birim.
- Yönetici Özeti ve Karar Notu: Yönetime sunulabilecek kısa açıklamalardır.

Bu bölüm kesin sonuç değil, karar vermeye yardımcı tahmini analizdir.`,
    followUps: [
      "Senaryo sonucunu rapora nasıl eklerim?",
      "Yönetici özeti nasıl oluşturulur?",
      "Maliyet seviyesi neye göre belirlenir?",
      "Yönetime hangi raporu sunmalıyım?"
    ]
  },
  {
    title: "Senaryo sonucunu rapora nasıl eklerim?",
    keywords: ["senaryoyu rapora ekle", "senaryo rapor", "sonucu rapora", "yonetici ozeti", "karar notu", "rapora nasil eklerim", "kopyalanabilir metin"],
    answer: `Senaryo sonucunu rapora eklemek için:

1. Senaryo Simülatörü bölümünde lokasyon, kategori ve hazır senaryo seçin.
2. “Senaryoyu Hesapla” butonuna basın.
3. Sonuç ekranındaki “Yönetici Özeti” metnini okuyun.
4. “Karar Notu” alanını kontrol edin.
5. Bu metinleri yönetim raporuna veya sunum notuna ekleyebilirsiniz.
6. PDF rapor alırken bu senaryoyu sözlü açıklama veya ek karar notu olarak kullanabilirsiniz.

Öneri: Yönetici Özeti daha açıklayıcıdır; Karar Notu ise kısa ve karar odaklıdır.`,
    followUps: [
      "Raporu yönetime nasıl açıklamalıyım?",
      "PDF rapor nasıl alırım?",
      "Senaryo sonucu ne anlama geliyor?",
      "Yönetime hangi raporu sunmalıyım?"
    ]
  },
  {
    title: "Elektrik verisini nereden almalıyım?",
    keywords: ["elektrik verisini nereden", "fatura bilgisi", "elektrik faturasi", "faturadan hangi deger", "kwh nerede", "sayac verisi", "tuketim degeri", "elektrik kaynak"],
    answer: `Elektrik verisi için en güvenilir kaynak fatura veya sayaç verisidir.

Önerilen kaynak sırası:
1. Elektrik faturası
2. Bina sayaç verisi
3. İlgili birimin resmi tüketim kaydı
4. Zorunlu durumda tahmini veri

Veri Girişi bölümünde kategori olarak “Elektrik” seçilmeli, miktar kWh cinsinden girilmelidir. Veri kaynağı olarak “Fatura” veya “Sayaç verisi” seçerseniz veri güven skoru daha yüksek olur.

Fatura numarası veya dönem bilgisini “Belge No / Açıklama” alanına yazabilirsiniz.`,
    followUps: [
      "Elektrik verisini nasıl girerim?",
      "Veri güven skoru nedir?",
      "Fatura resmi yükleyebilir miyim?",
      "Rapor almadan önce ne kontrol etmeliyim?"
    ]
  },
  {
    title: "Eksik veri varsa ne yapmalıyım?",
    keywords: ["eksik veri", "veri eksik", "eksik kayit", "tam veri yok", "tahmini veri girebilir miyim", "bazı veriler yok", "veri bulamadim"],
    answer: `Eksik veri varsa önce ilgili birimden resmi kaynağı istemeniz önerilir.

İzlenecek sıra:
1. Fatura, sayaç, yemekhane kayıtları veya servis kilometre bilgisi var mı kontrol edin.
2. Veri bulunamazsa ilgili birim sorumlusundan kayıt talep edin.
3. Zorunlu durumda “Tahmini veri” olarak giriş yapılabilir.
4. Tahmini veri girildiyse açıklama alanına neden tahmini olduğunu yazın.
5. Rapor almadan önce tahmini verileri tekrar kontrol edin.

Tahmini veri kullanılabilir; ancak veri güven skorunu düşüreceği için yönetim raporunda dikkatli değerlendirilmelidir.`,
    followUps: [
      "Veri güven skoru nedir?",
      "Rapor almadan önce ne kontrol etmeliyim?",
      "Hatalı kayıt girdim, ne yapmalıyım?",
      "Veri nasıl eklerim?"
    ]
  },
  {
    title: "Hangi senaryoyu seçmeliyim?",
    keywords: ["hangi senaryo", "senaryo sec", "senaryo sececegim", "hangisi daha iyi", "hangi onlem", "hizli kazanim", "dusuk maliyet", "yuksek etki", "yonetim onayi"],
    answer: `Senaryo seçerken önce lokasyon ve kategori seçmelisiniz. Sistem yalnızca o kategoriye uygun hazır senaryoları gösterir.

Seçim yaparken şu etiketlere dikkat edebilirsiniz:

- Hızlı Kazanım: Kısa sürede uygulanabilir.
- Düşük Maliyet: Bütçeyi fazla zorlamaz.
- Yüksek Etki: CO₂e azaltım etkisi daha güçlüdür.
- Kontrol ve İzleme: Önce veri kalitesini ve takibi güçlendirir.
- Uzun Vadeli Yatırım: Yönetim kararı ve bütçe planı gerektirir.

İdari personel için öneri: Raporlama döneminde önce Hızlı Kazanım ve Düşük Maliyet etiketli senaryolarla başlamak daha kolaydır. Yönetim sunumu için ise Yüksek Etki veya Yönetim Onayı Gerekir etiketli senaryolar ayrıca not alınabilir.`,
    followUps: [
      "Senaryo sonucu ne anlama geliyor?",
      "Senaryo sonucunu rapora nasıl eklerim?",
      "Raporu yönetime nasıl açıklamalıyım?",
      "Rapor almadan önce ne kontrol etmeliyim?"
    ]
  },
  {
    title: "Senaryolardaki etiketler ne anlama geliyor?",
    keywords: ["etiket", "hizli kazanim", "dusuk maliyet", "yuksek etki", "uzun vadeli yatirim", "kontrol izleme", "yonetim onayi gerekir"],
    answer: `Senaryo etiketleri, idari personelin aksiyonları daha hızlı yorumlaması için kullanılır.

- Hızlı Kazanım: Hemen veya kısa sürede uygulanabilecek aksiyonlardır.
- Düşük Maliyet: Büyük bütçe gerektirmeyen iyileştirmelerdir.
- Yüksek Etki: Karbon azaltım potansiyeli daha yüksek olan aksiyonlardır.
- Kontrol ve İzleme: Veri takibini ve rapor güvenilirliğini artırır.
- Yönetim Onayı Gerekir: Bütçe, satın alma veya politika kararı gerektirebilir.
- Uzun Vadeli Yatırım: 6-12 ay gibi daha uzun planlama gerektiren aksiyonlardır.

Bu etiketler yönetime hangi aksiyonun önce sunulacağını belirlemeye yardımcı olur.`,
    followUps: [
      "Hangi senaryoyu seçmeliyim?",
      "Yönetime hangi raporu sunmalıyım?",
      "Senaryo sonucunu rapora nasıl eklerim?",
      "PDF rapor nasıl alırım?"
    ]
  },
  {
    title: "Ek kullanım sorusu",
    keywords: ["lokasyon", "miktar", "birim", "tarih", "belge", "aciklama", "kontrol ederim", "nereden gorurum", "rapor bos", "grafik", "yonetime", "db browser", "gercek veri", "kwh nerede", "ogun sayisi", "tarih formati", "risk seviyesi", "karbon butcesi"],
    answer: `Bu konu sistemdeki kullanım adımlarından biriyle ilgilidir.

En doğru ilerleme için ilgili ana başlığı sorabilirsiniz:
- Veri nasıl eklerim?
- Elektrik verisini nasıl girerim?
- Yemekhane verisi nasıl eklenir?
- Ulaşım verisi nasıl eklenir?
- Excel dosyasını nasıl yüklerim?
- Dashboard ne gösterir?
- Haritadaki renkler ne anlama geliyor?
- PDF rapor nasıl alırım?
- Hatalı kayıt girdim, ne yapmalıyım?
- Senaryo simülatörü, karbon alarmları ve aksiyon planı nasıl kullanılır?`,
    followUps: [
      "Veri nasıl eklerim?",
      "PDF rapor nasıl alırım?",
      "Haritadaki renkler ne anlama geliyor?",
      "Sistemi hangi sırayla kullanmalıyım?"
    ]
  }
];

function getHelpContext() {
  const records = getActiveRecords();
  const total = records.reduce((sum, item) => sum + Number(item.totalEmission || 0), 0);
  const categoryData = sumBy(records, "category");
  const locationData = sumBy(records, "location");
  const topCategory = getTopEntry(categoryData);
  const topLocation = getTopEntry(locationData);
  const confidence = getWeightedConfidence(records);
  const alarms = buildAlarms();

  return {
    records,
    total,
    topCategory,
    topLocation,
    confidence,
    alarmCount: alarms.length
  };
}

function renderAiInsight() {
  const box = document.getElementById("aiInsightBox");
  if (!box) return;

  const ctx = getHelpContext();

  box.innerHTML = `
    <span class="mini-label">Kullanım rehberi</span>
    <h4>İdari personel için hızlı yardım</h4>
    <p>
      Bu asistan, Excel yerine CarbonMap Campus panelini kullanırken adım adım destek verir.
      ${ctx.records.length ? `Şu anda sistemde ${ctx.records.length} aktif kayıt üzerinden dashboard oluşturuluyor. En yüksek lokasyon <strong>${ctx.topLocation[0]}</strong>, en yüksek kategori <strong>${ctx.topCategory[0]}</strong>.` : "Henüz aktif kayıt yoksa veri girişi veya CSV yükleme adımıyla başlayabilirsiniz."}
    </p>
  `;
}


function normalizeHelpText(value) {
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
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function compactHelpText(value) {
  return normalizeHelpText(value).replace(/\s+/g, "");
}

function getHelpTokens(value) {
  return normalizeHelpText(value)
    .split(/\s+/)
    .filter((token) => token.length >= 2);
}

function uniqueList(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function getTopicExtraKeywords(topic) {
  const title = compactHelpText(topic.title);
  const extras = [];

  if (title.includes("sistem")) {
    extras.push("amac", "platform", "uygulama", "panel ne", "ne yapar", "neden var", "excel yerine", "dashboard kullanimi", "genel bilgi", "kurum ne icin kullanacak");
  }
  if (title.includes("verinasil") || title.includes("veri")) {
    extras.push("kayit", "kayit gir", "kayit ac", "tuketim gir", "miktar", "form doldur", "emisyon kaydi", "yeni veri", "manuel", "nereye yazicam", "nereye giricem");
  }
  if (title.includes("elektrik")) {
    extras.push("enerji", "kwh", "kw", "kilovat", "kilowat", "fatura", "fatura no", "fatura numarasi", "sayac", "sayaç", "elektrik faturasi", "enerji faturasi", "tuketim", "tüketim", "aylik elektrik", "elektirik", "elektirik verisi", "elektrik dosyasi", "elektrik kaydi", "fakulte elektrik");
  }
  if (title.includes("yemekhane")) {
    extras.push("yemek", "ogun", "porsiyon", "gida", "tabldot", "mutfak", "yemekhane kaydi", "yemekhane verileri", "yemek sayisi");
  }
  if (title.includes("ulasim")) {
    extras.push("servis", "arac", "otopark", "km", "kilometre", "personel servisi", "ulasım", "tasit", "yol", "ring", "araba");
  }
  if (title.includes("excel")) {
    extras.push("exel", "xlsx", "xls", "csv", "dosya", "dosya sec", "dosya seç", "dosya yukle", "dosya yükle", "dosya yukleme", "dosya yükleme", "dosya yukleyemiyorum", "yulkelem", "yüklem", "tablo", "toplu aktar", "toplu yukle", "toplu yükle", "veri aktar", "excelden alma", "liste yukleme", "import", "aktarim", "aktarim sorunu");
  }
  if (title.includes("harita")) {
    extras.push("renk", "kirmizi", "kırmızı", "sari", "sarı", "turuncu", "yesil", "yeşil", "bina", "fakulte", "fakülte", "lokasyon", "risk", "kampus krokisi", "kampüs krokisi", "noktalar", "haritadaki bina", "harita tiklama", "binaya tikla", "tıklama");
  }
  if (title.includes("pdf")) {
    extras.push("rapor", "rapor sayfasi", "rapor sayfası", "son rapor", "sonuc raporu", "sonuç raporu", "sonuc", "sonuç", "cikti", "çıktı", "indir", "belge", "yonetici", "rapor alma", "pdf indir", "rapor olustur", "raporu kaydet", "sunum", "yonetime sun", "rapor tıklama", "rapor butonu", "rapor sonucu");
  }
  if (title.includes("hatali") || title.includes("hatal")) {
    extras.push("yanlis", "yanlış", "duzelt", "düzelt", "sil", "kayit sil", "kayıt sil", "miktar yanlis", "hata yaptim", "hata yaptım", "geri al", "iptal", "reddet", "duzeltme", "yanlis fakulte", "yanlış fakülte", "yanlis fatura", "yanlış fatura");
  }
  if (title.includes("senaryo") || title.includes("alarm") || title.includes("aksiyon")) {
    extras.push("simulator", "simulatör", "tasarruf", "maliyet", "azaltim", "uyari", "anomali", "oneri", "oncelik", "plan", "ne yapmaliyim", "cozum", "risk uyarisi");
  }
  if (title.includes("guven")) {
    extras.push("skor", "güven", "fatura", "sayac", "tahmini veri", "veri kaynagi", "guvenilirlik", "dogruluk");
  }
  if (title.includes("emisyonfaktoru") || title.includes("faktorkaynagi") || title.includes("faktor")) {
    extras.push("emisyon faktoru", "emisyon faktörü", "faktor", "faktör", "kaynak", "hesaplama kaynagi", "hesaplama dayanağı", "hesaplama dayanagi", "co2e", "co2", "kg co2e", "ton co2e", "karbon yil", "karbon yıl", "petrol esdegeri", "petrol eşdeğeri", "tep", "toe", "elektrik katsayisi", "elektrik faktoru", "yakıt faktörü", "ulasim faktoru", "yemekhane faktoru");
  }
  if (title.includes("durumu")) {
    extras.push("onay", "onaylandi", "incelemede", "taslak", "reddedildi", "durum", "kayit durumu", "kontrol");
  }
  if (title.includes("backend")) {
    extras.push("aktif", "kapali", "kapalı", "veritabani", "veritabanı", "database", "sqlite", "sql", "kaydediliyor", "backend aktif", "backend kapali", "backend kapalı", "db browser", "db", "kayit nereye gidiyor", "kayıt nereye gidiyor");
  }
  if (title.includes("demo")) {
    extras.push("test", "ornek", "seed", "demo verisi", "deneme verisi", "demo uret", "ornek veri");
  }
  if (title.includes("sifirla")) {
    extras.push("reset", "temizle", "tum veriyi sil", "silinir mi", "sifirlamak", "verileri temizle");
  }
  if (title.includes("sirayla") || title.includes("sistemihangi")) {
    extras.push("nereden baslayayim", "ilk once", "adim adim", "kullanim sirasi", "sira", "baslangic", "nasil kullanacagim");
  }

  return extras;
}

function getExpandedTopicKeywords(topic) {
  return uniqueList([topic.title, ...(topic.keywords || []), ...getTopicExtraKeywords(topic)]);
}

function tokenSimilarityScore(questionTokens, candidateTokens) {
  let score = 0;
  questionTokens.forEach((qToken) => {
    candidateTokens.forEach((cToken) => {
      if (qToken === cToken) score += 6;
      else if (qToken.length >= 4 && cToken.length >= 4 && (qToken.includes(cToken) || cToken.includes(qToken))) score += 3;
      else if (qToken.length >= 5 && cToken.length >= 5 && qToken.slice(0, 5) === cToken.slice(0, 5)) score += 2;
    });
  });
  return score;
}

function getTopicScore(topic, question) {
  const questionText = normalizeHelpText(question);
  const questionCompact = compactHelpText(question);
  const questionTokens = getHelpTokens(question);
  const titleText = normalizeHelpText(topic.title);
  const titleCompact = compactHelpText(topic.title);
  const keywords = getExpandedTopicKeywords(topic);
  let score = 0;

  if (!questionCompact) return 0;

  if (questionCompact === titleCompact) score += 120;
  if (questionCompact.includes(titleCompact) || titleCompact.includes(questionCompact)) score += 45;
  if (questionText.includes(titleText) || titleText.includes(questionText)) score += 35;

  keywords.forEach((keyword) => {
    const keywordText = normalizeHelpText(keyword);
    const keywordCompact = compactHelpText(keyword);
    if (!keywordCompact) return;

    if (questionCompact === keywordCompact) score += 35;
    if (questionCompact.includes(keywordCompact)) score += keywordCompact.length >= 8 ? 22 : 12;
    if (keywordCompact.includes(questionCompact) && questionCompact.length >= 4) score += 8;

    score += tokenSimilarityScore(questionTokens, getHelpTokens(keywordText));
  });

  score += tokenSimilarityScore(questionTokens, getHelpTokens(topic.title)) * 1.4;

  return score;
}

function getSuggestedTopics(question, limit = 4) {
  const ranked = helpTopics
    .map((topic) => ({ topic, score: getTopicScore(topic, question) }))
    .sort((a, b) => b.score - a.score);

  const strong = ranked.filter((item) => item.score > 0).slice(0, limit);

  if (strong.length) {
    return strong.map((item) => item.topic.title);
  }

  return [
    "Veri nasıl eklerim?",
    "Excel dosyasını nasıl yüklerim?",
    "PDF rapor nasıl alırım?",
    "Haritadaki renkler ne anlama geliyor?"
  ].slice(0, limit);
}

function getBestHelpTopic(question) {
  const ranked = helpTopics
    .map((topic) => ({ topic, score: getTopicScore(topic, question) }))
    .sort((a, b) => b.score - a.score);

  return ranked[0] || { topic: null, score: 0 };
}

function getHelpAnswer(question) {
  const cleanQuestion = String(question || "").trim();
  const best = getBestHelpTopic(cleanQuestion);
  const suggestions = getSuggestedTopics(cleanQuestion, 4);

  if (best.topic && best.score >= 10) {
    const didYouMean = uniqueList([best.topic.title, ...suggestions]).slice(0, 4);
    return {
      answer: best.topic.answer,
      followUps: best.topic.followUps || [],
      suggestions: didYouMean,
      uncertain: best.score < 24
    };
  }

  return {
    answer: `Sorunuzu tam eşleştiremedim; ama idari personelin en çok ihtiyaç duyduğu başlıkları aşağıya ekledim. Birini seçerseniz adım adım anlatabilirim.

Ben CarbonMap Yardım Asistanı’yım. Veri girişi, Excel/CSV aktarımı, dashboard okuma, harita kullanımı, PDF rapor alma ve hatalı kayıt düzeltme konularında yardımcı olurum.`,
    followUps: [
      "Bu sistem ne işe yarıyor?",
      "Veri nasıl eklerim?",
      "Excel dosyasını nasıl yüklerim?",
      "PDF rapor nasıl alırım?"
    ],
    suggestions,
    uncertain: true
  };
}

function renderAiInsight() {
  const box = document.getElementById("aiInsightBox");
  if (!box) return;

  const ctx = getHelpContext();

  box.innerHTML = `
    <span class="mini-label">Kullanım rehberi</span>
    <h4>İdari personel için hızlı yardım</h4>
    <p>
      Bu asistan, Excel yerine CarbonMap Campus panelini kullanırken adım adım destek verir.
      ${ctx.records.length ? `Şu anda sistemde ${ctx.records.length} aktif kayıt üzerinden dashboard oluşturuluyor. En yüksek lokasyon <strong>${ctx.topLocation[0]}</strong>, en yüksek kategori <strong>${ctx.topCategory[0]}</strong>.` : "Henüz aktif kayıt yoksa veri girişi veya CSV yükleme adımıyla başlayabilirsiniz."}
    </p>
  `;
}

function addAiMessage(message, sender = "assistant", followUps = [], suggestions = [], options = {}) {
  const messages = document.getElementById("aiChatMessages");
  if (!messages) return;

  const div = document.createElement("div");
  div.className = `ai-message ${sender}`;

  if (sender === "assistant") {
    const suggestionHtml = suggestions.length
      ? `<div class="ai-did-you-mean ${options.uncertain ? "uncertain" : ""}">
          <span>${options.uncertain ? "Sorunuzu şöyle anlamış olabilirim:" : "Şunu mu demek istediniz?"}</span>
          <div class="ai-suggestion-list">
            ${suggestions.map((question) => `<button type="button" class="ai-suggestion-chip" data-follow-up-question="${escapeHtml(question)}">${escapeHtml(question)}</button>`).join("")}
          </div>
        </div>`
      : "";

    const answerHtml = formatAnswerHtml(message);
    const followUpHtml = followUps.length
      ? `<div class="ai-followups">
          <span>Devamında şunları da sorabilirsiniz:</span>
          <div class="ai-followup-list">
            ${followUps.map((question) => `<button type="button" class="ai-followup-chip" data-follow-up-question="${escapeHtml(question)}">${escapeHtml(question)}</button>`).join("")}
          </div>
        </div>`
      : "";

    div.innerHTML = `${suggestionHtml}<div class="ai-answer-text">${answerHtml}</div>${followUpHtml}`;
  } else {
    div.textContent = message;
  }

  messages.appendChild(div);

  div.querySelectorAll("[data-follow-up-question]").forEach((button) => {
    button.addEventListener("click", () => {
      askAiQuestion(button.dataset.followUpQuestion);
    });
  });

  messages.scrollTop = messages.scrollHeight;
}

function askAiQuestion(question) {
  const cleanQuestion = String(question || "").trim();

  if (!cleanQuestion) {
    showToast("Önce asistana bir soru yaz.");
    return;
  }

  addAiMessage(cleanQuestion, "user");
  const result = getHelpAnswer(cleanQuestion);

  window.setTimeout(() => {
    addAiMessage(result.answer, "assistant", result.followUps, result.suggestions, { uncertain: result.uncertain });
  }, 280);

  const input = document.getElementById("aiQuestionInput");
  if (input) input.value = "";
  renderInlineSuggestions("");
}

function renderInlineSuggestions(question) {
  const area = document.getElementById("aiInlineSuggestions");
  if (!area) return;

  const clean = String(question || "").trim();

  if (!clean) {
    area.innerHTML = "";
    return;
  }

  const suggestions = getSuggestedTopics(clean, 4);

  area.innerHTML = `
    <span>Yaklaşık benzer sorular:</span>
    <div class="ai-inline-suggestion-list">
      ${suggestions.map((questionText) => `<button type="button" class="ai-inline-suggestion-chip" data-inline-question="${escapeHtml(questionText)}">${escapeHtml(questionText)}</button>`).join("")}
    </div>
  `;

  area.querySelectorAll("[data-inline-question]").forEach((button) => {
    button.addEventListener("click", () => {
      askAiQuestion(button.dataset.inlineQuestion);
    });
  });
}

function setupAiAssistant() {
  const askButton = document.getElementById("aiAskBtn");
  const input = document.getElementById("aiQuestionInput");
  const floatingButton = document.getElementById("aiFloatingButton");
  const floatingPanel = document.getElementById("aiFloatingPanel");
  const closeButton = document.getElementById("aiCloseBtn");

  function openAssistant() {
    if (!floatingPanel) return;
    floatingPanel.classList.add("open");
    if (floatingButton) {
      floatingButton.setAttribute("aria-label", "Yardım Asistanını Kapat");
      floatingButton.classList.add("is-open");
    }
    window.setTimeout(() => {
      if (input) input.focus();
    }, 120);
  }

  function closeAssistant() {
    if (!floatingPanel) return;
    floatingPanel.classList.remove("open");
    if (floatingButton) {
      floatingButton.setAttribute("aria-label", "Yardım Asistanını Aç");
      floatingButton.classList.remove("is-open");
    }
  }

  function toggleAssistant() {
    if (!floatingPanel) return;
    if (floatingPanel.classList.contains("open")) {
      closeAssistant();
    } else {
      openAssistant();
    }
  }

  if (floatingButton) {
    floatingButton.addEventListener("click", toggleAssistant);
  }

  if (closeButton) {
    closeButton.addEventListener("click", closeAssistant);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAssistant();
    }
  });

  if (askButton && input) {
    askButton.addEventListener("click", () => {
      openAssistant();
      askAiQuestion(input.value);
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        askAiQuestion(input.value);
      }
    });

    input.addEventListener("input", () => {
      renderInlineSuggestions(input.value);
    });

    renderInlineSuggestions("");
  }

  document.querySelectorAll("[data-ai-question]").forEach((button) => {
    button.addEventListener("click", () => {
      openAssistant();
      askAiQuestion(button.dataset.aiQuestion);
    });
  });
}

async function handleFormSubmit(event) {
  event.preventDefault();
  const payload = getRecordFormPayload();
  const category = payload.category;

  if (payload.amount < 0 || Number.isNaN(payload.amount)) {
    showToast("Miktar geçerli ve negatif olmayan bir sayı olmalı.");
    return;
  }

  if (editingRecordId) {
    if (backendEnabled) {
      try {
        await apiRequest(`/records/${encodeURIComponent(editingRecordId)}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        resetRecordForm();
        $("#categoryInput").value = category;
        updateUnitInput();
        await syncFromBackend();
        showToast("Kayıt backend veritabanında güncellendi.");
        return;
      } catch (error) {
        backendEnabled = false;
        setBackendStatus(false, "Backend isteği başarısız oldu: localStorage moduna geçildi.");
        showToast("Backend yanıt vermedi, kayıt localStorage modunda güncelleniyor.");
      }
    }

    const index = emissions.findIndex((record) => record.id === editingRecordId);
    if (index !== -1) {
      emissions[index] = applyPayloadToLocalRecord(emissions[index], payload);
      saveRecords();
      resetRecordForm();
      $("#categoryInput").value = category;
      updateUnitInput();
      renderAll();
      showToast("Kayıt güncellendi.");
    }
    return;
  }

  if (backendEnabled) {
    try {
      await apiRequest("/records", { method: "POST", body: JSON.stringify(payload) });
      await syncFromBackend();
      resetRecordForm();
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
  resetRecordForm();
  $("#categoryInput").value = category;
  updateUnitInput();
  showToast("Kayıt eklendi ve karbon emisyonu hesaplandı.");
}


function buildManagerSummary({ locationName, categoryName, template, currentEmission, reductionRatePercent, reductionEmission, newEmission, costSaving, costAssumption }) {
  const scenarioTitle = template?.title || "Özel azaltım senaryosu";
  const savingText = costSaving > 0
    ? `Yaklaşık ${formatNumber(costSaving, 0)} TL ${costAssumption?.note || "maliyet"} avantajı oluşabilir.`
    : "Maliyet etkisi için birim maliyet varsayımı güncellenmelidir.";

  return `${locationName} için ${scenarioTitle} senaryosu seçildi. Mevcut emisyon ${formatKg(currentEmission)}; %${formatNumber(reductionRatePercent, 0)} azaltım ile ${formatKg(reductionEmission)} düşüş ve ${formatKg(newEmission)} yeni emisyon beklenir. ${savingText}`;
}

function buildDecisionNote(template, costSaving) {
  const scenarioTitle = template?.title || "Özel senaryo";
  const approval = template?.approval || "Yönetim değerlendirmesi önerilir";
  const owner = template?.owner || "İlgili idari birim";
  const costLevel = template?.cost || "-";
  const savingLevel = costSaving >= 10000 ? "yüksek" : costSaving >= 3000 ? "orta" : "sınırlı";

  return `${scenarioTitle}: ${costLevel} maliyetli, ${owner} sorumluluğunda değerlendirilebilir. Tahmini maliyet faydası ${savingLevel} seviyededir. ${approval}.`;
}

function buildReportPrecheckList() {
  return [
    "İlgili dönem için veri girişleri tamamlandı mı?",
    "Demo/test verileri gerçek rapordan önce temizlendi mi?",
    "Hatalı kayıtlar Reddedildi durumuna alındı mı?",
    "Tahmini veriler mümkünse fatura veya sayaç verisiyle kontrol edildi mi?",
    "Dashboard’da en yüksek lokasyon ve kategori incelendi mi?",
    "Haritada kırmızı görünen binalar kontrol edildi mi?",
    "Karbon alarmları ve anomali uyarıları gözden geçirildi mi?",
    "Aksiyon planı ve senaryo çıktısı yönetim notuna eklendi mi?"
  ];
}

function handleScenario(event) {
  event.preventDefault();
  const locationName = $("#scenarioLocation").value;
  const categoryName = $("#scenarioCategory").value;
  const template = getSelectedScenarioTemplate();
  const reductionRatePercent = Number($("#reductionInput").value || template?.defaultReduction || 0);
  const reduction = reductionRatePercent / 100;
  const price = Number($("#priceInput").value || 0);
  const currentEmission = locationName === "Kampüs Geneli"
    ? getActiveRecords()
        .filter((item) => item.category === categoryName)
        .reduce((sum, item) => sum + Number(item.totalEmission || 0), 0)
    : getLocationCategoryTotal(locationName, categoryName);
  const factor = factors[categoryName];
  const costAssumption = getCategoryCostAssumption(categoryName);
  const reductionEmission = currentEmission * reduction;
  const newEmission = Math.max(0, currentEmission - reductionEmission);
  const reducedActivity = factor.factor > 0 ? reductionEmission / factor.factor : 0;
  const costSaving = reducedActivity * price;
  const budgetImpact = template?.cost === "Düşük"
    ? "Düşük bütçeyle başlanabilir"
    : template?.cost === "Orta"
      ? "Orta düzey bütçe planı gerekir"
      : "Yönetim ve bütçe onayı gerekir";
  const payback = template?.cost === "Düşük"
    ? "Kısa vadeli"
    : template?.cost === "Orta"
      ? "Orta vadeli"
      : "Uzun vadeli";
  const managerSummary = buildManagerSummary({
    locationName,
    categoryName,
    template,
    currentEmission,
    reductionRatePercent,
    reductionEmission,
    newEmission,
    costSaving,
    costAssumption
  });
  const decisionNote = buildDecisionNote(template, costSaving);
  const noDataWarning = currentEmission <= 0 ? `<div class="scenario-warning"><strong>Bu seçim için kayıt bulunamadı.</strong><br>Lütfen önce veri girin veya Demo Verisi Üret butonuna basın. Veri yoksa CO₂e ve maliyet sonucu 0 görünür.</div>` : "";

  $("#scenarioResult").innerHTML = `
    <span class="mini-label">Senaryo sonucu</span>
    <h4>${locationName} / ${categoryName}</h4>
    ${noDataWarning}

    <div class="scenario-metric-grid">
      <article class="scenario-metric">
        <span>Mevcut CO₂e</span>
        <strong>${formatKg(currentEmission)}</strong>
      </article>
      <article class="scenario-metric positive">
        <span>Azalacak CO₂e</span>
        <strong>${formatKg(reductionEmission)}</strong>
      </article>
      <article class="scenario-metric">
        <span>Yeni CO₂e</span>
        <strong>${formatKg(newEmission)}</strong>
      </article>
      <article class="scenario-metric money">
        <span>Tahmini Maliyet Faydası</span>
        <strong>${formatNumber(costSaving, 0)} TL</strong>
      </article>
    </div>

    <div class="simple-cost-card">
      <span class="mini-label">Maliyet ve uygulama özeti</span>
      <div class="simple-cost-row"><span>Seçilen senaryo</span><strong>${template?.title || "Özel senaryo"}</strong></div>
      <div class="simple-cost-row"><span>Azaltım oranı</span><strong>%${formatNumber(reductionRatePercent, 0)}</strong></div>
      <div class="simple-cost-row"><span>Azaltılacak aktivite</span><strong>${formatNumber(reducedActivity, 1)} ${factor.unit}</strong></div>
      <div class="simple-cost-row"><span>Birim maliyet varsayımı</span><strong>${formatNumber(price, 2)} ${costAssumption.unitLabel}</strong></div>
      <div class="simple-cost-row"><span>Uygulama maliyeti</span><strong>${template?.cost || "-"}</strong></div>
      <div class="simple-cost-row"><span>Bütçe etkisi</span><strong>${budgetImpact}</strong></div>
      <div class="simple-cost-row"><span>Geri dönüş</span><strong>${payback}</strong></div>
      <div class="simple-cost-row"><span>Sorumlu birim</span><strong>${template?.owner || "İlgili idari birim"}</strong></div>
    </div>

    <div class="management-note compact-note">
      <span class="mini-label">Yönetime kısa not</span>
      <p>${managerSummary}</p>
      <p class="muted">${decisionNote}</p>
    </div>
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

  const rowsHtml = csvHeaders.map((header) => {
    const guessed = guessField(header);
    const options = targetFields.map(([value, label]) => `<option value="${value}" ${value === guessed ? "selected" : ""}>${label}</option>`).join("");
    return `
      <div class="mapping-row">
        <strong>${header}</strong>
        <select data-csv-map="${header}">${options}</select>
      </div>
    `;
  }).join("");

  let mappingArea = document.getElementById("mappingArea");
  let importButton = document.getElementById("importCsvBtn");

  if (!mappingArea || !importButton) {
    const modalContent = document.getElementById("modalContent");
    if (!modalContent) return;
    modalContent.innerHTML = `
      <p class="eyebrow">CSV içe aktarma</p>
      <h2>CSV Kolon Eşleştirme</h2>
      <p class="muted">Seçtiğiniz dosyadaki kolonları sistem alanlarıyla eşleştirip içeri aktarın.</p>
      <div id="mappingArea" class="mapping-area"></div>
      <div class="csv-modal-actions">
        <button class="btn btn-primary" id="importCsvBtn" type="button">CSV Verisini İçeri Aktar</button>
      </div>
    `;
    document.getElementById("modalBackdrop")?.classList.add("show");
    mappingArea = document.getElementById("mappingArea");
    importButton = document.getElementById("importCsvBtn");
    importButton?.addEventListener("click", importCsvRows);
  }

  if (mappingArea) mappingArea.innerHTML = rowsHtml;
  if (importButton) importButton.disabled = !parsedCsvRows.length;
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
      document.getElementById("mappingArea") && (document.getElementById("mappingArea").innerHTML = "");
      document.getElementById("csvFile") && (document.getElementById("csvFile").value = "");
      document.getElementById("importCsvBtn") && (document.getElementById("importCsvBtn").disabled = true);
      closeModal();
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
  document.getElementById("mappingArea") && (document.getElementById("mappingArea").innerHTML = "");
  document.getElementById("csvFile") && (document.getElementById("csvFile").value = "");
  document.getElementById("importCsvBtn") && (document.getElementById("importCsvBtn").disabled = true);
  closeModal();
  showToast(`${imported} CSV kaydı içeri aktarıldı.`);
}

async function generatePdfReport() {
  if (typeof window.jspdf === "undefined") {
    showToast("jsPDF kütüphanesi yüklenemedi. İnternet bağlantısını kontrol edin.");
    return;
  }

  const pdfBtn = document.getElementById("pdfBtn");
  const oldPdfText = pdfBtn?.textContent || "PDF Rapor Al";
  if (pdfBtn) {
    pdfBtn.disabled = true;
    pdfBtn.textContent = "Rapor hazırlanıyor...";
  }

  try {
    if (backendEnabled) {
      await syncFromBackend();
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const bottom = pageHeight - 16;
    let y = 16;

    const allRecords = [...emissions].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    const records = getActiveRecords();
    const total = records.reduce((sum, item) => sum + Number(item.totalEmission || 0), 0);
    const categoryData = sumBy(records, "category");
    const locationData = sumBy(records, "location");
    const scopeData = sumBy(records, "scope");
    const confidence = getWeightedConfidence(records);
    const actions = buildActions();
    const alarms = buildAlarms();
    const topCategory = getTopEntry(categoryData);
    const topLocation = getTopEntry(locationData);
    const reportDate = new Date().toLocaleDateString("tr-TR");

    function pdfSafeText(value) {
      const map = {
        "ğ": "g", "Ğ": "G", "ü": "u", "Ü": "U", "ş": "s", "Ş": "S",
        "ı": "i", "İ": "I", "ö": "o", "Ö": "O", "ç": "c", "Ç": "C",
        "₂": "2", "₃": "3", "₁": "1", "₄": "4", "₅": "5",
        "–": "-", "—": "-", "•": "-", "→": "->", "≥": ">=", "≤": "<=",
        "₺": "TL"
      };
      return String(value ?? "")
        .replace(/[ğĞüÜşŞıİöÖçÇ₂₃₁₄₅–—•→≥≤₺]/g, (char) => map[char] || char)
        .replace(/CO2e|CO₂e/g, "CO2e")
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\x20-\x7E]/g, "");
    }

    function kg(value) {
      return `${formatNumber(Number(value || 0), 1)} kg CO2e`;
    }

    function numberValue(value, fraction = 1) {
      return formatNumber(Number(value || 0), fraction);
    }

    function setColor(hex) {
      const clean = hex.replace("#", "");
      const r = parseInt(clean.slice(0, 2), 16);
      const g = parseInt(clean.slice(2, 4), 16);
      const b = parseInt(clean.slice(4, 6), 16);
      doc.setTextColor(r, g, b);
    }

    function fillColor(hex) {
      const clean = hex.replace("#", "");
      const r = parseInt(clean.slice(0, 2), 16);
      const g = parseInt(clean.slice(2, 4), 16);
      const b = parseInt(clean.slice(4, 6), 16);
      doc.setFillColor(r, g, b);
    }

    function drawHeader() {
      fillColor("#0b3d2e");
      doc.rect(0, 0, pageWidth, 34, "F");
      setColor("#ffffff");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(pdfSafeText("CarbonMap Campus"), margin, 15);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(pdfSafeText("Aylik Karbon Envanteri ve Aksiyon Raporu"), margin, 22);
      doc.text(pdfSafeText(`Rapor tarihi: ${reportDate}`), pageWidth - margin, 15, { align: "right" });
      doc.text(pdfSafeText(`${allRecords.length} toplam kayit / ${records.length} hesaplamaya dahil`), pageWidth - margin, 22, { align: "right" });
      setColor("#111827");
      y = 44;
    }

    function drawFooter() {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i += 1) {
        doc.setPage(i);
        doc.setDrawColor(220, 230, 224);
        doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        setColor("#6b7280");
        doc.text(pdfSafeText("CarbonMap Campus - Demo rapor"), margin, pageHeight - 5);
        doc.text(pdfSafeText(`Sayfa ${i}/${pageCount}`), pageWidth - margin, pageHeight - 5, { align: "right" });
      }
      doc.setPage(pageCount);
      setColor("#111827");
    }

    function newPage() {
      doc.addPage();
      y = 18;
    }

    function ensureSpace(requiredHeight) {
      if (y + requiredHeight > bottom) newPage();
    }

    function sectionTitle(title, subtitle = "") {
      ensureSpace(subtitle ? 20 : 13);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      setColor("#0b3d2e");
      doc.text(pdfSafeText(title), margin, y);
      y += 5;
      if (subtitle) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        setColor("#6b7280");
        const lines = doc.splitTextToSize(pdfSafeText(subtitle), pageWidth - margin * 2);
        doc.text(lines, margin, y);
        y += lines.length * 4 + 3;
      } else {
        y += 3;
      }
      setColor("#111827");
    }

    function drawSummaryCard(x, width, title, value, sub) {
      fillColor("#f4fbf7");
      doc.setDrawColor(200, 222, 211);
      doc.roundedRect(x, y, width, 24, 3, 3, "FD");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      setColor("#5d6b63");
      doc.text(pdfSafeText(title), x + 3, y + 6);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      setColor("#0b3d2e");
      doc.text(doc.splitTextToSize(pdfSafeText(value), width - 6), x + 3, y + 14);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      setColor("#6b7280");
      doc.text(doc.splitTextToSize(pdfSafeText(sub), width - 6), x + 3, y + 21);
      setColor("#111827");
    }

    function table(title, columns, rows, subtitle = "") {
      sectionTitle(title, subtitle);
      const tableWidth = columns.reduce((sum, col) => sum + col.width, 0);
      const x0 = margin;
      const headerHeight = 8;
      const lineGap = 3.7;

      function drawTableHeader() {
        fillColor("#0b6b4b");
        doc.rect(x0, y, tableWidth, headerHeight, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.8);
        setColor("#ffffff");
        let x = x0;
        columns.forEach((col) => {
          doc.text(pdfSafeText(col.title), x + 2, y + 5.2);
          x += col.width;
        });
        y += headerHeight;
        setColor("#111827");
      }

      ensureSpace(18);
      drawTableHeader();

      if (!rows.length) {
        fillColor("#ffffff");
        doc.setDrawColor(225, 232, 228);
        doc.rect(x0, y, tableWidth, 10, "S");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        setColor("#6b7280");
        doc.text(pdfSafeText("Veri yok"), x0 + 2, y + 6.5);
        y += 14;
        setColor("#111827");
        return;
      }

      rows.forEach((row, rowIndex) => {
        const wrapped = row.map((cell, i) => doc.splitTextToSize(pdfSafeText(cell), Math.max(8, columns[i].width - 4)));
        const maxLines = Math.max(...wrapped.map((lines) => lines.length));
        const rowHeight = Math.max(8, maxLines * lineGap + 4);
        if (y + rowHeight > bottom) {
          newPage();
          drawTableHeader();
        }
        fillColor(rowIndex % 2 === 0 ? "#ffffff" : "#f7faf8");
        doc.setDrawColor(226, 234, 229);
        doc.rect(x0, y, tableWidth, rowHeight, "FD");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.4);
        setColor("#1f2937");
        let x = x0;
        wrapped.forEach((lines, i) => {
          const col = columns[i];
          const textX = col.align === "right" ? x + col.width - 2 : x + 2;
          doc.text(lines, textX, y + 5.2, { align: col.align || "left" });
          x += col.width;
        });
        y += rowHeight;
      });
      y += 6;
      setColor("#111827");
    }

    function groupedRows(data, currentTotal) {
      return Object.entries(data)
        .sort((a, b) => b[1] - a[1])
        .map(([key, value]) => [key, kg(value), currentTotal > 0 ? `%${numberValue((value / currentTotal) * 100, 1)}` : "%0,0"]);
    }

    function shortText(value, max = 42) {
      const clean = String(value || "-");
      return clean.length > max ? `${clean.slice(0, max - 3)}...` : clean;
    }

    drawHeader();

    const cardGap = 4;
    const cardWidth = (pageWidth - margin * 2 - cardGap * 3) / 4;
    drawSummaryCard(margin, cardWidth, "Toplam emisyon", kg(total), "Aktif kayitlara gore");
    drawSummaryCard(margin + (cardWidth + cardGap), cardWidth, "Veri guven skoru", `%${numberValue(confidence, 0)}`, "Agirlikli ortalama");
    drawSummaryCard(margin + (cardWidth + cardGap) * 2, cardWidth, "En yuksek kategori", topCategory[0] || "-", kg(topCategory[1] || 0));
    drawSummaryCard(margin + (cardWidth + cardGap) * 3, cardWidth, "En yuksek lokasyon", topLocation[0] || "-", kg(topLocation[1] || 0));
    y += 32;

    sectionTitle("Yonetici Ozeti");
    const summaryLines = [
      `Bu rapor ${records.length} aktif kayit uzerinden toplam ${kg(total)} emisyon hesaplamistir.`,
      `Taslak ve reddedilen kayitlar hesaplamaya dahil edilmez; ancak asagidaki detayli veri tablosunda gorunur.`,
      `Sistem kategori, lokasyon, Scope, alarm ve aksiyon onceliklendirme bilgilerini tek raporda toplar.`
    ];
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setColor("#374151");
    summaryLines.forEach((line) => {
      const lines = doc.splitTextToSize(pdfSafeText(`- ${line}`), pageWidth - margin * 2);
      doc.text(lines, margin, y);
      y += lines.length * 4.5 + 1.5;
    });
    y += 3;

    table(
      "Kategori Bazli Dagilim",
      [
        { title: "Kategori", width: 74 },
        { title: "Emisyon", width: 62, align: "right" },
        { title: "Pay", width: 36, align: "right" }
      ],
      groupedRows(categoryData, total)
    );

    table(
      "Lokasyon Bazli Dagilim",
      [
        { title: "Lokasyon", width: 82 },
        { title: "Emisyon", width: 54, align: "right" },
        { title: "Pay", width: 36, align: "right" }
      ],
      groupedRows(locationData, total)
    );

    table(
      "Scope Dagilimi",
      [
        { title: "Scope", width: 74 },
        { title: "Emisyon", width: 62, align: "right" },
        { title: "Pay", width: 36, align: "right" }
      ],
      groupedRows(scopeData, total)
    );

    table(
      "Detayli Veri Tablosu",
      [
        { title: "Tarih", width: 22 },
        { title: "Lokasyon", width: 43 },
        { title: "Kategori", width: 25 },
        { title: "Miktar", width: 24, align: "right" },
        { title: "Emisyon", width: 32, align: "right" },
        { title: "Guven", width: 15, align: "right" },
        { title: "Durum", width: 20 }
      ],
      allRecords.map((item) => [
        item.date || "-",
        shortText(item.location, 36),
        item.category || "-",
        `${numberValue(item.amount, 1)} ${item.unit || ""}`,
        kg(item.totalEmission),
        `%${numberValue(item.confidence, 0)}`,
        item.status || "-"
      ]),
      "Bu tablo tum kayitlari gosterir. Ozet hesaplarda sadece Onaylandi ve Incelemede durumundaki kayitlar kullanilir."
    );

    table(
      "Aktif Alarmlar",
      [
        { title: "Alarm", width: 54 },
        { title: "Aciklama", width: 118 }
      ],
      alarms.length ? alarms.map((alarm) => [alarm.title, alarm.message]) : [["Aktif alarm yok", "Kampus karbon performansi icin kritik alarm bulunmuyor."]]
    );

    table(
      "Oncelikli Aksiyon Plani",
      [
        { title: "#", width: 10, align: "right" },
        { title: "Lokasyon / Kategori", width: 48 },
        { title: "Aksiyon", width: 64 },
        { title: "Puan", width: 18, align: "right" },
        { title: "Azaltim", width: 32, align: "right" }
      ],
      actions.length ? actions.slice(0, 10).map((action, index) => [
        String(index + 1),
        `${action.location} / ${action.category}`,
        action.title,
        `${action.priority}/100`,
        kg(action.estimatedReduction)
      ]) : [["-", "-", "Aksiyon uretmek icin yeterli aktif veri yok.", "-", "-"]]
    );

    sectionTitle("Rapor Notu");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    setColor("#4b5563");
    const note = "Bu prototip raporda emisyon katsayilari demo amaclidir. Gercek kullanimda kurumun resmi fatura, sayac, yakit ve ulasim verileri ile guncel emisyon faktorleri kullanilmalidir.";
    doc.text(doc.splitTextToSize(pdfSafeText(note), pageWidth - margin * 2), margin, y);

    drawFooter();
    doc.save("CarbonMap-Campus-Detayli-Rapor.pdf");
    showToast("Detaylı PDF rapor oluşturuldu.");
  } catch (error) {
    console.error(error);
    showToast("PDF rapor oluşturulurken hata oluştu. Konsolu kontrol edin.");
  } finally {
    if (pdfBtn) {
      pdfBtn.disabled = false;
      pdfBtn.textContent = oldPdfText;
    }
  }
}

async function resetData() {
  const ok = confirm("Tüm demo verileri silinsin mi?");
  if (!ok) return;

  if (backendEnabled) {
    try {
      await apiRequest("/records", { method: "DELETE" });
      emissions = [];
      saveRecords();
      resetRecordForm();
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
  resetRecordForm();
  renderAll();
  showToast("Veriler sıfırlandı.");
}

function setupNavObserver() {
  const links = [...$$('.nav-link')].filter((link) => link.getAttribute('href')?.startsWith('#'));
  const sections = [...new Set(links.map((link) => link.getAttribute('href')))]
    .map((href) => document.querySelector(href))
    .filter(Boolean);

  let ticking = false;

  const setActive = () => {
    const navbarHeight = document.querySelector('.fixed-navbar')?.offsetHeight || document.querySelector('.top-navbar')?.offsetHeight || 0;
    const markerLine = navbarHeight + 70;
    let currentId = sections[0]?.id;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= markerLine) currentId = section.id;
    });

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      currentId = sections.at(-1)?.id || currentId;
    }

    links.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });

    ticking = false;
  };

  const requestSetActive = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(setActive);
  };

  window.addEventListener('scroll', requestSetActive, { passive: true });
  window.addEventListener('resize', requestSetActive);
  window.addEventListener('hashchange', requestSetActive);
  setActive();
}

function setupResponsiveRefresh() {
  let resizeTimer = null;
  const refresh = () => {
    Object.values(charts || {}).forEach((chart) => chart?.resize?.());
    if (leafletMap) {
      window.setTimeout(() => leafletMap.invalidateSize(), 120);
    }
  };

  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(refresh, 180);
  });

  window.addEventListener("orientationchange", () => {
    window.setTimeout(refresh, 300);
  });
}


function init() {
  loadCustomScenarios();
  const sidebarToggle = document.getElementById("sidebarToggle");

if (sidebarToggle) {
  sidebarToggle.addEventListener("click", () => {
    document.body.classList.toggle("sidebar-closed");
  });
};
  initializeCampusControls();
  populateSelects();
  loadRecords();
  renderAll();
  setupNavObserver();
  setupResponsiveRefresh();
  setBackendStatus(false, "Backend kontrol ediliyor...");
  connectBackend();
  $("#dateInput").valueAsDate = new Date();
  $("#categoryInput").addEventListener("change", updateUnitInput);
  document.getElementById("monthlyFilter")?.addEventListener("change", renderCharts);
  document.getElementById("scenarioCategory")?.addEventListener("change", populateScenarioTemplates);
  document.getElementById("scenarioTemplate")?.addEventListener("change", updateScenarioInputs);
  $("#emissionForm").addEventListener("submit", handleFormSubmit);
  document.getElementById("cancelEditBtn")?.addEventListener("click", () => {
    resetRecordForm();
    renderRecordsTable();
    showToast("Düzenleme iptal edildi.");
  });
  $("#scenarioForm").addEventListener("submit", handleScenario);
  $("#seedDemoBtn").addEventListener("click", seedDemoData);
  $("#resetBtn").addEventListener("click", resetData);
  $("#pdfBtn").addEventListener("click", generatePdfReport);
  $("#modalClose").addEventListener("click", closeModal);
  $("#modalBackdrop").addEventListener("click", (event) => {
    if (event.target.id === "modalBackdrop") closeModal();
  });
  document.getElementById("csvFile")?.addEventListener("change", handleCsvUpload);
  document.getElementById("importCsvBtn")?.addEventListener("click", importCsvRows);
  document.getElementById("mapFitBtn")?.addEventListener("click", fitMapToCampus);
  setupScenarioSearchPickers();
  setupCustomScenarioControls();
  setupAiAssistant();
  window.setInterval(updateLiveEnergyPulse, 4000);
}

document.addEventListener("DOMContentLoaded", init);

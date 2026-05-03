# CarbonMap Campus Demo + Backend

CarbonMap Campus, üniversite kampüsleri için hazırlanmış karbon ayak izi yönetim prototipidir.

Bu sürümde mevcut frontend korunmuştur. Ek olarak FastAPI + SQLite backend eklendi. Backend açık olduğunda veriler API üzerinden SQLite veritabanına kaydedilir. Backend kapalıysa uygulama eski güvenli moduyla tarayıcı localStorage üzerinde çalışmaya devam eder.

## İçindeki Özellikler

Bu sürümde arayüz sadeleştirildi ve ana akış 5 bölüme indirildi:

1. Veri Toplama
2. Dashboard
3. Görsel Karar Desteği
4. Geleceği Hesapla
5. Hesaplama Dayanağı

Öne çıkan özellikler:

- Sabit sol sidebar ve çakışma yapmayan menü butonu
- Tek başlıklı sade tepe navbarı
- Manuel veri girişi
- Dashboard kartları
- Kategori, lokasyon, aylık trend ve Scope grafikleri
- Dinamik üniversite/kampüs haritası
- Hazır kampüs seçimi + özel üniversite arama alanı
- Lokasyon bazlı risk renklendirme
- Senaryo simülatörü
- Tahmini maliyet tasarrufu hesabı
- Emisyon faktörü kütüphanesi
- FastAPI tabanlı karbon hesaplama API'si
- SQLite veritabanı ile kayıt saklama
- Backend durum göstergesi
- Hesaplama açıklama paneli
- PDF rapor oluşturma
- Demo verisi üretme butonu

## En Kolay Çalıştırma

### Windows

1. Zip dosyasını çıkarın.
2. Klasörün içinde `run-backend.bat` dosyasına çift tıklayın.
3. Kurulum bittikten sonra tarayıcıdan şu adresi açın:

```text
http://127.0.0.1:8000
```

### macOS / Linux

```bash
./run-backend.sh
```

Sonra:

```text
http://127.0.0.1:8000
```

## Sadece Frontend Olarak Açmak İsterseniz

`index.html` dosyasını doğrudan tarayıcıda açabilirsiniz. Bu durumda backend kapalı uyarısı görünür, ancak demo localStorage ile çalışmaya devam eder.

## API Dokümantasyonu

Backend çalışırken şu adrese girin:

```text
http://127.0.0.1:8000/docs
```

## Önemli Backend Endpoint'leri

- `GET /api/health` backend durum kontrolü
- `GET /api/records` kayıtları listeler
- `POST /api/records` tek karbon kaydı ekler
- `POST /api/records/bulk` toplu kayıt ekler
- `POST /api/seed` demo verilerini SQLite veritabanına yazar
- `DELETE /api/records` tüm kayıtları temizler
- `GET /api/dashboard` dashboard özetini döndürür
- `POST /api/scenario` azaltım senaryosu hesaplar

## Demo Akışı Önerisi

1. Backend'i başlatın ve `http://127.0.0.1:8000` adresine girin.
2. Sol menüde sıralamanın Veri Toplama → Dashboard → Görsel Karar Desteği → Geleceği Hesapla → Hesaplama Dayanağı şeklinde olduğunu gösterin.
3. **Demo Verisi Üret** butonuna basın.
4. Veri Toplama bölümünde kayıt ekleme/düzenleme alanını gösterin.
5. Dashboard bölümünde toplam emisyon, en yüksek kategori ve grafik özetlerini gösterin.
6. Görsel Karar Desteği bölümünde önce hazır kampüslerden ODTÜ/İTÜ gibi bir örnek seçin; sonra isterseniz “Başka üniversite ara” ile farklı bir üniversite adı girerek haritanın dinamik değiştiğini gösterin.
7. Geleceği Hesapla bölümünde bir azaltım senaryosu çalıştırın.
8. Hesaplama Dayanağı bölümünde kullanılan emisyon faktörlerini gösterin.
9. **PDF Rapor Al** butonuyla rapor çıktısını gösterin.



## Kullanılan Teknolojiler

- HTML
- CSS
- JavaScript
- Chart.js
- jsPDF
- PapaParse
- Python
- FastAPI
- SQLite
- Uvicorn
- Leaflet
- OpenStreetMap / Nominatim / Overpass API

## Not

Chart.js, jsPDF ve PapaParse CDN üzerinden yüklendiği için internet bağlantısı gerekir. İnternet yoksa arayüz açılır; ancak grafik, CSV okuma veya PDF özellikleri CDN erişimine bağlıdır.

## Dinamik Harita Güncellemesi

Bu sürümde harita sadece Düzce Üniversitesi verisine bağlı olmaktan çıkarıldı.

Yeni yapı:

- Harita bölümüne **Seçili Üniversite** paneli eklendi.
- Hazır örnekler: Düzce Üniversitesi Konuralp Yerleşkesi, ODTÜ, İTÜ Ayazağa.
- **Başka üniversite ara...** seçeneğiyle kullanıcı üniversite adı + şehir yazabilir.
- İnternet varsa uygulama OpenStreetMap/Nominatim ile üniversite merkezini bulur ve Overpass üzerinden yakın kampüs lokasyonlarını çekmeye çalışır.
- İnternet yoksa veya yeterli bina/lokasyon verisi bulunamazsa uygulama seçilen üniversite için otomatik kampüs şablonu üretir.
- Demo verisi artık sabit Düzce kayıtlarına göre değil, **seçili kampüs lokasyonlarına göre** oluşturulur.
- Her üniversitenin kayıtları localStorage üzerinde ayrı anahtarla tutulur; böylece Düzce verisi ile başka üniversite verisi birbirine karışmaz.

Not: Hazır örneklerin ve otomatik şablonun koordinatları prototip/demo amaçlıdır. Gerçek kullanımda üniversite yönetiminin bina koordinatları veya resmi kampüs veri setiyle hassaslaştırılması önerilir.

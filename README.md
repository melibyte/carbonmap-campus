# CarbonMap Campus Demo + Backend

CarbonMap Campus, üniversite kampüsleri için hazırlanmış karbon haritalandırma ve emisyon takip prototipidir.

Bu sürümde mevcut frontend korunmuştur. Ek olarak FastAPI + SQLite backend eklendi. Backend açık olduğunda veriler API üzerinden SQLite veritabanına kaydedilir. Backend kapalıysa uygulama eski güvenli moduyla tarayıcı localStorage üzerinde çalışmaya devam eder.

## İçindeki Özellikler

- Dashboard kartları
- Kategori, lokasyon, aylık trend ve Scope grafikleri
- Manuel veri girişi
- FastAPI tabanlı karbon hesaplama API'si
- SQLite veritabanı ile kayıt saklama
- Backend durum göstergesi
- Emisyon faktörü kütüphanesi
- Kampüs karbon haritası
- Lokasyon bazlı risk renklendirme
- Hesaplama açıklama paneli
- Veri güven skoru
- Karbon alarm sistemi
- Basit anomali tespiti
- Senaryo simülatörü
- Tahmini maliyet tasarrufu hesabı
- Aksiyon planı ve öncelik puanı
- Akıllı CSV kolon eşleştirme
- Toplu CSV verisini backend'e aktarma
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
2. Sağ üstte **Backend: Aktif** yazısını gösterin.
3. **Demo Verisi Üret** butonuna basın. Bu veri artık SQLite veritabanına yazılır.
4. Dashboard kartlarını gösterin.
5. Kampüs haritasında kırmızı/sarı/yeşil lokasyonları gösterin.
6. Son kayıtlardan birinde **Hesaplamayı Gör** butonuna basın.
7. Karbon alarmlarını ve anomali tespitini gösterin.
8. Senaryo simülatöründe Mühendislik Fakültesi / Elektrik için %15 azaltım hesaplayın.
9. Aksiyon planındaki öncelik puanlarını gösterin.
10. `http://127.0.0.1:8000/docs` adresinden API endpoint'lerini gösterin.
11. PDF Rapor Al butonuyla rapor çıktısını gösterin.

## Jüriye Söylenebilecek Cümle

CarbonMap Campus yalnızca karbon hesaplayan bir arayüz değil; FastAPI backend'iyle verileri SQLite üzerinde saklayan, karbon hesaplamasını API tarafında yapabilen, veri güvenini puanlayan, karbon bütçesi aşımını yakalayan, anomali tespit eden ve azaltım aksiyonlarını önceliklendiren kampüs karbon karar destek yazılımıdır.

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

## Not

Chart.js, jsPDF ve PapaParse CDN üzerinden yüklendiği için internet bağlantısı gerekir. İnternet yoksa arayüz açılır; ancak grafik, CSV okuma veya PDF özellikleri CDN erişimine bağlıdır.

## Harita güncellemesi
Bu sürümde Konuralp Yerleşkesi için ana akademik binalar, sosyal tesisler, spor alanları, hastane, teknopark ve otopark harita noktalarına eklenmiştir. Koordinatlar sunum/prototip amaçlı yaklaşık konumlardır; gerçek bina giriş koordinatlarıyla daha sonra hassaslaştırılabilir.

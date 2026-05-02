# Veri Akışı

1. Kullanıcı manuel formdan veya CSV dosyasından tüketim verisi girer.
2. Sistem kategoriye göre emisyon faktörünü seçer.
3. `miktar x emisyon faktörü` hesabı ile kgCO₂e değeri oluşturulur.
4. Backend aktifse kayıt SQLite veritabanına kaydedilir.
5. Backend kapalıysa tarayıcı localStorage güvenli modu kullanılır.
6. Dashboard, harita, alarm, aksiyon ve senaryo alanları güncellenir.

## CSV Beklenen Alanlar

- `bina` veya `lokasyon`
- `tur` veya `kategori`
- `tuketim` veya `miktar`
- `tarih`
- `kaynak`

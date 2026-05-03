from pathlib import Path
import sqlite3
import uuid
from typing import Optional, Any

from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel


ROOT_DIR = Path(__file__).resolve().parents[2]
DB_DIR = ROOT_DIR / "backend" / "data"
DB_PATH = DB_DIR / "carbonmap.sqlite3"
DB_DIR.mkdir(parents=True, exist_ok=True)


FACTORS = {
    "Elektrik": {"unit": "kWh", "factor": 0.5, "scope": "Scope 2", "description": "Demo elektrik şebeke katsayısı"},
    "Ulaşım": {"unit": "km", "factor": 0.18, "scope": "Scope 3", "description": "Araç/km tahmini demo katsayısı"},
    "Yemekhane": {"unit": "öğün", "factor": 2.5, "scope": "Scope 3", "description": "Öğün başı demo katsayısı"},
    "Etkinlik": {"unit": "kişi", "factor": 1.2, "scope": "Scope 3", "description": "Katılımcı başı demo katsayısı"},
    "Satın Alma": {"unit": "adet", "factor": 5.0, "scope": "Scope 3", "description": "Ürün/adet demo katsayısı"},
    "Yakıt": {"unit": "L", "factor": 2.68, "scope": "Scope 1", "description": "Litre yakıt başı demo katsayısı"},
}

DATA_SOURCE_SCORES = {
    "Fatura": 95,
    "Sayaç verisi": 90,
    "CSV yükleme": 85,
    "Manuel giriş": 70,
    "Tahmini veri": 50,
}


class RecordInput(BaseModel):
    location: str
    category: str
    amount: float
    source: str = "Manuel giriş"
    status: str = "Onaylandı"
    date: str
    description: Optional[str] = ""


class ScenarioInput(BaseModel):
    location: str
    category: str
    reduction: Optional[float] = 15
    price: Optional[float] = 5


app = FastAPI(title="CarbonMap Campus API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS records (
            id TEXT PRIMARY KEY,
            location TEXT NOT NULL,
            category TEXT NOT NULL,
            amount REAL NOT NULL,
            unit TEXT NOT NULL,
            factor REAL NOT NULL,
            scope TEXT NOT NULL,
            total_emission REAL NOT NULL,
            source TEXT NOT NULL,
            confidence INTEGER NOT NULL,
            status TEXT NOT NULL,
            date TEXT NOT NULL,
            description TEXT
        )
        """
    )
    conn.commit()
    conn.close()


def row_to_record(row: sqlite3.Row) -> dict[str, Any]:
    return {
        "id": row["id"],
        "location": row["location"],
        "category": row["category"],
        "amount": row["amount"],
        "unit": row["unit"],
        "factor": row["factor"],
        "scope": row["scope"],
        "totalEmission": row["total_emission"],
        "source": row["source"],
        "confidence": row["confidence"],
        "status": row["status"],
        "date": row["date"],
        "description": row["description"] or "",
    }


def create_record_object(payload: RecordInput) -> dict[str, Any]:
    if payload.amount < 0:
        raise HTTPException(status_code=400, detail="Miktar negatif olamaz.")

    factor_info = FACTORS.get(payload.category, FACTORS["Elektrik"])
    amount = float(payload.amount)
    factor = float(factor_info["factor"])

    return {
        "id": str(uuid.uuid4()),
        "location": payload.location,
        "category": payload.category,
        "amount": amount,
        "unit": factor_info["unit"],
        "factor": factor,
        "scope": factor_info["scope"],
        "total_emission": amount * factor,
        "source": payload.source,
        "confidence": DATA_SOURCE_SCORES.get(payload.source, 70),
        "status": payload.status,
        "date": payload.date,
        "description": payload.description or "",
    }


def api_record(record: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": record["id"],
        "location": record["location"],
        "category": record["category"],
        "amount": record["amount"],
        "unit": record["unit"],
        "factor": record["factor"],
        "scope": record["scope"],
        "totalEmission": record["total_emission"],
        "source": record["source"],
        "confidence": record["confidence"],
        "status": record["status"],
        "date": record["date"],
        "description": record["description"],
    }


def insert_record(record: dict[str, Any]) -> None:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO records (
            id, location, category, amount, unit, factor, scope,
            total_emission, source, confidence, status, date, description
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            record["id"],
            record["location"],
            record["category"],
            record["amount"],
            record["unit"],
            record["factor"],
            record["scope"],
            record["total_emission"],
            record["source"],
            record["confidence"],
            record["status"],
            record["date"],
            record["description"],
        ),
    )
    conn.commit()
    conn.close()




def update_record_by_id(record_id: str, payload: RecordInput) -> dict[str, Any]:
    record = create_record_object(payload)
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM records WHERE id = ?", (record_id,))
    existing = cursor.fetchone()
    if existing is None:
        conn.close()
        raise HTTPException(status_code=404, detail="Kayıt bulunamadı.")

    cursor.execute(
        """
        UPDATE records
        SET location = ?, category = ?, amount = ?, unit = ?, factor = ?, scope = ?,
            total_emission = ?, source = ?, confidence = ?, status = ?, date = ?, description = ?
        WHERE id = ?
        """,
        (
            record["location"],
            record["category"],
            record["amount"],
            record["unit"],
            record["factor"],
            record["scope"],
            record["total_emission"],
            record["source"],
            record["confidence"],
            record["status"],
            record["date"],
            record["description"],
            record_id,
        ),
    )
    conn.commit()
    cursor.execute("SELECT * FROM records WHERE id = ?", (record_id,))
    updated = cursor.fetchone()
    conn.close()
    if updated is None:
        raise HTTPException(status_code=404, detail="Kayıt bulunamadı.")
    return row_to_record(updated)


def delete_record_by_id(record_id: str) -> None:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM records WHERE id = ?", (record_id,))
    deleted = cursor.rowcount
    conn.commit()
    conn.close()
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Kayıt bulunamadı.")

def get_all_records() -> list[dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM records ORDER BY date DESC, rowid DESC")
    rows = cursor.fetchall()
    conn.close()
    return [row_to_record(row) for row in rows]


def get_active_records() -> list[dict[str, Any]]:
    return [record for record in get_all_records() if record["status"] not in ["Reddedildi", "Taslak"]]


def sum_by(records: list[dict[str, Any]], key: str) -> dict[str, float]:
    result: dict[str, float] = {}
    for record in records:
        group = record.get(key) or "Belirsiz"
        result[group] = result.get(group, 0) + float(record.get("totalEmission", 0))
    return result


def top_key(grouped: dict[str, float]) -> str:
    if not grouped:
        return "-"
    return max(grouped.items(), key=lambda item: item[1])[0]


def weighted_confidence(records: list[dict[str, Any]]) -> int:
    total = sum(float(record.get("totalEmission", 0)) for record in records)
    if total == 0:
        return 0
    weighted = sum(float(record.get("totalEmission", 0)) * float(record.get("confidence", 0)) for record in records)
    return round(weighted / total)


def clear_records() -> None:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM records")
    conn.commit()
    conn.close()


@app.on_event("startup")
def startup() -> None:
    init_db()


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok", "database": str(DB_PATH)}


@app.get("/api/records")
def list_records() -> list[dict[str, Any]]:
    return get_all_records()


@app.post("/api/records")
def add_record(payload: RecordInput) -> dict[str, Any]:
    record = create_record_object(payload)
    insert_record(record)
    return api_record(record)


@app.put("/api/records/{record_id}")
def update_record(record_id: str, payload: RecordInput) -> dict[str, Any]:
    return update_record_by_id(record_id, payload)


@app.delete("/api/records/{record_id}")
def delete_single_record(record_id: str) -> Response:
    delete_record_by_id(record_id)
    return Response(status_code=204)



@app.post("/api/records/bulk")
async def add_bulk_records(request: Request) -> dict[str, Any]:
    body = await request.json()
    rows = body.get("records", []) if isinstance(body, dict) else body

    if not isinstance(rows, list):
        raise HTTPException(status_code=400, detail="records listesi bekleniyor.")

    inserted = 0
    for item in rows:
        payload = RecordInput(**item)
        record = create_record_object(payload)
        insert_record(record)
        inserted += 1

    return {"inserted": inserted, "count": inserted, "records": get_all_records()}


@app.delete("/api/records")
def delete_records() -> Response:
    clear_records()
    return Response(status_code=204)


@app.post("/api/seed")
def seed_records() -> dict[str, Any]:
    clear_records()

    demo_records = [
        RecordInput(location="Mühendislik Fakültesi", category="Elektrik", amount=9200, source="Fatura", status="Onaylandı", date="2026-01-10", description="EF-2026-01-001"),
        RecordInput(location="Mühendislik Fakültesi", category="Elektrik", amount=9600, source="Fatura", status="Onaylandı", date="2026-02-10", description="EF-2026-02-001"),
        RecordInput(location="Mühendislik Fakültesi", category="Elektrik", amount=10400, source="Fatura", status="Onaylandı", date="2026-03-10", description="EF-2026-03-001"),
        RecordInput(location="Mühendislik Fakültesi", category="Elektrik", amount=12800, source="Fatura", status="Onaylandı", date="2026-04-10", description="EF-2026-04-001"),
        RecordInput(location="Mühendislik Fakültesi", category="Satın Alma", amount=120, source="Manuel giriş", status="İncelemede", date="2026-04-12", description="Laboratuvar sarf malzemesi"),
        RecordInput(location="Yemekhane", category="Yemekhane", amount=1200, source="Manuel giriş", status="Onaylandı", date="2026-04-08", description="Nisan öğün sayısı"),
        RecordInput(location="Yemekhane", category="Elektrik", amount=2600, source="Sayaç verisi", status="Onaylandı", date="2026-04-09", description="Sayaç-YNK-0426"),
        RecordInput(location="Otopark", category="Ulaşım", amount=9200, source="CSV yükleme", status="Onaylandı", date="2026-04-13", description="Servis + araç km tahmini"),
        RecordInput(location="Kütüphane", category="Elektrik", amount=1700, source="Sayaç verisi", status="Onaylandı", date="2026-03-07", description="Sayaç-KTP-0326"),
        RecordInput(location="Kütüphane", category="Elektrik", amount=3900, source="Tahmini veri", status="İncelemede", date="2026-04-07", description="Anomali için demo veri"),
        RecordInput(location="Rektörlük", category="Elektrik", amount=3100, source="Fatura", status="Onaylandı", date="2026-04-06", description="EF-REK-0426"),
        RecordInput(location="Rektörlük", category="Yakıt", amount=340, source="Fatura", status="Onaylandı", date="2026-04-07", description="Kampüs aracı yakıt"),
        RecordInput(location="Konferans Salonu", category="Etkinlik", amount=620, source="Manuel giriş", status="Onaylandı", date="2026-04-17", description="Yapay Zekâ Zirvesi"),
        RecordInput(location="Konferans Salonu", category="Elektrik", amount=680, source="Sayaç verisi", status="Onaylandı", date="2026-04-17", description="Etkinlik salon elektrik"),
        RecordInput(location="Otopark", category="Ulaşım", amount=2600, source="Tahmini veri", status="Taslak", date="2026-04-20", description="Taslak veri rapora dahil edilmez"),
    ]

    for payload in demo_records:
        insert_record(create_record_object(payload))

    return {"records": get_all_records()}


@app.get("/api/dashboard")
def dashboard() -> dict[str, Any]:
    records = get_active_records()
    category_data = sum_by(records, "category")
    location_data = sum_by(records, "location")
    scope_data = sum_by(records, "scope")
    return {
        "totalEmission": sum(float(record.get("totalEmission", 0)) for record in records),
        "topCategory": top_key(category_data),
        "topLocation": top_key(location_data),
        "confidenceScore": weighted_confidence(records),
        "categoryDistribution": category_data,
        "locationDistribution": location_data,
        "scopeDistribution": scope_data,
    }


@app.post("/api/scenario")
def scenario(payload: ScenarioInput) -> dict[str, Any]:
    records = get_active_records()
    current_emission = sum(
        float(record.get("totalEmission", 0))
        for record in records
        if record["location"] == payload.location and record["category"] == payload.category
    )
    reduction_rate = float(payload.reduction or 0) / 100
    reduction_emission = current_emission * reduction_rate
    new_emission = current_emission - reduction_emission
    factor_info = FACTORS.get(payload.category, FACTORS["Elektrik"])
    reduced_activity = reduction_emission / float(factor_info["factor"]) if factor_info["factor"] else 0
    cost_saving = reduced_activity * float(payload.price or 0) if payload.category == "Elektrik" else 0

    return {
        "location": payload.location,
        "category": payload.category,
        "currentEmission": current_emission,
        "reductionEmission": reduction_emission,
        "newEmission": new_emission,
        "reducedActivity": reduced_activity,
        "costSaving": cost_saving,
    }


@app.get("/")
def serve_index() -> FileResponse:
    index_file = ROOT_DIR / "index.html"
    if not index_file.exists():
        raise HTTPException(status_code=404, detail="index.html bulunamadı.")
    return FileResponse(index_file)


@app.get("/{file_name}")
def serve_static_file(file_name: str) -> FileResponse:
    allowed_files = {"styles.css", "app.js", "report-preview.html"}
    if file_name not in allowed_files:
        raise HTTPException(status_code=404, detail="Dosya bulunamadı.")
    file_path = ROOT_DIR / file_name
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Dosya bulunamadı.")
    return FileResponse(file_path)

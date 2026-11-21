from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import engine, Base, SessionLocal
from app.models import Supplier
from app.seed_data import seed_database_demo_data

# Import API Routers
from app.api.auth import router as auth_router
from app.api.dashboard import router as dashboard_router
from app.api.ingestion import router as ingestion_router
from app.api.auditor import router as auditor_router
from app.api.suppliers import router as suppliers_router
from app.api.fairness import router as fairness_router
from app.api.simulator import router as simulator_router
from app.api.proofchain import router as proofchain_router
from app.api.copilot import router as copilot_router
from app.api.reports import router as reports_router
from app.api.settings import router as settings_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database schema
    Base.metadata.create_all(bind=engine)
    
    # Auto-seed initial demo dataset if database is freshly created
    db = SessionLocal()
    try:
        supplier_count = db.query(Supplier).count()
        if supplier_count == 0:
            print("[CarbonTrack] Initializing database with demonstration dataset...")
            seed_database_demo_data(db, reset_existing=False)
            print("[CarbonTrack] Demonstration dataset loaded successfully.")
    except Exception as e:
        print(f"[CarbonTrack] Startup error: {e}")
    finally:
        db.close()
        
    yield

app = FastAPI(
    title="CarbonTrack – Enterprise Footprint Auditor with Bias Mitigation",
    description="Enterprise-grade sustainability auditing platform combining Carbon Intelligence with Supplier Fairness Intelligence.",
    version="2.4.0",
    lifespan=lifespan
)

# Enable CORS for local Vite development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all core module routes under /api
app.include_router(auth_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(ingestion_router, prefix="/api")
app.include_router(auditor_router, prefix="/api")
app.include_router(suppliers_router, prefix="/api")
app.include_router(fairness_router, prefix="/api")
app.include_router(simulator_router, prefix="/api")
app.include_router(proofchain_router, prefix="/api")
app.include_router(copilot_router, prefix="/api")
app.include_router(reports_router, prefix="/api")
app.include_router(settings_router, prefix="/api")

@app.get("/")
def root():
    return {
        "platform": "CarbonTrack",
        "tagline": "Measure Carbon. Detect Bias. Build a Fairer Supply Chain.",
        "status": "operational",
        "docs": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "CarbonTrack API"}

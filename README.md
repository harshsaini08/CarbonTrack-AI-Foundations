# CarbonTrack
### AI-Powered Enterprise Carbon Footprint Auditor with Supplier Fairness Intelligence

> **Tagline:** *"Measure Carbon. Detect Bias. Build a Fairer Supply Chain."*

CarbonTrack is a fully functional, enterprise-grade sustainability auditing platform that analyzes enterprise supply-chain operational telemetry to identify carbon emission hotspots, detect suspicious reporting disclosures, and ensure small-scale suppliers are not unfairly penalized by traditional carbon evaluation systems.

---

## 🌟 The Core Problem CarbonTrack Solves

Traditional enterprise carbon evaluation systems assess suppliers using **absolute gross emissions ($tCO_2e$)**.
This creates two severe structural failures:

1. **Systemic Scale Bias:** Small-scale suppliers (Tier 2 & 3) often produce low absolute carbon solely because of lower production capacity, but are penalized by procurement algorithms for lack of reporting maturity or lower absolute volumes. Conversely, efficient small suppliers who produce with world-class clean unit intensity are ranked below large, dirty suppliers.
2. **Masked Volume Inefficiencies:** Giant suppliers frequently produce massive volumes with high unit inefficiency, yet evade scrutiny because their absolute reporting meets broad corporate thresholds.

### CarbonTrack solves this through Dual Intelligence:

1. **Carbon Intelligence:** Transparent, mathematical GHG Protocol Corporate Standard calculations across **Scope 1** (direct fuel combustion), **Scope 2** (purchased grid electricity), and **Scope 3** (freight logistics modal shift, materials, and industrial waste).
2. **FAIRScore AI (Supplier Fairness Intelligence):** Normalizes emissions by production volume ($\text{Intensity} = \frac{\text{Total Emissions}}{\text{Production Volume}}$), benchmarks within industry peer groups, detects statistical disparities in audit flag rates across enterprise scale tiers (Small, Medium, Large), and generates explainable equity adjustments.

---

## 🛠️ Technology Stack

- **Frontend:**
  - React.js (TypeScript) + Vite
  - Tailwind CSS with custom Sustainability-Tech palette (`forest`, `emerald`, `charcoal`)
  - Recharts for responsive analytics, area trends, donut breakdowns, and horizontal bar charts
  - Lucide React for consistent iconography
  - Glassmorphic panels with custom scrollbars and dark-mode styling
- **Backend:**
  - Python 3.14 / 3.12 + FastAPI
  - SQLAlchemy ORM with SQLite database (structured for PostgreSQL migration)
  - Pydantic v2 schemas for strict input validation
  - ReportLab for downloadable investor-grade PDF audit reports
  - NumPy & Pandas for peer-group statistical normalization and IQR anomaly bounds
  - SHA-256 recursive cryptographic hashing for the **ProofChain** tamper-evident ledger
- **AI & Analytics:**
  - Rule-based, mathematical explainable auditing engine
  - Statistical disparity checks (group-wise flag rates, sample-size-aware warnings)
  - Conversational **CarbonTrack Intelligence Copilot** with live telemetry grounding and evidence citations

---

## 📂 Project Architecture

```
Ai Project/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth.py          # Authentication, user directory, persona switching
│   │   │   ├── dashboard.py     # Executive Command Center KPI aggregations
│   │   │   ├── ingestion.py     # CSV/Excel parsing, auto-mapping, validation, demo seeder
│   │   │   ├── auditor.py       # AI Carbon Auditor execution and finding review
│   │   │   ├── suppliers.py     # Supplier directory, profiles, operational records
│   │   │   ├── fairness.py      # FAIRScore AI rankings, peer benchmarks, disparity stats
│   │   │   ├── simulator.py     # Carbon Twin What-If simulation engine & scenarios
│   │   │   ├── proofchain.py    # Tamper-evident SHA-256 chain and integrity verifier
│   │   │   ├── copilot.py       # CarbonTrack Intelligence conversational Q&A
│   │   │   ├── reports.py       # Enterprise & Supplier PDF generators
│   │   │   └── settings.py      # Configurable GHG emission factors & system metadata
│   │   ├── services/
│   │   │   ├── carbon_calculator.py  # GHG Protocol Scope 1, 2, 3 calculations
│   │   │   ├── auditor.py            # Outlier detection, discrepancy flags, fuel/freight checks
│   │   │   ├── fairness_engine.py    # FAIRScore normalization and disparity engine
│   │   │   ├── simulator.py          # Decarbonization what-if scenario calculator
│   │   │   ├── proofchain.py         # SHA-256 hash-linking and verification logic
│   │   │   ├── copilot.py            # Local semantic query router with evidence citations
│   │   │   └── report_generator.py   # ReportLab PDF builder (tables, seals, summaries)
│   │   ├── config.py            # Application paths and settings
│   │   ├── database.py          # SQLite engine and session factory
│   │   ├── models.py            # SQLAlchemy database tables
│   │   ├── schemas.py           # Pydantic request/response models
│   │   ├── seed_data.py         # 32+ realistic suppliers and pre-configured edge cases
│   │   └── main.py              # FastAPI application entrypoint with auto-seeding
│   └── tests/
│       └── test_core.py         # Automated pytest suite for calculations and ProofChain
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.tsx          # 10-item professional navigation with role badge
│   │   │   ├── Header.tsx           # Org header, 1-click Demo seeder, role switcher
│   │   │   ├── KPICard.tsx          # Polished KPI metric card with trends
│   │   │   ├── StatusBadge.tsx      # Severity, status, tier, and bias badges
│   │   │   └── DemoTourModal.tsx    # 8-step hackathon demonstration guide dialog
│   │   ├── pages/
│   │   │   ├── ExecutiveCommandCenter.tsx # Dashboard: KPIs, Scope 1-3 charts, filters
│   │   │   ├── SmartDataIngestion.tsx  # Upload CSV/Excel, column mapping, validation
│   │   │   ├── CarbonAuditor.tsx       # Live audit runner, findings table, reviewer sign-off
│   │   │   ├── SupplierIntelligence.tsx # Supplier directory, profile drawer, history
│   │   │   ├── FairScoreAI.tsx         # Absolute vs. Normalized ranking, disparity checks
│   │   │   ├── CarbonTwinSimulator.tsx # What-if sliders, comparison graphs, ROI savings
│   │   │   ├── ProofChainAuditTrail.tsx # Cryptographically hash-linked audit ledger
│   │   │   ├── SustainabilityCopilot.tsx # Conversational AI with data-grounded citations
│   │   │   ├── ReportGenerator.tsx     # Download Enterprise and Supplier PDF reports
│   │   │   └── SettingsPage.tsx        # Emission factor governance & system info
│   │   ├── services/
│   │   │   └── api.ts                  # Typed API client connecting to backend
│   │   ├── types/
│   │   │   └── index.ts                # TypeScript interfaces
│   │   ├── App.tsx                     # Main layout & router
│   │   └── index.css                   # Custom styles, scrollbar, glassmorphism
├── run_backend.bat              # One-click backend startup script
├── run_frontend.bat             # One-click frontend startup script
├── run_all.bat                  # One-click launcher for both servers
└── start_app.py                 # Python launcher that starts both servers and opens browser
```

---

## 🧭 The 10 Core Application Modules

### 1. Executive Command Center (Overview)
- **8 Dynamic KPI Cards:** Total Gross Footprint ($tCO_2e$), Scope 1 (Direct Fuel), Scope 2 (Grid Electricity), Scope 3 (Supply Chain & Logistics), Audited Suppliers, High-Risk Suppliers, Portfolio Fairness Index, and Abatement Opportunity.
- **Interactive Multi-Scope Filters:** Real-time filtering by Industry Sector and Supplier Scale Tier.
- **Charts:**
  - 12-Month Carbon Emission Trends by Scope (Area chart).
  - Scope 1, 2, and 3 Distribution (Donut chart).
  - Emissions by Industry / Category (Horizontal Bar chart).
  - FAIRScore distribution across Small, Medium, and Large suppliers.
  - Top 10 Gross Carbon Contributors ranking table.

### 2. Smart Data Ingestion
- Upload `.csv`, `.xls`, and `.xlsx` supply chain files.
- Semantic header recognition and column mapping.
- Data validation: identifies zero/negative production volumes, missing operational fields, and discrepancy percentages.
- **Transparent Reconstruction:** Missing carbon disclosures are automatically computed from physical activity telemetry (fuel, electricity, freight ton-km).
- Downloadable sample CSV template and one-click demo dataset loader.

### 3. AI Carbon Auditor
- Rule-based, explainable anomaly detection based on GHG Protocol standards:
  - **Inconsistent Disclosures:** Flags suppliers whose reported emissions deviate $>40\%$ from calculated activity data.
  - **Carbon Intensity Outliers:** Flags suppliers with Z-scores $>1.95\sigma$ within their industry peer group.
  - **Excessive Fuel Combustion:** Scope 1 hotspots with abnormally high liters-per-unit.
  - **High Freight Emissions:** Flags long-distance freight routed via air cargo ($0.602\ kgCO_2e/\text{ton-km}$) instead of rail or sea.
  - **Missing Activity Data:** Detects missing meter telemetry.
- **Auditor Verification Workflow:** Auditors can **Approve**, **Reject**, or **Flag** findings with custom notes. Every decision is cryptographically sealed to ProofChain.

### 4. Supplier Intelligence
- 360° supplier directory searchable by code, company name, industry, and scale tier.
- Interactive **Supplier Profile Drawer** displaying:
  - Historical operational disclosures.
  - Scope 1, 2, and 3 breakdown.
  - FAIRScore equity position and rank shifts.
  - Active audit findings.
  - One-click verified Supplier Audit Certificate download (PDF).

### 5. FAIRScore AI – Supplier Fairness Engine
- **Dual Scoring Architecture:**
  - **Carbon Performance Score ($0\text{--}100$):** Production cleanliness relative to industry bounds.
  - **Supplier Fairness Score ($0\text{--}100$):** Equity-adjusted score mitigating scale bias.
- **Absolute vs. Normalized Ranking Comparison:** Shows side-by-side rankings with green ($+\Delta$) and red ($-\Delta$) rank shift indicators.
- **Statistical Disparity & Bias Audit:** Compares audit flag rates and false positive rates between Small, Medium, and Large enterprises. Flags statistical anomalies when disparity exceeds $25\%$.
- Explains the exact mathematical rationale for every rank shift in plain language.

### 6. Carbon Twin – What-If Simulator
- Interactive supply-chain simulation sliders:
  - **Logistics Modal Shift:** Switch freight between Road, Rail, Sea, and Air.
  - **Clean Energy Transition:** Adjust on-site solar / renewable PPA ratio ($0\%\text{--}100\%$).
  - **Energy Efficiency:** Model process electricity savings ($0\%\text{--}50\%$).
  - **Thermal Optimization:** Model fuel reduction ($0\%\text{--}50\%$).
  - **Route Optimization:** Distance adjustments ($-50\%\text{ to }+50\%$).
- Calculates absolute carbon reduction ($tCO_2e$), percentage reduction ($\%$) and net financial impact ($\$ \text{USD}$ savings or investment).
- Compares baseline vs. simulated emissions by Scope on a synchronized bar chart.
- Save, retrieve, and delete customized simulation scenarios.

### 7. ProofChain – Explainable Audit Trail
- Cryptographically hash-linked ledger implementing **SHA-256 recursive digest continuity**:
  $$\text{Block Hash} = \text{SHA-256}(\text{Index} \parallel \text{Previous Hash} \parallel \text{Timestamp} \parallel \text{Payload})$$
- Live **Ledger Integrity Verifier** that recursively checks all blocks from the genesis block to verify tamper-evident continuity.
- Inspect raw JSON telemetry payloads for any block.
- Export verifiable audit evidence bundle as structured JSON.

### 8. AI Sustainability Copilot ("CarbonTrack Intelligence")
- Natural language chat grounded exclusively in uploaded dataset telemetry and audit findings.
- Pre-configured prompt chips:
  - *"Which supplier has the highest emission intensity?"*
  - *"Why was Supplier S-102 flagged?"*
  - *"Which small suppliers may be unfairly evaluated?"*
  - *"What happens if we change transportation from road to rail?"*
  - *"Show the top five carbon hotspots."*
  - *"Explain the fairness score methodology."*
- Generates responses with **Evidence Citations** and suggested follow-up questions.
- Built-in local intelligence engine ensures zero paid API dependencies.

### 9. Report Generator
- Download **Comprehensive Enterprise Audit Report (PDF)**:
  - Executive summary and metadata.
  - Scope 1, Scope 2, and Scope 3 tables.
  - Top carbon emission contributors.
  - FAIRScore supplier equity analysis.
  - Prioritized audit findings with corrective action recommendations.
  - ProofChain SHA-256 ledger seal.
- Download **Single-Supplier Audit Certificate (PDF)** with a single click.

### 10. Settings & Factor Governance
- Configure and fine-tune GHG emission factors (Electricity, Fuel Diesel, Road, Rail, Sea, Air, Materials, Waste).
- Inline factor editing with one-click **"Reset to Official Defaults"** (EPA / DEFRA / GLEC standards).
- Role-Based Access Control (RBAC) persona switcher (**Administrator**, **Sustainability Manager**, **Lead ESG Auditor**).
- Real-time system architecture and database health metadata.

---

## 🎯 Pre-Configured Test Scenarios in Demo Dataset

The demonstration dataset includes 32+ realistic suppliers with specific test cases built-in:

| Supplier Code | Company Name | Size Tier | Specific Test Scenario & Injected Anomaly |
| :--- | :--- | :--- | :--- |
| **S-101** | Vulcan Heavy Forgings & Castings | Large | **High-Emission Heavy Industrial:** High fuel ($145,000\text{ L}$) & electricity ($820,000\text{ kWh}$), top gross emitter. |
| **S-102** | Apex Intermodal Freight Services | Medium | **Suspicious Inconsistent Reporting:** Disclosed $180.0\ tCO_2e$, but physical activity yields $820.0\ tCO_2e$ ($>300\%$ under-reporting). |
| **S-103** | Global Silicon Wafer Foundry | Large | **High Volume, Clean Intensity:** High absolute emissions ($720\ tCO_2e$) due to $450,000$ units, but clean intensity ($0.0016\ t/u$). Jumps from Gross #22 to Normalized #3 (+19 rank shift). |
| **S-104** | MicroMelt Precision Stampings | Small | **Low Volume, High Intensity:** Modest gross emissions ($175\ tCO_2e$), but outdated furnace gives dirty unit intensity ($0.0416\ t/u$). |
| **S-105** | BioPak Compostable Solutions | Small | **Unfairly Penalized under Gross Ranking:** Small supplier producing efficiently ($0.0003\ t/u$). Ranked at the top on unit performance. |
| **S-106** | Horizon Weaving & Textiles | Small | **Missing Operational Telemetry:** Zero electricity consumption recorded; flagged by Auditor. |
| **S-109 / S-113** | GreenCircuit PCB / Delta Express | Medium | **Inefficient Freight Mode:** Long-haul air freight ($>3,000\text{ km}$) flagged for modal shift to rail/sea. |

---

## 🎬 8-Step Hackathon Demonstration Experience

To showcase the entire system during judging:

1. **Step 1: Data Ingestion** – Click **"Load Demo Dataset"** in the top header or on the Data Ingestion page to populate the 32+ supplier records.
2. **Step 2: Executive Command Center** – Inspect the consolidated footprint ($16,776\ tCO_2e$), filter by "Automotive Parts" or "Small Tier", and observe dynamic metric recalculation.
3. **Step 3: AI Carbon Auditor** – Review detected anomalies (Supplier S-102 reporting variance, air-freight logistics), open the review dialog, and approve/reject with auditor notes.
4. **Step 4: FAIRScore AI** – Contrast Gross Rank vs. Normalized Rank. Point out **S-103 Global Silicon Foundry** jumping 19 positions and observe the statistical disparity audit alert.
5. **Step 5: Carbon Twin Simulator** – Switch freight to **Rail** and move Renewable Energy to **60%**. Observe the real-time $-30.6\%$ carbon abatement and $\$42,000+$ in annual savings. Save the scenario.
6. **Step 6: ProofChain** – Click **"Verify Ledger Integrity"** to confirm the unbroken SHA-256 cryptographic sequence. Click on a block to inspect the raw JSON telemetry evidence.
7. **Step 7: AI Copilot** – Click the suggested prompt chip *"Why was Supplier S-102 flagged?"* and watch the copilot respond with live evidence citations.
8. **Step 8: Download Reports** – Go to Audit Reports and click **"Download Enterprise Audit Report (PDF)"** to view the formatted executive audit document.

---

## 🚀 Installation & Local Execution

### Prerequisites
- Python 3.10+ (Python 3.14 recommended, already configured in virtual environment)
- Node.js 18+ and npm

### Quick Start (Recommended)

#### Option 1: Double-Click Launcher (Windows)
Double-click `run_all.bat` in the project root. It will automatically start both the backend API and frontend dev server in separate windows.

#### Option 2: Python Unified Launcher
Run in terminal:
```powershell
python start_app.py
```
This launches the FastAPI backend on `http://127.0.0.1:8000`, the Vite frontend on `http://localhost:5173`, and opens your browser automatically.

#### Option 3: Manual Step-by-Step

**1. Start the Backend:**
```powershell
# In project root
$env:PYTHONPATH="backend"
.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API runs at: `http://127.0.0.1:8000`  
Swagger Docs at: `http://127.0.0.1:8000/docs`

**2. Start the Frontend:**
```powershell
cd frontend
npm.cmd run dev
```
Web app runs at: `http://localhost:5173`

---

## 🧪 Running Automated Tests

Run the backend test suite:
```powershell
$env:PYTHONPATH="backend"
.venv\Scripts\python.exe -m pytest backend/tests
```
All tests verify GHG Protocol calculation accuracy, ProofChain hash tamper detection, and freight modal variance.

---

## 🔒 Security & Data Integrity

- **Zero Paid API Gatekeeping:** Full functionality runs on local mathematical heuristics and SQLite database persistence.
- **ProofChain Tamper-Evidence:** Any unauthorized alteration to stored audit records breaks the recursive SHA-256 digest link and is immediately flagged by the verification engine.
- **Role-Based Access Control:** Distinct workflows for Administrator, Sustainability Manager, and ESG Auditor.
- **Safe Input Sanitization:** Robust Pydantic schema validation preventing malformed or out-of-range telemetry.

---

## 📄 License & Attribution

Developed for hackathon demonstration. All calculation methodologies conform to the **GHG Protocol Corporate Accounting and Reporting Standard (Scopes 1, 2, and 3)** and **GLEC Framework for Logistics Emissions**.

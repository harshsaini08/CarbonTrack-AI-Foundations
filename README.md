# CarbonTrack
### AI-Powered Carbon Footprint Intelligence and Supplier Sustainability Analysis System

> **Official Purpose:** *"CarbonTrack is an intelligent carbon footprint analysis system that uses AI-assisted analysis, statistical techniques, data-driven insights, and simulation to help organizations monitor carbon emissions, evaluate supplier sustainability, identify potential fairness issues, and explore emission reduction strategies."*

---

## 1. Project Overview

**CarbonTrack** is an academic software prototype developed to demonstrate the practical application of Artificial Intelligence Foundations, statistical inference, rule-based expert systems, and decision-support modeling to corporate environmental sustainability.

The system ingests supplier operational activity (fuel consumption, grid electricity draw, logistics freight modes, and production volume), calculates Scopes 1, 2, and 3 emissions under the **GHG Protocol Corporate Standard**, runs heuristic anomaly auditing, evaluates supplier equity through the **FAIRScore AI** engine, projects net-zero pathways via a **Carbon Twin Simulator**, and verifies audit non-repudiation using a **ProofChain SHA-256 cryptographic trail**.

---

## 2. Academic Context

- **University:** Lovely Professional University (LPU)
- **Subject:** Artificial Intelligence Foundations
- **Assessment:** Continuous Assessment (CA)
- **Project Domain:** Artificial Intelligence, Environmental Sustainability, Carbon Analytics, and Intelligent Decision Support
- **Evaluation Guide:** 11-Step Guided Project Demonstration built directly into the UI for faculty review

---

## 3. Problem Statement

Corporate supply-chain emissions (**Scope 3**) typically constitute over **70% to 90%** of an enterprise’s greenhouse gas footprint. However, current sustainability accounting approaches suffer from three critical deficiencies:

1. **Systemic Scale Bias in Supplier Evaluation:** Traditional carbon ranking algorithms evaluate suppliers strictly by **gross absolute emissions ($tCO_2e$)**. Consequently, large suppliers are automatically classified as high-risk simply due to their massive production capacity, while small, carbon-inefficient suppliers appear "sustainable" merely because their low output yields a modest absolute carbon footprint.
2. **Opacity and Greenwashing:** Supplier ESG questionnaires and self-reported emissions frequently contain mathematical discrepancies, outdated grid emission factors, or unsubstantiated claims that human auditing teams cannot easily verify across thousands of Tier-1 and Tier-2 vendors.
3. **Lack of Actionable Decarbonization Modeling:** Existing ESG dashboards act as static historical ledgers rather than active decision-support systems, failing to provide predictive "What-If" simulations that quantify the carbon and financial impact of logistical modal shifts or renewable energy transitions.

---

## 4. Project Objectives

1. **Codify Domain Knowledge:** Implement an automated, deterministic expert rule engine for Scope 1, Scope 2, and Scope 3 greenhouse gas calculations conforming to EPA and DEFRA standards.
2. **Mitigate Scale Bias:** Implement **FAIRScore AI**, a production-normalized intensity ranking system ($\\text{Intensity} = \\frac{\\text{Gross Emissions}}{\\text{Production Volume}}$) that evaluates suppliers within industry peer groups ($Z$-score statistical dispersion).
3. **Automate Anomaly Detection:** Formulate rule-based heuristics to detect fuel consumption abnormalities, excessive air-freight logistics, and discrepancies between reported and calculated carbon metrics.
4. **Provide Interactive Decision Support:** Build a **Carbon Twin What-If Simulator** enabling procurement managers to evaluate modal shifts (Road to Rail) and renewable electricity adoption in terms of both emissions avoidance ($tCO_2e$) and financial delta (USD).
5. **Ensure Audit Non-Repudiation:** Construct a sequential SHA-256 cryptographic ledger (**ProofChain**) guaranteeing that audit evidence and verification events cannot be tampered with.
6. **Democratize Interrogation:** Implement a database-grounded conversational agent (**Sustainability Copilot**) enabling natural language queries with evidence citations.

---

## 5. Existing System

Traditional corporate carbon management relies primarily on:
- Manual spreadsheet data collection (Excel) transmitted through annual email surveys.
- High-level enterprise calculators that multiply supplier spend (spend-based accounting) by average industry factors rather than tracking physical activity data.
- Absolute gross emission sorting without normalizing for production units or supplier scale.
- Third-party manual consulting audits that are slow, expensive, and conducted only annually.

**Shortcomings of Existing Systems:**
- High error rates and duplicate entries.
- Unfair disqualification of small, highly efficient suppliers.
- Zero cryptographic audit trails.
- No interactive simulation capabilities.

---

## 6. Proposed System (CarbonTrack)

CarbonTrack replaces static spreadsheets with an end-to-end intelligent auditing architecture:
- **Smart Data Ingestion:** Automated multi-encoding parser supporting CSV and Excel files, dynamic column schema mapping, and automated data quality scoring.
- **AI Carbon Auditor:** Real-time rule-based engine categorizing anomalies into 4 severity tiers with quantified carbon impacts and corrective guidance.
- **FAIRScore AI:** Dual-ranking engine displaying both Absolute Rank and Normalized Rank, highlighting rank shift deltas (e.g., $+20$ for efficient large suppliers, $-25$ for inefficient small suppliers).
- **Carbon Twin Simulator:** Real-time what-if scenario calculator projecting carbon and cost impacts.
- **ProofChain Ledger:** Cryptographic SHA-256 block-linked audit records.
- **AI Sustainability Copilot:** Semantic natural language parser with live SQL database retrieval.
- **PDF Report Generator:** Exportable GHG-compliant audit reports with complete mathematical disclosure.

---

## 7. Artificial Intelligence Concepts Used

CarbonTrack strictly adheres to **academic honesty**, distinguishing between deterministic rules, statistical algorithms, and decision-support systems:

| Technique / Paradigm | Curricular AI Concept | Implementation in CarbonTrack | Concrete Live Example |
|---|---|---|---|
| **Rule-Based Expert System** | Knowledge Representation & Automated Deduction | Codified GHG Protocol calculation rules, activity-to-emission multipliers, and severity classifiers | $Scope_1 = \text{Diesel (L)} \times 2.68$, $Scope_2 = \text{Electricity (kWh)} \times 0.42$ |
| **Statistical Analysis** | Central Tendency & Dispersion Metrics | Peer-group normalization, industry standard deviation, and Z-score outlier boundaries | Supplier S-101 fuel consumption exceeds industry mean by $2.3\sigma$, triggering a Critical finding |
| **Algorithmic Fairness** | Demographic Parity & Scale Normalization | FAIRScore dual-ranking engine decoupling volume scale from carbon efficiency | Small vendor MicroMelt demoted 25 positions due to high unit intensity ($0.0366\ tCO_2e/\text{unit}$) |
| **Decision Support Systems** | Multi-Criteria Decision Analysis (MCDA) | Executive Command Center & interactive multi-tier filtering | Real-time portfolio analysis across 32 suppliers, 5 sectors, and 3 Scope tiers |
| **Counterfactual Simulation** | Predictive Modeling & Sensitivity Analysis | Carbon Twin Simulator applying parameterized operational shifts | Road-to-Rail modal shift + 60% Solar yields $-30.6\%$ emissions reduction ($-5,134.9\ tCO_2e$) |
| **Natural Language Processing** | Semantic Parsing & Grounded Information Retrieval | Sustainability Copilot mapping queries to live database tuples | Query: *"Who are the top 5 emitters?"* returns structured table citing Vulcan, GreenCircuit, Pinnacle |
| **Explainable AI (XAI)** | Algorithmic Transparency & Model Auditability | Step-by-step mathematical disclosure for all audit findings and ranking changes | Every audit finding includes detected issue, formula, impact in tCO2e, severity, and action |

---

## 8. System Architecture

```
                                  [ User Interface (Vite + React + TS) ]
                                                     │
                             ┌───────────────────────┴───────────────────────┐
                             ▼                                               ▼
             [ Executive Command Center / UI ]             [ AI Sustainability Copilot ]
                             │                                               │
                             └───────────────────────┬───────────────────────┘
                                                     ▼ REST APIs (JSON)
                                 [ FastAPI Backend Application (Python) ]
                                                     │
         ┌───────────────────┬───────────────────────┼───────────────────────┬───────────────────┐
         ▼                   ▼                       ▼                       ▼                   ▼
  [ Carbon Engine ]   [ FAIRScore AI ]       [ Auditor Engine ]      [ Carbon Twin ]     [ ProofChain ]
   Scope 1-3 Math      Peer Z-Scores           Expert Rules            What-If Sim         SHA-256 Seal
         │                   │                       │                       │                   │
         └───────────────────┴───────────────────────┼───────────────────────┴───────────────────┘
                                                     ▼
                                      [ SQLite Database Layer ]
                               (Suppliers, Records, Findings, Blocks)
```

---

## 9. Module Descriptions

### Module A: Executive Command Center
Consolidates the global sustainability posture of 32 suppliers ($16,776.04\ tCO_2e$). Displays 6 interactive charts including Monthly Trends, Scope 1-3 Proportions, Sector Contributions, Top 10 Hotspots, Fairness Distributions, and an Emission Intensity vs Volume Scatter plot.

### Module B: Smart Data Ingestion
Ingests `.csv` (UTF-8, Latin-1) and `.xlsx` files. Validates 14 operational fields, recalculates omitted Scope values from primary telemetry, generates data quality scores (0–100), and provides an interactive pre-commit data preview.

### Module C: AI Carbon Auditor
Executes deterministic rule sets to identify operational anomalies: abnormal fuel draw, excessive logistics emissions, and reporting discrepancies. Tracks review status (`OPEN` $\rightarrow$ `REVIEWED`) with timestamps and user attribution.

### Module D: Supplier Intelligence
Provides detailed micro-profiles for all 32 vendors. Analyzes individual Scope distributions, historical operational records, and relative positioning within industry peer groups.

### Module E: FAIRScore AI (Supplier Fairness Engine)
Computes dual scores: Carbon Performance Score and Supplier Fairness Score. Discloses rank shift deltas (e.g., $+20$ for Oceanic Bulk Marine, $-25$ for MicroMelt Precision Stampings) to eliminate scale bias.

### Module F: Carbon Twin Simulator
What-if decarbonization simulation. Users adjust transport modes, fuel efficiency, and renewable grid shares, observing real-time footprint deltas and economic savings.

### Module G: ProofChain Audit Trail
Maintains an immutable sequence of 21 SHA-256 blocks chained from genesis (`0000...0000`). Features automated mathematical verification to detect ledger tampering.

### Module H: AI Sustainability Copilot
Domain-specific conversational assistant. Resolves natural language inquiries with evidence citations directly referencing underlying database records.

### Module I: Audit Reports & PDF Synthesis
ReportLab-powered document generator that creates publication-quality PDF audit reports complete with Scope tables, FAIRScore shifts, and cryptographic certificates.

---

## 10. Technologies Used

- **Frontend:** React 19, TypeScript, Tailwind CSS, Recharts, Lucide React, Vite.
- **Backend:** Python 3.14 / 3.12, FastAPI, SQLAlchemy ORM, SQLite.
- **Data & AI Analytics:** NumPy, Pandas, Scikit-learn, ReportLab.
- **Cryptography:** SHA-256 (Python `hashlib`).

---

## 11. Database Design

```sql
-- Core Entity Models in SQLite (carbontrack.db)
suppliers              (id, name, code, industry, size, location, contact_email)
operational_records    (id, supplier_id, reporting_period, production_volume, fuel_consumption,
                        electricity_consumption, transportation_distance, transportation_mode,
                        calculated_scope1, calculated_scope2, calculated_scope3, calculated_total_emissions,
                        emission_intensity, data_quality_score)
audit_findings         (id, audit_id, supplier_id, severity, category, issue_title, supporting_data,
                        estimated_impact_tco2e, recommended_action, confidence_level, review_status)
fairness_assessments   (id, supplier_id, size_category, industry, absolute_emissions, emission_intensity,
                        absolute_rank, normalized_rank, rank_delta, supplier_fairness_score,
                        peer_group_mean_intensity, statistical_disparity_flag, explanation)
audit_evidence_blocks  (id, finding_id, sequence_index, record_hash, prev_hash, merkle_root, timestamp)
simulation_scenarios   (id, name, description, baseline_emissions, simulated_emissions, reduction_pct,
                        cost_impact_usd, parameter_payload)
```

---

## 12. Methodology

1. **Activity-Based Accounting:** Carbon is computed strictly as $\text{Activity Data} \times \text{Certified Factor}$, never estimated from financial spend.
2. **Peer Group Benchmarking:** Suppliers are partitioned into 5 industry cohorts (Machinery, Electronics, Automotive, Packaging, Logistics).
3. **Statistical Dispersion:** Within each cohort, unit intensity distributions ($\mu, \sigma$) are computed to identify outliers exceeding $2.0$ standard deviations.
4. **Volume Normalization:** Supplier rankings are computed twice—first on raw gross emissions, then on unit intensity—to generate objective rank deltas.
5. **Cryptographic Sealing:** Every audit finding is hashed and sequentially linked to guarantee audit trail immutability.

---

## 13. Implementation Details

- **Backend Architecture:** REST API structured with modular routers under `backend/app/api/` and service engines under `backend/app/services/`.
- **Database Persistence:** Real disk persistence at `backend/data/carbontrack.db` (237 KB).
- **Frontend Architecture:** Single Page Application (SPA) with tabbed navigation, role persona switcher (Admin, Sustainability Manager, Auditor), and modal guidance.

---

## 14. Results and Observations

- **Portfolio Footprint:** Consolidated $16,776.04\ tCO_2e$ across 32 active suppliers.
  - Scope 1: $4,740.38\ tCO_2e$ ($28.3\%$)
  - Scope 2: $5,010.77\ tCO_2e$ ($29.9\%$)
  - Scope 3: $7,024.88\ tCO_2e$ ($41.9\%$)
- **Scale Bias Proof:** MicroMelt Precision Stampings (Small) had low gross emissions ($183\ tCO_2e$, rank #7), but the worst unit intensity ($0.0366\ tCO_2e/\text{unit}$), dropping to rank #32 under FAIRScore. Oceanic Bulk Marine (Large) had high gross emissions ($980\ tCO_2e$, rank #25), but world-class efficiency ($0.0017\ tCO_2e/\text{unit}$), jumping to rank #5 ($+20$ equity gain).
- **Simulation Impact:** Logistics modal shift to rail + 60% solar achieves $-30.6\%$ emissions reduction ($-5,134.9\ tCO_2e$) and $+\$42,500$ annual net savings.
- **ProofChain Integrity:** 21 consecutive SHA-256 blocks verified with 0 broken links; intentional tampering was detected immediately.

---

## 15. Limitations

1. **Static Emission Factors:** Emission factors are configurable but static per reporting cycle; dynamic real-time grid carbon intensity is not integrated.
2. **Single Database Node:** Prototype runs on SQLite; production multi-tenant deployment would require migration to PostgreSQL.
3. **Deterministic Copilot Engine:** The NLP engine uses rule-based semantic slot matching; complex colloquial phrasing outside sustainability vocabulary requires standardized prompt queries.

---

## 16. Future Scope

1. **IoT Sensor Ingestion:** Direct integration with smart factory power meters and telematics OBD-II devices for real-time telemetry.
2. **PostgreSQL & TimescaleDB Migration:** Enable sub-hourly time-series carbon auditing for enterprise IoT streams.
3. **Large Language Model (LLM) Integration:** Optional API connector to Gemini or local LLM for conversational multi-turn dialogue.
4. **Multi-Tier Supply Chain Mapping:** Graph database (Neo4j) tracking Scope 3 carbon propagation from Tier-3 raw miners to Tier-1 assemblers.

---

## 17. Installation and Startup Instructions

### Prerequisites
- Python 3.12 or 3.14 (Virtual environment included in `.venv/`)
- Node.js 18+ and npm

### Startup Option 1: Unified Python Launcher (Recommended)
```powershell
python start_app.py
```
*Starts FastAPI backend on port 8000 and Vite frontend on port 5173, then automatically opens the browser.*

### Startup Option 2: Windows Batch Script
Double-click `run_all.bat` or run in terminal:
```cmd
run_all.bat
```

### Access URLs
- **Academic Project Interface:** `http://localhost:5173`
- **Backend REST API Docs (Swagger UI):** `http://127.0.0.1:8000/docs`

---

## 18. Guided Project Demonstration

Click the **"Guided Project Demonstration"** button in the top navigation bar to open the 11-step evaluation walkthrough:

1. **Understanding the CarbonTrack Project:** AI Foundations, system taxonomy, and problem formulation.
2. **Loading the Demonstration Dataset:** 32 suppliers, multi-tier records, and data quality scoring.
3. **Exploring the Carbon Footprint Dashboard:** Consolidated 16,776 tCO2e footprint and 6 interactive charts.
4. **Performing an Automated Carbon Audit:** Rule-based anomaly detection across 20 findings.
5. **Understanding Scope 1, 2, and 3 Emissions:** Mathematical formula transparency ($Fuel \times 2.68$, $Electricity \times 0.42$).
6. **Examining Supplier Sustainability & FAIRScore:** Volume-normalized intensity ranking.
7. **Understanding Statistical Bias Detection:** Statistical dispersion and rank shifts ($+20$ vs $-25$).
8. **Running Carbon Reduction Simulations:** Modal shift to rail + solar ($-30.6\%$ cut, $\$42,500$ savings).
9. **Verifying ProofChain Data Integrity:** SHA-256 block ledger and tamper detection.
10. **Asking Questions through the AI Copilot:** Natural language query resolution with database citations.
11. **Generating an Analytical PDF Report:** Exportable audit report with cryptographic seal.

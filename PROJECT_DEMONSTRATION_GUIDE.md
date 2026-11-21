# CarbonTrack – Faculty Evaluation & Project Demonstration Guide

**Project Title:** AI-Powered Carbon Footprint Intelligence and Supplier Sustainability Analysis System  
**Subject:** Artificial Intelligence Foundations  
**Assessment:** Continuous Assessment (CA)  
**Institution:** Lovely Professional University (LPU)  
**Evaluator Target Audience:** University Faculty Evaluators & Academic Assessment Committee  

---

## 🎯 Presentation Strategy & Key Message

When demonstrating CarbonTrack to your faculty evaluators, emphasize these three core academic principles:

1. **Academic Honesty:** CarbonTrack does not make false claims about machine learning where deterministic mathematics is legally required. It is an **Intelligent Decision Support System** combining a **Rule-Based Expert System**, **Statistical Anomaly Detection**, and **Algorithmic Fairness Modeling**.
2. **Real-World Significance:** Scope 3 emissions account for over 70% to 90% of enterprise emissions. CarbonTrack addresses the critical problem of **scale bias** where small, efficient suppliers are unfairly penalized simply because they produce smaller absolute volumes.
3. **End-to-End Practical Execution:** All modules operate on a persistent SQLite database (`carbontrack.db`) with 32 realistic suppliers, 20 audited findings, and 21 SHA-256 sealed cryptographic blocks.

---

## 🚀 Pre-Presentation Setup (1 Minute)

1. Open PowerShell or Command Prompt in the project directory:
   ```powershell
   python start_app.py
   ```
2. Verify that:
   - Backend is running on `http://127.0.0.1:8000/docs`
   - Frontend is open in your browser on `http://localhost:5173`
3. Click the top-bar button: **"Guided Project Demonstration"** to open the 11-step evaluation flow modal.

---

## 📋 The 11-Step Evaluation Flow (Viva Script)

```
[ Step 1: AI Foundations ] ──► [ Step 2: Ingestion ] ──► [ Step 3: Command Center ]
                                                                 │
[ Step 6: FAIRScore AI ]  ◄── [ Step 5: Scope 1-3 ]   ◄── [ Step 4: Auditor ]
       │
[ Step 7: Statistical Bias ] ──► [ Step 8: Carbon Twin ] ──► [ Step 9: ProofChain ]
                                                                    │
[ Step 11: PDF Audit Report ] ◄── [ Step 10: Sustainability Copilot ] ◄┘
```

---

### Step 1: Understanding the CarbonTrack Project
- **Navigation:** Click `AI Foundations` on the sidebar.
- **What to tell the Faculty:**
  > *"Sir/Ma'am, CarbonTrack is developed for our AI Foundations Continuous Assessment. In this first view, we document our academic taxonomy. We explicitly distinguish between deterministic expert systems, statistical dispersion metrics, and decision-support modeling. Rather than using an unexplainable black-box neural network, our system codifies the international GHG Protocol Corporate Standards into an automated, transparent intelligence pipeline."*
- **Key Points to Highlight:**
  - Show the 3 sub-tabs: *9 Core AI Concepts*, *Academic Module Breakdown*, and *Technical Honesty & Taxonomy*.
  - Show the distinction table proving that we do not claim unverified machine learning models.

---

### Step 2: Loading the Demonstration Dataset
- **Navigation:** Click `Data Ingestion` on the sidebar.
- **What to tell the Faculty:**
  > *"Here is our Smart Data Ingestion engine. Real-world supply chain data comes in heterogeneous formats (CSV with UTF-8 or Latin-1 encodings, Excel sheets). Our system maps 14 canonical fields, verifies data boundaries, recalculates omitted emissions from raw activity telemetry, and generates an automated Data Quality Score."*
- **Live Action:**
  - Click the **"Load Demo Dataset"** button in the header bar.
  - Show the data preview table displaying the 32 loaded suppliers with quality scores (92–100%).

---

### Step 3: Exploring the Carbon Footprint Dashboard
- **Navigation:** Click `Command Center` on the sidebar.
- **What to tell the Faculty:**
  > *"This is the Executive Command Center, an Intelligent Decision Support System. It aggregates multi-tier activity data into consolidated Scope 1, 2, and 3 emissions. Across our active portfolio of 32 suppliers, the gross footprint is 16,776.0 tCO2e."*
- **Key Visualizations to Point Out:**
  1. **KPI Cards:** Scope 1 ($4,740.4\ tCO_2e$), Scope 2 ($5,010.8\ tCO_2e$), Scope 3 ($7,024.9\ tCO_2e$).
  2. **Chart 1:** Monthly Emission Trend (seasonal area curve).
  3. **Chart 2:** Scope Proportions Donut (Direct Fuel 28.3%, Electricity 29.9%, Supply Chain 41.9%).
  4. **Chart 6:** *Emission Intensity vs Production Volume Scatter Plot* (highlighting efficiency outliers).
  5. **Dynamic Filters:** Filter by industry (e.g., select *Industrial Machinery*) to show real-time KPI recalculations.

---

### Step 4: Performing an Automated Carbon Audit
- **Navigation:** Click `Carbon Auditor` on the sidebar.
- **What to tell the Faculty:**
  > *"The AI Carbon Auditor implements a rule-based expert system. It evaluates activity metrics against industry thresholds to detect anomalies: abnormal diesel fuel consumption, high-emission air freight, and reporting discrepancies. 20 findings were flagged across 4 severity tiers: Critical, High, Medium, and Low."*
- **Live Action:**
  - Open finding **#1 (Vulcan Heavy Forgings & Castings)**.
  - Explain: *"Fuel draw of 145,000 L exceeded the peer baseline by $2.3\sigma$, resulting in a +388.6 tCO2e excess footprint."*
  - Switch user role in top right to **Lead ESG Auditor** and click **"Review Finding"** to show state change to `REVIEWED`.

---

### Step 5: Understanding Scope 1, 2, and 3 Emissions
- **Navigation:** Click `Settings` or refer to formula breakdowns in `Carbon Auditor`.
- **What to tell the Faculty:**
  > *"We maintain full formula transparency conforming to ISO 14064 and GHG Protocol:
  > Scope 1 = Fuel (L) × 2.68 kg CO2e/L
  > Scope 2 = Electricity (kWh) × 0.42 kg CO2e/kWh
  > Scope 3 = Distance (km) × Modal Emission Factor (Road: 0.062, Rail: 0.022, Air: 0.602 kg CO2e/t-km).
  > Every calculation is verifiable with zero hallucinated inputs."*

---

### Step 6 & 7: FAIRScore AI & Statistical Bias Detection
- **Navigation:** Click `FairScore AI` on the sidebar.
- **What to tell the Faculty (MOST IMPORTANT VIVA SECTION):**
  > *"This is the core algorithmic contribution of our project: FAIRScore AI. Traditional ESG rankings sort suppliers strictly by gross emissions. This penalizes large suppliers solely for their production scale, while rewarding small suppliers whose unit manufacturing is actually dirty and inefficient.
  >
  > CarbonTrack introduces a dual-ranking system:
  > 1. Absolute Rank (gross emissions)
  > 2. Normalized Rank (Intensity = Gross Emissions / Production Volume).
  >
  > Let's look at two concrete examples from our database:
  > - **Oceanic Bulk Marine Haulage (Large):** Emits 980 tCO2e, ranking #25 under traditional systems. But its intensity is world-class at 0.0017 tCO2e/unit. FAIRScore awards it an equity gain of +20 positions to Rank #5!
  > - **MicroMelt Precision Stampings (Small):** Emits only 183 tCO2e, so traditional systems falsely ranked it #7. But its intensity is 0.0366 tCO2e/unit—the worst in the entire enterprise. FAIRScore demotes it -25 positions to Rank #32."*

---

### Step 8: Running Carbon Reduction Simulations
- **Navigation:** Click `Carbon Twin` on the sidebar.
- **What to tell the Faculty:**
  > *"The Carbon Twin is a counterfactual simulation engine. Rather than simply reviewing past data, managers can test future decarbonization strategies.
  > If we shift enterprise logistics from Road to Rail and require 60% on-site solar electricity:
  > - Total emissions drop from 16,776.0 to 11,641.1 tCO2e (-30.6% reduction).
  > - Net annual financial savings are projected at +$42,500."*
- **Live Action:**
  - Click **"Load Preset"** and select *"Rail Modal Shift + 60% Solar"*.
  - Show the live KPI delta and the side-by-side comparison bar chart.

---

### Step 9: Verifying ProofChain Data Integrity
- **Navigation:** Click `ProofChain Trail` on the sidebar.
- **What to tell the Faculty:**
  > *"To guarantee non-repudiation in regulatory sustainability audits, CarbonTrack seals every audit finding and review event into a sequential SHA-256 cryptographic chain.
  > Block #0 starts from the Genesis Hash. Each subsequent block hashes the finding payload, timestamp, and previous block hash.
  > If any record in the database is modified or tampered with, the cryptographic link breaks immediately."*
- **Live Action:**
  - Show the 21 verified blocks with green checkmarks.
  - Click **"Verify Cryptographic Integrity"** and show the confirmation modal: *"All 21 blocks verified valid. Zero broken links."*

---

### Step 10: Asking Questions through the AI Copilot
- **Navigation:** Click `AI Copilot` on the sidebar.
- **What to tell the Faculty:**
  > *"Our AI Copilot implements domain-specific Natural Language Processing. It interprets user questions and retrieves factual tuples from our SQLite database without hallucination."*
- **Live Action:**
  - Click the suggested prompt: *"Who are the top 5 highest emitting suppliers?"*
  - Show the structured Markdown table citing Vulcan, GreenCircuit, Pinnacle, Zenith, and Titanium Dynamics.
  - Ask: *"Why was Supplier S-102 flagged?"* and demonstrate the air-freight explanation.

---

### Step 11: Generating an Analytical PDF Report
- **Navigation:** Click `Audit Reports` on the sidebar.
- **What to tell the Faculty:**
  > *"Finally, CarbonTrack automates technical compliance reporting. We use ReportLab to dynamically generate official PDF audit reports conforming to the GHG Protocol Corporate Standard, complete with Scope breakdowns, FAIRScore equity matrices, and ProofChain cryptographic hash seals."*
- **Live Action:**
  - Click **"Download Enterprise Audit Report (PDF)"**.
  - Open the downloaded PDF in your browser to demonstrate the auto-wrapped tables, executive metadata, and institutional heading: *Lovely Professional University · AI Foundations Continuous Assessment*.

---

## ❓ Anticipated Faculty Questions & Model Answers

### Q1: "Is this Machine Learning or Deep Learning?"
**Model Answer:**
> *"No, sir/ma'am. We have explicitly avoided claiming black-box machine learning or deep neural networks. In corporate carbon accounting and legal audits, deterministic rule-based systems and certified EPA/DEFRA emission factors are legally mandatory. CarbonTrack uses an **Applied Expert System**, **Statistical $Z$-Score Dispersion Anomaly Detection**, and **Algorithmic Fairness Normalization**. We have documented this distinction in detail in our `AI_FOUNDATIONS_CONCEPTS.md` and in the AI Foundations section of the UI."*

### Q2: "How is the Supplier Fairness Score calculated?"
**Model Answer:**
> *"The Fairness Score normalizes absolute emissions by dividing by production volume to get unit emission intensity ($\text{tCO}_2\text{e/unit}$). We then benchmark that intensity against the supplier's specific industry peer group mean and standard deviation ($Z$-score). This prevents large suppliers from being penalized purely for high production capacity while preventing small, inefficient suppliers from hiding behind low gross emissions."*

### Q3: "What prevents data tampering in your audit findings?"
**Model Answer:**
> *"We implemented the ProofChain ledger using recursive SHA-256 hashing. Each finding is stored with a payload hash, the previous block's hash, a timestamp, and a sequential block index. If an attacker alters an emission value in the database, its recalculated hash diverges from the chain, which our verification engine detects and flags immediately."*

### Q4: "Where is the data stored?"
**Model Answer:**
> *"Data is stored persistently in an SQLite database at `backend/data/carbontrack.db`. It contains 32 suppliers, 32 operational records, 20 audit findings, 32 fairness assessments, 21 ProofChain blocks, and 2 simulation scenarios. It persists across application restarts and browser reloads."*

---

*This guide guarantees a structured, confident, and academically credible project demonstration for your university evaluation.*

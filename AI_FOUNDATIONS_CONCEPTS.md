# CarbonTrack – Artificial Intelligence Foundations Concepts

**Subject:** Artificial Intelligence Foundations  
**Institution:** Lovely Professional University (LPU)  
**Assessment:** Continuous Assessment (CA)  
**Course Context:** Applied AI, Expert Systems, Statistical Decision Modeling, and Environmental Analytics  

---

## Executive Summary of AI Implementation

In computer science and artificial intelligence, practical real-world applications often rely on **deterministic expert systems, heuristic deduction, and statistical inference** rather than non-interpretable black-box neural networks. This is especially true in environmental auditing and corporate sustainability, where calculations must strictly comply with international accounting standards (**GHG Protocol Corporate Standard** and **ISO 14064**).

CarbonTrack demonstrates how core Artificial Intelligence Foundations concepts are applied to solve the enterprise challenge of **Scope 3 supply-chain carbon visibility and supplier fairness**.

---

## Table of Contents

1. [Concept 1: Applied Artificial Intelligence & Expert Systems](#concept-1-applied-artificial-intelligence--expert-systems)
2. [Concept 2: Intelligent Decision Support Systems (IDSS)](#concept-2-intelligent-decision-support-systems-idss)
3. [Concept 3: Data-Driven Intelligence & Quality Scoring](#concept-3-data-driven-intelligence--quality-scoring)
4. [Concept 4: Statistical Analysis & Anomaly Detection](#concept-4-statistical-analysis--anomaly-detection)
5. [Concept 5: Algorithmic Fairness & Bias Mitigation (FAIRScore AI)](#concept-5-algorithmic-fairness--bias-mitigation-fairscore-ai)
6. [Concept 6: Natural Language Processing & Database-Grounded Retrieval](#concept-6-natural-language-processing--database-grounded-retrieval)
7. [Concept 7: Counterfactual Simulation & What-If Modeling](#concept-7-counterfactual-simulation--what-if-modeling)
8. [Concept 8: Explainable AI (XAI) & Decision Transparency](#concept-8-explainable-ai-xai--decision-transparency)
9. [Concept 9: AI in Environmental Sustainability (Green AI)](#concept-9-ai-in-environmental-sustainability-green-ai)
10. [Technical Taxonomy: Honest Algorithmic Classification](#technical-taxonomy-honest-algorithmic-classification)

---

## Concept 1: Applied Artificial Intelligence & Expert Systems

### Definition
An **Expert System** is an artificial intelligence program that emulates the decision-making ability of a human domain expert. It is designed to solve complex problems by reasoning through bodies of codified knowledge, represented primarily as `IF-THEN` deduction rules and mathematical relations.

### Theoretical Mechanism
An expert system consists of two primary components:
1. **Knowledge Base:** Codified facts, empirical coefficients, and domain rules (e.g., standard emissions factors).
2. **Inference Engine:** An analytical pipeline that evaluates operational activity against the knowledge base to deduce new conclusions (e.g., identifying whether a supplier's emissions intensity is anomalous).

### Implementation in CarbonTrack
CarbonTrack codifies the **GHG Protocol Corporate Standard** and the **GLEC Logistics Framework** into a deterministic knowledge engine:
- Direct fuel combustion is multiplied by certified diesel/fuel coefficients ($2.68\text{ kg CO}_2\text{e/L}$).
- Purchased electricity is multiplied by grid emission factors ($0.42\text{ kg CO}_2\text{e/kWh}$).
- Freight logistics emissions are derived from payload distance and transport mode coefficients (Road: $0.062$, Rail: $0.022$, Air: $0.602\text{ kg CO}_2\text{e/t-km}$).

### Practical Example from Active Database
When evaluating Supplier **S-101 (Vulcan Heavy Forgings)**, the expert system ingests:
- Fuel: $145,000\text{ L}$
- Electricity: $751,600\text{ kWh}$
- Logistics: $8,500\text{ km via Road}$
- Output: $85,000\text{ units}$

The inference engine executes:
$$\text{Scope 1} = 145,000 \times 2.68 \times 10^{-3} = 388.6\text{ tCO}_2\text{e}$$
$$\text{Scope 2} = 751,600 \times 0.42 \times 10^{-3} = 315.7\text{ tCO}_2\text{e}$$
$$\text{Scope 3} = 8,500 \times 1,560 \times 0.062 \times 10^{-6} = 822.8\text{ tCO}_2\text{e}$$
$$\text{Total Calculated} = 1,527.1\text{ tCO}_2\text{e}$$

It automatically flags a **Critical Anomaly** because the unit fuel draw exceeds the industrial machinery benchmark by over $2.3\sigma$.

---

## Concept 2: Intelligent Decision Support Systems (IDSS)

### Definition
An **Intelligent Decision Support System (IDSS)** is a human-in-the-loop computational architecture that organizes high-dimensional data, performs multi-criteria analysis, and assists managers in semi-structured decision-making.

### Theoretical Mechanism
An IDSS does not replace human agency. Instead, it aggregates operational noise into structured key performance indicators (KPIs), provides dynamic sensitivity filters, and allows scenario testing prior to real-world capital deployment.

### Implementation in CarbonTrack
Implemented via the **Executive Command Center** and **Carbon Twin Simulator**:
- Aggregates multi-tier supply chain data into high-level portfolio KPIs: Total Footprint ($16,776.04\text{ tCO}_2\text{e}$), High-Risk Vendors ($20$), and Fairness Index ($73.1\%$).
- Enables cross-sectional slicing by industry sector (Machinery, Electronics, Automotive, Packaging, Logistics) and enterprise scale tier (Small, Medium, Large).
- Enables human ESG auditors to review findings, add verification notes, and transition findings from `OPEN` to `REVIEWED`.

---

## Concept 3: Data-Driven Intelligence & Quality Scoring

### Definition
**Data-Driven Intelligence** refers to the automated ingestion, schema transformation, boundary verification, and quality assessment of external data streams without manual preprocessing.

### Theoretical Mechanism
Raw input files from suppliers often feature missing values, encoding conflicts, or formatting errors. A data-driven intelligence pipeline:
1. Normalizes encodings (e.g., handling UTF-8 with BOM or Latin-1).
2. Maps incoming header aliases to canonical database schemas.
3. Imputes missing derived fields through deterministic formula reconstruction while preventing silent fabrication of operational inputs.
4. Generates an objective Data Quality Score ($0–100$).

### Implementation in CarbonTrack
The **Smart Data Ingestion** module:
- Ingests CSV and Excel (.xlsx) files.
- Automatically maps 14 canonical fields (e.g., mapping `Fuel_Used`, `Liters_Diesel`, or `FuelCons` to `fuel_consumption`).
- Recomputes Scope 1, 2, and 3 emissions if the vendor provided raw operational telemetry but left carbon fields blank.
- Assigns quality penalties if primary activity metrics are missing, flagging incomplete submissions.

---

## Concept 4: Statistical Analysis & Anomaly Detection

### Definition
**Statistical Anomaly Detection** uses measures of central tendency (mean, median) and dispersion (variance, standard deviation, interquartile range) to identify data points that deviate significantly from peer-group distributions.

### Theoretical Mechanism
For any observed metric $x$ within peer group cohort $G$:
$$\mu_G = \frac{1}{N}\sum_{i=1}^N x_i, \quad \sigma_G = \sqrt{\frac{1}{N}\sum_{i=1}^N (x_i - \mu_G)^2}$$
$$Z = \frac{x - \mu_G}{\sigma_G}$$

A data point is flagged as a statistical outlier if $|Z| > 2.0$ (exceeding the 95th percentile under normal distribution assumptions).

### Implementation in CarbonTrack
The **AI Carbon Auditor** computes $Z$-scores across peer groups:
- Evaluates unit fuel consumption per production unit within specific industries.
- Identifies reporting discrepancies where vendor-reported carbon diverges from physical activity by more than $\pm 15\%$.
- Categorizes findings into 4 severity levels:
  - **Critical:** $|Z| \ge 2.5$ or $>50\%$ reporting discrepancy.
  - **High:** $2.0 \le |Z| < 2.5$ or high-emission freight (Air transport).
  - **Medium:** $1.5 \le |Z| < 2.0$ or elevated electricity intensity.
  - **Low:** Incomplete voluntary disclosures or minor boundary variations.

---

## Concept 5: Algorithmic Fairness & Bias Mitigation (FAIRScore AI)

### Definition
**Algorithmic Fairness** evaluates whether an automated decision or ranking model systematically disadvantages specific sub-populations due to confounding variables or proxy attributes.

### The Scale Bias Problem in Carbon Auditing
Traditional ESG procurement ranks vendors solely by **gross absolute footprint ($tCO_2e$)**.
- Large suppliers with high production output naturally emit more gross carbon, even if their manufacturing processes are exceptionally clean.
- Small suppliers with low production volume appear "green" merely because they produce very little, even if their machinery is dirty and inefficient.

### The FAIRScore AI Formulation
CarbonTrack solves this through dual-index ranking:
1. **Absolute Rank:** Ranking based strictly on gross footprint ($tCO_2e$).
2. **Normalized Rank:** Ranking based strictly on **Emission Intensity**:
$$\text{Emission Intensity} = \frac{\text{Calculated Total Emissions (tCO}_2\text{e)}}{\text{Production Volume (units)}}$$

3. **Rank Delta:**
$$\text{Rank Delta} = \text{Absolute Rank} - \text{Normalized Rank}$$

### Real Evidence from CarbonTrack Dataset
- **Oceanic Bulk Marine Haulage (Large Tier):**
  - Gross Footprint: $980.0\text{ tCO}_2\text{e}$ $\implies$ Absolute Rank **#25** (unfairly categorized as high polluter).
  - Production Volume: $570,000\text{ units}$ $\implies$ Intensity: **$0.0017\text{ tCO}_2\text{e/unit}$**.
  - FAIRScore Normalized Rank: **#5** (Rank Delta: **+20**, equity restored).
- **MicroMelt Precision Stampings (Small Tier):**
  - Gross Footprint: $183.0\text{ tCO}_2\text{e}$ $\implies$ Absolute Rank **#7** (appeared clean).
  - Production Volume: $5,000\text{ units}$ $\implies$ Intensity: **$0.0366\text{ tCO}_2\text{e/unit}$** (dirtiest unit intensity in portfolio).
  - FAIRScore Normalized Rank: **#32** (Rank Delta: **-25**, volume-masked inefficiency exposed).

---

## Concept 6: Natural Language Processing & Database-Grounded Retrieval

### Definition
**Domain-Specific NLP** parses user inquiries expressed in human natural language, extracts operational semantics (intents and entities), and retrieves verified database tuples to construct factual, evidence-backed answers.

### Theoretical Mechanism
1. **Tokenization & Normalization:** Strips punctuation, normalizes case, and extracts candidate tokens.
2. **Intent & Entity Classification:** Matches tokens against domain dictionaries (e.g., supplier codes `S-101`, scope identifiers `Scope 1`, keywords `highest emitters`, `fairness`).
3. **Database Tuple Retrieval:** Executes parameterized SQL queries to pull verified numbers.
4. **Natural Language Generation (NLG):** Formulates structured Markdown responses containing numerical disclosures and audit citations.

### Implementation in CarbonTrack
The **AI Sustainability Copilot**:
- Grounded strictly in active database records (no hallucinated external facts).
- Handles inquiries such as:
  - *"Who are the top 5 highest emitting suppliers?"*
  - *"Why was Supplier S-102 flagged?"*
  - *"Which small suppliers may be unfairly evaluated?"*
  - *"What happens if we switch from road to rail?"*
- Generates structured Markdown tables, percentage contributions, and direct audit citations.

---

## Concept 7: Counterfactual Simulation & What-If Modeling

### Definition
**Counterfactual Simulation** models "what would happen if" specific operational variables were altered, enabling predictive scenario optimization without physical or financial risk.

### Theoretical Mechanism
Given baseline state $S_0$ and parameter modification vector $\vec{\Delta}$:
$$S_{\text{sim}} = f(S_0, \vec{\Delta})$$
$$\Delta\text{Emissions} = \text{Emissions}(S_{\text{sim}}) - \text{Emissions}(S_0)$$
$$\text{Cost Impact} = \text{Operational Savings} - \text{Transition Capital Expenditure}$$

### Implementation in CarbonTrack
The **Carbon Twin Simulator**:
- Levers tested:
  - Transport Modal Shift: Road freight $\rightarrow$ Electric/Diesel Rail ($0.062 \rightarrow 0.022\text{ kg CO}_2\text{e/t-km}$).
  - Renewable Electricity Fraction: $0\% \rightarrow 60\%$ Solar ($0.42 \rightarrow 0.05\text{ kg CO}_2\text{e/kWh}$).
  - Efficiency Optimizations: Scrap scrap and energy reductions.
- Live Simulation Results:
  - Baseline Portfolio: $16,776.04\text{ tCO}_2\text{e}$
  - Simulated Portfolio: $11,641.14\text{ tCO}_2\text{e}$
  - Absolute Reduction: **$-5,134.90\text{ tCO}_2\text{e}$ ($-30.61\%$)**
  - Net Annual Financial Impact: **$+\$42,500.00$** savings.

---

## Concept 8: Explainable AI (XAI) & Decision Transparency

### Definition
**Explainable AI (XAI)** encompasses methods that ensure automated analytical outputs, scores, and classifications can be understood, verified, and audited by human domain experts.

### Theoretical Mechanism
In regulatory and financial domains, a model cannot be defended by stating "the neural network outputted this classification." XAI requires:
- **Traceability:** Disclosing exact activity inputs and reference factors.
- **Determinism:** The same inputs must yield identical outputs every time.
- **Auditability:** Documenting why a decision was reached in understandable prose.

### Implementation in CarbonTrack
- Every audit finding exposes:
  1. The specific detected issue.
  2. Exact numerical supporting data ($145,000\text{ L fuel vs } 62,000\text{ peer baseline}$).
  3. Estimated impact in $tCO_2e$.
  4. Explicit formula and emission factor used.
  5. Actionable, step-by-step corrective recommendation.
- FAIRScore AI publishes the exact mathematical shift explanation for every vendor in the supply chain.

---

## Concept 9: AI in Environmental Sustainability (Green AI)

### Definition
**Green AI** represents the computational study and development of intelligent systems applied to reduce environmental degradation, monitor greenhouse gas emissions, optimize energy consumption, and support international climate agreements.

### Real-World Importance
- Aligns computational intelligence with **United Nations Sustainable Development Goals**:
  - **SDG 12:** Responsible Consumption and Production.
  - **SDG 13:** Climate Action.
- Bridges the gap between high-level executive climate pledges and ground-level supplier engineering reality.

---

## Technical Taxonomy: Honest Algorithmic Classification

To maintain the highest standard of **academic rigor and scientific honesty**, the following table explicitly classifies every algorithmic component in CarbonTrack:

| Component in CarbonTrack | Genuine Technique Used | Not Claimed (Academic Honesty) |
|---|---|---|
| **Emission Calculation** | Deterministic Formula Evaluation (GHG Protocol Scopes 1–3) | Not Deep Learning or Machine Learning Regression |
| **Audit Anomaly Detection** | Heuristic Expert System & Statistical $Z$-Score Dispersion | Not Black-Box Autoencoder Neural Networks |
| **FAIRScore Equity** | Mathematical Normalization & Demographic Parity Modeling | Not Reinforcement Learning |
| **Carbon Twin Simulator** | Parameterized Counterfactual Sensitivity Modeling | Not Generative AI |
| **Sustainability Copilot** | Domain NLP, Regular Expression Tokenization & SQL Retrieval | Not Unbounded Generative Hallucination |
| **ProofChain Ledger** | Recursive Cryptographic SHA-256 Hashing | Not Distributed Proof-of-Work Mining |

---

*This document serves as the theoretical and conceptual knowledge reference for the Artificial Intelligence Foundations Continuous Assessment (CA) at Lovely Professional University.*

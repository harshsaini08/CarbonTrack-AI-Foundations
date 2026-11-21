import React, { useState } from 'react';
import {
  GraduationCap,
  Brain,
  Scale,
  Sparkles,
  ShieldAlert,
  Search,
  Cpu,
  BarChart3,
  Bot,
  Layers,
  CheckCircle2,
  FileSpreadsheet,
  AlertTriangle,
  ArrowRight,
  Database,
  Link2,
  HelpCircle,
  Lightbulb,
  Info
} from 'lucide-react';

interface ConceptItem {
  id: string;
  number: number;
  title: string;
  paradigm: 'Rule-Based Expert System' | 'Statistical Analysis' | 'Decision Support' | 'Natural Language Processing' | 'Simulation & Modeling' | 'Explainable AI';
  paradigmColor: string;
  definition: string;
  howItWorks: string;
  carbonTrackImplementation: string;
  practicalExample: string;
  realWorldImportance: string;
  mathFormula?: string;
}

interface ModuleExplanation {
  id: string;
  code: string;
  name: string;
  role: string;
  academicConcept: string;
  keyTechniques: string[];
  description: string;
  metrics: string;
}

export const AIFoundationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'concepts' | 'modules' | 'distinctions'>('concepts');
  const [selectedConcept, setSelectedConcept] = useState<string>('c1');

  const concepts: ConceptItem[] = [
    {
      id: 'c1',
      number: 1,
      title: 'Introduction to Artificial Intelligence & Applied Systems',
      paradigm: 'Rule-Based Expert System',
      paradigmColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      definition: 'Artificial Intelligence (AI) in software engineering refers to computational systems that emulate aspects of human problem-solving, analytical deduction, heuristic reasoning, and automated decision-making.',
      howItWorks: 'Applied AI systems process structured operational observations, test them against codified domain heuristics and statistical thresholds, and surface prioritized insights that would otherwise require days of human manual inspection.',
      carbonTrackImplementation: 'CarbonTrack implements a deterministic, explainable rule-based expert system combined with statistical anomaly scoring. Rather than an unexplainable "black box", the system codifies GHG Protocol Corporate Standards and GLEC logistics frameworks into an automated auditing engine.',
      practicalExample: 'When analyzing supplier operational activity, the engine evaluates fuel combustion, electricity draw, and transport modes against industry benchmark thresholds, generating flagged findings with quantified severity tiers (Critical, High, Medium, Low).',
      realWorldImportance: 'Enterprise sustainability teams manage thousands of Tier-1 and Tier-2 suppliers. Automated heuristic intelligence allows a single sustainability officer to audit an entire global supply chain in seconds.',
    },
    {
      id: 'c2',
      number: 2,
      title: 'Intelligent Decision Support Systems (IDSS)',
      paradigm: 'Decision Support',
      paradigmColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      definition: 'An Intelligent Decision Support System (IDSS) is an interactive software framework that synthesizes raw operational data, domain rules, and analytical models to assist human executives in making complex, semi-structured strategic decisions.',
      howItWorks: 'An IDSS does not replace human managers; instead, it reduces cognitive load by filtering noise, synthesizing high-dimensional data into meaningful key performance indicators (KPIs), and projecting the downstream consequences of alternative choices.',
      carbonTrackImplementation: 'Implemented through the Executive Command Center and Carbon Twin What-If Simulator. The platform aggregates multi-tier activity data into consolidated Scope 1, 2, and 3 emissions, highlights risk concentration, and provides interactive policy filters.',
      practicalExample: 'Procurement executives can test "What-If" decisions—such as transitioning road freight to electrified rail or requiring 60% on-site solar electricity—and immediately view projected carbon reductions and cost impacts.',
      realWorldImportance: 'Prevents costly trial-and-error in corporate capital allocation, enabling organizations to achieve ESG compliance and net-zero milestones through evidence-backed intervention planning.',
    },
    {
      id: 'c3',
      number: 3,
      title: 'Data-Driven Intelligence & Automated Data Quality Scoring',
      paradigm: 'Statistical Analysis',
      paradigmColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      definition: 'Data-Driven Intelligence involves systematically ingesting, cleaning, validating, and extracting actionable inferences from heterogeneous data streams without manual human intervention.',
      howItWorks: 'Input streams (such as vendor spreadsheets) undergo schema reconciliation, boundary validation, missing-value imputation checks, and data quality scoring before being committed to persistent system storage.',
      carbonTrackImplementation: 'The Smart Data Ingestion engine supports CSV (UTF-8, UTF-8-BOM, Latin-1) and Excel (.xlsx) formats. It validates 14 standard supply-chain fields, recalculates omitted Scope values from raw activity telemetry, and assigns an objective Data Quality Score (0–100).',
      practicalExample: 'If a supplier reports fuel and electricity volumes but fails to report calculated carbon emissions, the system recalculates emissions using certified emission factors ($2.68\\text{ kg CO}_2\\text{e/L diesel}$, $0.42\\text{ kg CO}_2\\text{e/kWh}$) instead of hallucinating values or dropping the record.',
      realWorldImportance: 'Supply chain carbon data is notoriously noisy, incomplete, and varied in formatting. Automated quality scoring prevents "garbage-in, garbage-out" auditing.',
    },
    {
      id: 'c4',
      number: 4,
      title: 'Statistical Analysis & Anomaly Detection',
      paradigm: 'Statistical Analysis',
      paradigmColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      definition: 'Statistical anomaly detection is the identification of rare observations, data points, or patterns that deviate significantly from the baseline distribution of the peer group or population.',
      howItWorks: 'By computing central tendency (mean, median) and dispersion metrics (standard deviation, interquartile range), observations that exceed dynamic threshold boundaries ($Z > 2.0$ or $>1.5 \\times \\text{IQR}$) are flagged as potential reporting errors or operational inefficiencies.',
      carbonTrackImplementation: 'The AI Carbon Auditor evaluates supplier activity metrics against peer group distributions across 5 distinct industry sectors. It detects statistical outliers in unit fuel consumption, energy intensity per production unit, and air-freight transport usage.',
      practicalExample: 'Supplier S-101 (Vulcan Heavy Forgings) exhibits excessive diesel consumption of 145,000 liters for its production volume, exceeding the industrial machinery baseline by $2.3\\sigma$, which triggers an immediate Critical Audit Finding with $+388.6\\text{ tCO}_2\\text{e}$ impact.',
      realWorldImportance: 'Detects intentional greenwashing, equipment malfunction, and reporting errors before regulatory audits or public ESG filings.',
      mathFormula: 'Z = \\frac{x - \\mu_{\\text{industry}}}{\\sigma_{\\text{industry}}} > 2.0 \\implies \\text{Flag as Anomaly}',
    },
    {
      id: 'c5',
      number: 5,
      title: 'Supplier Fairness Analysis & Bias Mitigation (FAIRScore AI)',
      paradigm: 'Statistical Analysis',
      paradigmColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      definition: 'Fairness analysis in intelligent systems evaluates whether ranking algorithms or evaluation metrics systematically disadvantage specific demographic or operational sub-groups due to confounding variables such as production scale.',
      howItWorks: 'Traditional carbon audits rank vendors strictly by absolute emissions ($tCO_2e$). Because large suppliers produce higher output, they are penalized simply for their size, while small, carbon-inefficient suppliers appear "clean" merely because their absolute volume is tiny.',
      carbonTrackImplementation: 'FAIRScore AI decomposes supplier performance into dual indices: Absolute Gross Rank vs Production-Normalized Intensity Rank ($\\text{Intensity} = \\text{Total Emissions} / \\text{Production Volume}$). It detects statistical disparity flags when rank shifts exceed threshold equity bounds.',
      practicalExample: 'Oceanic Bulk Marine Haulage produces 980 tCO2e (Absolute Rank #25), but produces massive shipping output at an ultra-efficient intensity of 0.0017 tCO2e/unit. FAIRScore normalizes its volume, promoting it $+20$ positions to Normalized Rank #5. Conversely, MicroMelt Precision Stampings produces only 183 tCO2e (Absolute Rank #7), but has an atrocious intensity of 0.0366 tCO2e/unit, causing a $-25$ rank demotion.',
      realWorldImportance: 'Protects ethical, efficient small enterprises from unfair disqualification while holding large, inefficient suppliers accountable for real unit emissions.',
      mathFormula: '\\text{Emission Intensity} = \\frac{\\text{Gross Emissions (tCO}_2\\text{e)}}{\\text{Production Volume (units)}} \\quad \\text{vs} \\quad \\text{Absolute Rank}',
    },
    {
      id: 'c6',
      number: 6,
      title: 'AI-Assisted Natural Language Processing & Semantic Copilot',
      paradigm: 'Natural Language Processing',
      paradigmColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      definition: 'Natural Language Processing (NLP) enables computational systems to interpret human queries, extract semantic entities and operational intent, and synthesize coherent, contextually grounded natural language answers.',
      howItWorks: 'The query is parsed through regular expression tokenization and intent classifiers, matching keywords to domain entities (supplier IDs, emission scopes, simulation levers). The system retrieves factual database tuples and synthesizes an evidence-backed narrative.',
      carbonTrackImplementation: 'The Sustainability Copilot combines a deterministic local rule-based semantic parser with database-grounded retrieval. It answers inquiries regarding specific suppliers, fairness explanations, decarbonization advice, and anomaly justifications with evidence citations.',
      practicalExample: 'Query: "Who are the top 5 highest emitting suppliers?" -> Copilot retrieves active OperationalRecords, calculates portfolio percentages, and renders a structured Markdown table citing Vulcan Heavy Forgings (9.1%), GreenCircuit PCB (8.4%), and Pinnacle Stamped Metal (7.6%).',
      realWorldImportance: 'Democratizes complex carbon accounting data so non-technical procurement officers and executive board members can interrogate emissions data conversationally.',
    },
    {
      id: 'c7',
      number: 7,
      title: 'Scenario-Based Simulation & Counterfactual Modeling',
      paradigm: 'Simulation & Modeling',
      paradigmColor: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      definition: 'Counterfactual simulation evaluates "what would have happened" or "what would happen if" specific operational parameters were altered, allowing predictive scenario analysis without real-world risk.',
      howItWorks: 'The simulation engine captures the baseline operational snapshot, applies parameterized transformation vectors (delta modal shift, renewable energy fraction, volume scaling), and propagates the changes through the GHG emission factor network.',
      carbonTrackImplementation: 'The Carbon Twin Simulator recalculates enterprise footprint dynamically across 32 suppliers when transport modes are shifted (e.g., Road to Rail), electricity grid factors are greened, or production volumes fluctuate, providing both carbon and dollar delta metrics.',
      practicalExample: 'Switching enterprise road logistics to electric/diesel rail and adding 60% on-site solar across key suppliers yields a calculated $-30.6\\%$ reduction ($-5,134.9\\text{ tCO}_2\\text{e}$) and $+\\$42,500$ in net annual operational savings.',
      realWorldImportance: 'Transforms sustainability from a backwards-looking compliance exercise into an active forward-looking decarbonization strategy.',
    },
    {
      id: 'c8',
      number: 8,
      title: 'Explainable AI (XAI) & Algorithmic Decision Transparency',
      paradigm: 'Explainable AI',
      paradigmColor: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
      definition: 'Explainable AI (XAI) refers to methods and design principles in artificial intelligence that ensure every automated recommendation, score, or classification can be understood and audited by human domain experts.',
      howItWorks: 'Instead of non-interpretable neural network weights, explainable systems expose the exact formula, activity inputs, reference emission factors, and statistical distributions used to arrive at each conclusion.',
      carbonTrackImplementation: 'Every audit finding in CarbonTrack includes: (1) Detected Issue, (2) Quantified Supporting Data, (3) Estimated Impact in tCO2e, (4) Severity Level, (5) Recommended Corrective Action, and (6) Confidence Level. FAIRScore explicitly breaks down why each supplier moved up or down in the rankings.',
      practicalExample: 'For Supplier S-102 (Apex Freight), the system explains: "Flagged High Severity because air freight emission factor (0.602 kg CO2e/t-km) is 9.7x higher than road freight (0.062 kg CO2e/t-km). Switching to intermodal rail will save 142.3 tCO2e."',
      realWorldImportance: 'Essential in regulatory and corporate compliance where decisions cannot be defended in court or before stakeholders by saying "the AI model outputted this number."',
    },
    {
      id: 'c9',
      number: 9,
      title: 'Real-World Applications of AI in Environmental Sustainability',
      paradigm: 'Decision Support',
      paradigmColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      definition: 'Applied AI for sustainability integrates computational sensing, automated telemetry auditing, optimization heuristics, and fairness verification to accelerate global decarbonization and ESG governance.',
      howItWorks: 'Combines multiple analytical disciplines—GHG Protocol standard calculations, statistical anomaly detection, counterfactual optimization, and cryptographic proof verification—into an unified enterprise intelligence stack.',
      carbonTrackImplementation: 'CarbonTrack proves that an integrated, academic-grade AI system can solve the real-world challenge of supply chain emissions (Scope 3), which typically accounts for over 70% to 90% of an enterprise’s total carbon footprint.',
      practicalExample: 'A large manufacturer using CarbonTrack can audit 32 global vendors across machinery, electronics, automotive, chemicals, and logistics, pinpoint the 20 most critical anomalies, eliminate supplier scale bias, and simulate actionable pathways to net-zero.',
      realWorldImportance: 'Aligns computational intelligence with United Nations Sustainable Development Goals (SDG 12: Responsible Consumption and Production, SDG 13: Climate Action).',
    },
  ];

  const modules: ModuleExplanation[] = [
    {
      id: 'm1',
      code: 'Module A',
      name: 'Executive Command Center',
      role: 'Executive Intelligence & Decision Dashboard',
      academicConcept: 'Visual Analytics & Multi-Criteria Decision Support',
      keyTechniques: ['GHG Protocol Scopes 1-3 Aggregation', 'Multi-Series Visual Trends', 'Dispersion Scatter Benchmarking', 'Dynamic Industry Filtering'],
      description: 'Provides holistic real-time synthesis of enterprise sustainability posture. Transforms raw supplier operational data into consolidated portfolio emissions, high-risk flag concentrations, and fairness indices.',
      metrics: 'Portfolio: 16,776.0 tCO2e | 32 Suppliers | 6 Interactive Charts'
    },
    {
      id: 'm2',
      code: 'Module B',
      name: 'Smart Data Ingestion',
      role: 'Automated Data Quality & Schema Mapping',
      academicConcept: 'Data Cleaning, Validation Heuristics & Deterministic Imputation',
      keyTechniques: ['Multi-Encoding Ingestion (UTF-8, Latin-1)', '14-Field Schema Mapping', 'Missing Value Imputation', 'Data Quality Scoring (0-100)'],
      description: 'Ingests messy CSV and Excel supplier submissions. Detects formatting irregularities, automatically recalculates missing Scope values from underlying activity metrics, and generates a pre-commit data preview.',
      metrics: '14 Standard Fields | Multi-Format Ingestion | Quality Scoring'
    },
    {
      id: 'm3',
      code: 'Module C',
      name: 'AI Carbon Auditor',
      role: 'Rule-Based Anomaly Detection & Finding Classifier',
      academicConcept: 'Expert System Heuristics & Severity Classification',
      keyTechniques: ['Activity x Factor Formulation', 'Z-Score Statistical Deviation', 'Severity Tiering (Critical to Low)', 'Auditor Review Lifecycle Tracking'],
      description: 'Analyzes operational telemetry to identify excessive fuel draw, high-carbon air freight logistics, and reported vs calculated emission discrepancies. Packages each finding with quantified impact and remediation guidance.',
      metrics: '20 Active Anomalies | 4 Severity Tiers | Audit Trail Continuity'
    },
    {
      id: 'm4',
      code: 'Module D',
      name: 'Supplier Intelligence',
      role: 'Supplier-Level Profiling & Micro-Auditing',
      academicConcept: 'Entity Profiling & Multi-Dimensional Performance Benchmarking',
      keyTechniques: ['Tier-Specific Footprint Decomposition', 'Peer-Group Comparison', 'Direct Emission Verification', 'Historical Trend Tracking'],
      description: 'Drills down into individual vendor operational records. Compares suppliers against their specific industrial peer groups and tracks individual progress toward corporate emission reduction targets.',
      metrics: '32 Comprehensive Supplier Profiles across 5 Sectors'
    },
    {
      id: 'm5',
      code: 'Module E',
      name: 'FAIRScore AI',
      role: 'Supplier Fairness Engine & Bias Mitigation',
      academicConcept: 'Algorithmic Fairness, Production Normalization & Statistical Equity',
      keyTechniques: ['Volume-Normalized Intensity Scoring', 'Absolute vs Normalized Ranking Delta', 'Disparity Flags', 'Peer-Group Standard Deviation Analysis'],
      description: 'Resolves systemic scale bias in traditional carbon accounting. Uncovers how small suppliers are unfairly penalized on gross footprint while large inefficient suppliers hide behind high output, restoring rank equity.',
      metrics: 'Rank Shifts up to +20 and -25 positions | Equity Explanations'
    },
    {
      id: 'm6',
      code: 'Module F',
      name: 'Carbon Twin Simulator',
      role: 'What-If Decarbonization Modeling',
      academicConcept: 'Counterfactual Simulation & Scenario Impact Analysis',
      keyTechniques: ['Multi-Parameter Sensitivity Modeling', 'Logistics Modal Shift Analysis', 'Renewable Energy Substitution', 'Dual Metric (Carbon + Cost) Output'],
      description: 'Enables interactive scenario exploration by simulating changes in transport modes (Road to Rail), energy mix (Solar adoption), and efficiency gains, projecting net carbon avoidance and economic savings.',
      metrics: '-30.6% Reduction (-5,134.9 tCO2e) | $42,500 Net Annual Savings'
    },
    {
      id: 'm7',
      code: 'Module G',
      name: 'ProofChain Audit Trail',
      role: 'Cryptographic Integrity & Tamper Detection',
      academicConcept: 'Cryptographic Hashing & Immutable Ledger Verification',
      keyTechniques: ['SHA-256 Block Chaining', 'Genesis Hash Linkage', 'Automated Tamper Verification', 'Auditor Signature Stamping'],
      description: 'Ensures audit integrity by sealing every finding and verification event into a sequential SHA-256 cryptographic chain. Any unauthorized modification to audit evidence instantly breaks the hash sequence.',
      metrics: '21 Cryptographic Blocks | Zero Broken Links | Tamper-Evident'
    },
    {
      id: 'm8',
      code: 'Module H',
      name: 'AI Sustainability Copilot',
      role: 'Conversational Intelligence & Semantic Grounding',
      academicConcept: 'Domain-Specific NLP & Database-Grounded Retrieval',
      keyTechniques: ['Semantic Intent Classification', 'Database Tuple Grounding', 'Evidence Citation Engine', 'Actionable Procurement Recommendation'],
      description: 'Empowers users to interrogate the complex carbon dataset via natural language. Parses user questions and constructs evidence-backed, factual responses citing real suppliers and exact emission metrics.',
      metrics: 'Real Database Grounding | Structured Markdown Tables | Citations'
    },
    {
      id: 'm9',
      code: 'Module I',
      name: 'Audit Reports & PDF Synthesis',
      role: 'Automated Technical Communication',
      academicConcept: 'Structured Document Generation & Compliance Reporting',
      keyTechniques: ['ReportLab PDF Compilation', 'Flowable Table Auto-Wrapping', 'GHG Protocol Standard Conformity', 'Digital Hash Certificate Inclusion'],
      description: 'Compiles technical and executive sustainability reports on-demand. Exports comprehensive enterprise audits and single-supplier certificates with complete mathematical disclosure and ProofChain references.',
      metrics: 'Comprehensive Enterprise Audit PDF | Single-Vendor Certificates'
    },
  ];

  const currentConcept = concepts.find((c) => c.id === selectedConcept) || concepts[0];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Academic Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-charcoal-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs bg-emerald-950 text-emerald-400 px-2.5 py-0.5 rounded border border-emerald-800/80 font-mono font-medium flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              Lovely Professional University · AI Foundations (CA)
            </span>
            <span className="text-xs text-charcoal-400">|</span>
            <span className="text-xs text-charcoal-300 font-medium">Academic Project Knowledge Base</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>AI Foundations & Theoretical Methodology</span>
          </h1>
          <p className="text-xs text-charcoal-400 mt-1 max-w-3xl leading-relaxed">
            Detailed academic documentation of the Artificial Intelligence, statistical modeling, expert systems, and decision-support techniques implemented throughout the CarbonTrack system.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-charcoal-900 p-1 rounded-xl border border-charcoal-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('concepts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'concepts'
                ? 'bg-forest-800 text-emerald-300 border border-emerald-700/50 shadow-sm'
                : 'text-charcoal-400 hover:text-white'
            }`}
          >
            9 Core AI Concepts
          </button>
          <button
            onClick={() => setActiveTab('modules')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'modules'
                ? 'bg-forest-800 text-emerald-300 border border-emerald-700/50 shadow-sm'
                : 'text-charcoal-400 hover:text-white'
            }`}
          >
            Academic Module Breakdown
          </button>
          <button
            onClick={() => setActiveTab('distinctions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'distinctions'
                ? 'bg-forest-800 text-emerald-300 border border-emerald-700/50 shadow-sm'
                : 'text-charcoal-400 hover:text-white'
            }`}
          >
            Technical Honesty & Taxonomy
          </button>
        </div>
      </div>

      {/* VIEW 1: 9 CORE AI CONCEPTS */}
      {activeTab === 'concepts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Concept Selector List (Left 4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-charcoal-400 px-1 mb-2 flex items-center justify-between">
              <span>Core Curricular Concepts</span>
              <span className="text-[10px] text-emerald-400 font-mono">9 Topics</span>
            </div>

            <div className="space-y-1.5">
              {concepts.map((c) => {
                const isSelected = c.id === selectedConcept;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedConcept(c.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex items-start gap-3 ${
                      isSelected
                        ? 'bg-forest-900/80 border-emerald-600/70 text-white shadow-lg shadow-emerald-950/40'
                        : 'bg-charcoal-900/90 border-charcoal-800 text-charcoal-300 hover:border-charcoal-700 hover:bg-charcoal-850'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                        isSelected
                          ? 'bg-emerald-500 text-charcoal-950'
                          : 'bg-charcoal-800 text-charcoal-400'
                      }`}
                    >
                      {c.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white truncate">{c.title}</div>
                      <div className="text-[10px] text-charcoal-400 mt-0.5 truncate">{c.paradigm}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Concept Detail Card (Right 8 cols) */}
          <div className="lg:col-span-8 bg-charcoal-900 border border-charcoal-750 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="border-b border-charcoal-800 pb-4">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded border font-semibold ${currentConcept.paradigmColor}`}>
                  {currentConcept.paradigm}
                </span>
                <span className="text-xs text-charcoal-500">·</span>
                <span className="text-xs text-emerald-400 font-mono">Topic {currentConcept.number} of 9</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {currentConcept.title}
              </h2>
            </div>

            {/* Concept Breakdown Grid */}
            <div className="space-y-4 text-xs leading-relaxed">
              {/* 1. Simple Definition */}
              <div className="p-4 rounded-xl bg-charcoal-850/80 border border-charcoal-800 space-y-1.5">
                <div className="font-bold text-emerald-300 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  1. Simple Academic Definition
                </div>
                <p className="text-charcoal-200">
                  {currentConcept.definition}
                </p>
              </div>

              {/* 2. How the Concept Works */}
              <div className="p-4 rounded-xl bg-charcoal-850/80 border border-charcoal-800 space-y-1.5">
                <div className="font-bold text-cyan-300 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  2. Theoretical Mechanism (How it Works)
                </div>
                <p className="text-charcoal-200">
                  {currentConcept.howItWorks}
                </p>
                {currentConcept.mathFormula && (
                  <div className="mt-2 p-2.5 bg-charcoal-950 rounded-lg border border-charcoal-800 font-mono text-[11px] text-emerald-400 text-center">
                    {currentConcept.mathFormula}
                  </div>
                )}
              </div>

              {/* 3. Implementation in CarbonTrack */}
              <div className="p-4 rounded-xl bg-charcoal-850/80 border border-charcoal-800 space-y-1.5">
                <div className="font-bold text-purple-300 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  3. Implementation in CarbonTrack
                </div>
                <p className="text-charcoal-200">
                  {currentConcept.carbonTrackImplementation}
                </p>
              </div>

              {/* 4. Practical Concrete Example */}
              <div className="p-4 rounded-xl bg-forest-950/40 border border-emerald-800/40 space-y-1.5">
                <div className="font-bold text-emerald-400 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  4. Practical Example from Active Database Records
                </div>
                <p className="text-emerald-100">
                  {currentConcept.practicalExample}
                </p>
              </div>

              {/* 5. Real-World Importance */}
              <div className="p-4 rounded-xl bg-charcoal-850/80 border border-charcoal-800 space-y-1.5">
                <div className="font-bold text-amber-300 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  5. Real-World & Environmental Significance
                </div>
                <p className="text-charcoal-200">
                  {currentConcept.realWorldImportance}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: ACADEMIC MODULE BREAKDOWN */}
      {activeTab === 'modules' && (
        <div className="space-y-4">
          <div className="bg-charcoal-900 border border-charcoal-800 rounded-xl p-4 text-xs text-charcoal-300 flex items-center gap-3">
            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Each of the 9 modules in CarbonTrack implements a specific academic discipline across expert systems, statistical modeling, visual analytics, or cryptographic data integrity.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((m) => (
              <div
                key={m.id}
                className="bg-charcoal-900 border border-charcoal-800 rounded-xl p-5 space-y-3 flex flex-col justify-between hover:border-emerald-700/50 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/60">
                      {m.code}
                    </span>
                    <span className="text-[10px] text-charcoal-400 font-mono">Academic Module</span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{m.name}</h3>
                  <div className="text-[11px] text-emerald-300 font-medium">{m.academicConcept}</div>
                  <p className="text-xs text-charcoal-400 leading-relaxed">{m.description}</p>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-charcoal-800 text-[11px]">
                  <div className="text-[10px] uppercase font-bold text-charcoal-500 tracking-wider">Key Methodologies</div>
                  <div className="flex flex-wrap gap-1.5">
                    {m.keyTechniques.map((tech, idx) => (
                      <span key={idx} className="bg-charcoal-800 text-charcoal-300 px-2 py-0.5 rounded text-[10px]">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 text-[10px] font-mono text-emerald-400 bg-charcoal-950 p-2 rounded border border-charcoal-800">
                    {m.metrics}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: TECHNICAL HONESTY & AI TAXONOMY */}
      {activeTab === 'distinctions' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-950/60 via-charcoal-900 to-charcoal-900 border border-emerald-800/40 rounded-xl p-6 space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-400" />
              <span>Academic Integrity: Explicit Algorithmic Classification</span>
            </h2>
            <p className="text-xs text-charcoal-300 leading-relaxed max-w-3xl">
              In academic AI evaluation, it is critical not to conflate deterministic mathematics, heuristic expert rules, or statistical dispersion metrics with deep machine learning. Below is CarbonTrack’s verified algorithmic taxonomy:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Box 1: What CarbonTrack Genuinely Implements */}
            <div className="p-6 rounded-2xl bg-charcoal-900 border border-emerald-800/60 space-y-4">
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Genuinely Implemented AI & Statistical Techniques</span>
              </div>
              <ul className="space-y-2.5 text-xs text-charcoal-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Rule-Based Expert Auditing:</strong> Codified heuristic inference engine with GHG Protocol Scopes 1–3 calculations (2.68 kg CO2e/L diesel, 0.42 kg CO2e/kWh electricity).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Statistical Dispersion & Outlier Scoring:</strong> Normalization by volume, peer-group standard deviation ($Z$-scores), and interquartile boundary detection.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Algorithmic Fairness Modeling:</strong> Dual-index equity ranking (Absolute vs Intensity-adjusted) with demographic/scale parity checks.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Counterfactual Simulation:</strong> Dynamic what-if parameterized projection of logistics modal shifts and renewable power adoption.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Semantic Query Interpretation:</strong> Local rule-grounded NLP engine mapping natural language questions to live SQL database records.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Cryptographic Hash Chain:</strong> SHA-256 sequential block linkage with automated tamper detection.</span>
                </li>
              </ul>
            </div>

            {/* Box 2: What CarbonTrack Does NOT Claim */}
            <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-750 space-y-4">
              <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm">
                <AlertTriangle className="w-5 h-5" />
                <span>Techniques Not Falsely Claimed (Academic Honesty)</span>
              </div>
              <ul className="space-y-2.5 text-xs text-charcoal-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong>No Black-Box Deep Neural Networks:</strong> Emission calculations are intentionally deterministic to comply with financial and environmental audit standards.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong>No Hallucinated ML Training:</strong> CarbonTrack does not claim to train neural regression models where certified EPA/DEFRA emission factors are legally required.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong>No Simulated Inferences as Real Telemetry:</strong> Missing operational activity metrics are never silently invented; gaps are explicitly flagged as data quality warnings.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong>Explainability Priority:</strong> All scoring algorithms provide complete step-by-step mathematical breakdowns rather than unexplainable latent feature embeddings.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

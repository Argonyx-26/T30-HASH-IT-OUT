# SENTINEL

### From scattered signals to confident response.

**Full Title:** Sentinel: A Privacy-Preserving Multi-Agent Situational Awareness System for Smart Campuses

---

## 1. Core Innovation & Philosophy

Campus safety personnel face an overwhelming deluge of isolated sensor alerts, door contact triggers, optical motion flags, and dispatcher calls.

**The Core Transformation:**
```text
SCATTERED SIGNALS
        ↓
EVENT CORRELATION
        ↓
SITUATION UNDERSTANDING
        ↓
PRIORITIZED INCIDENT
        ↓
EXPLAINABLE EVIDENCE
        ↓
HUMAN DECISION
```

> **"AI recommends. Humans decide."**  
> Sentinel is **NOT** a facial recognition surveillance tool, weapon scanner, or autonomous actuator. It is an intelligent correlation and explainability mesh designed to keep authorized humans firmly in control.

---

## 2. Key Capabilities & Architecture

- **10-Agent Collaborative Mesh**:
  - *Perception Layer*: Vision Agent (optical flow density only), Sensor Agent, Access Agent, Report Agent, Anomaly Agent.
  - *Reasoning Layer*: Correlation Engine, Risk Agent, Explainability Agent, Response Agent.
  - *Governance Layer*: Privacy & Audit Agent.
- **Dynamic Simulation Clock**: Replay clock generates runtime relative offsets (`00:00`, `00:04`, `00:16`) across 1x, 2x, 5x, 10x speeds. All data is clearly watermarked as **SIMULATION MODE / DIGITAL TWIN**.
- **Interactive Campus Digital Twin**: Vector SVG/CSS map displaying 8 campus facilities (Science Annex, Engineering Block, Library, Student Center, Administration, Main Gate, Parking, Hostel) with status halos and dynamic source markers.
- **Explainability Dossier**: Unpacks *Why Created*, *Why Prioritized*, *Why Confidence Changed*, *What is Uncertain*, and *What Would Change the Assessment*.
- **Alert Compression**: Compresses 20 noisy alarms into 1 prioritized incident dossier.
- **Tamper-Evident Audit Trail**: Immutable logging of all agent inferences and operator authorizations.

---

## 3. Website Routes & Structure

| Route | View | Description |
|---|---|---|
| `/` | Landing Page | Hero animated signal-correlation engine, problem comparison, alert compression funnel, interactive 10-agent mesh, responsible AI guarantees, and digital twin preview. |
| `/operations` | Command Center | 3-tier operations console: Level 1 Incident Queue, Level 2 Digital Twin & Intelligence Panel, Level 3 Response Recommendations & Operator Notes, Bottom Live Signal Stream. |
| `/incidents` | Incident Dossiers | Filterable catalog of all active, elevated, critical, acknowledged, and resolved case files. |
| `/incidents/:id` | Case Investigation | Deep-dive case file with Overview, Evidence, Timeline, Situation Graph, Response, and Audit tabs. |
| `/simulation` | Digital Twin Simulation | Replay controls (Play, Pause, Reset, 1x/2x/5x/10x), 5 rich safety scenarios, progress bar, and "Launch Judge Demo" button. |
| `/analytics` | Operational Intelligence | Alert compression comparison (20 raw alerts $\rightarrow$ 1 situation), dynamic confidence evolution chart, latency histograms, and zone posture. |
| `/audit` | Audit Trail | Filterable, chronological ledger of all system events, agent inferences, and operator notes. |
| `/settings` | Privacy by Design | Hardcoded privacy constraints (Facial recognition DISABLED, Biometrics DISABLED, Human confirmation REQUIRED). |
| `/architecture` | Architecture Specs | 7-stage pipeline breakdown, Common Event Format (CEF) schema, and deterministic correlation mathematics. |

---

## 4. One-Click Judge Demo Guide (Under 2 Minutes)

1. Click the glowing **"Judge Demo"** button in the top navigation bar or on the landing page.
2. Observe the campus start in a calm, nominal state (**Phase 1**).
3. At simulated `00:04`, a thermal anomaly triggers in the Science Annex (**Phase 2**).
4. At simulated `00:09`, a dispatch report arrives and the correlation engine fuses the signals into **INC-2048: Possible Fire Incident** (**Phase 3**).
5. At simulated `00:16`, a manual pull station triggers; evidence confidence climbs dynamically from 61% to 86% (**Phase 4**).
6. Click **"Why This Incident?"** to inspect the Explainability Dossier.
7. Click **"Acknowledge Incident"**, add an operator note (*"Visual verification requested from Sector B patrol"*), and click **"Resolve"** (**Phases 5 & 6**).
8. Inspect the **Situation Graph** and **Audit Trail** to demonstrate complete transparency and accountability.

---

## 5. Running the Application Locally

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Quick Start

```powershell
# From the project root (c:\Users\HP\Desktop\sentinel)

# Start backend server (Port 4000)
npm run server

# In a separate terminal, start frontend client (Port 5173)
npm run client
```

Then open your browser to **http://localhost:5173**.

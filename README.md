# EnviroFHIR-Guard
### 🛡️ Automated Trust-Scored Interoperability Engine for Citizen Science & Environmental Informatics

> **Product Tagline:** *From Untrusted Environmental Signals to Trusted Healthcare Interoperability. Verify first. Trust transparently. Interoperate securely.*

---

## 📌 Project Overview
**EnviroFHIR-Guard** acts as an intelligent data firewall between untrusted, heterogeneous environmental data streams (IoT sensors, citizen reports) and strict, clinical-grade healthcare networks. 

Instead of blindly converting raw metrics, this system implements an algorithmic **Trust Engine** that cross-verifies environmental anomalies against external meteorological infrastructure (e.g., Open-Meteo APIs), calculates an explainable digital trust score, embeds cryptographic SHA-256 provenance hashes, and outputs fully-compliant **HL7 FHIR R5 Transaction Bundles**.

---

## 📸 System Previews

<img width="960" height="446" alt="image" src="https://github.com/user-attachments/assets/5667e1a7-4694-4470-97d9-f3d5548b931d" />

<img width="960" height="443" alt="image" src="https://github.com/user-attachments/assets/f9c179ba-e702-4b00-a900-e612bfd0e3bd" />


<img width="954" height="441" alt="image" src="https://github.com/user-attachments/assets/ccea3711-4d81-4d71-a259-671f1bec0abc" />


---

## ⚔️ The Problem & Core Solution

### ❌ The Core Infrastructure Disconnect
Urban ecological disasters (e.g., chemical runoff, severe pH shifts, vector population spikes) directly threaten public health. However, modern clinical databases run on strict data protocols like **HL7 FHIR** and cannot safely ingest raw, unverified IoT payloads or messy citizen spreadsheets. Doing so introduces severe security, integrity, and data pollution risks to clinical environments.

### 🛡️ The EnviroFHIR-Guard Solution
This application architecture defines a strict zero-trust boundary:

Raw Environmental Ingestion ➡️ Schema Validation ➡️ Anomaly Detection ➡️ External Weather Cross-Verification ➡️ Algorithmic Trust Scoring ➡️ Semantic FHIR Mapping (LOINC) ➡️ Cryptographic SHA-256 Fingerprinting ➡️ FHIR Sandbox Transmission.

---

## 🏗️ Technical Architecture & Data Pipeline
```text
  [ Untrusted Zone ]          [ Trust Firewall (EnviroFHIR-Guard) ]          [ Trusted Clinical Zone ]
  💡 IoT Sensor Streams   ──► 🛡️ Validation & Anomaly Detection       ──► 🏥 HL7 FHIR R5 Observation
  📣 Citizen App Reports  ──► ☁️ External API Cross-Verification      ──► 🔒 Cryptographic Provenance
  📊 Unverified Metrics   ──► 🧮 Explainable Trust Scoring Matrix     ──► 🌐 OneAquaHealth Sandbox
```

---

## ⚡ Key Architectural Features

* **Multi-Modal Ingestion Engines:** Dual entry pathways optimized for structured IoT sensor JSON strings (tracking parameters like pH, Dissolved Oxygen, Turbidity) and unstructured Citizen Scientist incident data text reports.
* **External Verification Matrix:** Automatically triggers asynchronous sub-queries to external meteorological endpoints to evaluate if real-world historical data matches environmental anomalies (e.g., verifying if a reported flash-flood runoff correlates with actual precipitation records).
* **Explainable Digital Trust Score:** Replaces opaque algorithms with a transparent, configurable metrics matrix analyzing payload integrity, sensor history, and location consistency.
* **Cryptographic Data Provenance:** Generates immutable SHA-256 fingerprints of raw source payloads, wrapping them into native FHIR Provenance Resources linked to standard **LOINC 29198-9 (Water pH)** data codings.

---

## 🛠️ Technology Stack & Engineering Standards

### Frontend Core
* **React 19 & TypeScript:** Scalable, strictly typed UI layer built over modern component principles.
* **Vite:** High-performance Next-Generation frontend tooling for hot module replacement.
* **Tailwind CSS:** Utility-first utility engines for custom cyber-clinical styling presets.
* **Recharts:** Functional, lightweight vector chart engines mapping time-series environmental drift data.
* **Lucide React:** Clean, consistent clinical and system vector iconography.

### Backend & Interoperability
* **Python & FastAPI:** High-performance, production-ready asynchronous API foundation framework.
* **Pydantic v2:** Rigid data schema enforcement and native runtime validation gates.
* **HL7 FHIR R5:** The latest global standard structure for modern health healthcare record interoperability.
* **LOINC Data Coding:** Standardized terminology bindings for precise medical and laboratory observation indexing.
* **SHA-256 Engine:** Browser and server-native cryptographic security fingerprint modules.

---

## 👤 Author & Maintainer

**Saz Jani**
* **Website:** envirofhir-guard-mu.vercel.app
* **LinkedIn:** www.linkedin.com/in/saz-jani-88250b425


Feel free to connect or reach out regarding full-stack software development, healthcare informatics, or interoperability project collaborations!

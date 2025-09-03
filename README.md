# ChronoPapers  
**Preserving knowledge forever with decentralized, tamper-proof archives.**

---

## Overview  
ChronoPapers is a decentralized archive for academic research, built on **Filecoin Onchain Cloud**.  
It allows researchers to **upload, timestamp, and preserve** their papers permanently while ensuring authenticity through **verifiable storage proofs**. Each paper gets a unique **CID** (Content Identifier), and versioning ensures transparency for updates or corrections.  

---

## Problem  
Academic research today faces critical challenges:  
- Centralized repositories can lose access (paywalls, shutdowns, censorship).  
- Papers lack guaranteed **permanence** or **verifiability** once published.  
- Version tracking is fragmented, leading to mistrust in authenticity.  
- Researchers in underfunded regions struggle with accessible, reliable storage.  

---

## Solution : ChronoPapers
ChronoPapers solves this by leveraging **Filecoin Onchain Cloud** to provide:  
- **Decentralized, permanent storage** for academic papers.  
- **Verifiable authenticity** using Proof of Data Possession (PDP).  
- **Immutable timestamps & version control** for transparent research history.  
- **Global, censorship-resistant access** to knowledge archives.  

---

## Docs
[Notion Guide Docs](https://secret-blackberry-bc2.notion.site/ChronoPapers-263412aee10c80ad88dce2a137c46296)

## ✨ Features  
- **Decentralized Storage** – Papers stored securely on Filecoin/IPFS.  
- **Tamper-Proof** – Verifiable via cryptographic proofs (PDP).  
-  **Timestamped & Immutable** – Each paper is time-anchored and linked to previous versions.  
- **Search & Browse** – Query by title, author, or CID.  
- **Version Control** – Track revisions while preserving the original work.  

---

## 🛠️ Tech Stack  
- **Frontend**: React + TypeScript (prototype with Figma mockups)  
- **Storage & Proofs**: Filecoin, IPFS, PDP contracts  
- **Onchain Registry**: Filecoin Onchain Cloud primitives  
- **Integration SDKs**: [Synapse SDK](https://github.com/FilOzone/synapse-sdk), FilecoinPay, Filecoin Services  

---

## 🏗️ Architecture  
- **Researcher Uploads Paper** → Paper & metadata sent to Filecoin/IPFS.  
- **CID Generated** → Unique content identifier stored onchain.  
- **Versioning** → Each update links to the previous CID for full history.  
- **Proof-of-Data-Possession (PDP)** → Ensures the file still exists without re-uploading.  
- **Reader Retrieval** → Users fetch papers by CID with guaranteed authenticity.  

---

## 🚀 Current Progress (Wave 1)  
- Designed core UI mockups: Upload, Search, and Detail pages.  
- Defined metadata schema for papers with CID + version control.  
- Drafted system architecture and PDP verification flow.  
- Outlined full lifecycle: Upload → Store → Verify → Retrieve.  

---

## 📅 Roadmap  
### Wave 2 (MVP Build)  
- Integrate Filecoin storage for real uploads.  
- CID generation & retrieval enabled.  
- Basic search functionality live.  

### Wave 3 (Polish & Iteration)  
- Enhanced UI/UX for smoother onboarding.  
- Author profiles & citation management.  
- Improved verification dashboard.  

### Wave 4 (Final Product)  
- Full-stack integration with Filecoin Onchain Cloud.  
- PDP verification live for uploaded files.  
- Production-ready decentralized research archive.  

---

## License  
MIT License © 2025 ChronoPapers Team

# VeriTrust — Product Logic

## Overview
VeriTrust is a trust infrastructure for the AI era. It independently evaluates:
1. Whether content is authentic or synthetic.
2. Whether content is factually true.

These are treated as orthogonal dimensions.

---

## Inputs
- Text
- Image
- Audio
- Video
- Profile or metadata

---

## Outputs

### Authenticity
- Likely Real
- Likely AI-Generated
- Likely Edited / Mixed
- Uncertain

### Truthfulness
- Likely True
- Likely False
- Mixed / Partially True
- Uncertain

Each includes:
- Confidence score
- Evidence
- Limitations

---

## Authenticity Engine

Uses:
- Cryptographic provenance (C2PA, signatures)
- Physical constraints (camera physics, audio acoustics)
- Temporal consistency (video)
- Generative behavior tests (diffusion snap-back)
- Contextual signals

Fused using Bayesian Evidence Accumulation with capped likelihood ratios.

---

## Truth Engine

### Step 1: Claim Extraction
Decompose content into atomic factual claims.

### Step 2: Evidence Retrieval
Search:
- Wikipedia / Wikidata
- News APIs
- Government datasets
- Academic databases

### Step 3: Cross-Source Agreement
Compare consistency across sources.

### Step 4: Reasoning
Use LLM to compare claims vs evidence.

### Step 5: Scoring
Score based on:
- Number of sources
- Agreement
- Credibility
- Freshness

---

## UX Principles
- No binary certainty
- Always show explanations
- Surface uncertainty explicitly
- Never accuse; only inform

---

## Ethics
- Conservative confidence
- Human review encouraged for high stakes
- Privacy-preserving by default


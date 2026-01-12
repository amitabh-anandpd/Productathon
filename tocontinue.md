---

## 15. Unified Authenticity Framework (Cross-Modal Extension)

### Purpose of This Section
This section formalizes the **Unified Authenticity Framework** that governs *all current and future modalities* (image, audio, video, text).  

The image pipeline is **complete and validated**.  
All future work (audio, video, text) must **reuse the same philosophical, architectural, and trust principles**, changing only modality-specific forensic signals.

---

## 15.1 Core Principle (Modality-Agnostic)

> **Authenticity is not detected — it is inferred from converging evidence.**

Across *all* media types:
- No single signal is trusted
- Verification is preferred over inference
- Physics > appearance
- Behavior > static artifacts
- Confidence > binary claims

This principle must **never change**, regardless of modality.

---

## 15.2 The Four Invariant Layers (Applies to ALL Media)

Every modality (image, audio, video, text) MUST map into the same four layers:

### Layer 1 — Provenance & Cryptographic Verification
- C2PA / Content Credentials (when available)
- Digital signatures
- Platform attestations
- Signed creation / edit logs

**Invariant rule**:
> If provenance is verified → skip heavy forensic inference.

---

### Layer 2 — Physical / Signal Constraints
Each modality has a *physical generation pipeline*:

| Modality | Physical Basis |
|--------|---------------|
| Image | Light → Lens → Sensor |
| Audio | Voice → Air → Microphone |
| Video | Time + Optics + Motion |
| Text | Human cognition & language production |

AI-generated content **imitates appearance**, but often violates **generation physics**.

---

### Layer 3 — Generative-Prior Behavioral Tests
All modern generative AI shares one trait:

> **Generated samples lie on a learned manifold.**

Therefore:
- They reconstruct differently
- They respond differently to perturbations
- They exhibit unnatural stability or regularity

This layer is the **most future-proof** and must exist for every modality.

---

### Layer 4 — Contextual & Behavioral Signals
No content exists in isolation.

Signals include:
- Account behavior
- Creation patterns
- Posting cadence
- Cross-source corroboration

This layer grows stronger at **platform scale**.

---

## 15.3 Mapping the Framework Across Modalities

### Image (COMPLETED — BASELINE)

| Layer | Implemented Signals |
|----|--------------------|
| Provenance | C2PA, metadata |
| Physical | PRNU, CFA, optics |
| Behavior | Diffusion reconstruction, noise stress |
| Context | Limited (hackathon scope) |

This serves as the **reference implementation**.

---

### Audio (NEXT UPGRADE TARGET)

#### Physical Constraints
- Microphone noise realism
- Room impulse response
- Spectral continuity
- Breath & vocal micro-variations

#### Generative-Prior Behavior
- Stability under denoising
- Over-regular spectral envelopes
- Phase-locking artifacts

#### Key Risk
- Audio is easy to re-record (physics laundering)

#### Mitigation Strategy
- Multi-sample analysis
- Temporal coherence tests
- Lower confidence ceilings

---

### Video (EXTENSION OF IMAGE + TIME)

#### Physical Constraints
- Frame-to-frame sensor noise consistency
- Motion blur realism
- Rolling shutter artifacts
- Optical flow plausibility

#### Biological Signals
- rPPG (pulse from skin)
- Blink dynamics
- Micro-expressions

#### Generative Behavior
- Temporal snap-back
- Inconsistent reconstruction across frames

Video detection MUST:
- Fuse **spatial + temporal evidence**
- Prefer **segment-level judgments**, not whole-video claims

---

### Text (FUNDAMENTALLY DIFFERENT)

Text has **no physical sensor**, so the framework adapts:

#### Provenance Dominates
- Signed documents
- Platform attestations
- Editing history

#### Behavioral & Statistical Signals
- Stylometry
- Entropy & burstiness
- Logical consistency
- Cross-document contradictions

#### Critical Limitation
> **Text authenticity can never be proven — only assessed probabilistically.**

Text detection output MUST:
- Cap confidence aggressively
- Prefer “credibility assessment” language
- Emphasize corroboration

---

## 15.4 Unified Output Schema (All Modalities)

Every modality MUST output:

```json
{
  "verdict": "Likely Real | Likely AI | Likely Edited | Uncertain",
  "confidence": 0.0 – 1.0,
  "evidence": [
    "Provenance missing",
    "Physical constraints violated",
    "Abnormal reconstruction stability"
  ],
  "limitations": [
    "Metadata unavailable",
    "Possible re-recording"
  ]
}




# LOCKED DESIGN DECISIONS  
## Evidence Fusion & Confidence Calibration

This section defines **non-negotiable, locked system design choices**.  
All future modality extensions (video, audio, text) MUST inherit these rules without modification.

---

## 1. Evidence Fusion Method (LOCKED)

### Chosen Method
> **Bayesian Evidence Accumulation with Capped Likelihood Ratios**

Authenticity is inferred by accumulating **independent probabilistic evidence** rather than by binary detection or single-model classification.

---

### 1.1 Core Principle

> **No single signal is sufficient to determine authenticity.**  
> Confidence emerges only from *converging, independent evidence*.

Each forensic signal contributes **evidence**, not a verdict.

---

### 1.2 Prior Assumption

The system begins with a neutral prior:

```text
P(Real) = 0.5
P(AI)   = 0.5




This prevents bias toward either outcome and enforces forensic neutrality.

1.3 Evidence Layers (Invariant)

All signals are mapped to one of the following invariant layers:

Provenance & Cryptographic Verification

Physical / Signal Constraints

Generative-Prior Behavioral Tests

Contextual & Behavioral Signals

Each layer produces one or more likelihood ratios (LRs).

1.4 Likelihood Ratio Definition

For each independent signal:

LR = P(evidence | AI) / P(evidence | Real)


Bayesian updating is performed using odds:

Posterior Odds = Prior Odds × LR₁ × LR₂ × ... × LRₙ


Odds are converted to probabilities after aggregation.

1.5 Likelihood Ratio Capping (CRITICAL SAFEGUARD)

No likelihood ratio may exceed a fixed upper bound.

LR_max = 10   (≈ 90% confidence contribution per signal)


This prevents:

Single-signal domination

Overconfident false accusations

Adversarial manipulation

Ethical failure modes

This cap is mandatory and must not be removed.

1.6 Missing Evidence Handling

If a layer is unavailable or inconclusive:

No LR is applied for that layer

Confidence penalties are applied later (see Section 2)

Missing evidence must never be treated as evidence of AI generation.

2. Confidence Calibration Rules (LOCKED)
2.1 Core Philosophy

The system must never claim certainty.
Confidence reflects evidence strength, not model confidence.

Binary claims are explicitly forbidden.

2.2 Modality-Specific Confidence Ceilings

Each modality has a hard upper bound on confidence:

Modality	Maximum Confidence
Image	0.95
Video	0.90
Audio	0.85
Text	0.70

If Bayesian posterior exceeds the ceiling, it is clipped.

These ceilings are non-negotiable.

2.3 Missing Evidence Penalties

Final confidence is reduced when invariant layers are missing:

Missing Layer	Confidence Penalty
Provenance	−10%
Physical / Signal	−15%
Generative Behavior	−20%
Contextual Signals	−5%

Penalties are multiplicative:

Final Confidence = Posterior × Π(1 − penalty)

2.4 Conflict Dampening Rule

If strong evidence sources disagree (e.g., provenance suggests real, generative behavior suggests AI):

Final Confidence ≤ 0.60
Verdict = "Uncertain"


The system must explicitly surface disagreement rather than forcing a decision.

2.5 Calibration Guarantee

Final confidence values MUST be calibrated using held-out data:

Temperature scaling or isotonic regression

Reliability diagrams (expected vs actual accuracy)

Guarantee:

When the system outputs confidence X, it should be correct approximately X percent of the time.

3. Output Constraint (GLOBAL)

The system may output only the following verdicts:

Likely Real

Likely AI-Generated

Likely Edited / Mixed

Uncertain

Each verdict MUST include:

Confidence score

Evidence summary

Known limitations

4. Design Invariants (DO NOT VIOLATE)

Verification > inference

Physics > appearance

Behavior > static artifacts

Confidence > binary certainty

Ethics > performance metrics

Any future extension that violates these principles is invalid.



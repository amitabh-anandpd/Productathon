# CHECKPOINT — TEXT AUTHENTICITY & CREDIBILITY MODULE
*A locked, research-grounded specification for assessing text authenticity and factual credibility under uncertainty.*

> **Inheritance rule (LOCKED):**  
> All global invariants from CHECKPOINT 1 (Images) and CHECKPOINT 2 (Video & Audio) apply unchanged.  
> **Verification > inference • Behavior > appearance • Confidence > binary claims • Ethics > performance**

---

## 0. Executive Summary

Text is the **most fragile and adversarial modality** for authenticity assessment.

Unlike images, audio, or video:
- There is **no physical sensor**
- There is **no immutable generation pipeline**
- Human and AI text share the **same language distribution**

Therefore:

> **Text authenticity can never be proven — only probabilistically assessed.**

This module defines a **conservative, evidence-based approach** that:
- Avoids binary AI-detection claims
- Prioritizes provenance and behavior over stylometry
- Explicitly caps confidence
- Separates **authenticity (origin)** from **credibility (truth)**

---

## 1. Problem Definition (Text)

Given an input text (post, article, message, email, transcript, or document), the system must:

1. Assess **authenticity**  
   → Was the text likely written by a human, an AI, edited/mixed, or is it uncertain?

2. Assess **credibility / truthfulness**  
   → Are the factual claims supported by reliable evidence?

These are **orthogonal questions** and MUST be handled by **separate engines**.

---

## 2. Threat Model (Text)

### 2.1 AI-related threats
- LLM-generated articles, posts, essays
- AI-assisted rewriting and paraphrasing
- Mixed human + AI authorship
- Iterative human editing of AI drafts

### 2.2 Adversarial strategies
- Paraphrasing to evade detectors
- Prompting for high-entropy or error-injected text
- Copy-paste laundering across platforms
- Mixing factual and false claims
- Impersonation via stylistic mimicry

### 2.3 Critical limitation
> **There is no invariant textual feature that uniquely identifies AI authorship.**

This constraint governs all design choices.

---

## 3. Core Detection Philosophy (TEXT-SPECIFIC)

### 3.1 What is explicitly forbidden
- Binary “AI-written / human-written” claims
- Claims of high-confidence (>70%) AI detection
- Single-model text classifiers as final authority
- Stylometry-only judgments

### 3.2 What is required
- Probabilistic inference
- Evidence fusion across independent signals
- Conservative confidence caps
- Transparent uncertainty and limitations

---

## 4. Unified Authenticity Framework Mapping (TEXT)

Text MUST map to the same four invariant layers used for all modalities.

---

## 5. Layer 1 — Provenance & Verification (DOMINANT SIGNAL)

### 5.1 Supported provenance signals
- Cryptographic document signatures
- Platform attestations (email headers, CMS logs)
- Version history (document edit logs, Git metadata)
- Authenticated publication sources

### 5.2 Invariant rule (LOCKED)
> **If provenance is verified, it dominates all inferential signals.**

### 5.3 Limitations
- Provenance is often missing
- Copy-paste destroys provenance
- Not universally supported

Provenance absence MUST NOT be treated as AI evidence.

---

## 6. Layer 2 — Cognitive / Linguistic Constraints (Supporting Only)

Since text lacks physical sensors, we analyze **human cognitive production patterns**, not appearance.

### 6.1 Entropy & predictability
- Token-level entropy
- Entropy variance (more important than mean)
- Predictability under re-tokenization

**Observation:**
- AI text often shows smoother entropy curves
- Humans show unevenness and abrupt shifts

### 6.2 Burstiness & rhythm
- Sentence length variance
- Clause depth irregularity
- Punctuation distribution

### 6.3 Error pattern analysis
- Inconsistent vs systematic mistakes
- Contextual vs global grammar errors

> These signals are **weak alone** and MUST NOT dominate inference.

---

## 7. Layer 3 — Generative-Prior Behavioral Tests (MOST IMPORTANT)

### 7.1 Core insight
> **Generated text lies on a learned language manifold.**

Therefore, instead of asking *“what does it look like?”*, we test *“how does it behave under perturbation?”*

---

### 7.2 Behavioral tests (MANDATORY)

#### 7.2.1 Paraphrase stability test
- Generate multiple paraphrases at varying temperatures
- Measure:
  - Structural similarity
  - Argument skeleton preservation
  - Semantic drift

**AI tendency:**  
High structural stability under paraphrase

**Human tendency:**  
Reorganization of emphasis and flow

---

#### 7.2.2 Noise injection test
Apply controlled perturbations:
- Remove connective phrases
- Mask low-information segments
- Slight sentence reordering

Evaluate:
- Degree of “snap-back” into polished coherence

Excessive snap-back → AI-leaning evidence

---

#### 7.2.3 Continuation convergence test
- Ask multiple models to:
  - Continue the text
  - Summarize and reconstruct it

High convergence across models → AI prior increases

---

### 7.3 Design constraint
Behavioral tests provide **bounded likelihood ratios only**.  
They MUST NOT exceed capped influence.

---

## 8. Layer 4 — Contextual & Behavioral Signals

### 8.1 Signals
- Posting frequency and cadence
- Sudden stylistic shifts for same account
- Cross-platform duplication
- Coordinated posting behavior

### 8.2 Scope
- Strong at platform scale
- Weak for single documents
- Always supporting, never decisive

---

## 9. Evidence Fusion (LOCKED — TEXT)

### 9.1 Prior
```
P(Human) = 0.5
P(AI)    = 0.5
```

### 9.2 Bayesian accumulation
```
PosteriorOdds(AI) =
  PriorOdds ×
  LR_provenance ×
  LR_behavioral ×
  LR_entropy ×
  LR_context
```

### 9.3 Likelihood ratio caps (LOCKED)
- No LR may exceed global maximum
- Behavioral LRs are capped lower than provenance

### 9.4 Conflict rule (LOCKED)
If strong signals disagree:
- Verdict = **Uncertain**
- Confidence ≤ 0.60

---

## 10. Confidence Calibration (LOCKED)

### 10.1 Maximum confidence
| Modality | Max Confidence |
|--------|----------------|
| Text | **0.70** |

### 10.2 Language constraint
The system MUST prefer:
- “No reliable evidence of AI generation”
over:
- “Human-written”

---

## 11. Text Authenticity Output Schema

```json
{
  "verdict": "Likely Human | Likely AI | Likely Edited | Uncertain",
  "confidence": 0.0,
  "evidence": [
    "No verifiable provenance",
    "High paraphrase stability",
    "Low entropy variance"
  ],
  "limitations": [
    "Possible human editing",
    "No authorship verification available"
  ]
}
```

---

## 12. Truthfulness / Credibility Engine (TEXT)

Authenticity ≠ Truth.  
This engine operates independently.

---

## 13. Truth Engine Pipeline (LOCKED)

### 13.1 Claim extraction
- Decompose text into atomic factual claims
- Avoid compound or implied claims

### 13.2 Evidence retrieval (RAG — LIMITED ROLE)
- Wikipedia / Wikidata
- Government datasets
- Trusted news sources
- Academic databases (when applicable)

RAG is **retrieval only**, not judgment.

---

### 13.3 Cross-source agreement
Evaluate:
- Number of corroborating sources
- Independence of sources
- Credibility weighting
- Recency and temporal alignment

---

### 13.4 LLM reasoning (RESTRICTED)
LLMs may:
- Compare claims vs evidence
- Explain agreements and conflicts

LLMs MUST NOT:
- Invent facts
- Act as final arbiters of truth

---

### 13.5 Truth scoring
Possible verdicts:
- Likely True
- Likely False
- Mixed / Partially True
- Uncertain

---

## 14. Truth Output Schema (TEXT)

```json
{
  "verdict": "Likely True | Likely False | Mixed | Uncertain",
  "confidence": 0.0,
  "evidence": [
    "Claim supported by 3 independent sources",
    "One source contradicts timeline"
  ],
  "limitations": [
    "Limited source availability",
    "Claim ambiguity"
  ]
}
```

---

## 15. Ethical Constraints (NON-NEGOTIABLE)

- No punitive or accusatory language
- No storage of author identities
- No author fingerprinting
- No opaque scoring
- Human review encouraged for high-stakes use

---

## 16. Design Invariants (TEXT — DO NOT VIOLATE)

- Text authenticity is probabilistic
- Provenance dominates inference
- Behavioral tests > stylometry
- Confidence is capped and conservative
- “Uncertain” is a valid and preferred outcome
- Trust is communicated, not enforced

---

## 17. Final Statement (LOCKED)

> **This module does not detect AI-written text.  
> It assesses the likelihood of AI involvement and the credibility of claims, under uncertainty, using converging evidence.**

Any future system claiming certainty for text authenticity violates this checkpoint.

---

**CHECKPOINT — TEXT: LOCKED**

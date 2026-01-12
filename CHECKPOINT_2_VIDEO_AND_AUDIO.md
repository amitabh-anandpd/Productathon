# CHECKPOINT 2 — Video Authenticity Module (AI-Generated vs Real)
*A research-grounded, hackathon-ready specification that extends CHECKPOINT 1 (Images) into **Video**, and defines the concrete pipeline, evidence model, and implementation plan.*

> **Inheritance rule:** All CHECKPOINT 1 invariants remain unchanged:  
> **Verification > inference • Physics > appearance • Behavior > static artifacts • Confidence > binary claims • Ethical conservatism**

---

## 0. Executive Summary

Modern deepfake videos can look visually perfect per-frame, so reliable detection must go beyond static artifacts. This module distinguishes **Real**, **AI-Generated**, **Edited/Mixed**, and **Uncertain** video content using **converging evidence** from:

1. **Provenance (C2PA / Content Credentials)** when available  
2. **Physical camera constraints** (sensor noise, shutter, blur, optics)  
3. **Temporal consistency** (motion/flow, identity stability, lighting)  
4. **Audio-visual synchrony** (phoneme–viseme alignment, timing) when audio exists  
5. **Biological signals** (rPPG, blink dynamics) when conditions permit  
6. **Generative-prior behavioral tests** (spatio-temporal “snap-back” under perturbation; diffusion-prior reconstruction curves)

All evidence is fused using the **LOCKED Bayesian Evidence Accumulation** design with **capped likelihood ratios** and **confidence ceilings**.

---

## 1. Problem Statement (Video)

Given an input video (optionally with audio), determine whether it is:
- **Likely Real**
- **Likely AI-Generated**
- **Likely Edited / Mixed**
- **Uncertain**

…and provide an **explainable evidence report** with a calibrated confidence score, while avoiding overconfident claims.

---

## 2. Threat Model (Video)

### 2.1 Deepfake / manipulation types covered
- Face swap
- Lip-sync / mouth-region manipulation
- Expression reenactment
- Whole-scene AI generation (text-to-video)
- Partial edits (short windows, partial ROIs)
- Re-encoding, compression, scaling, and “laundering” via reposting platforms

### 2.2 Adversarial strategies
- Heavy compression / resizing
- Smoothing temporal flicker
- Adding fake camera noise / film grain
- Audio replacement or removal
- Upload → download → reupload (metadata stripping)

---

## 3. Detection Philosophy (Video-Specific)

### 3.1 Why frame-only detection is forbidden
Deepfakes may be **temporally inconsistent** but visually plausible in isolated frames.

**Rule:** The system MUST perform **segment-level** inference and **temporal aggregation** before any video-level decision.

### 3.2 Segment-level reasoning (mandatory)
- Deepfakes are often partial (face only) and intermittent (some segments fake).
- Therefore, the system MUST localize judgments in time.

---

## 4. High-Level Architecture

### 4.1 Video module — pipeline overview (ASCII flow)

```
[Video Input]
   |
   v
[Decode + Normalize (FFmpeg/PyAV)]
   |
   v
[Provenance / C2PA Verification] ----> (if verified chain) -> [High-confidence provenance verdict + report]
   |
   v
[Temporal Segmentation (overlapping windows)]
   |
   v
+-------------------------------------------------------------+
| For each Segment (parallel, stateless workers):              |
|   - Face/ROI Track (face, eyes, mouth, skin ROI)             |
|   - Temporal Consistency (optical flow, embedding drift)     |
|   - Camera Physics (noise, blur/exposure consistency)        |
|   - A/V Sync (if audio)                                      |
|   - Biological (if feasible): rPPG, blink                     |
|   - Generative Behavioral: diffusion-prior temporal tests     |
|   - Bayesian Segment Fusion + Confidence Cap                  |
+-------------------------------------------------------------+
   |
   v
[Temporal Aggregation Engine]
   |
   v
[Video-level Bayesian Fusion + Calibration + Ceiling]
   |
   v
[Explainable Output: verdict + confidence + evidence + limits]
```

---

## 5. Core Step 1 — Video Preprocessing & Segmentation

### 5.1 Decode and normalize
- Normalize container/codec differences: decode to a standard pixel format (e.g., yuv420p → rgb) and standard sample rate for audio.
- Record codec metadata as a supporting signal (never decisive).

**Tools:** FFmpeg, PyAV, OpenCV

### 5.2 Temporal segmentation (overlapping)
Recommended default:
- **Window length:** 1.5–3.0 seconds  
- **Overlap:** 30–50%  
- **Frame sampling:** adaptive (e.g., 15–30 FPS depending on source)

Rationale:
- Long enough for motion/physiology cues
- Short enough to isolate partial fakes
- Overlap reduces boundary artifacts

### 5.3 Spatial segmentation (ROI extraction)
For each segment:
- Face detection + multi-frame tracking
- ROIs:
  - Whole face
  - Mouth (lip-sync)
  - Eye region (blink)
  - Cheek/forehead (rPPG)
  - Background patch (camera physics reference)

**Tools:** MediaPipe / RetinaFace + ByteTrack/DeepSORT

---

## 6. Core Step 2 — Evidence Pipelines (Per Segment)

Each pipeline outputs:
- a **bounded likelihood ratio** (LR) favoring AI vs Real
- an **evidence string** for explainability
- a **quality gate** result (can be “not applicable”)

> **LR rule (LOCKED):** Each LR MUST be capped: `LR ∈ [1, LR_max]` where `LR_max = 10`.

### 6.1 Temporal consistency pipeline (high weight)
**Signals**
- Optical flow plausibility (frame-to-frame motion coherence)
- Temporal embedding drift (identity feature stability)
- Lighting/texture consistency over time
- Flicker detection and feature persistence

**Methods**
- Dense optical flow (OpenCV)
- Face embedding trajectories (ArcFace/ViT-based)
- Temporal consistency metrics across adjacent frames

**Output**
- `LR_temporal ∈ [1, 8]` (cap lower than global max to reflect brittleness)
- Evidence: “Optical flow inconsistencies”, “Identity drift spikes”, etc.

### 6.2 Audio-visual synchrony (very high value when audio exists)
**Signals**
- Phoneme–viseme alignment
- Mouth motion vs audio energy timing
- Cross-modal embedding agreement
- Latency anomalies and jitter

**Methods**
- SyncNet-style A/V sync embeddings
- Contrastive A/V models (optional)
- Mouth ROI tracking + short-time audio features

**Output**
- `LR_avsync ∈ [1, 9]`
- Evidence: “A/V sync mismatch”, “Mouth ROI inconsistencies”
- If audio absent → Not applicable (no penalty by itself)

### 6.3 Camera physics / sensor consistency (high value)
**Signals**
- Sensor noise consistency across frames (noise residual analysis)
- Motion blur vs flow alignment (blur should match motion + exposure)
- Rolling shutter artifacts consistency (when present)
- JPEG/video compression history (supporting only)

**Methods**
- Noise residual extraction and temporal consistency score
- Blur estimation + motion vector plausibility
- Rolling shutter heuristics on fast motion (optional)

**Output**
- `LR_physics ∈ [1, 7]`
- Evidence: “Noise pattern inconsistency across frames”, “Blur-motion mismatch”

### 6.4 Biological signals (supporting; quality-gated)
**Signals**
- rPPG: pulse-derived dynamics from skin color micro-variations
- Blink rate/dynamics
- Micro-expression timing consistency

**Quality gates**
- Adequate resolution on skin ROI
- Sufficient lighting stability
- Not extreme head motion / occlusion

**Output**
- `LR_bio ∈ [1, 5]` (supporting only)
- Evidence: “Physiological inconsistency (rPPG)”, “Blink anomalies”
- If gates fail → Not applicable (no penalty by itself)

### 6.5 Generative-prior behavioral tests (future-proof pillar)
This is the **video extension** of diffusion behavioral tests.

#### 6.5.1 Perturbation protocol (segment-level)
Apply controlled perturbations at multiple magnitudes:
- Spatial Gaussian noise (σ sweep)
- Temporal jitter / micro time-warp
- Frame dropout
- Frequency attenuation (band-limits)

#### 6.5.2 Reconstruction via generative prior
Use a **video diffusion prior** (or temporally-conditioned denoiser) to attempt reconstruction from perturbed inputs.

**Key idea:** AI-generated video lies on a learned manifold → reconstructs “too stably” under perturbation.

#### 6.5.3 Behavioral curves (not single numbers)
Compute curves across noise levels:
- SSIM / LPIPS vs noise
- Temporal SSIM vs time
- Flow-consistency before/after reconstruction
- Identity drift before/after reconstruction

**Output**
- `LR_gen_behavior ∈ [1, 10]` (still capped; never decisive alone)
- Evidence: “Abnormally stable reconstruction across perturbations”, “Temporal snap-back behavior”

---

## 7. Core Step 3 — Segment-Level Bayesian Fusion (LOCKED)

### 7.1 Neutral priors
Start each segment with:
- `P(Real) = 0.5`
- `P(AI) = 0.5`

### 7.2 Bayesian odds update
For each segment:

```
PosteriorOdds(AI) = PriorOdds(AI)
  × LR_gen_behavior
  × LR_temporal
  × LR_avsync
  × LR_physics
  × LR_bio
```

- Missing LRs are skipped (not treated as AI evidence)
- All LRs are capped

### 7.3 Segment confidence cap (conservative)
**Recommended segment confidence cap:** `0.85`

Segments MUST output evidence + limitations.

---

## 8. Core Step 4 — Temporal Aggregation (Segments → Video)

### 8.1 Why aggregation is not majority voting
- One short manipulated segment can be harmful
- But forcing a whole-video “fake” label from one weak segment causes false accusations

### 8.2 Aggregation logic (recommended)
Compute:
- `p_ai(t)` over segments
- Duration-weighted AI evidence
- Continuity of AI evidence in time (runs)

**Heuristic policy (hackathon-ready)**
- If AI evidence is **sustained** across many adjacent segments → **Likely AI-Generated**
- If AI evidence is **sparse / localized** → **Likely Edited / Mixed**
- If evidence is conflicting across strong pipelines → **Uncertain**
- If provenance verifies + pipelines agree → **Likely Real**

### 8.3 Video confidence cap (LOCKED)
**Max video confidence:** `0.90`

---

## 9. Output Schema (Video)

```json
{
  "verdict": "Likely Real | Likely AI | Likely Edited | Uncertain",
  "confidence": 0.0,
  "segment_summary": {
    "total_segments": 0,
    "ai_leaning_segments": 0,
    "edited_mixed_segments": 0
  },
  "top_evidence": [
    "A/V synchrony mismatch in segments 4–7",
    "Abnormally stable temporal diffusion reconstruction"
  ],
  "limitations": [
    "Audio missing",
    "Low resolution face ROI"
  ]
}
```

---

## 10. Tech Stack (Video Module)

### 10.1 Ingestion & media
- FFmpeg, PyAV
- OpenCV

### 10.2 Vision / tracking
- MediaPipe or RetinaFace (face detection)
- ByteTrack / DeepSORT (tracking)
- Optical flow (OpenCV)

### 10.3 Audio
- librosa / torchaudio
- A/V sync model (SyncNet-style)

### 10.4 ML & metrics
- PyTorch
- LPIPS, SSIM
- NumPy/SciPy

### 10.5 Backend + orchestration
- FastAPI
- Docker (GPU optional)
- Task queue (Celery/RQ) for segment workers
- Object storage (S3-compatible) for intermediate artifacts (optional)

### 10.6 Explainability & UI
- Next.js / React frontend
- Segment timeline visualization
- Evidence panels and uncertainty display

---

## 11. Implementation Plan (Build Steps)

### Phase A — MVP (Hackathon)
1. **Decode + segment** video (FFmpeg/PyAV)
2. **Face detect + track** (MediaPipe/RetinaFace + tracker)
3. Implement **Temporal Consistency** pipeline (optical flow + embedding drift)
4. Implement **A/V Sync** pipeline (SyncNet-style model)
5. Implement **Bayesian fusion** (LR caps + confidence ceilings)
6. Implement **Temporal aggregation** (edited/mixed vs AI)
7. Build UI:
   - upload video
   - segment timeline
   - verdict + evidence + limitations

### Phase B — Stronger Forensics
8. Add **camera physics** pipeline (noise residual consistency; blur-motion checks)
9. Add **biological signals** with strict gating (rPPG + blink)

### Phase C — Future-Proof Pillar
10. Add **generative-prior behavioral tests** (temporal diffusion reconstruction curves)

---

## 12. Evaluation Plan (Video)

### 12.1 Robustness stress tests
- Compression levels (H.264, H.265, AV1)
- Re-encoding and platform laundering
- Resizing and frame-rate conversion
- Audio removal / audio replacement

### 12.2 Metrics
- AUC / ROC per manipulation type
- Calibration (reliability curves)
- False positive rate (critical!)
- Segment-level localization accuracy

---

## 13. Ethics & Safety (Video)

- Never output “definitely fake”
- Cap confidence and surface limitations
- Encourage human review for high-stakes use
- Avoid biometric storage; keep processing stateless when possible

---

## 14. References (selected)
- C2PA / Content Credentials specification and overview: https://c2pa.org/ and https://c2pa.org/specifications/
- Deepfake detection surveys (video; audio) and research examples:
  - https://www.sciencedirect.com/science/article/pii/S111001682500465X
  - https://dl.acm.org/doi/10.1145/3643030
  - https://arxiv.org/abs/2010.00400
  - https://arxiv.org/abs/2110.01200

---

# AUDIO EXTENSION (Web-Crawled) — Applying the Same Unified Logic

> This section extends the same locked framework to **Audio**.  
> **Note:** Audio is uniquely vulnerable to *physics laundering* (re-recording through speakers/mics), so confidence ceilings are lower and quality gates are stricter.

---

## A1. Audio Threat Model

### A1.1 Manipulation types
- Text-to-Speech (TTS)
- Voice Conversion (VC)
- Partial splicing / concatenation
- Post-processing to mimic microphone/channel
- Replay attacks (speaker → mic) and re-recording

### A1.2 Why audio is hard
- Audio can be “laundered” by replaying through physical space, partially restoring plausible physics.
- Compression and channel variability dominate many cues (telephony, social platforms).

---

## A2. Audio Evidence Pipelines (Mapped to the 4 invariant layers)

### Layer 1 — Provenance
- Signed creation logs (where available)
- Platform attestations (if ever provided)
- C2PA for audio/video containers when supported

**Outcome:** If provenance verified → high confidence, low computation.

---

### Layer 2 — Physical / Signal Constraints (audio physics)
**Signals**
- Microphone/device noise plausibility
- Room impulse response (RIR) consistency
- Reverberation tails and early reflections
- Spectral continuity and phase behavior
- Codec/channel fingerprints (supporting only)

**Methods**
- Noise-floor modeling
- RIR estimation (blind deconvolution style features)
- Phase-coherence metrics, group delay stability
- Replay-detection cues for PA-style attacks

**LR output**
- `LR_audio_physics ∈ [1, 7]`

---

### Layer 3 — Generative-Prior Behavioral Tests (future-proof pillar)
**Idea**
Generated speech lies on a learned manifold (TTS/VC). Under perturbation + denoising, it can show **abnormally stable reconstruction** (analogous to diffusion “snap-back”).

**Behavioral tests**
- Add controlled noise / band-limits → attempt reconstruction with a speech prior (denoiser or speech enhancement model)
- Track reconstruction stability curves vs perturbation
- Measure oversmoothing, over-regular envelopes, and abnormal stationarity

**LR output**
- `LR_audio_behavior ∈ [1, 10]` (capped)

---

### Layer 4 — Contextual & Behavioral Signals
**Signals**
- Speaker identity consistency across clips (if multi-clip)
- Conversation turn-taking realism (if multi-utterance)
- Metadata consistency (timestamps, device identifiers if present)
- Cross-source corroboration (platform-scale)

**LR output**
- `LR_audio_context ∈ [1, 4]`

---

## A3. Audio ML Models (Modern practice)

### A3.1 Anti-spoofing / deepfake speech benchmarks
- ASVspoof provides LA/PA/DF tracks and datasets for spoofed/deepfake speech detection.

### A3.2 Strong model families (practical)
- End-to-end raw waveform models
- Spectro-temporal architectures
- Self-supervised speech representations (e.g., wav2vec-style frontends) with anti-spoofing backends

> Important: ML classifiers remain **one evidence source**; never final authority.

---

## A4. Audio Fusion & Calibration (LOCKED compatibility)

### A4.1 Bayesian fusion (per utterance / per segment)
For each audio segment:

```
PosteriorOdds(AI) = PriorOdds(AI)
  × LR_audio_physics
  × LR_audio_behavior
  × LR_audio_context
  × LR_audio_ml
```

All LRs capped, missing signals skipped.

### A4.2 Confidence ceilings (LOCKED)
- **Audio max confidence:** `0.85`  
- Apply additional penalties when replay risk is high (unknown channel, noisy environment).

---

## A5. Audio Tech Stack (Implementation)

### A5.1 Ingestion
- FFmpeg / PyAV
- librosa / torchaudio

### A5.2 Feature extraction
- Log-mel spectrograms, CQCC/LFCC (optional, classic)
- Raw waveform frontends (optional)
- Phase & group delay features
- RIR / reverb features (lightweight)

### A5.3 ML stack
- PyTorch
- Pretrained SSL speech models (optional)
- Anti-spoofing models (e.g., graph attention / spectro-temporal models)

### A5.4 Service architecture
- FastAPI microservice `audio_forensics`
- Stateless inference + evidence ledger output

---

## A6. Audio Output Schema

```json
{
  "verdict": "Likely Real | Likely AI | Likely Edited | Uncertain",
  "confidence": 0.0,
  "evidence": [
    "Spectral over-smoothing consistent with TTS",
    "Room impulse response inconsistent across segments"
  ],
  "limitations": [
    "Possible replay laundering",
    "Low SNR / heavy compression"
  ]
}
```

---

## A7. Next Engineering Steps (Audio)
1. Implement ingestion + segmentation + metadata parsing
2. Build physics constraints pipeline (noise-floor + RIR cues + phase)
3. Add an ML anti-spoofing model as a supporting signal
4. Add generative behavioral tests (perturbation → reconstruction curves)
5. Calibrate and enforce confidence ceilings
6. Integrate into unified evidence fusion engine

---

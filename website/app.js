const themeToggle = document.getElementById('themeToggle');
const analyzeBtn = document.getElementById('analyzeBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const resultsSection = document.getElementById('resultsSection');

const modeBtns = document.querySelectorAll('.mode-btn');
const inputContainers = document.querySelectorAll('.input-container');

const textInput = document.getElementById('textInput');
const imageInput = document.getElementById('imageInput');
const audioInput = document.getElementById('audioInput');
const videoInput = document.getElementById('videoInput');

const imagePreview = document.getElementById('imagePreview');
const audioPreview = document.getElementById('audioPreview');
const videoPreview = document.getElementById('videoPreview');

let currentMode = 'text';
let currentFile = null;

function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcon('sun');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    updateThemeIcon('moon');
  }
}

function updateThemeIcon(icon) {
  const iconElement = themeToggle.querySelector('i');
  iconElement.setAttribute('data-lucide', icon);
  lucide.createIcons();
}

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme === 'dark' ? 'sun' : 'moon');
});

modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const mode = btn.getAttribute('data-mode');
    switchMode(mode);
  });
});

function switchMode(mode) {
  currentMode = mode;
  currentFile = null;

  modeBtns.forEach(btn => {
    if (btn.getAttribute('data-mode') === mode) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  inputContainers.forEach(container => {
    if (container.getAttribute('data-input') === mode) {
      container.classList.add('active');
    } else {
      container.classList.remove('active');
    }
  });

  clearInputs();
  hideResults();
}

function clearInputs() {
  textInput.value = '';
  imageInput.value = '';
  audioInput.value = '';
  videoInput.value = '';
  imagePreview.innerHTML = '';
  audioPreview.innerHTML = '';
  videoPreview.innerHTML = '';
  imagePreview.classList.remove('active');
  audioPreview.classList.remove('active');
  videoPreview.classList.remove('active');
}

imageInput.addEventListener('change', (e) => {
  handleFileUpload(e, 'image', imagePreview);
});

audioInput.addEventListener('change', (e) => {
  handleFileUpload(e, 'audio', audioPreview);
});

videoInput.addEventListener('change', (e) => {
  handleFileUpload(e, 'video', videoPreview);
});

function handleFileUpload(event, type, previewElement) {
  const file = event.target.files[0];
  if (!file) return;

  currentFile = file;

  previewElement.innerHTML = '';

  if (type === 'image') {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    previewElement.appendChild(img);
  } else if (type === 'video') {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);
    video.controls = true;
    previewElement.appendChild(video);
  }

  const fileInfo = document.createElement('div');
  fileInfo.className = 'file-info';

  const fileName = document.createElement('div');
  fileName.className = 'file-name';
  fileName.textContent = file.name;

  const fileSize = document.createElement('div');
  fileSize.className = 'file-size';
  fileSize.textContent = formatFileSize(file.size);

  fileInfo.appendChild(fileName);
  fileInfo.appendChild(fileSize);
  previewElement.appendChild(fileInfo);

  previewElement.classList.add('active');
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

analyzeBtn.addEventListener('click', async () => {
  if (!validateInput()) {
    return;
  }

  showLoading();
  hideResults();

  await simulateAnalysis();

  const results = generateMockResults();
  displayResults(results);

  hideLoading();
  showResults();
});

function validateInput() {
  if (currentMode === 'text') {
    return textInput.value.trim().length > 0;
  } else {
    return currentFile !== null;
  }
}

function showLoading() {
  analyzeBtn.disabled = true;
  loadingSpinner.classList.add('active');
}

function hideLoading() {
  analyzeBtn.disabled = false;
  loadingSpinner.classList.remove('active');
}

function hideResults() {
  resultsSection.classList.remove('active');
}

function showResults() {
  resultsSection.classList.add('active');
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function simulateAnalysis() {
  return new Promise(resolve => {
    setTimeout(resolve, 2000 + Math.random() * 1500);
  });
}

function generateMockResults() {
  const authenticityOptions = [
    {
      verdict: 'Likely Real',
      confidence: 72 + Math.floor(Math.random() * 18),
      evidence: [
        'Consistent metadata patterns match expected camera profile',
        'No detectable signs of AI-generated artifacts or manipulation',
        'Natural noise distribution consistent with genuine capture device',
        'Temporal consistency across frames shows no anomalies'
      ],
      limitations: [
        'Advanced manipulation techniques may evade current detection methods',
        'Limited historical data available for cross-reference verification',
        'Cannot verify chain of custody or original source'
      ]
    },
    {
      verdict: 'Likely AI',
      confidence: 65 + Math.floor(Math.random() * 20),
      evidence: [
        'Statistical patterns consistent with generative model outputs',
        'Subtle artifacts detected in high-frequency analysis',
        'Anomalous texture repetition in certain regions',
        'Metadata inconsistencies suggest synthetic origin'
      ],
      limitations: [
        'Newer generation models may produce fewer detectable artifacts',
        'Cannot determine specific model or generation method used',
        'Partial AI generation combined with real content harder to detect'
      ]
    },
    {
      verdict: 'Likely Edited',
      confidence: 68 + Math.floor(Math.random() * 17),
      evidence: [
        'Discontinuities detected in compression artifacts',
        'Multiple compression passes identified in forensic analysis',
        'Color gradient inconsistencies suggest local modifications',
        'Edge detection reveals cloning or splicing patterns'
      ],
      limitations: [
        'Minor edits like cropping or color correction cannot be distinguished',
        'Professional editing may leave minimal forensic traces',
        'Cannot determine intent behind modifications'
      ]
    },
    {
      verdict: 'Uncertain',
      confidence: 45 + Math.floor(Math.random() * 25),
      evidence: [
        'Mixed signals from multiple detection algorithms',
        'Quality degradation limits forensic analysis capability',
        'Some indicators present but below confidence threshold',
        'Conflicting metadata patterns require further investigation'
      ],
      limitations: [
        'Low resolution or heavy compression reduces detection accuracy',
        'Limited context makes definitive assessment challenging',
        'Multiple processing steps obscure original characteristics'
      ]
    }
  ];

  const credibilityOptions = [
    {
      verdict: 'Likely True',
      confidence: 68 + Math.floor(Math.random() * 20),
      evidence: [
        'Core claims corroborated by multiple independent sources',
        'Verifiable facts align with established databases and records',
        'Contextual details consistent with known circumstances',
        'Source has established credibility record'
      ],
      limitations: [
        'Recent events may lack sufficient independent verification',
        'Nuanced interpretations may vary across sources',
        'Cannot verify subjective or opinion-based components'
      ]
    },
    {
      verdict: 'Likely False',
      confidence: 70 + Math.floor(Math.random() * 18),
      evidence: [
        'Key claims contradicted by authoritative sources',
        'Factual errors detected in verifiable statements',
        'Similar content previously identified as misinformation',
        'Lacks corroboration from credible independent sources'
      ],
      limitations: [
        'Evolving situations may contain outdated but previously accurate info',
        'Partial truths mixed with false claims complicate assessment',
        'Satirical or hypothetical content may be misclassified'
      ]
    },
    {
      verdict: 'Mixed',
      confidence: 55 + Math.floor(Math.random() * 20),
      evidence: [
        'Contains both verified accurate and inaccurate elements',
        'Some claims supported while others lack evidence',
        'Correct facts presented with misleading context or framing',
        'Partial information omits relevant contradictory details'
      ],
      limitations: [
        'Determining overall truthfulness requires subjective judgment',
        'Misleading framing harder to detect than factual errors',
        'Context-dependent interpretations may vary'
      ]
    },
    {
      verdict: 'Uncertain',
      confidence: 40 + Math.floor(Math.random() * 25),
      evidence: [
        'Insufficient independent sources available for verification',
        'Claims involve future predictions or unverifiable statements',
        'Limited data prevents comprehensive fact-checking',
        'Conflicting reports from different sources'
      ],
      limitations: [
        'Breaking news may not yet have sufficient verification',
        'Specialized or technical claims exceed available resources',
        'Opinion-based or subjective content difficult to assess objectively'
      ]
    }
  ];

  const authenticity = authenticityOptions[Math.floor(Math.random() * authenticityOptions.length)];
  const credibility = credibilityOptions[Math.floor(Math.random() * credibilityOptions.length)];

  return { authenticity, credibility };
}

function displayResults(results) {
  const { authenticity, credibility } = results;

  displayAuthenticity(authenticity);
  displayCredibility(credibility);

  setTimeout(() => {
    lucide.createIcons();
  }, 100);
}

function displayAuthenticity(data) {
  const verdictElement = document.querySelector('#authenticityVerdict .verdict-value');
  verdictElement.textContent = data.verdict;
  verdictElement.className = 'verdict-value ' + getVerdictClass(data.verdict);

  const confidenceValue = document.getElementById('authenticityConfidence');
  confidenceValue.textContent = data.confidence + '%';

  const confidenceBar = document.getElementById('authenticityBar');
  setTimeout(() => {
    confidenceBar.style.width = data.confidence + '%';
  }, 100);

  const evidenceList = document.getElementById('authenticityEvidence');
  evidenceList.innerHTML = data.evidence.map(item => `<li>${item}</li>`).join('');

  const limitationsList = document.getElementById('authenticityLimitations');
  limitationsList.innerHTML = data.limitations.map(item => `<li>${item}</li>`).join('');
}

function displayCredibility(data) {
  const verdictElement = document.querySelector('#credibilityVerdict .verdict-value');
  verdictElement.textContent = data.verdict;
  verdictElement.className = 'verdict-value ' + getVerdictClass(data.verdict);

  const confidenceValue = document.getElementById('credibilityConfidence');
  confidenceValue.textContent = data.confidence + '%';

  const confidenceBar = document.getElementById('credibilityBar');
  setTimeout(() => {
    confidenceBar.style.width = data.confidence + '%';
  }, 100);

  const evidenceList = document.getElementById('credibilityEvidence');
  evidenceList.innerHTML = data.evidence.map(item => `<li>${item}</li>`).join('');

  const limitationsList = document.getElementById('credibilityLimitations');
  limitationsList.innerHTML = data.limitations.map(item => `<li>${item}</li>`).join('');
}

function getVerdictClass(verdict) {
  const verdictLower = verdict.toLowerCase();
  if (verdictLower.includes('real')) return 'real';
  if (verdictLower.includes('ai')) return 'ai';
  if (verdictLower.includes('edited')) return 'edited';
  if (verdictLower.includes('true')) return 'true';
  if (verdictLower.includes('false')) return 'false';
  if (verdictLower.includes('mixed')) return 'mixed';
  return 'uncertain';
}

initTheme();
lucide.createIcons();

document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input-element');
    const filePreview = document.getElementById('file-preview');
    const removeFileBtn = document.getElementById('remove-file');
    const analyzeBtn = document.getElementById('analyze-btn');
    const newAnalysisBtn = document.getElementById('new-analysis-btn');

    const inputSection = document.getElementById('input-section');
    const loadingSection = document.getElementById('loading-section');
    const resultsSection = document.getElementById('results-section');

    let currentFile = null;
    let currentInputType = 'text';

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            currentInputType = targetTab;

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(`${targetTab}-input`).classList.add('active');
        });
    });

    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    removeFileBtn.addEventListener('click', () => {
        currentFile = null;
        fileInput.value = '';
        filePreview.style.display = 'none';
        uploadArea.style.display = 'block';
    });

    analyzeBtn.addEventListener('click', () => {
        if (currentInputType === 'text') {
            const textContent = document.getElementById('text-area').value.trim();
            if (!textContent) {
                alert('Please enter some text to analyze.');
                return;
            }
            performAnalysis({ type: 'text', content: textContent });
        } else {
            if (!currentFile) {
                alert('Please upload a file to analyze.');
                return;
            }
            performAnalysis({ type: 'file', file: currentFile });
        }
    });

    newAnalysisBtn.addEventListener('click', () => {
        resetToInput();
    });

    function handleFile(file) {
        const validTypes = ['image/', 'audio/', 'video/'];
        const isValid = validTypes.some(type => file.type.startsWith(type));

        if (!isValid) {
            alert('Please upload a valid image, audio, or video file.');
            return;
        }

        currentFile = file;

        document.getElementById('file-name').textContent = file.name;
        document.getElementById('file-size').textContent = formatFileSize(file.size);

        uploadArea.style.display = 'none';
        filePreview.style.display = 'block';
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    async function performAnalysis(data) {
        inputSection.style.display = 'none';
        loadingSection.style.display = 'block';
        resultsSection.style.display = 'none';

        const loadingSteps = [
            'Initializing analysis...',
            'Processing content...',
            'Analyzing patterns...',
            'Checking authenticity markers...',
            'Verifying factual claims...',
            'Cross-referencing sources...',
            'Calculating confidence scores...',
            'Finalizing results...'
        ];

        const progressBar = document.getElementById('progress-bar');
        const loadingText = document.getElementById('loading-text');

        let currentStep = 0;
        const stepDuration = 600;

        const interval = setInterval(() => {
            if (currentStep < loadingSteps.length) {
                loadingText.textContent = loadingSteps[currentStep];
                progressBar.style.width = ((currentStep + 1) / loadingSteps.length * 100) + '%';
                currentStep++;
            } else {
                clearInterval(interval);
            }
        }, stepDuration);

        setTimeout(() => {
            clearInterval(interval);
            const results = generateMockResults(data);
            displayResults(results);
        }, stepDuration * loadingSteps.length);
    }

    function generateMockResults(data) {
        const contentType = data.type === 'text' ? 'text' :
                          data.file?.type.startsWith('image/') ? 'image' :
                          data.file?.type.startsWith('audio/') ? 'audio' : 'video';

        const mockScenarios = [
            {
                authenticity: {
                    verdict: 'Likely Real',
                    confidence: 87,
                    evidence: [
                        { text: 'Natural language patterns detected', type: 'positive' },
                        { text: 'Human-like writing inconsistencies present', type: 'positive' },
                        { text: 'No repetitive AI sentence structures found', type: 'positive' },
                        { text: 'Varied vocabulary usage typical of human authors', type: 'positive' }
                    ]
                },
                truthfulness: {
                    verdict: 'Likely True',
                    confidence: 82,
                    evidence: [
                        { text: 'Claims align with verified sources', type: 'positive' },
                        { text: 'Statistical data matches public records', type: 'positive' },
                        { text: 'Timeline of events is logically consistent', type: 'positive' },
                        { text: 'Minor discrepancy in one date reference', type: 'negative' }
                    ]
                }
            },
            {
                authenticity: {
                    verdict: 'Likely AI',
                    confidence: 91,
                    evidence: [
                        { text: 'Repetitive sentence structure patterns detected', type: 'negative' },
                        { text: 'Overly formal tone throughout content', type: 'negative' },
                        { text: 'Generic vocabulary common in AI-generated text', type: 'negative' },
                        { text: 'Lacks personal anecdotes or unique perspectives', type: 'negative' }
                    ]
                },
                truthfulness: {
                    verdict: 'Mixed',
                    confidence: 65,
                    evidence: [
                        { text: 'Some factual statements verified', type: 'positive' },
                        { text: 'Several unverifiable claims present', type: 'negative' },
                        { text: 'Context missing for key assertions', type: 'neutral' },
                        { text: 'Dates and statistics partially accurate', type: 'neutral' }
                    ]
                }
            },
            {
                authenticity: {
                    verdict: 'Mixed',
                    confidence: 73,
                    evidence: [
                        { text: 'Combination of human and AI-like patterns', type: 'neutral' },
                        { text: 'Some sections show natural flow', type: 'positive' },
                        { text: 'Other sections have AI-typical structure', type: 'negative' },
                        { text: 'Possible human editing of AI content', type: 'neutral' }
                    ]
                },
                truthfulness: {
                    verdict: 'Likely False',
                    confidence: 79,
                    evidence: [
                        { text: 'Multiple claims contradict verified sources', type: 'negative' },
                        { text: 'Timeline inconsistencies detected', type: 'negative' },
                        { text: 'Statistics appear manipulated or fabricated', type: 'negative' },
                        { text: 'One minor claim verified as accurate', type: 'positive' }
                    ]
                }
            },
            {
                authenticity: {
                    verdict: 'Uncertain',
                    confidence: 58,
                    evidence: [
                        { text: 'Insufficient content length for confident analysis', type: 'neutral' },
                        { text: 'Mixed indicators present', type: 'neutral' },
                        { text: 'Some characteristics typical of both human and AI', type: 'neutral' },
                        { text: 'Further analysis recommended', type: 'neutral' }
                    ]
                },
                truthfulness: {
                    verdict: 'Uncertain',
                    confidence: 52,
                    evidence: [
                        { text: 'Limited verifiable claims to analyze', type: 'neutral' },
                        { text: 'Content is largely opinion-based', type: 'neutral' },
                        { text: 'No major red flags detected', type: 'positive' },
                        { text: 'Context needed for proper verification', type: 'neutral' }
                    ]
                }
            }
        ];

        if (contentType === 'image') {
            return {
                authenticity: {
                    verdict: 'Likely Real',
                    confidence: 84,
                    evidence: [
                        { text: 'Natural lighting patterns consistent', type: 'positive' },
                        { text: 'No AI artifact patterns detected in pixels', type: 'positive' },
                        { text: 'Metadata indicates genuine camera source', type: 'positive' },
                        { text: 'Minor editing detected in background area', type: 'negative' }
                    ]
                },
                truthfulness: {
                    verdict: 'Likely True',
                    confidence: 76,
                    evidence: [
                        { text: 'Image location verified through landmarks', type: 'positive' },
                        { text: 'Time of day matches shadow analysis', type: 'positive' },
                        { text: 'No signs of composite manipulation', type: 'positive' },
                        { text: 'Cannot verify all contextual claims', type: 'neutral' }
                    ]
                }
            };
        } else if (contentType === 'audio') {
            return {
                authenticity: {
                    verdict: 'Likely Real',
                    confidence: 89,
                    evidence: [
                        { text: 'Natural voice patterns and intonation', type: 'positive' },
                        { text: 'Background ambient noise present', type: 'positive' },
                        { text: 'No AI voice synthesis markers detected', type: 'positive' },
                        { text: 'Voice matches known speaker characteristics', type: 'positive' }
                    ]
                },
                truthfulness: {
                    verdict: 'Mixed',
                    confidence: 68,
                    evidence: [
                        { text: 'Some statements align with known facts', type: 'positive' },
                        { text: 'Exaggeration detected in several claims', type: 'negative' },
                        { text: 'Context suggests partial information', type: 'neutral' },
                        { text: 'Speaker credibility cannot be fully verified', type: 'neutral' }
                    ]
                }
            };
        } else if (contentType === 'video') {
            return {
                authenticity: {
                    verdict: 'Likely AI',
                    confidence: 86,
                    evidence: [
                        { text: 'Unnatural facial micro-expressions detected', type: 'negative' },
                        { text: 'Lip-sync inconsistencies in multiple frames', type: 'negative' },
                        { text: 'Background shows signs of AI generation', type: 'negative' },
                        { text: 'Temporal artifacts typical of deepfake technology', type: 'negative' }
                    ]
                },
                truthfulness: {
                    verdict: 'Likely False',
                    confidence: 81,
                    evidence: [
                        { text: 'Claims made contradict verified events', type: 'negative' },
                        { text: 'Manipulated to present false narrative', type: 'negative' },
                        { text: 'Original source content appears altered', type: 'negative' },
                        { text: 'Context completely changed from original', type: 'negative' }
                    ]
                }
            };
        }

        const randomScenario = mockScenarios[Math.floor(Math.random() * mockScenarios.length)];
        return randomScenario;
    }

    function displayResults(results) {
        loadingSection.style.display = 'none';
        resultsSection.style.display = 'block';

        const authenticityVerdict = document.getElementById('authenticity-verdict');
        const authenticityConfidence = document.getElementById('authenticity-confidence');
        const authenticityConfidenceFill = document.getElementById('authenticity-confidence-fill');
        const authenticityEvidence = document.getElementById('authenticity-evidence');

        const truthfulnessVerdict = document.getElementById('truthfulness-verdict');
        const truthfulnessConfidence = document.getElementById('truthfulness-confidence');
        const truthfulnessConfidenceFill = document.getElementById('truthfulness-confidence-fill');
        const truthfulnessEvidence = document.getElementById('truthfulness-evidence');

        authenticityVerdict.textContent = results.authenticity.verdict;
        authenticityVerdict.className = 'verdict ' + results.authenticity.verdict.toLowerCase().replace(/ /g, '-');
        authenticityConfidence.textContent = `${results.authenticity.confidence}% Confidence`;

        setTimeout(() => {
            authenticityConfidenceFill.style.width = `${results.authenticity.confidence}%`;
        }, 100);

        authenticityEvidence.innerHTML = '';
        results.authenticity.evidence.forEach((item, index) => {
            const evidenceItem = document.createElement('div');
            evidenceItem.className = 'evidence-item';
            evidenceItem.style.animationDelay = `${index * 0.1}s`;
            evidenceItem.innerHTML = `<p class="evidence-text evidence-${item.type}">${item.text}</p>`;
            authenticityEvidence.appendChild(evidenceItem);
        });

        truthfulnessVerdict.textContent = results.truthfulness.verdict;
        truthfulnessVerdict.className = 'verdict ' + results.truthfulness.verdict.toLowerCase().replace(/ /g, '-');
        truthfulnessConfidence.textContent = `${results.truthfulness.confidence}% Confidence`;

        setTimeout(() => {
            truthfulnessConfidenceFill.style.width = `${results.truthfulness.confidence}%`;
        }, 100);

        truthfulnessEvidence.innerHTML = '';
        results.truthfulness.evidence.forEach((item, index) => {
            const evidenceItem = document.createElement('div');
            evidenceItem.className = 'evidence-item';
            evidenceItem.style.animationDelay = `${index * 0.1}s`;
            evidenceItem.innerHTML = `<p class="evidence-text evidence-${item.type}">${item.text}</p>`;
            truthfulnessEvidence.appendChild(evidenceItem);
        });

        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    function resetToInput() {
        document.getElementById('text-area').value = '';
        currentFile = null;
        fileInput.value = '';
        filePreview.style.display = 'none';
        uploadArea.style.display = 'block';

        inputSection.style.display = 'block';
        loadingSection.style.display = 'none';
        resultsSection.style.display = 'none';

        inputSection.scrollIntoView({ behavior: 'smooth' });
    }
});

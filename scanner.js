class DriversLicenseParser {
    constructor() {
        this.codeReader = new ZXing.BrowserPDF417Reader();
        this.videoElement = document.createElement('video');
        this.setupEventListeners();
    }

    debug(message) {
        const debugContent = document.getElementById('debug-content');
        const timestamp = new Date().toLocaleTimeString();
        debugContent.innerHTML += `[${timestamp}] ${message}\n`;
        debugContent.scrollTop = debugContent.scrollHeight;
    }

    setupEventListeners() {
        // Tab switching
        document.getElementById('camera-tab').addEventListener('click', () => this.switchTab('camera'));
        document.getElementById('upload-tab').addEventListener('click', () => this.switchTab('upload'));

        // File upload handling
        const fileInput = document.getElementById('file-input');
        const uploadSection = document.getElementById('upload-section');

        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // Drag and drop handling
        uploadSection.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            uploadSection.style.borderColor = '#007bff';
        });

        uploadSection.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            uploadSection.style.borderColor = '#ccc';
        });

        uploadSection.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            uploadSection.style.borderColor = '#ccc';
            
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.handleFile(file);
            }
        });
    }

    switchTab(tab) {
        const cameraTab = document.getElementById('camera-tab');
        const uploadTab = document.getElementById('upload-tab');
        const cameraSection = document.getElementById('camera-section');
        const uploadSection = document.getElementById('upload-section');

        if (tab === 'camera') {
            cameraTab.classList.add('active');
            uploadTab.classList.remove('active');
            cameraSection.style.display = 'block';
            uploadSection.style.display = 'none';
            this.startScanning();
        } else {
            uploadTab.classList.add('active');
            cameraTab.classList.remove('active');
            cameraSection.style.display = 'none';
            uploadSection.style.display = 'block';
            this.stopScanning();
        }
    }

    async handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            await this.handleFile(file);
        }
    }

    async handleFile(file) {
        this.debug(`Processing file: ${file.name}`);
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.debug('Error: Please upload an image file');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            this.debug('Error: File size too large (max 10MB)');
            return;
        }
        
        const previewImage = document.getElementById('preview-image');
        previewImage.style.display = 'block';
        previewImage.src = URL.createObjectURL(file);

        try {
            this.debug('Loading image...');
            const image = await this.loadImage(previewImage);
            
            this.debug('Scanning for barcode...');
            const result = await this.codeReader.decodeFromImage(image);
            
            if (result) {
                this.debug('Barcode detected and decoded successfully');
                this.parseAndDisplayResult(result.text);
            } else {
                this.debug('No barcode detected in image. Please try a different image or angle.');
            }
        } catch (error) {
            this.debug(`Error processing image: ${error.message}`);
            previewImage.style.display = 'none';
        } finally {
            // Clean up the object URL
            URL.revokeObjectURL(previewImage.src);
        }
    }

    loadImage(imgElement) {
        return new Promise((resolve, reject) => {
            imgElement.onload = () => resolve(imgElement);
            imgElement.onerror = reject;
        });
    }

    async startScanning() {
        try {
            const videoConstraints = {
                facingMode: 'environment'
            };
            const constraints = {
                video: videoConstraints,
                audio: false
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.videoElement.srcObject = stream;
            this.videoElement.setAttribute('playsinline', true);
            this.videoElement.play();

            document.querySelector('#interactive').appendChild(this.videoElement);
            this.debug('Camera started successfully');
            this.scanLoop();
        } catch (err) {
            this.debug(`Error starting camera: ${err.message}`);
            console.error('Error starting scanner:', err);
        }
    }

    stopScanning() {
        if (this.videoElement.srcObject) {
            const tracks = this.videoElement.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            this.videoElement.srcObject = null;
            this.debug('Camera stopped');
        }
    }

    async scanLoop() {
        try {
            const result = await this.codeReader.decodeFromVideoElement(this.videoElement);
            if (result) {
                this.debug('Barcode detected from camera');
                this.parseAndDisplayResult(result.text);
            }
        } catch (err) {
            // Ignore errors and continue scanning
        }
        if (this.videoElement.srcObject) {
            requestAnimationFrame(() => this.scanLoop());
        }
    }

    parseAndDisplayResult(rawData) {
        this.debug('Raw data received: ' + rawData.substring(0, 50) + '...');
        const parsedData = this.parseAAMVAData(rawData);
        document.getElementById('parsed-result').textContent = 
            JSON.stringify(parsedData, null, 2);
    }

    parseAAMVAData(data) {
        const fields = {
            DBA: 'Expiration Date',
            DCS: 'Last Name',
            DCT: 'First Name',
            DBD: 'Issue Date',
            DBB: 'Date of Birth',
            DBC: 'Gender',
            DAY: 'Eye Color',
            DAU: 'Height',
            DAG: 'Street Address',
            DAI: 'City',
            DAJ: 'State',
            DAK: 'Postal Code',
            DCF: 'Document ID Number'
        };

        const parsed = {};
        const segments = data.split('\n');

        segments.forEach(segment => {
            const code = segment.substring(0, 3);
            const value = segment.substring(3).trim();
            
            if (fields[code]) {
                parsed[fields[code]] = value;
            }
        });

        return parsed;
    }
}

// Start the scanner when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const scanner = new DriversLicenseParser();
    scanner.startScanning();
}); 
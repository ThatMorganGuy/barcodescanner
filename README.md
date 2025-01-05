# Driver's License Barcode Scanner

A web-based application that can scan and parse driver's license barcodes from multiple countries using your device's camera or uploaded images.

## Features

- Live camera scanning
- Image upload support (drag & drop or file selection)
- Support for multiple countries:
  - United States
  - Canada
  - Mexico
  - United Kingdom
  - Australia
- Auto-detection of country format
- Debug panel with real-time information
- Frame capture for successful scans

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 12 or higher)
- [Git](https://git-scm.com/)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/drivers-license-scanner.git
   ```

2. Navigate to the project directory:
   ```bash
   cd drivers-license-scanner
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. Start the server:
   ```bash
   npm start
   ```

2. For development with auto-reload:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

### Camera Scanning
1. Click the "Use Camera" tab
2. Grant camera permissions when prompted
3. Hold the driver's license barcode in front of the camera
4. The parsed information will appear in the results panel

### Image Upload
1. Click the "Upload Image" tab
2. Either:
   - Click "Choose Image" to select a file
   - Drag and drop an image onto the upload area
3. The parsed information will appear in the results panel

### Country Selection
- Use the country selector dropdown to manually select the ID format
- The application will attempt to auto-detect the country format from the barcode

## Debug Information
- The debug panel shows real-time information about:
  - Scanning process
  - Success/failure messages
  - Country detection
  - Image processing details

## Security Notes
- This application runs entirely in the browser
- No data is sent to any external servers
- Images and scanned data are processed locally

## Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Known Limitations
- Camera access requires HTTPS in production
- Some older or damaged barcodes may not scan properly
- Image quality affects scanning success rate

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details

## Acknowledgments
- ZXing library for barcode scanning
- Express.js for the server

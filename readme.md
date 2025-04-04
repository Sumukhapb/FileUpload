# File Upload System

A Node.js application for handling file uploads with Express.js.

## Features

- Single file upload
- Multiple file upload support
- File type validation
- Size limit restrictions
- Secure file storage

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Flie_Upload
```

2. Install dependencies:
```bash
npm install
```

3. Create an `.env` file and set your environment variables:
```bash
PORT=3000
UPLOAD_PATH=./uploads
```

## Usage

1. Start the server:
```bash
npm start
```

2. Access the application at `http://localhost:3000`

## API Endpoints

- `POST /upload/single` - Upload a single file
- `POST /upload/multiple` - Upload multiple files

## Tech Stack

- Node.js
- Express.js
- Multer (for file handling)

## License

MIT License

## Author

[Your Name]

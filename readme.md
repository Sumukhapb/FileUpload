## 📦 Project Title: File Upload and Temporary Storage

An Express.js application that allows authenticated users to upload, manage, and share files with temporary, expiring links. Supports in-browser previews for common file types and secure downloads for others.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.x-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Passport](https://img.shields.io/badge/Auth-Passport-34E27A?logo=passport&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

### 🧰 Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Views**: EJS with `ejs-mate` layouts
- **Auth**: Passport (Local + Google OAuth 2.0)
- **Database**: MongoDB with Mongoose
- **Sessions**: `express-session` with `connect-mongo`
- **Uploads**: Multer (disk storage)

### ✨ Features
- 🔐 **Authentication**: Local email/password and Google sign-in
- ⬆️ **Upload**: Single-file upload, stored on disk with timestamped filenames
- 📂 **My Files**: List files you uploaded
- 📥 **Download**: Direct file download
- ✏️ **Rename/Delete**: Manage uploaded files (rename and delete)
- 🔗 **Share**: Generate temporary shareable links with 24-hour expiry
- 👀 **Preview**: Inline previews for text/code, images, and PDFs when possible

### 🛠️ Prerequisites
- Node.js v18+ (recommended)
- npm (comes with Node.js)
- MongoDB instance (local or hosted)

### 🚀 Installation and Setup
1) Clone the repository
```bash
git clone https://github.com/Sumukhapb/FileUpload.git
cd Flie_Upload
```

2) Install dependencies
```bash
npm install
```

3) Create an `.env` file in the project root and configure the environment variables (see next section)

4) Start the server
```bash
# Production
npm start

# Development (auto-restart on changes)
npm run dev
```

5) Open the app
- Visit `http://localhost:8000` (default) in your browser

### 🔧 Environment Variables
Create a `.env` file with the following keys. Adjust values for your environment.
```bash
# Server
PORT=8000

# Database
MONGO_URL=mongodb://127.0.0.1:27017/file_upload

# Google OAuth (for social login)
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```
Notes:
- ⚠️ The Google OAuth callback is configured at `http://localhost:8000/auth/google/callback`. Ensure this is added in your Google Cloud Console OAuth settings.
- 💾 File uploads are stored on disk under `backend/uploads/`.

### 📖 Usage Overview
- 📝 Sign up with email/password or continue with Google
- ⬆️ Use the upload page to add files
- 🧭 Manage your files: rename, delete, download, or generate share links
- ⏱️ Share links are valid for 24 hours and default to view permission

### 🔗 API Endpoints
Unless noted, endpoints require authentication via session cookies.

- **Auth**
  - `GET /auth/login` — Render login page
  - `GET /auth/signup` — Render signup page
  - `POST /auth/signup` — Create local account and sign in
  - `POST /auth/login` — Local login
  - `GET /auth/google` — Start Google OAuth
  - `GET /auth/google/callback` — Google OAuth callback
  - `GET /auth/logout` — Log out and destroy session

- **Dashboard**
  - `GET /dashboard` — Authenticated dashboard

- **Files** (mounted at `/files`)
  - `GET /files/upload` — Upload page
  - `POST /files/upload` — Upload single file (form field name: `file`)
  - `GET /files/myfiles` — List files uploaded by the current user
  - `GET /files/download/:filename` — Download a file by filename
  - `PUT /files/rename/:id` — Rename a file by document id (body: `{ newFileName }`)
  - `DELETE /files/delete/:id` — Delete a file by document id
  - `POST /files/share/:id` — Create a temporary shareable link; returns JSON `{ link, expireAt }`
  - `GET /files/shared/:link` — Open a shared file (inline preview when supported; otherwise download)
  - `GET /files/open-shared?link=<id|url>` — Helper route to navigate to a shared file

### 🖼️ Notes on File Support and Previews
- ✅ Allowed types include common documents, images, archives, and code/text files
- 👀 Previews: images (`.jpg`, `.jpeg`, `.png`), text/code (`.txt`, `.js`, `.css`, `.html`, `.py`, `.java`, `.cpp`, `.csv`), and PDFs
- 📦 Archives (`.zip`, `.rar`, `.7z`) show a message when preview is not available

### 🏃 Scripts
```bash
npm start    # start server
npm run dev  # start with nodemon
```

### 📄 License
MIT License

### 👤 Author
Sumukh PB

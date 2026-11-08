# 🎧 Anurix – Music Streaming Application

Anurix is a full-stack music streaming web application designed to deliver an immersive music-listening experience through a modern, dark-themed interface. It allows users to explore music, play tracks, search songs, manage playlists, and keep track of recently played music.

Built using React.js, Node.js, Express.js, and MongoDB, Anurix combines a modern frontend with a backend API to provide a seamless music experience.

## ✨ Features

- **Music Player:** Play and pause tracks with centralized playback state management.
- **Music Library:** Browse and explore available music.
- **Music Search:** Search for songs using the application's search functionality.
- **Playlist Management:** Organize music into playlists such as Chill, Focus Vibes, Workout, Study, and Sleep.
- **Recently Played:** Keep track of recently played songs.
- **Music Upload:** Upload music through backend API endpoints.
- **Centralized State Management:** Manage current track, playback status, and recently played songs using React Context API.
- **Real-Time Communication:** Socket.IO integration for real-time application functionality.
- **Modern UI:** Dark-themed interface with vibrant cyan accents and a clean layout.

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO

### Tools
- Git & GitHub
- npm
- VS Code

## 🎨 UI Theme

Anurix follows a modern dark-themed design with cyan accents to create an immersive music-listening experience.

| Element | Color |
|---|---|
| Background | `#12141c` |
| AURA Accent | `#00f2fe` |

## 📂 Project Structure

```text
Anurix/
│
├── Anurix/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── footer/
│   │   ├── HomePage/
│   │   ├── main/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   └── package.json
│
├── Backend/                         # Backend (Node.js + Express)
│   ├── src/
│   │   ├── authRoutes/
│   │   ├── controller/
│   │   ├── db/
│   │   ├── model/
│   │   └── app.js
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── node_modules/
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## 🚀 Getting Started

Follow these steps to run Anurix locally.

### Prerequisites

- Node.js
- npm
- MongoDB (local instance or MongoDB Atlas)

### 1. Clone the Repository

```bash
git clone https://github.com/Ritik-9/Anurix.git
cd Anurix
```

### 2. Install Root Dependencies

```bash
npm install
```

### 3. Install Frontend Dependencies

Navigate to the frontend directory:

```bash
cd Anurix
npm install
```

### 4. Install Backend Dependencies

Open another terminal in the root project directory:

```bash
cd Backend
npm install
```

### 5. Configure Environment Variables

Create a `.env` file inside the `Backend` directory and configure the required environment variables.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Use the exact variable names required by your backend source code.

**Important:** Never commit your `.env` file, database credentials, or authentication secrets to GitHub.

### 6. Start the Backend

From the `Backend` directory:

```bash
npm run dev
```

### 7. Start the Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd Anurix
npm run dev
```

Open the local development URL displayed by Vite in your terminal.

## 🔗 Backend API Routes

The backend provides API endpoints for music-related operations.

| Endpoint | Description |
|---|---|
| `/api/music` | Retrieve music data |
| `/api/upload` | Handle music uploads |
| `/api/search` | Search for music |

## 🧠 Key Learnings

Developing Anurix provided practical experience in:

- Building full-stack applications using the MERN stack.
- Creating reusable UI components using React.
- Managing application state using React Context API.
- Integrating frontend applications with REST APIs.
- Working with MongoDB and Mongoose.
- Implementing music playback functionality.
- Handling file uploads through backend APIs.
- Exploring real-time communication using Socket.IO.
- Structuring frontend and backend applications for maintainability.

## 🔮 Future Enhancements

- Enhanced music recommendation system.
- Improved music discovery experience.
- Advanced playback controls and queue management.
- Additional playlist customization options.
- Further UI/UX improvements.

## 👨‍💻 Author

**Ritik Paras**

- GitHub: [Ritik-9](https://github.com/Ritik-9)
- LinkedIn: [Ritik Paras](https://www.linkedin.com/in/ritik-paras-675906388/)
- LeetCode: [Ritik__11](https://leetcode.com/u/Ritik__11/)

---

<p align="center">
  Built with ❤️ and a passion for music.
</p>
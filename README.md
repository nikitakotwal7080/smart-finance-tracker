# 💰 Smart Finance Tracker

A modern full-stack expense tracking application with AI-powered insights, multi-language support, and interactive visualizations.

**Status:** ✅ Production Ready | Frontend: Vercel | Backend: Railway | Database: MongoDB Atlas

---

## 🎯 Features

✅ **User Authentication** - Secure login/register with JWT  
✅ **Expense Management** - Create, read, update, delete expenses  
✅ **Budget Tracking** - Set monthly budgets and track spending  
✅ **Analytics & Charts** - Visualize spending patterns with Recharts  
✅ **AI Insights** - Smart spending analysis  
✅ **Multi-Language** - English, हिंदी (Hindi), मराठी (Marathi)  
✅ **Responsive Design** - Works on desktop, tablet, mobile  
✅ **Dark Mode** - Built-in dark theme support  

---

## 🏗️ Tech Stack

### Frontend
- **React** 19.2 - UI framework
- **Vite** 8.0 - Build tool
- **Recharts** 3.8 - Data visualization
- **Axios** 1.16 - HTTP client
- **i18next** 26.2 - Internationalization
- **ESLint** 9.39 - Code quality

### Backend
- **Node.js / Express** 4.22 - Server framework
- **MongoDB** 8.24 - Database (Mongoose ODM)
- **JWT** 9.0 - Authentication
- **bcryptjs** 2.4 - Password hashing
- **CORS** 2.8 - Cross-origin requests
- **dotenv** 16.6 - Environment config

### Deployment
- **Frontend:** Vercel (auto-deploy from GitHub)
- **Backend:** Railway (auto-deploy from GitHub)
- **Database:** MongoDB Atlas (cloud MongoDB)

---

## 📁 Project Structure

```
finance/
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── pages/           # React pages (SmartFinanceTracker.jsx)
│   │   ├── components/      # Reusable UI components
│   │   ├── services/        # API integration (api.js)
│   │   ├── hooks/           # Custom hooks (useAnalytics)
│   │   ├── utils/           # Helpers & utilities
│   │   └── styles/          # Global CSS & themes
│   ├── package.json
│   ├── vite.config.js
│   ├── .env                 # Environment variables (local)
│   └── .env.example         # Environment template
│
├── backend/                 # Express.js API server
│   ├── routes/              # API endpoints
│   │   ├── authRoutes.js    # Auth endpoints
│   │   ├── expenseRoutes.js # Expense CRUD
│   │   └── budgetRoutes.js  # Budget endpoints
│   ├── models/              # MongoDB schemas (User, Expense, Budget)
│   ├── middleware/          # Auth middleware
│   ├── controllers/         # Business logic
│   ├── server.js            # Entry point
│   ├── package.json
│   ├── .env                 # Secrets (not committed)
│   ├── .env.example         # Environment template
│   └── Procfile             # Railway deployment config
│
├── DEPLOYMENT.md            # Step-by-step deployment guide
├── package.json             # Root package.json
└── .gitignore              # Git ignore rules
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 16+ 
- npm or yarn
- MongoDB Atlas account (free tier available)
- Git

### Setup

1. **Clone repository**
```bash
git clone https://github.com/nikitakotwal7080/smart-finance-tracker.git
cd smart-finance-tracker
```

2. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

3. **Configure environment variables**

**Backend** (`backend/.env`):
```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Finance
JWT_SECRET=your_jwt_secret_key
```

**Frontend** (`frontend/.env`):
```
VITE_API_URL=http://localhost:5000
```

4. **Start servers**

**Backend** (Terminal 1):
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

5. **Open browser**
```
http://localhost:5173
```

---

## 📦 Available Scripts

### Frontend
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production (dist/)
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend
```bash
npm start        # Start server (production)
npm run dev      # Start with nodemon (auto-reload)
```

---

## 🌍 Deployment

### Step 1: Prepare Code
```bash
git add .
git commit -m "Deploy: Final production setup"
git push origin main
```

### Step 2: Deploy Frontend to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Connect GitHub repo
4. **Settings:**
   - Root Directory: `frontend`
   - Build: `npm run build`
   - Output: `dist`
5. **Environment Variables:**
   ```
   VITE_API_URL = https://your-backend.up.railway.app
   ```
6. Click **Deploy**

### Step 3: Deploy Backend to Railway

1. Go to [Railway.app](https://railway.app)
2. Create new project → Deploy from GitHub
3. Select repository
4. **Environment Variables:**
   ```
   PORT=5000
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-secret>
   ```
5. Railway auto-deploys on push

### Step 4: Update Frontend API URL

After Railway deployment, update frontend env var:
```
VITE_API_URL = https://your-railway-backend-url
```

---

## 🔐 Security Checklist

- [x] JWT authentication enabled
- [x] Passwords hashed with bcrypt (10 rounds)
- [x] CORS configured
- [x] Environment variables in `.env` (not committed)
- [x] Auth middleware on protected routes
- [x] Secrets stored securely (not in code)
- [x] MongoDB Atlas IP whitelist configured

---

## 📊 API Endpoints

### Authentication
```
POST   /api/auth/register     # Register new user
POST   /api/auth/login        # Login user
GET    /api/auth/me           # Get current user (protected)
```

### Expenses
```
GET    /api/expenses          # Get all expenses (protected)
POST   /api/expenses          # Create expense (protected)
PUT    /api/expenses/:id      # Update expense (protected)
DELETE /api/expenses/:id      # Delete expense (protected)
```

### Budget
```
GET    /api/budget            # Get current budget (protected)
POST   /api/budget            # Save budget (protected)
GET    /api/budget/history    # Get budget history (protected)
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **MongoDB connection failed** | Add IP to [MongoDB Atlas Network Access](https://cloud.mongodb.com/v2) whitelist |
| **CORS errors** | Check backend CORS config and frontend `VITE_API_URL` |
| **White screen on frontend** | Check browser console, verify API connection |
| **401 Unauthorized** | Verify JWT token in localStorage |
| **Vite not found** | Run `npm install` in frontend directory |

---

## 🎨 Customization

### Theme Colors
Edit `frontend/src/styles/globalStyles.js` to customize:
- Primary colors
- Dark/light theme
- Spacing & typography

### API Endpoints
Change backend URL in:
- `frontend/src/services/api.js` - API base configuration
- `.env` file - `VITE_API_URL`

### Language Settings
Add new languages in `frontend/src/pages/SmartFinanceTracker.jsx`:
```javascript
const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "hi", label: "हिंदी", flag: "🇮🇳" },
  { code: "mr", label: "मराठी", flag: "🇮🇳" },
  // Add more here
];
```

---

## 📈 Performance

- **Frontend Build Size:** 763.81 KB (gzipped)
- **Build Time:** ~550ms
- **Database:** MongoDB Atlas with indexing
- **Caching:** Automatic with Vercel CDN

---

## 📝 License

MIT License - See LICENSE file for details

---

## 👨‍💻 Author

**Nikita Kotwal**  
GitHub: [@nikitakotwal7080](https://github.com/nikitakotwal7080)

---

## 📞 Support

For issues or questions:
1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
2. Review API endpoints documentation
3. Check browser console for error details
4. Verify environment variables are set correctly

---

**Status:** ✅ Production Ready  
**Last Updated:** June 18, 2026  
**Version:** 1.0.0

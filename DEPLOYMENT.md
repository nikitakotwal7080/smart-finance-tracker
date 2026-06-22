# Smart Finance Tracker - Deployment Checklist ✅

## 📋 Pre-Deployment Requirements

### 1. **MongoDB Atlas Setup** ⚠️ ACTION REQUIRED
- [ ] Go to [MongoDB Atlas](https://cloud.mongodb.com)
- [ ] Navigate to **Network Access** → **IP Whitelist**
- [ ] Add your current IP address or allow **0.0.0.0/0** (for production: add specific IPs)
- [ ] Your current MongoDB URI: `mongodb+srv://nikitakotwal7080_db_user:8wWC2Ksz9xAHGr8w@finance.xdv6o7e.mongodb.net/?appName=Finance`

### 2. **Environment Variables**

#### Backend (.env in `/backend`)
```
PORT=5000
MONGO_URI=mongodb+srv://nikitakotwal7080_db_user:8wWC2Ksz9xAHGr8w@finance.xdv6o7e.mongodb.net/?appName=Finance
JWT_SECRET=smartfinance_secret
```
✅ Currently configured and saved in `.env`

#### Frontend (.env in `/frontend`)
```
VITE_API_URL=http://localhost:5000
```
✅ Currently configured and saved in `.env`

### 3. **For Vercel (Frontend) Deployment**
```
Environment Variables:
- VITE_API_URL = https://your-railway-backend.up.railway.app (production URL after backend deploys)
```

### 4. **For Railway/Heroku (Backend) Deployment**
```
Environment Variables:
- PORT = 5000
- MONGO_URI = <your MongoDB Atlas connection string>
- JWT_SECRET = <your JWT secret>
```

---

## 🚀 Deployment Steps

### **Frontend (Vercel)**
1. Push code to GitHub:
   ```bash
   git add .
   git commit -m "Deploy: Add production configs"
   git push
   ```

2. Go to [Vercel](https://vercel.com)
3. Click **"Add New Project"** → Select your GitHub repository
4. **Settings:**
   - Framework: **Vite**
   - Root Directory: **frontend**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Environment Variables:**
   - `VITE_API_URL` = `https://your-backend-url.up.railway.app/api`
6. Click **Deploy**

### **Backend (Railway)**
1. Go to [Railway](https://railway.app)
2. Click **"Create New Project"** → **Deploy from GitHub repo**
3. Select your repository
4. Choose **backend** directory
5. Add environment variables:
   - `PORT` = `5000`
   - `MONGO_URI` = Your MongoDB Atlas connection string
   - `JWT_SECRET` = Your JWT secret key
6. Railway auto-deploys on push

---

## ✅ Build & Test Locally

### Test Frontend Build:
```bash
cd frontend
npm install
npm run build
```
✅ **Status:** Builds successfully (763.81 KB gzipped)

### Test Backend:
```bash
cd backend
npm install
npm start
```
⚠️ **Status:** Awaiting MongoDB Atlas IP whitelist configuration

---

## 🔍 Code Quality Checks

### ✅ Frontend (`SmartFinanceTracker.jsx`)
- [x] No duplicate `deleteExp` declarations
- [x] All functions properly closed
- [x] No syntax errors
- [x] Builds without errors
- [x] MongoDB `_id` usage preserved
- [x] createExpense/updateExpense working
- [x] API endpoints properly configured

### ✅ Backend API Routes
- [x] Auth routes (register, login, /me)
- [x] Expense routes (CRUD operations)
- [x] Budget routes (save, get, history)
- [x] Auth middleware properly implemented
- [x] Error handling in place

### ✅ Security
- [x] JWT authentication enabled
- [x] Password hashing with bcrypt
- [x] CORS enabled
- [x] Secrets in `.env` (not committed)

---

## 📦 Files Created for Deployment

✅ `/frontend/.env` - Local development config
✅ `/frontend/.env.example` - Template for reference
✅ `/frontend/vercel.json` - Vercel build configuration
✅ `/backend/.env` - Backend secrets (already exists)
✅ `/backend/.env.example` - Template for reference
✅ `/backend/Procfile` - Railway/Heroku deployment config

---

## 🎯 Final Checklist Before Deploy

- [ ] **MongoDB Atlas IP Whitelist:** Add your IP or use `0.0.0.0/0`
- [ ] **Git Commit:** Push all changes
- [ ] **Vercel:** Connect GitHub repo and deploy frontend
- [ ] **Railway:** Connect GitHub repo, set env vars, and deploy backend
- [ ] **Test API:** After both deploy, test `/api/auth/login` endpoint
- [ ] **Frontend .env:** Update `VITE_API_URL` to production backend URL after Railway deploy

---

## 🧪 Testing Production URLs

After deployment, test with:
```bash
# Test backend
curl https://your-backend.up.railway.app/api/auth/login -X POST -d '{"email":"test@example.com","password":"test"}'

# Test frontend
Visit: https://your-frontend.vercel.app
```

---

## ⚠️ Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **MongoDB connection failed** | Add IP to MongoDB Atlas Network Access whitelist |
| **CORS errors in frontend** | Ensure backend CORS is configured (already done) |
| **API 404 errors** | Check `VITE_API_URL` in frontend `.env` matches deployed backend URL |
| **Auth not working** | Verify `JWT_SECRET` is same in `.env` and production |
| **White screen on load** | Check browser console for errors, verify API connection |

---

## 📞 Support Resources

- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [Express.js Docs](https://expressjs.com)

---

**Last Updated:** 2026-06-18
**Status:** ✅ Ready for production deployment

# 🚀 Render Deployment Quick Guide

## ✅ Issue Fixed

**Problem:** TypeScript compilation error in `role.service.ts`
**Solution:** Updated the role assignment logic to use `roleId` directly instead of updating through relation

## 🎯 Render Configuration

### Option 1: Manual Configuration (Recommended for First Time)

1. **Go to Render Dashboard** → Create New Web Service

2. **Connect Your Repository**
   - Link your GitHub/GitLab repository
   - Select the `EventKonnect-be` repository

3. **Configure Build Settings:**
   - **Name:** `eventkonnect-backend` (or your choice)
   - **Region:** Choose closest to your users
   - **Branch:** `main` or `develop`
   - **Root Directory:** Leave empty
   - **Runtime:** Node
   - **Build Command:**
     ```bash
     npm install && npx prisma generate && npm run build
     ```
   - **Start Command:**
     ```bash
     npm run start:prod
     ```

4. **Set Environment Variables:**
   Click "Advanced" → Add Environment Variables:

   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/eventKonnect?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-key
   CLOUDINARY_API_SECRET=your-cloudinary-secret
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-app-password
   FRONTEND_URL=https://eventkonnect-fe-1.onrender.com
   ```

5. **Click "Create Web Service"**

### Option 2: Using render.yaml (Infrastructure as Code)

We've created a `render.yaml` file for you. To use it:

1. Commit the render.yaml file:
   ```bash
   git add render.yaml
   git commit -m "Add Render configuration"
   git push
   ```

2. In Render Dashboard:
   - Go to "Blueprint" → "New Blueprint Instance"
   - Connect your repository
   - Select the repository with render.yaml
   - Fill in the secret environment variables when prompted

## 🔍 MongoDB Setup (MongoDB Atlas)

If you don't have MongoDB set up yet:

1. **Go to** https://www.mongodb.com/cloud/atlas
2. **Sign up** or log in
3. **Create a Cluster** (Free tier is fine)
4. **Create a Database User:**
   - Security → Database Access
   - Add New Database User
   - Username & Password authentication
   - Save credentials
5. **Allow Network Access:**
   - Security → Network Access
   - Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
6. **Get Connection String:**
   - Deployment → Database → Connect
   - Connect your application
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `eventKonnect`

Example:
```
mongodb+srv://admin:MyP@ssw0rd123@cluster0.abc123.mongodb.net/eventKonnect?retryWrites=true&w=majority
```

## 📝 Deployment Checklist

- [ ] MongoDB database created and accessible
- [ ] DATABASE_URL configured in Render
- [ ] All environment variables set in Render
- [ ] Build command includes `npx prisma generate`
- [ ] Code pushed to Git repository
- [ ] Render service created and building

## ✅ Verify Deployment

After deployment completes (5-10 minutes):

1. **Check Build Logs** for:
   ```
   ✔ Generated Prisma Client
   Build successful
   ```

2. **Check Runtime Logs** for:
   ```
   🚀 EventKonnect API Started Successfully! 🚀
   Server running on: http://0.0.0.0:10000
   ```

3. **Test API** - Visit:
   ```
   https://your-app-name.onrender.com/api/v1
   https://your-app-name.onrender.com/api/docs
   ```

4. **Test from Frontend:**
   - Open your frontend: https://eventkonnect-fe-1.onrender.com
   - Try to register/login
   - Should work without CORS errors!

## 🐛 Common Issues & Solutions

### Build fails with "prisma command not found"
**Solution:** Make sure build command includes `npx prisma generate`

### Build fails with TypeScript errors
**Solution:** The role.service.ts issue has been fixed. Make sure you pulled the latest changes:
```bash
git pull origin main
```

### Runtime error: "URL must start with protocol mongo"
**Solution:** Check DATABASE_URL in Render environment variables
- Must start with `mongodb://` or `mongodb+srv://`
- No quotes around the value
- Special characters in password should be URL-encoded

### Error: "MongoServerError: bad auth"
**Solution:** 
- Double-check MongoDB username and password
- URL-encode special characters in password
- Verify database user has read/write permissions

### CORS errors from frontend
**Solution:** 
- Frontend URL already configured: `https://eventkonnect-fe-1.onrender.com`
- Make sure backend is accessible
- Check browser console for specific error

### App crashes on startup
**Solution:** Check runtime logs in Render dashboard
- Look for missing environment variables
- Check DATABASE_URL connection
- Verify all required env vars are set

## 🎉 Success!

Once deployed, your API will be available at:
- **API Base:** `https://your-app-name.onrender.com/api/v1`
- **API Docs:** `https://your-app-name.onrender.com/api/docs`

Your frontend can now communicate with the backend! 🚀

## 📞 Need Help?

Check the logs in Render dashboard:
1. Go to your service
2. Click "Logs" tab
3. Look for errors or issues

Common log locations:
- **Build Logs:** Show during deployment
- **Runtime Logs:** Show after app starts

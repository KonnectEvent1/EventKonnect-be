# 🚀 Deployment Checklist for Render

## ✅ Changes Completed

1. ✅ Added CORS support for `https://eventkonnect-fe-1.onrender.com`
2. ✅ Converted database from PostgreSQL to MongoDB
3. ✅ Updated Prisma schema for MongoDB
4. ✅ Added postinstall script to auto-generate Prisma client

## 📋 Required Actions on Render

### Step 1: Set Environment Variable

In your Render dashboard for the backend service:

1. Go to **Environment** tab
2. Add/Update this variable:

```
DATABASE_URL=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/eventKonnect?retryWrites=true&w=majority
```

**Replace:**
- `YOUR_USERNAME` - MongoDB database username
- `YOUR_PASSWORD` - MongoDB database password  
- `YOUR_CLUSTER` - Your MongoDB Atlas cluster address

**Example:**
```
DATABASE_URL=mongodb+srv://admin:MyP@ssw0rd@cluster0.abc123.mongodb.net/eventKonnect?retryWrites=true&w=majority
```

### Step 2: Verify Build & Start Commands

Your Render configuration should be:

**Build Command:**
```bash
npm install && npx prisma generate && npm run build
```

**Start Command:**
```bash
npm run start:prod
```

### Step 3: Deploy

Commit and push your changes:

```bash
git add .
git commit -m "Add MongoDB support and frontend CORS"
git push origin main
```

Render will automatically detect the push and redeploy.

## 🔍 Verify Deployment

After deployment completes:

1. Check Render logs for:
   ```
   🚀 EventKonnect API Started Successfully! ��
   🌐 CORS enabled for: ... https://eventkonnect-fe-1.onrender.com
   ```

2. Test from frontend at `https://eventkonnect-fe-1.onrender.com`

3. Check database connection - try logging in or registering a user

## ⚠️ Troubleshooting

### Error: "the URL must start with the protocol `mongo`"
- Check DATABASE_URL in Render environment variables
- Must start with `mongodb://` or `mongodb+srv://`

### Error: "MongoServerError: bad auth"
- Verify MongoDB username and password
- Check if special characters in password are URL-encoded

### Error: "Connection timeout"
- In MongoDB Atlas, check Network Access
- Add `0.0.0.0/0` to allow all IPs (for cloud deployments)
- Or add Render's IP addresses

### CORS Errors from Frontend
- Verify frontend URL exactly matches: `https://eventkonnect-fe-1.onrender.com`
- Check if backend is running and accessible
- Check browser console for specific CORS error

## 📚 Additional Resources

- `MONGODB_MIGRATION.md` - Detailed MongoDB migration guide
- `.env.example` - Updated with MongoDB URL format
- `prisma/schema.prisma` - MongoDB-compatible schema

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ Backend deploys without errors
- ✅ Logs show successful database connection
- ✅ Frontend can make API calls without CORS errors
- ✅ User registration/login works from frontend

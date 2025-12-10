# MongoDB Migration Guide

## ✅ Changes Made

Your EventKonnect backend has been converted from PostgreSQL to MongoDB.

### 1. Schema Changes
- **Provider**: Changed from `postgresql` to `mongodb`
- **ID Fields**: Updated all models to use MongoDB ObjectId format:
  - Changed `@id @default(uuid())` to `@id @default(auto()) @map("_id") @db.ObjectId`
  - All foreign key fields now use `@db.ObjectId` annotation

### 2. Models Updated
- User
- Role
- Event
- EventAttendee
- Review

## 🚀 Deployment Steps on Render

### Step 1: Set Up MongoDB Database
1. Create a MongoDB database (MongoDB Atlas recommended)
2. Get your MongoDB connection string (starts with `mongodb+srv://` or `mongodb://`)

### Step 2: Configure Environment Variables on Render
In your Render dashboard, set the following environment variable:

```
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/eventKonnect?retryWrites=true&w=majority
```

Replace:
- `username` with your MongoDB username
- `password` with your MongoDB password
- `cluster.mongodb.net` with your actual MongoDB cluster URL
- `eventKonnect` with your database name

### Step 3: Add Build Command on Render
Make sure your Render build command includes Prisma generation:

```bash
npm install && npx prisma generate
```

Or if using yarn:
```bash
yarn install && npx prisma generate
```

### Step 4: Deploy
Push your changes to Git and Render will automatically redeploy:

```bash
git add .
git commit -m "Migrate from PostgreSQL to MongoDB"
git push origin main
```

## 📝 Important Notes

### MongoDB vs PostgreSQL Differences

1. **No Migrations**: MongoDB doesn't use migrations like PostgreSQL. The schema is created automatically on first connection.

2. **ID Format**: IDs are now MongoDB ObjectIds (24-character hex strings) instead of UUIDs.

3. **Unique Constraints**: Unique fields like `username` and `email` will be automatically indexed by MongoDB.

4. **Relations**: Prisma handles MongoDB relations internally, no manual indexing needed.

## 🔍 Verify Connection

After deployment, check your Render logs for:
```
🚀 EventKonnect API Started Successfully! 🚀
```

If you see Prisma connection errors, verify:
1. DATABASE_URL is correctly set in Render environment variables
2. MongoDB cluster allows connections from Render's IP (usually set to "Allow from anywhere" for cloud deployments)
3. Database user has read/write permissions

## 🛠️ Local Development

To test locally with MongoDB:

1. Update your local `.env` file:
   ```
   DATABASE_URL="mongodb://localhost:27017/eventKonnect"
   ```
   Or use MongoDB Atlas for local development too.

2. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

3. Start your server:
   ```bash
   npm run start:dev
   ```

## 🔄 Data Migration (if needed)

If you have existing data in PostgreSQL that needs to be migrated to MongoDB:

1. Export data from PostgreSQL
2. Transform the data (UUIDs → ObjectIds)
3. Import into MongoDB using MongoDB tools or custom scripts

Contact your team if you need help with data migration.

## ✨ CORS Configuration

Frontend URL has been added to CORS:
- `https://eventkonnect-fe-1.onrender.com`

Your frontend should now be able to communicate with the backend once deployed.

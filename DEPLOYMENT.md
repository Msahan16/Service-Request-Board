# Deployment Guide

This guide covers deploying the Service Request Board application to production.

## Deployment Options

### Option 1: Deploy to Vercel + Render (Recommended)

#### Frontend Deployment to Vercel

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub, GitLab, or Bitbucket

2. **Push Frontend to GitHub**
   ```bash
   cd frontend
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

3. **Deploy to Vercel**
   - Visit vercel.com dashboard
   - Click "New Project"
   - Select your frontend repository
   - Configure environment variables:
     - `NEXT_PUBLIC_API_URL` = (your Render backend URL)
   - Click "Deploy"

4. **Configure Custom Domain (Optional)**
   - In Vercel dashboard → Settings → Domains
   - Add your custom domain

#### Backend Deployment to Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up

2. **Push Backend to GitHub**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

3. **Deploy to Render**
   - Visit render.com dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: service-request-api
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Environment Variables**:
       ```
       PORT=5000
       MONGO_URI=<your-mongodb-connection-string>
       NODE_ENV=production
       ```
   - Click "Create Web Service"

4. **Get Backend URL**
   - Once deployed, Render provides a URL like: `https://service-request-api.onrender.com`
   - Update Vercel `NEXT_PUBLIC_API_URL` with this URL

### Option 2: Deploy to Railway (Alternative)

#### Backend to Railway

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Connect Repository**
   - New Project → Deploy from GitHub
   - Select your backend repository

3. **Add Environment Variables**
   - Add `PORT`, `MONGO_URI`, `NODE_ENV`
   - Railway auto-generates a domain

4. **Deploy**
   - Push to repository
   - Railway auto-deploys

### Option 3: Docker Deployment

#### Create Docker Files

**Dockerfile for Backend:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

**Dockerfile for Frontend:**
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public

RUN npm ci --only=production

EXPOSE 3000

CMD ["npm", "start"]
```

#### Deploy with Docker

```bash
# Build images
docker build -t service-request-backend ./backend
docker build -t service-request-frontend ./frontend

# Run with docker-compose
docker-compose up
```

## Environment Variables for Production

### Backend
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/service-board
NODE_ENV=production
```

### Frontend
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

## Database Considerations

### MongoDB Atlas (Cloud)
1. Create free cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create database and user
3. Whitelist IP addresses
4. Get connection string
5. Use in `MONGO_URI`

### Local MongoDB
- Install MongoDB locally
- Update `MONGO_URI` to: `mongodb://localhost:27017/service-board`
- Ensure MongoDB service is running

## Security Checklist

- [ ] Never commit `.env` files
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS (automatic with Vercel/Render)
- [ ] Set CORS properly for production domain
- [ ] Validate all inputs on backend
- [ ] Use strong MongoDB password
- [ ] Enable MongoDB IP whitelist
- [ ] Monitor application logs
- [ ] Set up error tracking (Sentry, etc.)

## Performance Optimization

### Frontend
```bash
# Build optimization
npm run build

# Analyze bundle
npm install -D @next/bundle-analyzer
```

### Backend
- Use connection pooling for MongoDB
- Add caching headers
- Enable gzip compression
- Monitor response times

## Monitoring & Logging

### Vercel
- Built-in analytics and error tracking
- Real-time logs in dashboard

### Render
- Built-in monitoring
- Email alerts for errors

### Third-party Options
- [Sentry.io](https://sentry.io) - Error tracking
- [DataDog](https://datadog.com) - Monitoring
- [LogRocket](https://logrocket.com) - Frontend monitoring

## Scaling Considerations

### Horizontal Scaling
- Backend is stateless (scales horizontally)
- Use load balancer
- Render/Railway handle this automatically

### Database Scaling
- MongoDB Atlas handles scaling
- Monitor collection size
- Add indexes if needed

## Backup Strategy

- MongoDB Atlas automatic backups (free tier: 7-day retention)
- Regular database exports
- Code backups via GitHub

## Update & Rollback

### Vercel
```bash
git push origin main
# Auto-deploys with GitHub integration
```

### Render
```bash
git push origin main
# Auto-deploys with GitHub integration
```

### Rollback
- Vercel/Render keep deployment history
- Easy one-click rollback in dashboard

## Cost Estimates (as of May 2026)

### Option 1: Vercel + Render + MongoDB Atlas
- **Vercel**: Free tier (or $20/month Pro)
- **Render**: Free tier (or $7/month basic)
- **MongoDB Atlas**: Free tier (512MB)
- **Total**: Free (for hobby) or ~$27/month (for pro)

### Option 2: All Railway
- **Railway**: $5-20/month depending on usage
- **Total**: ~$5-20/month

## Troubleshooting Deployment

### Backend not connecting to MongoDB
- Check connection string
- Verify IP is whitelisted in MongoDB Atlas
- Check credentials

### Frontend API calls failing
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings in backend
- Verify backend is running

### Vercel build fails
- Check Node version compatibility
- Verify all dependencies installed
- Check build output logs

### Render deployment keeps restarting
- Check logs for errors
- Verify environment variables
- Check resource limits

## Post-Deployment Checklist

- [ ] Test all features on production URL
- [ ] Test on different browsers/devices
- [ ] Verify database connections
- [ ] Monitor error logs
- [ ] Set up automated backups
- [ ] Configure email alerts
- [ ] Document deployment process
- [ ] Create runbook for troubleshooting

## Support

For issues:
1. Check deployment provider logs
2. Check application error messages
3. Review this guide's troubleshooting section
4. Contact deployment provider support

---

**Note**: This guide is for production deployment of the Service Request Board application.

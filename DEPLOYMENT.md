# 🚀 Vercel Deployment Guide

## ✅ Pre-Deployment Checklist

- [x] All code committed to GitHub
- [x] Build successful locally
- [x] No linter errors
- [x] All images present
- [x] Favicons configured
- [x] SEO metadata complete

## 📦 Vercel Import Settings

When importing from GitHub, use these settings:

### **Project Settings:**
```
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### **Environment Variables:**
None needed! ✅

### **Domain Settings (After Deployment):**
```
Production Domain: yourportfolio.vercel.app
Custom Domain: (optional) yourdomain.com
```

## 🔧 Post-Deployment Steps

### 1. Update Metadata Base URL
After deployment, update `src/app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://yourportfolio.vercel.app'),
  // ... rest stays the same
}
```

### 2. Update robots.txt
Update `public/robots.txt`:
```txt
Sitemap: https://yourportfolio.vercel.app/sitemap.xml
```

### 3. Test Everything
- [ ] Visit deployed site
- [ ] Test all 6 dev tools
- [ ] Test dark/light mode
- [ ] Test on mobile
- [ ] Test social sharing preview
- [ ] Check all links work

## 🎯 Vercel Automatic Features

Vercel automatically provides:
- ✅ HTTPS/SSL certificate
- ✅ Global CDN
- ✅ Image optimization
- ✅ Automatic deployments on git push
- ✅ Preview deployments for branches

## 📊 Performance Tips

Already implemented:
- ✅ Image optimization (AVIF/WebP)
- ✅ Code splitting
- ✅ Static generation
- ✅ Font optimization
- ✅ Compression enabled

## 🔗 Useful Vercel Commands

```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Deploy from command line
vercel --prod

# Check deployment status
vercel ls
```

## 🎉 You're All Set!

Your portfolio is ready for deployment. Just click "Deploy" in Vercel!

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**


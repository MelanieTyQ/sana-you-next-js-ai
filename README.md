# Lifefort Wellness Assessment — Next.js

A full-stack Next.js 15 wellness assessment app for Lifefort (Independent USANA Brand Partner).
Features 5 trackers, lead capture, and real AI-powered summaries via Claude.

---

## 🚀 Quick Start (localhost)

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.local.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY
```

### 3. Run development server
```bash
npm run dev
# Open http://localhost:3000
```

---

## 🗂️ Project Structure

```
lifefort-nextjs/
├── app/
│   ├── layout.tsx               # Root layout + fonts + metadata
│   ├── globals.css              # Tailwind + base styles
│   ├── page.tsx                 # Main wellness assessment (Client Component)
│   └── api/
│       ├── ai-summary/route.ts  # POST /api/ai-summary — AI wellness summary
│       ├── ask-ai/route.ts      # POST /api/ask-ai — Contextual Q&A
│       └── capture-lead/route.ts # POST /api/capture-lead — Email capture
├── lib/
│   └── trackers.ts              # All 5 tracker data + getTier() logic
├── next.config.ts               # Security headers, standalone output
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🌐 Deploy to Hostinger VPS

### Prerequisites
- Ubuntu 22.04 VPS
- Node.js 20+ installed
- PM2 + Nginx installed

### Steps

```bash
# 1. Upload project (or clone from Git)
git clone https://github.com/YOUR_REPO/lifefort-wellness.git /var/www/lifefort
cd /var/www/lifefort

# 2. Install and build
npm install
npm run build

# 3. Create .env.local
nano .env.local
# Add: ANTHROPIC_API_KEY=sk-ant-xxxx

# 4. Start with PM2
pm2 start npm --name "lifefort" -- start
pm2 save && pm2 startup
```

### Nginx Config
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/lifefort /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d yourdomain.com  # Free HTTPS
```

---

## 🔌 Email Integration

In `app/api/capture-lead/route.ts`, uncomment and configure either:
- **Resend** (recommended, free tier available): https://resend.com
- **Mailchimp**: Replace the commented block with your list ID + API key

---

## 🔐 Security Checklist

- [x] API key is server-side only (never in frontend)
- [x] Rate limiting on all AI API routes
- [x] Input sanitization (length limits, HTML stripping)
- [x] Security headers via next.config.ts
- [x] No runSelfTests() in production
- [ ] Add Upstash Redis rate limiting for production scale
- [ ] Add CAPTCHA to email capture form (optional)

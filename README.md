# ExpensAI – AI-Driven Expense Classification Platform

ExpensAI is a web-based automation tool designed to help CPA and accounting teams reduce manual work by automatically classifying expense transactions. Users can upload CSV/Excel files, review low-confidence predictions, correct categories, and generate clear summary reports. This project was developed as part of the PRG800 capstone.

---

## Project Purpose

ExpensAI automates the most repetitive parts of the expense review workflow. The system enables users to:

- Upload CSV/Excel expense files  
- Classify transactions using AI + rule-based logic  
- Detect low-confidence classifications that need attention  
- Manually adjust incorrect or uncertain predictions  
- Generate PDF/Excel cost-head summaries  
- Store results securely in a cloud database  

This workflow mirrors how modern accounting firms process expense sheets while improving accuracy and reducing processing time.

---

## Tech Stack

### Frontend  
- Next.js 16  
- React  
- TailwindCSS

### Backend  
- Next.js API Routes  
- Modular services for parsing, classification, reporting, and data storage  

### Database & Storage  
- Supabase Postgres  
- Supabase Storage  
- JSONB fields for AI classification output  

### AI / Classification  
- Local rule-based classifier  
- Optional external AI model via feature flag  

---

## 🚀 Running the Project Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

Now open the app in your browser:

http://localhost:3000

---

## 3. Create a .env.local File

Add your Supabase and AI credentials:

```
GROQ_API_KEY=your_groq_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
AI_PROVIDER=local
```

---

## Required Environment Variables

| Variable | Purpose |
|----------|---------|
| NEXT_PUBLIC_SUPABASE_URL | Connects the frontend to Supabase |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Secure public key for client operations |
| SUPABASE_SERVICE_ROLE_KEY | Privileged server-side key |
| GROQ_API_KEY | Used for optional AI classification |
| AI_PROVIDER | Switch between local/classic AI modes |

---

## Team Members

- Mirza Mohammad Ullah Sadi — Project Lead / Backend  
- Hasini — Technical Lead / Core Logic  
- Happy — UI/UX & Frontend  


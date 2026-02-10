# HRMS Lite

A lightweight Human Resource Management System built with Next.js, Tailwind CSS, and Supabase.

## Features

- **Employee Management**: Add, view, and delete employee records.
- **Attendance Management**: Mark daily attendance (Present/Absent) and view history.
- **Dashboard**: Quick overview of workforce stats.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Lucide Icons.
- **Backend**: Next.js API Routes.
- **Database**: Supabase (PostgreSQL).
- **UI Components**: Custom components inspired by shadcn/ui.

## Setup Instructions

### Prerequisites
- Node.js installed.
- A Supabase account and project.

### 1. Clone the repository
```bash
git clone <repository-url>
cd ethara_hrms
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Setup Database
Run the following SQL in your Supabase SQL Editor to create the necessary tables:

```sql
-- Create employees table
CREATE TABLE employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create attendance table
CREATE TABLE attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT CHECK (status IN ('Present', 'Absent')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(employee_id, date)
);
```

### 5. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Frontend (Vercel/Netlify)
1. Import the repository.
2. Add the Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the deployment settings.
3. Deploy.

### Backend
The backend is integral to the Next.js app and will be deployed automatically with the frontend.

# HRMS Lite

A lightweight, modern Human Resource Management System built with **Next.js 14**, **Tailwind CSS**, and **Supabase**. designed for efficiency and ease of use.

## Features

-   **Employee Management**:
    -   Add, view, and delete employee records.
    -   Track department and contact information.
-   **Attendance Management**:
    -   **Smart Navigation**: Easily switch between days with "Previous", "Next", and "Today" buttons.
    -   **Daily Marking**: Mark employees as 'Present' or 'Absent' instantly.
    -   **Visual Status**: Clear color-coded badges for attendance status.
-   **Data Export**:
    -   **Export Today's Data**: Download attendance records for the currently selected date.
    -   **Export All Attendance Data**: Download the complete attendance history in CSV format.
-   **Dashboard**:
    -   Quick overview of total employees and attendance stats.
-   **Modern UI/UX**:
    -   Clean, responsive design with hover effects and smooth transitions.
    -   Built with semantic HTML and accessible components.

## Tech Stack

-   **Framework**: Next.js 14, React, Tailwind CSS, Lucide Icons.
-   **Database**: Supabase (PostgreSQL).
-   **Utilities**: `date-fns` for date manipulation, `clsx` & `tailwind-merge` for styling.

## Setup Instructions

### Prerequisites

-   Node.js (v18+ recommended)
-   A Supabase account and project.

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

The application handles both frontend and backend logic (via Server Actions/API Routes).

1.  Import the repository to **Vercel** or **Netlify**.
2.  Add the Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the project settings.
3.  Deploy.

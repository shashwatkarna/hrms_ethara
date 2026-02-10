import { supabase } from '@/lib/supabase'
import { AttendanceClient } from './attendance-client'

export const revalidate = 0

// Helper to get formatted date string YYYY-MM-DD
function getTodayString() {
    return new Date().toISOString().split('T')[0]
}

export default async function AttendancePage({
    searchParams,
}: {
    searchParams: Promise<{ date?: string }>
}) {
    const { date: dateParam } = await searchParams
    const date = dateParam || getTodayString()

    // Parallel fetching
    const [employeesRes, attendanceRes] = await Promise.all([
        supabase.from('employees').select('*').order('created_at'),
        supabase.from('attendance').select('*').eq('date', date)
    ])

    const employees = employeesRes.data || []
    const attendance = attendanceRes.data || []

    return (
        <div className="container mx-auto py-10 max-w-7xl px-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
                <p className="text-muted-foreground">Mark and view daily attendance records.</p>
            </div>

            <AttendanceClient
                employees={employees}
                attendance={attendance}
                date={date}
            />
        </div>
    )
}

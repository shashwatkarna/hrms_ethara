import Link from 'next/link'
import { Users, UserCheck, UserX, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const revalidate = 0

async function getStats() {
  const today = new Date().toISOString().split('T')[0]

  const [
    { count: totalEmployees },
    { count: presentToday },
    { count: absentToday }
  ] = await Promise.all([
    supabase.from('employees').select('*', { count: 'exact', head: true }),
    supabase.from('attendance').select('*', { count: 'exact', head: true }).eq('date', today).eq('status', 'Present'),
    supabase.from('attendance').select('*', { count: 'exact', head: true }).eq('date', today).eq('status', 'Absent')
  ])

  return {
    totalEmployees: totalEmployees || 0,
    presentToday: presentToday || 0,
    absentToday: absentToday || 0
  }
}

export default async function DashboardPage() {
  const stats = await getStats()

  return (
    <div className="container mx-auto py-10 max-w-7xl px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Overview of your organization for today.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/attendance">
              <Calendar className="mr-2 h-4 w-4" />
              Mark Attendance
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/employees">
              <Users className="mr-2 h-4 w-4" />
              Manage Employees
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              Registered in the system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Present Today
            </CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.presentToday}</div>
            <p className="text-xs text-muted-foreground">
              Marked as present
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Absent Today
            </CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.absentToday}</div>
            <p className="text-xs text-muted-foreground">
              Marked as absent
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <div className="bg-card rounded-lg border p-8 text-center shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Welcome to HRMS Lite</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Get started by adding employees to the system or marking attendance for today.
            Use the navigation bar to access different sections.
          </p>
        </div>
      </div>
    </div>
  )
}

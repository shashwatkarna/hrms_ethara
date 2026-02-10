import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Mail, Building, User } from 'lucide-react'
import { format } from 'date-fns'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export const revalidate = 0

export default async function EmployeeDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    // Fetch employee details
    const { data: employee } = await supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .single()

    if (!employee) {
        notFound()
    }

    // Fetch attendance history
    const { data: attendance } = await supabase
        .from('attendance')
        .select('*')
        .eq('employee_id', id)
        .order('date', { ascending: false })

    const totalPresent = attendance?.filter(r => r.status === 'Present').length || 0
    const totalAbsent = attendance?.filter(r => r.status === 'Absent').length || 0

    return (
        <div className="container mx-auto py-10 max-w-7xl px-4">
            <div className="mb-6">
                <Button variant="ghost" asChild className="mb-4 pl-0 hover:bg-transparent hover:text-primary">
                    <Link href="/employees" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Employees
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">{employee.first_name} {employee.last_name}</h1>
                <p className="text-muted-foreground">Employee Profile & Attendance History</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-8">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Department</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-lg font-semibold">
                            <Building className="h-5 w-5 text-primary" />
                            {employee.department}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Email</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-lg font-semibold truncate" title={employee.email}>
                            <Mail className="h-5 w-5 text-primary" />
                            {employee.email}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Joined</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-lg font-semibold">
                            <Calendar className="h-5 w-5 text-primary" />
                            {format(new Date(employee.created_at), 'MMM do, yyyy')}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="flex justify-between items-center border-b pb-2">
                            <span className="text-sm">Total Present</span>
                            <span className="font-bold text-green-600">{totalPresent}</span>
                        </div>
                        <div className="flex justify-between items-center border-b pb-2">
                            <span className="text-sm">Total Absent</span>
                            <span className="font-bold text-red-600">{totalAbsent}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm">Total Days</span>
                            <span className="font-bold">{(attendance?.length || 0)}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-3">
                    <CardHeader>
                        <CardTitle>Attendance History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Day</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {!attendance || attendance.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                            No attendance records found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    attendance.map((record) => (
                                        <TableRow key={record.id}>
                                            <TableCell className="font-medium">
                                                {format(new Date(record.date), 'MMM do, yyyy')}
                                            </TableCell>
                                            <TableCell>
                                                {record.status === 'Present' ? (
                                                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                        Present
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                                                        Absent
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right text-muted-foreground text-sm">
                                                {format(new Date(record.date), 'EEEE')}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

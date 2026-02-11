'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { format, addDays, subDays } from 'date-fns'
import { Check, X, Loader2, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExportButton } from "@/components/export-button";
import { cn } from '@/lib/utils'

interface Employee {
    id: string
    first_name: string
    last_name: string
    department: string
}

interface AttendanceRecord {
    employee_id: string
    status: 'Present' | 'Absent'
    date: string // Ensure date is part of the record for history export
}

interface AttendanceClientProps {
    employees: Employee[]
    attendance: AttendanceRecord[]
    date: string
}

export function AttendanceClient({ employees, attendance: initialData, date }: AttendanceClientProps) {
    const router = useRouter()
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({})

    // attendanceMap for quick lookup
    const attendanceMap = new Map(initialData.map((r: AttendanceRecord) => [r.employee_id, r.status]))

    const updateDate = (newDate: string) => {
        router.push(`/attendance?date=${newDate}`)
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateDate(e.target.value)
    }

    const handlePrevDay = () => {
        const prevDate = subDays(new Date(date), 1)
        updateDate(format(prevDate, 'yyyy-MM-dd'))
    }

    const handleNextDay = () => {
        const nextDate = addDays(new Date(date), 1)
        updateDate(format(nextDate, 'yyyy-MM-dd'))
    }

    const handleToday = () => {
        updateDate(format(new Date(), 'yyyy-MM-dd'))
    }

    const markAttendance = async (employeeId: string, status: 'Present' | 'Absent') => {
        setLoadingMap(prev => ({ ...prev, [employeeId]: true }))
        try {
            const res = await fetch('/api/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employee_id: employeeId, date, status }),
            })

            if (!res.ok) throw new Error('Failed to mark attendance')

            router.refresh()
        } catch (err) {
            console.error(err)
            alert('Failed to update status')
        } finally {
            setLoadingMap(prev => ({ ...prev, [employeeId]: false }))
        }
    }

    const fetchAllAttendance = async () => {
        const { data, error } = await supabase
            .from('attendance')
            .select('*')
            .order('date', { ascending: false })

        if (error) {
            console.error('Error fetching attendance history:', error)
            throw error
        }

        return (data || []).map((r: any) => {
            const emp = employees.find(e => e.id === r.employee_id)
            return {
                Date: r.date,
                Name: emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown',
                Department: emp?.department || 'N/A',
                Status: r.status
            }
        })
    }

    return (
        <div>
            <Card className="mb-6">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
                    <CardTitle className="text-xl font-bold">Attendance Management</CardTitle>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <ExportButton
                            data={initialData.map((r: AttendanceRecord) => {
                                const emp = employees.find(e => e.id === r.employee_id)
                                return {
                                    Date: date,
                                    Name: emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown',
                                    Department: emp?.department || 'N/A',
                                    Status: r.status
                                }
                            })}
                            filename={`attendance_${date}.csv`}
                            label="Export today's data"
                            className="w-full sm:w-auto"
                        />
                        <ExportButton
                            fetchData={fetchAllAttendance}
                            filename={`attendance_history_${format(new Date(), 'yyyy-MM-dd')}.csv`}
                            label="Export All Attendance Data"
                            className="w-full sm:w-auto"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 bg-card p-2 rounded-lg border shadow-sm">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handlePrevDay}
                                title="Previous Day"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <div className="relative">
                                <Input
                                    type="date"
                                    value={date}
                                    onChange={handleDateChange}
                                    className="w-[150px] border-none shadow-none focus-visible:ring-0 px-2 text-center font-medium"
                                />
                            </div>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleNextDay}
                                title="Next Day"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold text-foreground/80 hidden sm:inline-block">
                                {format(new Date(date), 'EEEE, MMMM do, yyyy')}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleToday}
                                className="ml-2"
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                Today
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="border rounded-md bg-background">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employees.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">No employees found.</TableCell>
                            </TableRow>
                        ) : (
                            employees.map((emp) => {
                                const status = attendanceMap.get(emp.id)
                                const isLoading = loadingMap[emp.id]

                                return (
                                    <TableRow key={emp.id}>
                                        <TableCell className="font-medium">{emp.first_name} {emp.last_name}</TableCell>
                                        <TableCell>{emp.department}</TableCell>
                                        <TableCell>
                                            {status === 'Present' && (
                                                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                    Present
                                                </span>
                                            )}
                                            {status === 'Absent' && (
                                                <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                                                    Absent
                                                </span>
                                            )}
                                            {!status && (
                                                <span className="text-muted-foreground text-sm italic">Not Marked</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant={status === 'Present' ? "default" : "outline"}
                                                    className={cn(status === 'Present' && "bg-green-600 hover:bg-green-700")}
                                                    onClick={() => markAttendance(emp.id, 'Present')}
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                                                    Present
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant={status === 'Absent' ? "default" : "outline"}
                                                    className={cn(status === 'Absent' && "bg-red-600 hover:bg-red-700")}
                                                    onClick={() => markAttendance(emp.id, 'Absent')}
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4 mr-1" />}
                                                    Absent
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

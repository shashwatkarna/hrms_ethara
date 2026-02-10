'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Trash2, Eye } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface Employee {
    id: string
    first_name: string
    last_name: string
    email: string
    department: string
    created_at: string
}

interface EmployeeListProps {
    employees: Employee[]
}

export function EmployeeList({ employees }: EmployeeListProps) {
    const router = useRouter()

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this employee?')) return

        try {
            const res = await fetch(`/api/employees/${id}`, {
                method: 'DELETE',
            })

            if (!res.ok) {
                throw new Error('Failed to delete')
            }

            router.refresh()
        } catch (err) {
            alert('Error deleting employee')
            console.error(err)
        }
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {employees.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                            No employees found. Add one to get started.
                        </TableCell>
                    </TableRow>
                ) : (
                    employees.map((employee) => (
                        <TableRow key={employee.id}>
                            <TableCell className="font-medium">
                                {employee.first_name} {employee.last_name}
                            </TableCell>
                            <TableCell>{employee.email}</TableCell>
                            <TableCell>{employee.department}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={`/employees/${employee.id}`}>
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => handleDelete(employee.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    )
}

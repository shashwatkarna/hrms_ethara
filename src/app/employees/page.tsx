import { supabase } from '@/lib/supabase'
import { AddEmployeeDialog } from "./add-employee-dialog"
import { EmployeeList } from "./employee-list"

// Opt-out of caching for this page to always get fresh data on navigation
export const revalidate = 0

export default async function EmployeesPage() {
    const { data: employees } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="container mx-auto py-10 max-w-7xl px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
                    <p className="text-muted-foreground">Manage your organization's workforce.</p>
                </div>
                <AddEmployeeDialog />
            </div>

            <div className="border rounded-md">
                <EmployeeList employees={employees || []} />
            </div>
        </div>
    )
}

import Link from 'next/link'
import { Button } from './ui/button'

export function Navbar() {
    return (
        <nav className="border-b bg-background">
            <div className="flex h-16 items-center px-4 max-w-7xl mx-auto container">
                <Link href="/" className="font-bold text-xl flex items-center gap-2">
                    <span className="text-primary">HRMS</span> Lite
                </Link>
                <div className="ml-auto flex items-center gap-4">
                    <Link href="/employees" className="text-sm font-medium hover:underline underline-offset-4">
                        Employees
                    </Link>
                    <Link href="/attendance" className="text-sm font-medium hover:underline underline-offset-4">
                        Attendance
                    </Link>
                    <Button variant="outline" size="sm" className="hover:bg-background cursor-default hover:text-foreground">
                        Admin
                    </Button>
                </div>
            </div>
        </nav>
    )
}

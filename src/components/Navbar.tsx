import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from './ui/button'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./ui/sheet"

export function Navbar() {
    return (
        <nav className="border-b bg-background">
            <div className="flex h-16 items-center px-4 max-w-7xl mx-auto container">
                <Link href="/" className="font-bold text-xl flex items-center gap-2">
                    <span className="text-primary">HRMS</span> Lite
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex ml-auto items-center gap-4">
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

                {/* Mobile Navigation */}
                <div className="ml-auto md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <SheetHeader>
                                <SheetTitle>HRMS Lite</SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-4 mt-6">
                                <Link href="/employees" className="text-lg font-medium hover:text-primary">
                                    Employees
                                </Link>
                                <Link href="/attendance" className="text-lg font-medium hover:text-primary">
                                    Attendance
                                </Link>
                                <Button variant="outline" size="sm" className="w-full justify-start">
                                    Admin
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    )
}

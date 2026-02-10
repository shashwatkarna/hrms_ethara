'use client'

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface ExportButtonProps {
    data: any[]
    filename?: string
}

export function ExportButton({ data, filename = 'export.csv' }: ExportButtonProps) {
    const handleExport = () => {
        if (!data || data.length === 0) {
            alert('No data to export')
            return
        }

        // Get headers from first object
        const headers = Object.keys(data[0])
        const csvContent = [
            headers.join(','), // Header row
            ...data.map(row => headers.map(header => {
                const value = row[header]
                // Handle nested objects or strings with commas
                if (typeof value === 'object' && value !== null) {
                    return `"${JSON.stringify(value).replace(/"/g, '""')}"`
                }
                return `"${String(value).replace(/"/g, '""')}"`
            }).join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob)
            link.setAttribute('href', url)
            link.setAttribute('download', filename)
            link.style.visibility = 'hidden'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    return (
        <Button variant="outline" size="sm" onClick={handleExport} className="flex gap-2">
            <Download className="h-4 w-4" />
            Export CSV
        </Button>
    )
}

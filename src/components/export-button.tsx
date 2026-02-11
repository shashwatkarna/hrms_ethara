'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

interface ExportButtonProps {
    data?: any[]
    fetchData?: () => Promise<any[]>
    filename?: string
    label?: string
    className?: string
}

export function ExportButton({ data, fetchData, filename = 'export.csv', label = 'Export CSV', className }: ExportButtonProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleExport = async () => {
        setIsLoading(true)
        try {
            let exportData = data

            if (fetchData) {
                exportData = await fetchData()
            }

            if (!exportData || exportData.length === 0) {
                alert('No data to export')
                return
            }

            // Get headers from first object
            const headers = Object.keys(exportData[0])
            const csvContent = [
                headers.join(','), // Header row
                ...exportData.map(row => headers.map(header => {
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
        } catch (error) {
            console.error('Export failed:', error)
            alert('Failed to export data')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className={cn("flex gap-2", className)}
            disabled={isLoading}
        >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {label}
        </Button>
    )
}

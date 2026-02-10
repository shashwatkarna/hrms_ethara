import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const employeeId = searchParams.get('employeeId')

    let query = supabase
        .from('attendance')
        .select('*, employees(first_name, last_name, department)')
        .order('date', { ascending: false })

    if (date) {
        query = query.eq('date', date)
    }

    if (employeeId) {
        query = query.eq('employee_id', employeeId)
    }

    const { data, error } = await query

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}

export async function POST(request: Request) {
    try {
        const json = await request.json()
        const { employee_id, date, status } = json

        if (!employee_id || !date || !status) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        if (!['Present', 'Absent'].includes(status)) {
            return NextResponse.json(
                { error: "Status must be either 'Present' or 'Absent'" },
                { status: 400 }
            )
        }

        // Upsert attendance record
        const { data, error } = await supabase
            .from('attendance')
            .upsert(
                { employee_id, date, status },
                { onConflict: 'employee_id,date' }
            )
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data, { status: 201 })
    } catch (err) {
        return NextResponse.json(
            { error: 'Invalid request body' },
            { status: 400 }
        )
    }
}

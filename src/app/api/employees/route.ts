import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
    const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}

export async function POST(request: Request) {
    try {
        const json = await request.json()
        const { first_name, last_name, email, department } = json

        // Basic validation
        if (!first_name || !last_name || !email || !department) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Strict email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            )
        }

        // Check for duplicate email
        const { data: existing } = await supabase
            .from('employees')
            .select('id')
            .eq('email', email)
            .single()

        if (existing) {
            return NextResponse.json(
                { error: 'Employee with this email already exists' },
                { status: 409 }
            )
        }

        const { data, error } = await supabase
            .from('employees')
            .insert([{ first_name, last_name, email, department }])
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

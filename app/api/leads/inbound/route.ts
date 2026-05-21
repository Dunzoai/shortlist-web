import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      source = 'website_form',
      parent_name,
      email,
      phone,
      child_name,
      child_grade,
      subjects,
      notes,
      preferred_schedule,
      location,
    } = body;

    // Validate required fields
    if (!parent_name || (!email && !phone)) {
      return NextResponse.json(
        { error: 'Parent name and at least one contact method (email or phone) are required.' },
        { status: 400 }
      );
    }

    // Build the message from the intake data
    const subjectList = subjects?.length ? `Subjects: ${subjects.join(', ')}` : '';
    const gradeLine = child_grade ? `Grade: ${child_grade}` : '';
    const scheduleLine = preferred_schedule ? `Preferred schedule: ${preferred_schedule}` : '';
    const locationLine = location ? `Format: ${location}` : '';
    const notesLine = notes ? `Notes: ${notes}` : '';

    const message = [subjectList, gradeLine, scheduleLine, locationLine, notesLine]
      .filter(Boolean)
      .join('\n');

    const { data, error } = await supabase.from('leads').insert({
      source,
      parent_name,
      email: email || null,
      phone: phone || null,
      child_name: child_name || null,
      child_grade: child_grade || null,
      subjects: subjects || [],
      preferred_schedule: preferred_schedule || null,
      location: location || null,
      notes: notes || null,
      message,
      status: 'new',
      unread: true,
      client_slug: 'growwithgia',
    }).select().single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to save lead.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch (err) {
    console.error('Lead inbound error:', err);
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}

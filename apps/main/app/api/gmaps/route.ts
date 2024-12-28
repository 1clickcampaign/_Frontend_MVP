import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { GoogleMapsLead } from '@/types/database';

export async function POST(request: Request) {
  try {
    // Initialize Supabase client and verify user
    const supabase = createClient();
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { query, max_leads, fields = [
      "name",
      "formatted_address",
      "formatted_phone_number",
      "website",
      "rating",
      "user_ratings_total",
      "business_status",
    ] } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Queue the task using the Supabase JWT token
    const queueResponse = await fetch(`http://localhost:8000/leads/google_maps/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ 
        query, 
        max_leads: max_leads || 100,
        fields 
      }),
    });

    if (!queueResponse.ok) {
      const errorData = await queueResponse.json();
      console.error('Error response from API:', errorData);
      return NextResponse.json({ error: errorData.detail || 'Failed to queue task' }, { status: queueResponse.status });
    }

    const taskData = await queueResponse.json();
    const taskId = taskData.task_id;

    // Poll for results using the same token
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds timeout
    
    while (attempts < maxAttempts) {
      const statusResponse = await fetch(`http://localhost:8000/leads/google_maps/status/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!statusResponse.ok) {
        const errorData = await statusResponse.json();
        console.error('Error checking task status:', errorData);
        return NextResponse.json({ error: errorData.detail || 'Failed to check task status' }, { status: statusResponse.status });
      }

      const statusData = await statusResponse.json();
      
      if (statusData.status === 'completed') {
        // Check if result exists and is an array
        if (!Array.isArray(statusData.result)) {
          console.error('Invalid results format:', statusData);
          return NextResponse.json({ error: 'Invalid results format from API' }, { status: 500 });
        }

        // Clean and transform the data before sending it to the client
        const cleanResults = statusData.result.map((lead: any) => {
          // Create a base object with required fields
          const cleanLead: GoogleMapsLead = {
            id: lead.id,
            name: lead.name,
            business_phone: lead.business_phone || '',
            formatted_address: lead.formatted_address || '',
            website: lead.website || '',
            rating: lead.rating || 0,
            user_ratings_total: lead.user_ratings_total || 0,
            types: lead.types || [],
            business_status: lead.business_status || '',
            latitude: lead.latitude || 0,
            longitude: lead.longitude || 0
          };

          // Only add optional fields if they exist and are valid
          if (lead.additional_properties) {
            cleanLead.additional_properties = lead.additional_properties;
          }
          if (lead.images) {
            cleanLead.images = lead.images;
          }
          if (lead.reviews) {
            cleanLead.reviews = lead.reviews;
          }
          if (lead.similar_businesses) {
            cleanLead.similar_businesses = lead.similar_businesses;
          }
          if (lead.about) {
            cleanLead.about = lead.about;
          }

          return cleanLead;
        });

        return NextResponse.json(cleanResults);
      } else if (statusData.status === 'failed') {
        return NextResponse.json({ error: 'Task failed' }, { status: 500 });
      }

      // Wait 1 second before next attempt
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    return NextResponse.json({ error: 'Task timeout' }, { status: 408 });
  } catch (error) {
    console.error('Error in /api/gmaps route:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const TO_EMAIL = 'dmeyers.wakekite@gmail.com';

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const data = await req.json();
    const { type } = data;

    if (!data.name || typeof data.name !== 'string' || data.name.length > 200) {
      return new Response(
        JSON.stringify({ error: 'Invalid name' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!data.email || typeof data.email !== 'string' || data.email.length > 200) {
      return new Response(
        JSON.stringify({ error: 'Invalid email' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (type === 'project') {
      if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
        return new Response(
          JSON.stringify({ error: 'Description is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (data.description.length > 5000) {
        return new Response(
          JSON.stringify({ error: 'Description too long (max 5000 characters)' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (!data.projectType || typeof data.projectType !== 'string') {
        return new Response(
          JSON.stringify({ error: 'Project type is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else if (type === 'consultation') {
      if (!data.message || typeof data.message !== 'string' || data.message.trim().length === 0) {
        return new Response(
          JSON.stringify({ error: 'Message is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (data.message.length > 5000) {
        return new Response(
          JSON.stringify({ error: 'Message too long (max 5000 characters)' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid submission type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let emailHtml = '';
    let subject = '';

    if (type === 'project') {
      subject = `New Project Inquiry from ${escapeHtml(data.name)}`;
      emailHtml = `
        <h2>New Project Inquiry</h2>
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        ${data.company ? `<p><strong>Company:</strong> ${escapeHtml(data.company)}</p>` : ''}
        <p><strong>Project Type:</strong> ${escapeHtml(data.projectType)}</p>
        <p><strong>Project Description:</strong></p>
        <p>${escapeHtml(data.description).replace(/\n/g, '<br>')}</p>
      `;
    } else if (type === 'consultation') {
      subject = `New Contact from ${escapeHtml(data.name)}`;

      if (data.topicsOfInterest && data.engagementType) {
        const topics = data.topicsOfInterest?.map((t: string) => escapeHtml(t)).join(', ') || 'None selected';
        emailHtml = `
          <h2>New Consultation Request</h2>
          <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
          ${data.company ? `<p><strong>Company:</strong> ${escapeHtml(data.company)}</p>` : ''}
          <p><strong>Topics of Interest:</strong> ${topics}</p>
          <p><strong>Engagement Type:</strong> ${escapeHtml(data.engagementType)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>
        `;
      } else {
        emailHtml = `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>
        `;
      }
    }

    if (RESEND_API_KEY) {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Sacred Machines <onboarding@resend.dev>',
          to: [TO_EMAIL],
          subject: subject,
          html: emailHtml,
        }),
      });

      if (!resendResponse.ok) {
        const error = await resendResponse.text();
        throw new Error(`Resend API error: ${error}`);
      }
    } else {
      console.log('Email would be sent:');
      console.log('To:', TO_EMAIL);
      console.log('Subject:', subject);
      console.log('Body:', emailHtml);
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
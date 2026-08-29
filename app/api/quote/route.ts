import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const { contact, configuration } = payload;

    const htmlContent = `
      <h2>New Quote Request</h2>
      <p><strong>Name:</strong> ${contact.name}</p>
      <p><strong>Email:</strong> ${contact.email}</p>
      <p><strong>Phone:</strong> ${contact.phone}</p>
      
      <h3>Configuration Details</h3>
      <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px;"><strong>Back Wall</strong></td>
          <td style="padding: 8px;">${configuration.backWall}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px;"><strong>Side Walls</strong></td>
          <td style="padding: 8px;">${configuration.sideWalls}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px;"><strong>Floor</strong></td>
          <td style="padding: 8px;">${configuration.floor}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px;"><strong>Ceiling</strong></td>
          <td style="padding: 8px;">${configuration.ceiling}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px;"><strong>Doors</strong></td>
          <td style="padding: 8px;">${configuration.doors}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px;"><strong>COP Style</strong></td>
          <td style="padding: 8px;">${configuration.copStyle} - ${configuration.copInterface} (${configuration.copPlacement})</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px;"><strong>Handrails</strong></td>
          <td style="padding: 8px;">${configuration.handrails} (${configuration.handrailLocation})</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px;"><strong>Lighting</strong></td>
          <td style="padding: 8px;">${configuration.lighting}</td>
        </tr>
      </table>
    `;

    // Only attempt to send if a real API key is present
    if (process.env.RESEND_API_KEY) {
      const data = await resend.emails.send({
        from: 'Configurator <onboarding@resend.dev>',
        to: ['sales@bayern.qa'],
        subject: `New Elevator Quote Request from ${contact.name}`,
        html: htmlContent,
      });

      return NextResponse.json({ success: true, data });
    } else {
      console.warn("RESEND_API_KEY is not set. Simulating email send.");
      console.log(htmlContent);
      return NextResponse.json({ success: true, simulated: true });
    }

  } catch (error) {
    console.error('Quote submission error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { to, message, type } = body;

        // Validate required fields
        if (!to || !message) {
            return NextResponse.json(
                { error: 'Missing required fields: to, message' },
                { status: 400 }
            );
        }

        // Check if Twilio is configured
        if (!accountSid || !authToken || !fromPhone) {
            console.warn('Twilio credentials not configured - SMS not sent');
            return NextResponse.json(
                { success: true, message: 'SMS skipped (Twilio not configured)' },
                { status: 200 }
            );
        }

        // Only send SMS for critical updates to avoid spam
        if (type !== 'critical') {
            return NextResponse.json(
                { success: true, message: 'SMS skipped (non-critical update)' },
                { status: 200 }
            );
        }

        // Create Twilio client
        const client = twilio(accountSid, authToken);

        // Format phone number
        let formattedPhone = to;
        if (!to.startsWith('+')) {
            // Remove leading 0 and add Nigeria country code as default
            const digits = to.replace(/\D/g, '');
            formattedPhone = '+234' + (digits.startsWith('0') ? digits.slice(1) : digits);
        }

        // Send SMS
        const twilioMessage = await client.messages.create({
            body: message,
            from: fromPhone,
            to: formattedPhone,
        });

        return NextResponse.json({
            success: true,
            messageId: twilioMessage.sid,
        });
    } catch (error) {
        console.error('SMS API error:', error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}

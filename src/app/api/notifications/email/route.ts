import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Lazily initialize Resend to avoid build-time crash when API key is missing
let _resend: Resend | null = null;
function getResend() {
    if (!_resend && process.env.RESEND_API_KEY) {
        _resend = new Resend(process.env.RESEND_API_KEY);
    }
    return _resend;
}

// Email templates
const templates = {
    shipment_update: (data: Record<string, string | number>) => ({
        subject: `Shipment Update: ${data.shipmentId}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #003399 0%, #4196FF 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
                    .header h1 { color: white; margin: 0; font-size: 24px; }
                    .content { background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; }
                    .status-badge { display: inline-block; padding: 8px 16px; background: #FFCA00; color: #003399; border-radius: 20px; font-weight: bold; }
                    .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
                    .button { display: inline-block; padding: 12px 24px; background: #003399; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>✈️ Cargofly</h1>
                    </div>
                    <div class="content">
                        <h2>Shipment Status Update</h2>
                        <p>Your shipment <strong>${data.shipmentId}</strong> has been updated.</p>
                        
                        <p style="margin: 20px 0;">
                            <span class="status-badge">${data.status}</span>
                        </p>
                        
                        <p>Updated at: ${new Date(data.timestamp as string).toLocaleString()}</p>
                        
                        <p style="margin-top: 30px;">
                            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://cargofly.app'}/dashboard/shipments/${(data.shipmentId as string).replace('#', '').replace('CF-', '')}" class="button">
                                Track Shipment
                            </a>
                        </p>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} Cargofly - Caverton Cargo Division</p>
                        <p>Premium Aviation Logistics</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    }),

    shipment_delivered: (data: Record<string, string | number>) => ({
        subject: `🎉 Shipment Delivered: ${data.shipmentId}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
                    .header h1 { color: white; margin: 0; font-size: 24px; }
                    .content { background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; }
                    .success-icon { font-size: 48px; text-align: center; }
                    .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>✈️ Cargofly</h1>
                    </div>
                    <div class="content">
                        <div class="success-icon">✅</div>
                        <h2 style="text-align: center;">Shipment Delivered!</h2>
                        <p style="text-align: center;">Your shipment <strong>${data.shipmentId}</strong> has been successfully delivered.</p>
                        
                        <p style="text-align: center; color: #64748b;">
                            Delivered at: ${new Date(data.timestamp as string).toLocaleString()}
                        </p>
                        
                        <p style="text-align: center; margin-top: 20px; color: #64748b;">
                            Thank you for choosing Cargofly!
                        </p>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} Cargofly - Caverton Cargo Division</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    }),

    welcome: (data: Record<string, string | number>) => ({
        subject: 'Welcome to Cargofly! ✈️',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #003399 0%, #4196FF 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0; }
                    .header h1 { color: white; margin: 0; font-size: 28px; }
                    .content { background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; }
                    .button { display: inline-block; padding: 14px 28px; background: #003399; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; }
                    .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to Cargofly! ✈️</h1>
                    </div>
                    <div class="content">
                        <h2>Hello ${data.name || 'there'}!</h2>
                        <p>Thank you for joining Cargofly - Nigeria's premier aviation cargo logistics platform.</p>
                        
                        <p>With your new account, you can:</p>
                        <ul>
                            <li>📦 Book shipments across West Africa</li>
                            <li>📍 Track packages in real-time</li>
                            <li>📊 Access detailed shipping analytics</li>
                            <li>💳 Manage invoices and payments</li>
                        </ul>
                        
                        <p style="text-align: center; margin-top: 30px;">
                            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://cargofly.app'}/dashboard" class="button">
                                Go to Dashboard
                            </a>
                        </p>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} Cargofly - Caverton Cargo Division</p>
                        <p>Premium Aviation Logistics</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    }),

    payment_received: (data: Record<string, string | number>) => ({
        subject: `Payment Received - Invoice ${data.invoiceId}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #003399 0%, #4196FF 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
                    .header h1 { color: white; margin: 0; font-size: 24px; }
                    .content { background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; }
                    .amount { font-size: 32px; font-weight: bold; color: #22c55e; text-align: center; }
                    .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>✈️ Cargofly</h1>
                    </div>
                    <div class="content">
                        <h2>Payment Received</h2>
                        <p>Thank you! We've received your payment for Invoice <strong>${data.invoiceId}</strong>.</p>
                        
                        <p class="amount">$${data.amount}</p>
                        
                        <p style="text-align: center; color: #64748b;">
                            Processed on: ${new Date(data.timestamp as string).toLocaleString()}
                        </p>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} Cargofly - Caverton Cargo Division</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    }),
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { to, subject, template, data } = body;

        // Validate required fields
        if (!to || !template) {
            return NextResponse.json(
                { error: 'Missing required fields: to, template' },
                { status: 400 }
            );
        }

        // Check if Resend API key is configured
        if (!process.env.RESEND_API_KEY) {
            console.warn('RESEND_API_KEY not configured - email not sent');
            return NextResponse.json(
                { success: true, message: 'Email skipped (API key not configured)' },
                { status: 200 }
            );
        }

        // Get template content
        const templateFn = templates[template as keyof typeof templates];
        if (!templateFn) {
            return NextResponse.json(
                { error: `Unknown template: ${template}` },
                { status: 400 }
            );
        }

        const emailContent = templateFn(data || {});

        // Send email via Resend
        const resend = getResend();
        if (!resend) {
            return NextResponse.json(
                { success: true, message: 'Email skipped (Resend not initialized)' },
                { status: 200 }
            );
        }
        const { data: emailData, error } = await resend.emails.send({
            from: process.env.EMAIL_FROM || 'Cargofly <notifications@resend.dev>',
            to: [to],
            subject: subject || emailContent.subject,
            html: emailContent.html,
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            messageId: emailData?.id,
        });
    } catch (error) {
        console.error('Email API error:', error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}

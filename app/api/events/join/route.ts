import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
    try {
        const data = await req.json()
        const { name, email, eventName, eventDate, eventTime } = data
        if (!data.email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            )
        }

        // Create a transporter using your email service provider's SMTP details
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.NODE_MAILER_USER,
                pass: process.env.NODE_MAILER_PASSWORD,
            },
        })

        // Define the email options
        const mailOptions = {
            from: '"AirDND event booked" <support@airdnd.ai>', // Sender address
            to: data.email,
            subject: 'Event booked',
            text: `Hi ${name},\n\nYou have successfully joined the event. Here are the event details:\n\nEvent Name: ${eventName}\nDate: ${eventDate}\nTime: ${eventTime}\n\nThank you for joining!`, // Plain text body
            html: `<p>Hi ${data.name},</p><p>You have successfully joined the event. Here are the event details:</p><ul><li><strong>Event Name:</strong> ${eventName}</li><li><strong>Date:</strong> ${eventDate}</li><li><strong>Time:</strong> ${eventTime}</li></ul><p>Thank you for joining!</p>`, // HTML body
        }

        // Send the email
        await transporter.sendMail(mailOptions)

        return NextResponse.json(
            { message: 'Email sent successfully!' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error sending email:', error)
        return NextResponse.json(
            { error: 'Error sending email' },
            { status: 500 }
        )
    }
}

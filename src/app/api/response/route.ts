import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import nodemailer from "nodemailer";

const DATA = path.join(process.cwd(), "responses.json");

async function sendEmail(feeling: string, message: string) {
    const apiKey = process.env.BREVO_API_KEY;
    const smtpKey = process.env.BREVO_SMTP_KEY;
    const toEmail = process.env.NOTIFICATION_EMAIL || "madhwaniarman@gmail.com";

    if (!apiKey && !smtpKey) {
        console.warn("No Brevo keys set — skipping email");
        return;
    }

    const feelingLabels: Record<string, string> = {
        "hurt": "💔 Hurt",
        "upset": "😔 Upset",
        "okay": "🌿 Okay",
        "need-time": "🕊 Need time",
        "want-to-talk": "💬 Want to talk",
    };

    const feelingDisplay = feelingLabels[feeling] || feeling;
    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    const htmlContent = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; background: #0c1222; color: #f5f0e8; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, rgba(94,234,212,0.15), rgba(139,92,246,0.1)); padding: 32px 28px 20px;">
        <h1 style="font-size: 22px; font-weight: 400; margin: 0 0 4px; color: #5eead4;">☽ Nandini responded</h1>
        <p style="font-size: 13px; color: rgba(245,240,232,0.4); margin: 0;">${timestamp}</p>
      </div>
      <div style="padding: 28px;">
        <div style="margin-bottom: 20px;">
          <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(94,234,212,0.5); margin: 0 0 6px;">How she's feeling</p>
          <p style="font-size: 18px; margin: 0; color: #f5f0e8;">${feelingDisplay}</p>
        </div>
        <div style="margin-bottom: 20px;">
          <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(94,234,212,0.5); margin: 0 0 6px;">Her message</p>
          <div style="background: rgba(245,240,232,0.04); border: 1px solid rgba(94,234,212,0.12); border-radius: 10px; padding: 16px;">
            <p style="font-size: 15px; line-height: 1.7; margin: 0; color: rgba(245,240,232,0.8); white-space: pre-wrap;">${message}</p>
          </div>
        </div>
        <div style="border-top: 1px solid rgba(94,234,212,0.08); padding-top: 16px;">
          <p style="font-size: 12px; color: rgba(245,240,232,0.2); margin: 0; text-align: center;">✦ for Nandini</p>
        </div>
      </div>
    </div>
  `;

    const brevoLogin = process.env.BREVO_LOGIN || toEmail;

    // Try Brevo REST API v3 first
    if (apiKey) {
        try {
            const res = await fetch("https://api.brevo.com/v3/smtp/email", {
                method: "POST",
                headers: {
                    "accept": "application/json",
                    "api-key": apiKey,
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    sender: { name: "For You Nandini", email: brevoLogin },
                    to: [{ email: toEmail, name: "Arman" }],
                    subject: `Nandini responded — she's feeling ${feelingDisplay}`,
                    htmlContent,
                }),
            });

            if (res.ok) {
                console.log("✓ Email sent via Brevo API");
                return;
            }

            const errText = await res.text();
            console.warn("Brevo API failed:", res.status, errText, "— trying SMTP...");
        } catch (e) {
            console.warn("Brevo API error:", e, "— trying SMTP...");
        }
    }

    // Fallback: SMTP relay
    const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
            user: brevoLogin,
            pass: smtpKey,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: `"For You, Nandini ☽" <${brevoLogin}>`,
            to: toEmail,
            subject: `☽ Nandini responded — she's feeling ${feelingDisplay}`,
            html: htmlContent,
        });
        console.log("✓ Email sent via SMTP:", info.messageId);
    } catch (e) {
        console.error("Both methods failed. SMTP error:", e);
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { feeling, message, timestamp } = body;

        // Save locally
        let arr: unknown[] = [];
        try { arr = JSON.parse(await fs.readFile(DATA, "utf-8")); } catch { arr = []; }
        arr.push({ feeling, message, timestamp, id: Date.now() });
        await fs.writeFile(DATA, JSON.stringify(arr, null, 2));

        // Send email notification (non-blocking)
        sendEmail(feeling, message).catch(console.error);

        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}

/**
 * @file server.ts
 * @description Full-stack Express server and Vite entry point for TheKidsNest.
 * @purpose Serves static client files, binds to port 3000, and hosts our Cash on Delivery order notifications API.
 * @interaction Receives order submission fetch calls from the shopping cart and sends email notifications.
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load variables from .env
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Declare lazy-loaded SMTP transport variable
let mailTransporter: nodemailer.Transporter | null = null;

/**
 * Purpose: Lazy-initializes and configures the Nodemailer transport system.
 * Input: none
 * Return: Promise<nodemailer.Transporter | null>
 * Why: Prevents startup crashes when SMTP variables are not set and provisions safe, zero-cost Ethereal testing fallbacks.
 */
async function getMailTransporter(): Promise<nodemailer.Transporter | null> {
  if (mailTransporter) return mailTransporter;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && port && user && pass) {
    try {
      mailTransporter = nodemailer.createTransport({
        host,
        port: parseInt(port),
        secure: parseInt(port) === 465,
        auth: { user, pass }
      });
      console.log('Using custom SMTP configuration for email delivery.');
      return mailTransporter;
    } catch (err) {
      console.error('Failed to initialize custom SMTP transport:', err);
    }
  }

  // Fallback: Attempt to generate a transient Ethereal SMTP testing account
  try {
    console.log('No SMTP configurations found in .env. Attempting to provision transient Ethereal test account...');
    const testAccount = await nodemailer.createTestAccount();
    mailTransporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.log(`Successfully provisioned Ethereal SMTP test account! User: ${testAccount.user}`);
    return mailTransporter;
  } catch (err) {
    console.warn('Could not generate automatic Ethereal SMTP test account. Falling back to log-only dispatch.');
    return null;
  }
}

/* ----------------------------------------------------
   1. API ROUTES
   ---------------------------------------------------- */
/**
 * Route: POST /api/send-email
 * Description: Dispatch a premium-styled HTML notification to the administrator upon order completion.
 * Error Handling: Catches transport issues gracefully so orders proceed even if mail service is offline.
 */
app.post('/api/send-email', async (req, res) => {
  const { order } = req.body;

  if (!order) {
    return res.status(400).json({ success: false, error: 'Missing order parameter' });
  }

  const adminEmail = 'thekidsnestbd@gmail.com';
  const orderDateString = new Date(order.createdAt).toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' });

  // Compile a responsive, professional HTML layout for the admin's inbox
  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="background-color: #f43f5e; color: #ffffff; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 800;">TheKidsNest Order Notification</h1>
        <p style="margin: 5px 0 0 0; font-size: 14px;">নতুন ক্যাশ অন ডেলিভারি (COD) অর্ডার এসেছে!</p>
      </div>
      
      <div style="padding: 20px; color: #334155;">
        <h2 style="color: #f43f5e; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 0; font-size: 18px;">গ্রাহকের বিবরণ (Customer Details)</h2>
        <table style="width: 100%; font-size: 14px; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 6px 0; font-weight: bold; width: 140px;">নাম (Name):</td>
            <td style="padding: 6px 0;">${order.customerName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">মোবাইল (Phone):</td>
            <td style="padding: 6px 0;"><a href="tel:${order.customerPhone}" style="color: #f43f5e; text-decoration: none; font-weight: bold;">${order.customerPhone}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">জেলা (District):</td>
            <td style="padding: 6px 0;">${order.deliveryDistrict === 'sylhet' ? 'Sylhet (Inside)' : 'Outside Sylhet'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">ঠিকানা (Address):</td>
            <td style="padding: 6px 0;">${order.shippingAddress}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">তারিখ (Placed At):</td>
            <td style="padding: 6px 0;">${orderDateString} (BD Time)</td>
          </tr>
        </table>

        <h2 style="color: #f43f5e; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; font-size: 18px;">পণ্য তালিকা (Product List)</h2>
        <table style="width: 100%; font-size: 14px; border-collapse: collapse; margin-bottom: 20px; text-align: left;">
          <thead>
            <tr style="background-color: #f8fafc;">
              <th style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Brand & Size</th>
              <th style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center;">Qty</th>
              <th style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">Price (BDT)</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map((item: any) => `
              <tr>
                <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9;">
                  <strong>${item.product.brand}</strong> - Size ${item.product.size} (${item.product.style === 'pant' ? 'Pant' : 'Belt'})<br/>
                  <span style="font-size: 11px; color: #64748b;">${item.product.count} Pcs / ${item.product.weightRange || ''}</span>
                </td>
                <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9; text-align: right;">৳${item.product.mrp * item.quantity}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin-top: 15px; font-size: 14px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span>সাবটোটাল (Subtotal):</span>
            <span style="font-weight: bold;">৳${order.totalPrice - order.deliveryFee} BDT</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span>ডেলিভারি চার্জ (Delivery Fee):</span>
            <span style="font-weight: bold;">৳${order.deliveryFee} BDT</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; color: #f43f5e; border-top: 1px solid #e2e8f0; padding-top: 10px;">
            <span>সর্বমোট বিল (Total Bill):</span>
            <span>৳${order.totalPrice} BDT</span>
          </div>
        </div>

        <div style="margin-top: 30px; text-align: center;">
          <p style="font-size: 12px; color: #94a3b8;">
            Please open the admin dashboard to accept, decline, or process this order.
          </p>
        </div>
      </div>
    </div>
  `;

  try {
    const transporter = await getMailTransporter();
    if (transporter) {
      const info = await transporter.sendMail({
        from: '"TheKidsNest System" <system@thekidsnest.com>',
        to: adminEmail,
        subject: `🚨 New Order from ${order.customerName} - ৳${order.totalPrice} BDT`,
        text: `New order placed by ${order.customerName} (${order.customerPhone}). Total Bill: ৳${order.totalPrice} BDT. View on Dashboard.`,
        html: htmlContent
      });

      console.log('Email sent successfully:', info.messageId);
      
      // If we are using Ethereal, log the preview URL for developer convenience
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log(`[ETHEREAL TEST EMAIL] Preview URL: ${previewUrl}`);
      }

      return res.status(200).json({ success: true, message: 'Notification sent successfully!', messageId: info.messageId, previewUrl });
    } else {
      console.warn('Transporter is unavailable. Order printed to container stdout:', JSON.stringify(order, null, 2));
      return res.status(200).json({ success: true, message: 'SMTP configurations missing. Logged order data successfully.' });
    }
  } catch (err: any) {
    console.error('Email sending error caught safely:', err);
    return res.status(200).json({ success: true, error: 'Email dispatch failed but order captured successfully.', details: err.message });
  }
});

/* ----------------------------------------------------
   2. VITE MIDDLEWARE & STATIC ASSET HANDLING
   ---------------------------------------------------- */
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();

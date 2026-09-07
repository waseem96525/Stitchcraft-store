// Supabase Edge Function to send order confirmation email
// Uses Resend API (https://resend.com) - Free tier: 100 emails/day
// Set RESEND_API_KEY in Supabase Edge Function secrets

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "StitchCraft <orders@stitchcraft.in>";

interface OrderItem {
  name: string;
  size: string;
  qty: number;
  price: number;
}

interface OrderData {
  orderCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  pickupStore?: string;
  orderDate: string;
}

function generateEmailHTML(order: OrderData): string {
  const itemsHTML = order.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.size}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.qty}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.qty).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  const paymentLabel = order.paymentMethod === 'upi' ? 'UPI / GPay / PhonePe' : 
                       order.paymentMethod === 'cod' ? 'Cash on Delivery' :
                       order.paymentMethod === 'card' ? 'Credit/Debit Card' : 'EMI';

  const deliveryInfo = order.pickupStore 
    ? `<p style="margin: 0 0 10px;"><strong>Store Pickup:</strong> ${order.pickupStore}</p>`
    : `<p style="margin: 0 0 5px;"><strong>Delivery Address:</strong></p>
       <p style="margin: 0 0 5px;">${order.address || ''}</p>
       <p style="margin: 0 0 10px;">${order.city || ''}, ${order.state || ''} - ${order.pincode || ''}</p>`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - ${order.orderCode}</title>
</head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
  
  <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1a1a2e, #2d2d44); padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">
        <span style="color: #e8b44b;">🌿</span> StitchCraft
      </h1>
      <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0;">Order Confirmation</p>
    </div>

    <!-- Success Icon -->
    <div style="text-align: center; padding: 30px;">
      <div style="width: 80px; height: 80px; background: #e6f4ea; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 40px;">
        ✓
      </div>
      <h2 style="color: #28a745; margin: 20px 0 10px;">Thank You, ${order.customerName}!</h2>
      <p style="color: #666; margin: 0;">Your order has been placed successfully.</p>
    </div>

    <!-- Order Details -->
    <div style="padding: 0 30px 30px;">
      <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #666; font-size: 14px;">Order ID</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #1a1a2e;">${order.orderCode}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-size: 14px;">Order Date</td>
            <td style="padding: 8px 0; text-align: right; color: #1a1a2e;">${order.orderDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-size: 14px;">Payment Method</td>
            <td style="padding: 8px 0; text-align: right; color: #1a1a2e;">${paymentLabel}</td>
          </tr>
        </table>
      </div>

      <!-- Items Table -->
      <h3 style="color: #1a1a2e; margin: 0 0 15px; font-size: 16px;">Order Items</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background: #f5f5f5;">
            <th style="padding: 12px; text-align: left; font-size: 12px; color: #666; text-transform: uppercase;">Item</th>
            <th style="padding: 12px; text-align: center; font-size: 12px; color: #666; text-transform: uppercase;">Size</th>
            <th style="padding: 12px; text-align: center; font-size: 12px; color: #666; text-transform: uppercase;">Qty</th>
            <th style="padding: 12px; text-align: right; font-size: 12px; color: #666; text-transform: uppercase;">Price</th>
            <th style="padding: 12px; text-align: right; font-size: 12px; color: #666; text-transform: uppercase;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>

      <!-- Totals -->
      <div style="background: #f8f9fa; border-radius: 8px; padding: 20px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #666;">Subtotal</td>
            <td style="padding: 8px 0; text-align: right;">₹${order.subtotal.toLocaleString('en-IN')}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">Shipping</td>
            <td style="padding: 8px 0; text-align: right;">${order.shipping === 0 ? 'FREE' : '₹' + order.shipping.toLocaleString('en-IN')}</td>
          </tr>
          ${order.discount > 0 ? `
          <tr style="color: #28a745;">
            <td style="padding: 8px 0;">Discount</td>
            <td style="padding: 8px 0; text-align: right;">-₹${order.discount.toLocaleString('en-IN')}</td>
          </tr>
          ` : ''}
          <tr style="border-top: 2px solid #1a1a2e; font-size: 18px; font-weight: bold;">
            <td style="padding: 15px 0 0; color: #1a1a2e;">Total Paid</td>
            <td style="padding: 15px 0 0; text-align: right; color: #c41e3a;">₹${order.total.toLocaleString('en-IN')}</td>
          </tr>
        </table>
      </div>

      <!-- Delivery Info -->
      <h3 style="color: #1a1a2e; margin: 25px 0 15px; font-size: 16px;">Delivery Information</h3>
      <div style="background: #f8f9fa; border-radius: 8px; padding: 20px;">
        ${deliveryInfo}
        <p style="margin: 0; color: #666; font-size: 14px;"><strong>Estimated Delivery:</strong> 3-7 business days</p>
      </div>

      <!-- Footer Message -->
      <div style="text-align: center; margin-top: 30px; padding: 20px; background: #fef7e0; border-radius: 8px;">
        <p style="margin: 0 0 10px; color: #1a1a2e; font-weight: 600;">Need Help?</p>
        <p style="margin: 0; color: #666; font-size: 14px;">
          Contact us at <a href="mailto:support@stitchcraft.in" style="color: #c41e3a;">support@stitchcraft.in</a> or call <a href="tel:+919876543210" style="color: #c41e3a;">+91 98765 43210</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #1a1a2e; padding: 20px; text-align: center;">
      <p style="color: rgba(255,255,255,0.7); margin: 0 0 10px; font-size: 14px;">
        Thank you for shopping with StitchCraft!
      </p>
      <p style="color: rgba(255,255,255,0.5); margin: 0; font-size: 12px;">
        Goods once sold will not be exchanged or returned. | Please keep this bill for future reference.
      </p>
      <p style="color: rgba(255,255,255,0.4); margin: 15px 0 0; font-size: 11px;">
        © 2024 StitchCraft. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const { order } = await req.json();

    if (!order || !order.orderCode) {
      return new Response(
        JSON.stringify({ error: "Order data is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!RESEND_API_KEY) {
      console.log("RESEND_API_KEY not configured - email not sent");
      return new Response(
        JSON.stringify({ success: false, message: "Email service not configured" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!order.customerEmail) {
      return new Response(
        JSON.stringify({ success: false, message: "Customer email not provided" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const orderDate = new Date(order.orderDate || Date.now()).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const emailData = {
      from: FROM_EMAIL,
      to: order.customerEmail,
      subject: `Order Confirmed - ${order.orderCode} | StitchCraft`,
      html: generateEmailHTML({ ...order, orderDate })
    };

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailData),
    });

    if (response.ok) {
      return new Response(
        JSON.stringify({ success: true, message: "Email sent successfully" }),
        { 
          status: 200, 
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          } 
        }
      );
    } else {
      const error = await response.text();
      console.error("Resend API error:", error);
      return new Response(
        JSON.stringify({ success: false, message: "Failed to send email" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error sending email" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

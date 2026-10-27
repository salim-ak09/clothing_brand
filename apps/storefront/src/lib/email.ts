import { Resend } from 'resend';

// Initialize Resend API
const resend = new Resend(process.env.RESEND_API_KEY || 're_test_placeholder');

export const sendOrderConfirmation = async (email: string, orderNumber: string, amount: string) => {
  try {
    const data = await resend.emails.send({
      from: 'AETHER Atelier <orders@aether-atelier.com>',
      to: [email],
      subject: `Order Confirmation // ${orderNumber}`,
      html: `
        <div style="font-family: monospace; max-width: 600px; margin: 0 auto; background: #050507; color: #fff; padding: 40px;">
          <h1 style="color: #a81338; font-family: serif; text-transform: uppercase;">AETHER</h1>
          <p>Your order <strong>${orderNumber}</strong> has been secured.</p>
          <p>Total amount: $${amount}</p>
          <p>We are preparing the pattern cut. We will notify you once dispatched.</p>
          <hr style="border-color: #222; margin: 30px 0;" />
          <p style="font-size: 10px; color: #666;">AETHER DIGITAL ATELIER • 450GSM</p>
        </div>
      `,
    });
    console.log('[Email] Confirmation sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('[Email] Failed to send:', error);
    return { success: false, error };
  }
};

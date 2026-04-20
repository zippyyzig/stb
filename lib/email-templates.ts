import { COMPANY_NAME, SITE_URL } from "./email";

// Base email template wrapper
function baseTemplate(content: string, preheader: string = ""): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${COMPANY_NAME}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; }
    .preheader { display: none !important; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px 40px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 28px; font-weight: 700; margin: 0; }
    .header p { color: rgba(255,255,255,0.8); font-size: 14px; margin-top: 5px; }
    .content { padding: 40px; }
    .content h2 { color: #1a1a2e; font-size: 22px; margin-bottom: 20px; }
    .content p { color: #555; margin-bottom: 15px; font-size: 15px; }
    .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff !important; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 15px; margin: 20px 0; }
    .button:hover { opacity: 0.9; }
    .info-box { background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
    .info-box h3 { color: #1a1a2e; font-size: 16px; margin-bottom: 10px; }
    .info-box p { margin-bottom: 8px; color: #555; }
    .order-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
    .order-item:last-child { border-bottom: none; }
    .status-badge { display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; text-transform: uppercase; }
    .status-pending { background-color: #fff3cd; color: #856404; }
    .status-processing { background-color: #cce5ff; color: #004085; }
    .status-shipped { background-color: #d4edda; color: #155724; }
    .status-delivered { background-color: #d1e7dd; color: #0f5132; }
    .status-cancelled { background-color: #f8d7da; color: #721c24; }
    .priority-low { background-color: #d1e7dd; color: #0f5132; }
    .priority-medium { background-color: #fff3cd; color: #856404; }
    .priority-high { background-color: #f8d7da; color: #721c24; }
    .priority-urgent { background-color: #dc3545; color: #ffffff; }
    .footer { background-color: #f8f9fa; padding: 30px 40px; text-align: center; border-top: 1px solid #eee; }
    .footer p { color: #888; font-size: 13px; margin-bottom: 10px; }
    .footer a { color: #667eea; text-decoration: none; }
    .social-links { margin: 15px 0; }
    .social-links a { display: inline-block; margin: 0 8px; color: #667eea; text-decoration: none; }
    .divider { height: 1px; background-color: #eee; margin: 25px 0; }
    table { width: 100%; border-collapse: collapse; }
    .data-table th { background-color: #f8f9fa; padding: 12px; text-align: left; font-weight: 600; color: #333; border-bottom: 2px solid #dee2e6; }
    .data-table td { padding: 12px; border-bottom: 1px solid #eee; color: #555; }
    .highlight { color: #667eea; font-weight: 600; }
    .text-muted { color: #888; font-size: 13px; }
    .text-center { text-align: center; }
    .mt-20 { margin-top: 20px; }
    .mb-20 { margin-bottom: 20px; }
  </style>
</head>
<body>
  <span class="preheader">${preheader}</span>
  <div class="container">
    <div class="header">
      <h1>${COMPANY_NAME}</h1>
      <p>Your Trusted Tech Partner</p>
    </div>
    ${content}
    <div class="footer">
      <p>Thank you for choosing ${COMPANY_NAME}!</p>
      <p>If you have any questions, reply to this email or contact us at <a href="mailto:${process.env.COMPANY_EMAIL || "sabkatechbazarr@gmail.com"}">${process.env.COMPANY_EMAIL || "sabkatechbazarr@gmail.com"}</a></p>
      <div class="divider"></div>
      <p class="text-muted">&copy; ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.</p>
      <p class="text-muted"><a href="${SITE_URL}">Visit our website</a></p>
    </div>
  </div>
</body>
</html>
  `;
}

// 1. Welcome Email - Customer Registration
export function welcomeEmailTemplate(customerName: string): string {
  const content = `
    <div class="content">
      <h2>Welcome to ${COMPANY_NAME}! 🎉</h2>
      <p>Dear <strong>${customerName}</strong>,</p>
      <p>Thank you for creating an account with us! We're thrilled to have you as part of our community.</p>
      
      <div class="info-box">
        <h3>What's Next?</h3>
        <p>✓ Browse our extensive collection of tech products</p>
        <p>✓ Add items to your wishlist for later</p>
        <p>✓ Enjoy exclusive member discounts</p>
        <p>✓ Track your orders in real-time</p>
      </div>
      
      <p class="text-center">
        <a href="${SITE_URL}/products" class="button">Start Shopping</a>
      </p>
      
      <p>If you have any questions or need assistance, our support team is always here to help.</p>
      
      <p>Best regards,<br><strong>The ${COMPANY_NAME} Team</strong></p>
    </div>
  `;
  return baseTemplate(content, `Welcome to ${COMPANY_NAME}! Start exploring our products.`);
}

// 2. New User Registration Notification - Admin
export function newUserNotificationTemplate(
  customerName: string,
  customerEmail: string,
  registrationDate: string
): string {
  const content = `
    <div class="content">
      <h2>New User Registration</h2>
      <p>A new user has registered on ${COMPANY_NAME}.</p>
      
      <div class="info-box">
        <h3>User Details</h3>
        <p><strong>Name:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Registration Date:</strong> ${registrationDate}</p>
      </div>
      
      <p class="text-center">
        <a href="${SITE_URL}/admin/customers" class="button">View Customer</a>
      </p>
    </div>
  `;
  return baseTemplate(content, `New user registration: ${customerName}`);
}

// 3. Password Reset Email
export function passwordResetTemplate(
  userName: string,
  resetType: "temporary" | "link" | "manual",
  resetValue?: string
): string {
  let resetContent = "";
  
  if (resetType === "temporary" && resetValue) {
    resetContent = `
      <div class="info-box">
        <h3>Your Temporary Password</h3>
        <p style="font-size: 24px; font-family: monospace; letter-spacing: 2px; color: #667eea; font-weight: bold;">${resetValue}</p>
        <p class="text-muted">This password will expire in 24 hours.</p>
      </div>
      <p><strong>Important:</strong> Please log in with this temporary password and change it immediately for security purposes.</p>
    `;
  } else if (resetType === "link" && resetValue) {
    resetContent = `
      <p>Click the button below to reset your password:</p>
      <p class="text-center">
        <a href="${resetValue}" class="button">Reset Password</a>
      </p>
      <p class="text-muted">This link will expire in 1 hour. If you didn't request this reset, please ignore this email.</p>
    `;
  } else {
    resetContent = `
      <div class="info-box">
        <h3>Password Updated</h3>
        <p>Your password has been successfully reset by an administrator.</p>
        <p>If you did not request this change, please contact support immediately.</p>
      </div>
    `;
  }

  const content = `
    <div class="content">
      <h2>Password Reset Request</h2>
      <p>Dear <strong>${userName}</strong>,</p>
      <p>We received a request to reset your password for your ${COMPANY_NAME} account.</p>
      
      ${resetContent}
      
      <p class="text-center mt-20">
        <a href="${SITE_URL}/login" class="button">Login to Your Account</a>
      </p>
      
      <div class="divider"></div>
      <p class="text-muted">If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
    </div>
  `;
  return baseTemplate(content, `Password reset request for your ${COMPANY_NAME} account`);
}

// 4. Order Confirmation Email
export function orderConfirmationTemplate(
  customerName: string,
  orderNumber: string,
  orderDate: string,
  items: Array<{ name: string; quantity: number; price: number }>,
  subtotal: number,
  shipping: number,
  tax: number,
  total: number,
  shippingAddress: string
): string {
  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td>${item.name}</td>
      <td class="text-center">${item.quantity}</td>
      <td class="text-center">₹${item.price.toLocaleString()}</td>
      <td class="text-center">₹${(item.quantity * item.price).toLocaleString()}</td>
    </tr>
  `
    )
    .join("");

  const content = `
    <div class="content">
      <h2>Order Confirmed!</h2>
      <p>Dear <strong>${customerName}</strong>,</p>
      <p>Thank you for your order! We're getting it ready for you.</p>
      
      <div class="info-box">
        <h3>Order Details</h3>
        <p><strong>Order Number:</strong> <span class="highlight">${orderNumber}</span></p>
        <p><strong>Order Date:</strong> ${orderDate}</p>
      </div>
      
      <table class="data-table">
        <thead>
          <tr>
            <th>Item</th>
            <th class="text-center">Qty</th>
            <th class="text-center">Price</th>
            <th class="text-center">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      
      <div style="background-color: #f8f9fa; padding: 20px; margin-top: 20px; border-radius: 8px;">
        <table style="width: 100%;">
          <tr>
            <td>Subtotal:</td>
            <td style="text-align: right;">₹${subtotal.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Shipping:</td>
            <td style="text-align: right;">₹${shipping.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Tax:</td>
            <td style="text-align: right;">₹${tax.toLocaleString()}</td>
          </tr>
          <tr style="font-weight: bold; font-size: 18px;">
            <td>Total:</td>
            <td style="text-align: right; color: #667eea;">₹${total.toLocaleString()}</td>
          </tr>
        </table>
      </div>
      
      <div class="info-box mt-20">
        <h3>Shipping Address</h3>
        <p>${shippingAddress.replace(/\n/g, "<br>")}</p>
      </div>
      
      <p class="text-center">
        <a href="${SITE_URL}/orders/${orderNumber}" class="button">Track Your Order</a>
      </p>
    </div>
  `;
  return baseTemplate(content, `Order ${orderNumber} confirmed - Thank you for your purchase!`);
}

// 5. Order Status Update Email
export function orderStatusUpdateTemplate(
  customerName: string,
  orderNumber: string,
  newStatus: string,
  trackingNumber?: string,
  estimatedDelivery?: string,
  notes?: string
): string {
  const statusClass = `status-${newStatus.toLowerCase().replace("_", "-")}`;
  
  let statusMessage = "";
  switch (newStatus.toLowerCase()) {
    case "processing":
      statusMessage = "We're preparing your order for shipment.";
      break;
    case "shipped":
      statusMessage = "Great news! Your order has been shipped and is on its way.";
      break;
    case "out_for_delivery":
      statusMessage = "Your order is out for delivery and will arrive today!";
      break;
    case "delivered":
      statusMessage = "Your order has been delivered. We hope you love it!";
      break;
    case "cancelled":
      statusMessage = "Your order has been cancelled. A refund will be processed within 5-7 business days.";
      break;
    case "refunded":
      statusMessage = "Your refund has been processed and will reflect in your account within 5-7 business days.";
      break;
    default:
      statusMessage = `Your order status has been updated to ${newStatus}.`;
  }

  const content = `
    <div class="content">
      <h2>Order Status Update</h2>
      <p>Dear <strong>${customerName}</strong>,</p>
      <p>${statusMessage}</p>
      
      <div class="info-box">
        <h3>Order Information</h3>
        <p><strong>Order Number:</strong> <span class="highlight">${orderNumber}</span></p>
        <p><strong>Status:</strong> <span class="status-badge ${statusClass}">${newStatus.replace("_", " ")}</span></p>
        ${trackingNumber ? `<p><strong>Tracking Number:</strong> ${trackingNumber}</p>` : ""}
        ${estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${estimatedDelivery}</p>` : ""}
        ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ""}
      </div>
      
      <p class="text-center">
        <a href="${SITE_URL}/orders/${orderNumber}" class="button">View Order Details</a>
      </p>
      
      <p>If you have any questions about your order, please don't hesitate to contact us.</p>
    </div>
  `;
  return baseTemplate(content, `Order ${orderNumber} - Status updated to ${newStatus}`);
}

// 6. New Order Notification - Admin
export function newOrderNotificationTemplate(
  orderNumber: string,
  customerName: string,
  customerEmail: string,
  total: number,
  itemCount: number,
  orderDate: string
): string {
  const content = `
    <div class="content">
      <h2>New Order Received!</h2>
      <p>A new order has been placed on ${COMPANY_NAME}.</p>
      
      <div class="info-box">
        <h3>Order Summary</h3>
        <p><strong>Order Number:</strong> <span class="highlight">${orderNumber}</span></p>
        <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
        <p><strong>Items:</strong> ${itemCount} item(s)</p>
        <p><strong>Total:</strong> <span style="color: #28a745; font-weight: bold;">₹${total.toLocaleString()}</span></p>
        <p><strong>Order Date:</strong> ${orderDate}</p>
      </div>
      
      <p class="text-center">
        <a href="${SITE_URL}/admin/orders/${orderNumber}" class="button">View Order</a>
      </p>
    </div>
  `;
  return baseTemplate(content, `New order #${orderNumber} from ${customerName}`);
}

// 7. Ticket Created Confirmation
export function ticketCreatedTemplate(
  customerName: string,
  ticketNumber: string,
  subject: string,
  priority: string,
  message: string
): string {
  const priorityClass = `priority-${priority.toLowerCase()}`;
  
  const content = `
    <div class="content">
      <h2>Support Ticket Created</h2>
      <p>Dear <strong>${customerName}</strong>,</p>
      <p>We've received your support request and will get back to you as soon as possible.</p>
      
      <div class="info-box">
        <h3>Ticket Details</h3>
        <p><strong>Ticket Number:</strong> <span class="highlight">${ticketNumber}</span></p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Priority:</strong> <span class="status-badge ${priorityClass}">${priority}</span></p>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h4 style="margin-bottom: 10px;">Your Message:</h4>
        <p style="white-space: pre-wrap;">${message}</p>
      </div>
      
      <p>Our support team typically responds within 24-48 hours. For urgent matters, please contact us directly.</p>
      
      <p class="text-center">
        <a href="${SITE_URL}/support/tickets/${ticketNumber}" class="button">View Ticket</a>
      </p>
    </div>
  `;
  return baseTemplate(content, `Support ticket #${ticketNumber} created`);
}

// 8. Ticket Reply Notification
export function ticketReplyTemplate(
  customerName: string,
  ticketNumber: string,
  subject: string,
  replyMessage: string,
  repliedBy: string,
  isResolved: boolean
): string {
  const content = `
    <div class="content">
      <h2>New Reply on Your Support Ticket</h2>
      <p>Dear <strong>${customerName}</strong>,</p>
      <p>There's a new reply on your support ticket.</p>
      
      <div class="info-box">
        <h3>Ticket Information</h3>
        <p><strong>Ticket Number:</strong> <span class="highlight">${ticketNumber}</span></p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Status:</strong> <span class="status-badge ${isResolved ? "status-delivered" : "status-processing"}">${isResolved ? "Resolved" : "In Progress"}</span></p>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="color: #888; font-size: 13px; margin-bottom: 10px;">Reply from <strong>${repliedBy}</strong>:</p>
        <p style="white-space: pre-wrap;">${replyMessage}</p>
      </div>
      
      ${isResolved ? `
        <p style="color: #28a745;"><strong>This ticket has been marked as resolved.</strong> If you need further assistance, you can reopen it by replying.</p>
      ` : `
        <p>If you have additional questions or information to provide, please reply to this ticket.</p>
      `}
      
      <p class="text-center">
        <a href="${SITE_URL}/support/tickets/${ticketNumber}" class="button">View Ticket</a>
      </p>
    </div>
  `;
  return baseTemplate(content, `Reply on ticket #${ticketNumber} - ${subject}`);
}

// 9. New Ticket Notification - Admin
export function newTicketNotificationTemplate(
  ticketNumber: string,
  customerName: string,
  customerEmail: string,
  subject: string,
  priority: string,
  category: string
): string {
  const priorityClass = `priority-${priority.toLowerCase()}`;
  
  const content = `
    <div class="content">
      <h2>New Support Ticket</h2>
      <p>A new support ticket has been submitted.</p>
      
      <div class="info-box">
        <h3>Ticket Details</h3>
        <p><strong>Ticket Number:</strong> <span class="highlight">${ticketNumber}</span></p>
        <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Priority:</strong> <span class="status-badge ${priorityClass}">${priority}</span></p>
      </div>
      
      <p class="text-center">
        <a href="${SITE_URL}/admin/tickets/${ticketNumber}" class="button">View Ticket</a>
      </p>
    </div>
  `;
  return baseTemplate(content, `New support ticket #${ticketNumber} - ${priority} priority`);
}

// 10. Low Stock Alert - Admin
export function lowStockAlertTemplate(
  products: Array<{ name: string; sku: string; currentStock: number; reorderLevel: number }>
): string {
  const productsHtml = products
    .map(
      (product) => `
    <tr>
      <td>${product.name}</td>
      <td>${product.sku}</td>
      <td style="color: ${product.currentStock <= 5 ? "#dc3545" : "#856404"}; font-weight: bold;">${product.currentStock}</td>
      <td>${product.reorderLevel}</td>
    </tr>
  `
    )
    .join("");

  const content = `
    <div class="content">
      <h2 style="color: #dc3545;">Low Stock Alert</h2>
      <p>The following products are running low on stock and need attention:</p>
      
      <table class="data-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>SKU</th>
            <th>Current Stock</th>
            <th>Reorder Level</th>
          </tr>
        </thead>
        <tbody>
          ${productsHtml}
        </tbody>
      </table>
      
      <p class="text-center mt-20">
        <a href="${SITE_URL}/admin/inventory" class="button">Manage Inventory</a>
      </p>
    </div>
  `;
  return baseTemplate(content, `Low stock alert: ${products.length} products need attention`);
}

// 11. Email Verification Code Template (8-digit code)
export function emailVerificationCodeTemplate(userName: string, verificationCode: string): string {
  const content = `
    <div class="content">
      <h2>Verify Your Email Address</h2>
      <p>Dear <strong>${userName}</strong>,</p>
      <p>Thank you for registering with ${COMPANY_NAME}! Please use the verification code below to verify your email address.</p>
      
      <div style="background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%); padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0;">
        <p style="color: rgba(255,255,255,0.8); font-size: 14px; margin-bottom: 10px;">Your Verification Code</p>
        <p style="font-size: 36px; font-family: 'Courier New', monospace; letter-spacing: 8px; color: #ffffff; font-weight: bold; margin: 0;">${verificationCode}</p>
      </div>
      
      <div class="info-box">
        <h3>Important</h3>
        <p>This code will expire in <strong>15 minutes</strong>.</p>
        <p>Do not share this code with anyone.</p>
      </div>
      
      <div class="divider"></div>
      <p class="text-muted">If you didn't create an account with ${COMPANY_NAME}, please ignore this email.</p>
    </div>
  `;
  return baseTemplate(content, `Your verification code: ${verificationCode}`);
}

// 11b. Account Verification Email (legacy link-based)
export function accountVerificationTemplate(userName: string, verificationLink: string): string {
  const content = `
    <div class="content">
      <h2>Verify Your Email Address</h2>
      <p>Dear <strong>${userName}</strong>,</p>
      <p>Thank you for registering with ${COMPANY_NAME}! Please verify your email address to complete your registration.</p>
      
      <p class="text-center">
        <a href="${verificationLink}" class="button">Verify Email Address</a>
      </p>
      
      <p class="text-muted">This link will expire in 24 hours.</p>
      
      <div class="divider"></div>
      <p class="text-muted">If you didn't create an account with ${COMPANY_NAME}, please ignore this email.</p>
    </div>
  `;
  return baseTemplate(content, `Verify your email address for ${COMPANY_NAME}`);
}

// 12. Invoice Email
export function invoiceEmailTemplate(
  customerName: string,
  invoiceNumber: string,
  orderNumber: string,
  invoiceDate: string,
  dueDate: string,
  items: Array<{ name: string; quantity: number; price: number }>,
  subtotal: number,
  tax: number,
  total: number,
  isPaid: boolean
): string {
  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td>${item.name}</td>
      <td class="text-center">${item.quantity}</td>
      <td class="text-center">₹${item.price.toLocaleString()}</td>
      <td class="text-center">₹${(item.quantity * item.price).toLocaleString()}</td>
    </tr>
  `
    )
    .join("");

  const content = `
    <div class="content">
      <h2>Invoice</h2>
      <p>Dear <strong>${customerName}</strong>,</p>
      <p>Please find your invoice details below.</p>
      
      <div class="info-box">
        <h3>Invoice Information</h3>
        <p><strong>Invoice Number:</strong> <span class="highlight">${invoiceNumber}</span></p>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Invoice Date:</strong> ${invoiceDate}</p>
        <p><strong>Due Date:</strong> ${dueDate}</p>
        <p><strong>Status:</strong> <span class="status-badge ${isPaid ? "status-delivered" : "status-pending"}">${isPaid ? "Paid" : "Pending"}</span></p>
      </div>
      
      <table class="data-table">
        <thead>
          <tr>
            <th>Item</th>
            <th class="text-center">Qty</th>
            <th class="text-center">Price</th>
            <th class="text-center">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      
      <div style="background-color: #f8f9fa; padding: 20px; margin-top: 20px; border-radius: 8px;">
        <table style="width: 100%;">
          <tr>
            <td>Subtotal:</td>
            <td style="text-align: right;">₹${subtotal.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Tax (GST):</td>
            <td style="text-align: right;">₹${tax.toLocaleString()}</td>
          </tr>
          <tr style="font-weight: bold; font-size: 18px;">
            <td>Total:</td>
            <td style="text-align: right; color: #667eea;">₹${total.toLocaleString()}</td>
          </tr>
        </table>
      </div>
      
      <p class="text-center mt-20">
        <a href="${SITE_URL}/orders/${orderNumber}/invoice" class="button">Download Invoice</a>
      </p>
    </div>
  `;
  return baseTemplate(content, `Invoice ${invoiceNumber} for order ${orderNumber}`);
}

// 13. Refund Processed Email
export function refundProcessedTemplate(
  customerName: string,
  orderNumber: string,
  refundAmount: number,
  refundReason: string,
  refundMethod: string
): string {
  const content = `
    <div class="content">
      <h2>Refund Processed</h2>
      <p>Dear <strong>${customerName}</strong>,</p>
      <p>Your refund has been processed successfully.</p>
      
      <div class="info-box">
        <h3>Refund Details</h3>
        <p><strong>Order Number:</strong> <span class="highlight">${orderNumber}</span></p>
        <p><strong>Refund Amount:</strong> <span style="color: #28a745; font-weight: bold;">₹${refundAmount.toLocaleString()}</span></p>
        <p><strong>Reason:</strong> ${refundReason}</p>
        <p><strong>Refund Method:</strong> ${refundMethod}</p>
      </div>
      
      <p>The refund will be credited to your original payment method within 5-7 business days.</p>
      
      <p>We apologize for any inconvenience caused. If you have any questions, please don't hesitate to contact us.</p>
    </div>
  `;
  return baseTemplate(content, `Refund of ₹${refundAmount.toLocaleString()} processed for order ${orderNumber}`);
}

// 14. Newsletter Subscription Confirmation
export function newsletterSubscriptionTemplate(email: string): string {
  const content = `
    <div class="content">
      <h2>Welcome to Our Newsletter!</h2>
      <p>Thank you for subscribing to the ${COMPANY_NAME} newsletter!</p>
      
      <div class="info-box">
        <h3>What to Expect</h3>
        <p>✓ Exclusive deals and discounts</p>
        <p>✓ New product announcements</p>
        <p>✓ Tech tips and guides</p>
        <p>✓ Special member-only offers</p>
      </div>
      
      <p>You're now subscribed with: <strong>${email}</strong></p>
      
      <p class="text-center">
        <a href="${SITE_URL}/products" class="button">Shop Now</a>
      </p>
      
      <div class="divider"></div>
      <p class="text-muted">You can unsubscribe at any time by clicking the unsubscribe link in our emails.</p>
    </div>
  `;
  return baseTemplate(content, `Welcome to ${COMPANY_NAME} newsletter!`);
}

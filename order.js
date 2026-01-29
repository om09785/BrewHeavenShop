// order.js  (Netlify function)

const nodemailer = require("nodemailer");

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const OWNER_EMAIL = "satputeo210@gmail.com";

exports.handler = async (request, context) => {
  try {
    // Only allow POST
    if (request.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: false,
          message: "Only POST allowed",
        }),
      };
    }

    // Parse JSON body
    const body = JSON.parse(request.body || "{}");
    const {
      name,
      phone,
      email,
      address,
      deliveryType,
      deliveryDate,
      deliveryTime,
      drink,
      size,
      quantity,
      paymentMethod,
      notes,
    } = body;

    // Basic validation
    if (!name || !phone || !drink || !quantity) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: false,
          message: "Please fill name, phone, drink and quantity.",
        }),
      };
    }

    // Email text
    const text =
      `New BrewHaven Order/Inquiry\n\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Email: ${email || "-"}\n` +
      `Address: ${address || "-"}\n` +
      `Delivery Type: ${deliveryType || "-"}\n` +
      `Delivery Date: ${deliveryDate || "-"}\n` +
      `Delivery Time: ${deliveryTime || "-"}\n` +
      `Drink: ${drink}\n` +
      `Size: ${size || "-"}\n` +
      `Quantity: ${quantity}\n` +
      `Payment Method: ${paymentMethod || "-"}\n` +
      `Notes: ${notes || "-"}\n`;

    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"BrewHaven Website" <${EMAIL_USER}>`,
      to: OWNER_EMAIL,
      subject: "New BrewHaven Order/Inquiry",
      text,
    });

    // Success response
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        message: "Order sent successfully!",
      }),
    };
  } catch (err) {
    console.error("Error sending order email:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: false,
        message: "Error sending order.",
      }),
    };
  }
};

// netlify/functions/order.js
import nodemailer from "nodemailer";
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const OWNER_EMAIL = "satputeo210@gmail.com";


export default async (request, context) => {
  try {
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ success: false, message: "Only POST allowed" }),
        { status: 405, headers: { "Content-Type": "application/json" } }
      );
    

    const body = await request.json();
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

    if (!name || !phone || !drink || !quantity) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Please fill name, phone, drink and quantity.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

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

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"BrewHaven Website" <${EMAIL_USER}>`,
      to: OWNER_EMAIL,
      subject: "New BrewHaven Order/Inquiry",
      text,
    });

    return new Response(
      JSON.stringify({ success: true, message: "Order sent successfully!" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error sending order email:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Error sending order." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};


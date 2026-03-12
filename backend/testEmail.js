import nodemailer from "nodemailer";

async function testSMTP() {
    // Use arguments passed to the script for credentials
    const [host, port, user, pass] = process.argv.slice(2);

    if (!host || !port || !user || !pass) {
        console.error("Usage: node testEmail.js <host> <port> <user> <pass>");
        process.exit(1);
    }

    console.log(`Testing SMTP connection to ${host}:${port}...`);
    console.log(`User: ${user}`);

    const transporter = nodemailer.createTransport({
        host,
        port: parseInt(port),
        secure: port === "465", // true for 465, false for other ports
        auth: {
            user,
            pass,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
    });

    try {
        const success = await transporter.verify();
        console.log("✅ SMTP Server is ready to take our messages");

        // Attempt sending a test email
        const info = await transporter.sendMail({
            from: `"AEROLITH Support" <${user}>`,
            to: user, // send to self
            subject: "Test Email from AEROLITH",
            text: "If you are reading this, your SMTP credentials are correct!",
        });

        console.log("✅ Test email sent successfully:", info.messageId);
    } catch (error) {
        console.error("❌ SMTP Error:");
        console.error(error);
    }
}

testSMTP();

import "dotenv/config";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API);

const from = process.env.EMAIL_FROM || "Cuebase <onboarding@resend.dev>";

export const sendEmail = async options => {
    const { data, error } = await resend.emails.send({
        from,
        to: options.email,
        subject: options.subject,
        text: options.message,
    });
      
    if (error) {
        console.error("Error sending email:", error);
        throw error;
    }
      
    console.log("Email sent successfully!");
    console.log("Email ID:", data?.id);
}


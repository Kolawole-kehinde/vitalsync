import { Resend } from "resend";

const resend = new Resend(
process.env.RESEND_API_KEY
);

type SendEmailData = {
to: string;
subject: string;
html: string;
};

export async function sendEmail(
data: SendEmailData
) {
const result =
await resend.emails.send({
from: process.env.EMAIL_FROM!,
to: data.to,
subject: data.subject,
html: data.html,
});

if (result.error) {
throw new Error(
result.error.message
);
}

return result;
}

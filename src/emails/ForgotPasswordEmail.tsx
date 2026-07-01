import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type Props = {
  resetUrl: string;
};

export default function ForgotPasswordEmail({
  resetUrl,
}: Props) {
  return (
    <Html>
      <Head />

      <Preview>
        Reset your VitaOS password
      </Preview>

      <Body
        style={{
          backgroundColor: "#f5f7fb",
          fontFamily: "Arial",
          padding: "40px 0",
        }}
      >
        <Container
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "40px",
            maxWidth: "600px",
          }}
        >
          <Heading>
            Password Reset
          </Heading>

          <Text>
            We received a request to reset your password.
          </Text>

          <Text>
            Click the button below to continue.
          </Text>

          <Section
            style={{
              textAlign: "center",
              marginTop: "30px",
              marginBottom: "30px",
            }}
          >
            <Button
              href={resetUrl}
              style={{
                backgroundColor: "#2563eb",
                color: "#fff",
                padding: "14px 30px",
                borderRadius: "8px",
                textDecoration: "none",
              }}
            >
              Reset Password
            </Button>
          </Section>

          <Text>
            This link expires in 15 minutes.
          </Text>

          <Text
            style={{
              color: "#dc2626",
            }}
          >
            If you didn&apos;t request this, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
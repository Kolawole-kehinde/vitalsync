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

type VerificationEmailProps = {
  otp: string;
};

export default function VerificationEmail({
  otp,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />

      <Preview>
        Verify your VitaOS account
      </Preview>

      <Body
        style={{
          backgroundColor: "#f5f7fb",
          fontFamily: "Arial, Helvetica, sans-serif",
          padding: "40px 0",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            overflow: "hidden",
            maxWidth: "600px",
          }}
        >
          <Section
            style={{
              backgroundColor: "#2563eb",
              padding: "40px",
              textAlign: "center",
            }}
          >
            <Heading
              style={{
                color: "#ffffff",
                margin: 0,
              }}
            >
              Verify Your Email
            </Heading>

            <Text
              style={{
                color: "#dbeafe",
              }}
            >
              One more step before getting started.
            </Text>
          </Section>

          <Section
            style={{
              padding: "40px",
            }}
          >
            <Text>
              Welcome to <strong>VitaOS</strong>.
            </Text>

            <Text>
              Use the verification code below to activate your account.
            </Text>

            <Section
              style={{
                textAlign: "center",
                margin: "40px 0",
              }}
            >
              <Text
                style={{
                  fontSize: "36px",
                  fontWeight: "bold",
                  letterSpacing: "8px",
                  color: "#2563eb",
                }}
              >
                {otp}
              </Text>
            </Section>

            <Text>
              This verification code expires in <strong>15 minutes</strong>.
            </Text>

            <Text
              style={{
                color: "#6b7280",
                fontSize: "13px",
              }}
            >
              If you didn&apos;t create this account, you can safely ignore this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
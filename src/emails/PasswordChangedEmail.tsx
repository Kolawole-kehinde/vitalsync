import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export default function PasswordChangedEmail() {
  return (
    <Html>
      <Head />

      <Preview>Your VitaOS password was changed</Preview>

      <Body
        style={{
          backgroundColor: "#f5f7fb",
          fontFamily: "Arial, Helvetica, sans-serif",
          padding: "40px 0",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            background: "#fff",
            borderRadius: "12px",
            overflow: "hidden",
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
                color: "#fff",
                margin: 0,
              }}
            >
              Password Updated
            </Heading>
          </Section>

          <Section
            style={{
              padding: "40px",
            }}
          >
            <Text>
              Your password has been changed successfully.
            </Text>

            <Text>
              If you made this change, no further action is required.
            </Text>

            <Text
              style={{
                color: "#dc2626",
                fontWeight: "bold",
              }}
            >
              If this wasn&apos;t you, please reset your password immediately and contact support.
            </Text>

            <Hr />

            <Text
              style={{
                color: "#6b7280",
                fontSize: "13px",
              }}
            >
              This is an automated security notification from VitaOS.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
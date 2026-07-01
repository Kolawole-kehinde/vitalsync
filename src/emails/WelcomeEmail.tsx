import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type WelcomeEmailProps = {
  firstName: string;
};

export default function WelcomeEmail({
  firstName,
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />

      <Preview>
        Welcome to VitaOS! Your wellness journey starts today.
      </Preview>

      <Body
        style={{
          backgroundColor: "#f5f7fb",
          fontFamily:
            "Arial, Helvetica, sans-serif",
          padding: "40px 0",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            overflow: "hidden",
            margin: "0 auto",
          }}
        >
          {/* Header */}

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
                fontSize: "32px",
              }}
            >
              🎉 Welcome to VitaOS
            </Heading>

            <Text
              style={{
                color: "#dbeafe",
                marginTop: "12px",
                fontSize: "16px",
              }}
            >
              Your wellness journey starts today.
            </Text>
          </Section>

          {/* Body */}

          <Section
            style={{
              padding: "40px",
            }}
          >
            <Text
              style={{
                fontSize: "18px",
                color: "#111827",
              }}
            >
              Hi <strong>{firstName}</strong>,
            </Text>

            <Text
              style={{
                fontSize: "16px",
                lineHeight: "28px",
                color: "#374151",
              }}
            >
              Your <strong>VitaOS</strong> profile has
              been successfully set up.
            </Text>

            <Text
              style={{
                fontSize: "16px",
                color: "#374151",
              }}
            >
              Here are your next recommended steps:
            </Text>

            <Text style={listItem}>
              ✅ Set your first wellness goal
            </Text>

            <Text style={listItem}>
              🏋️ Log your first workout
            </Text>

            <Text style={listItem}>
              💧 Track today&apos;s water intake
            </Text>

            <Text style={listItem}>
              🌙 Complete today&apos;s wellness check-in
            </Text>

            <Section
              style={{
                backgroundColor: "#eff6ff",
                borderLeft: "5px solid #2563eb",
                padding: "20px",
                borderRadius: "8px",
                marginTop: "32px",
              }}
            >
              <Text
                style={{
                  margin: 0,
                  color: "#1e3a8a",
                  lineHeight: "28px",
                }}
              >
                Every workout, every healthy meal,
                every glass of water, and every night
                of quality sleep helps build a healthier
                version of you.
              </Text>
            </Section>

            <Section
              style={{
                textAlign: "center",
                marginTop: "40px",
                marginBottom: "40px",
              }}
            >
              <Button
                href={`${process.env.APP_URL}/dashboard`}
                style={{
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  padding: "14px 28px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Start My Wellness Journey →
              </Button>
            </Section>

            <Text
              style={{
                fontSize: "16px",
                color: "#374151",
                lineHeight: "28px",
              }}
            >
              We&apos;ll help you build healthier habits one
              day at a time.
            </Text>

            <Text
              style={{
                fontSize: "16px",
                color: "#374151",
              }}
            >
              Welcome aboard!
            </Text>

            <Text
              style={{
                marginTop: "40px",
              }}
            >
              — <strong>The VitaOS Team</strong>
            </Text>

            <Hr />

            <Text
              style={{
                color: "#6b7280",
                fontSize: "13px",
                lineHeight: "20px",
              }}
            >
              You&apos;re receiving this email because you
              successfully completed your VitaOS account
              setup.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const listItem = {
  fontSize: "16px",
  color: "#111827",
  margin: "10px 0",
};
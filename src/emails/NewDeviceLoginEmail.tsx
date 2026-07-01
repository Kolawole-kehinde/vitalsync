import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type Props = {
  deviceName?: string;
  ipAddress?: string;
};

export default function NewDeviceLoginEmail({
  deviceName,
  ipAddress,
}: Props) {
  return (
    <Html>
      <Head />

      <Preview>
        New device signed into your VitaOS account
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
              New Device Login
            </Heading>
          </Section>

          <Section
            style={{
              padding: "40px",
            }}
          >
            <Text>
              We noticed a login from a new device.
            </Text>

            <Text>
              <strong>Device:</strong>{" "}
              {deviceName ?? "Unknown Device"}
            </Text>

            <Text>
              <strong>IP Address:</strong>{" "}
              {ipAddress ?? "Unknown"}
            </Text>

            <Text>
              If this was you, there&apos;s nothing else you need to do.
            </Text>

            <Text
              style={{
                color: "#dc2626",
                fontWeight: "bold",
              }}
            >
              If you didn&apos;t recognize this login, change your password immediately.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
import * as React from "react";
import {
  Html,
  Head,
  Font,
  Container,
  Section,
  Row,
  Column,
  Text,
} from "@react-email/components";

export function Email({email, password, fullName}) {
  const styles = {
    container: {
      fontFamily: "Inter, Arial, sans-serif",
      backgroundColor: "#f0f0f0",
      color: "#333",
      padding: "32px",
    },
    sectionMargin: {
      marginBottom: "24px",
    },
    textCenter: {
      textAlign: "center",
    },
    heading: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "16px",
      color: "#29b6f6",
    },
    paragraph: {
      marginBottom: "16px",
    },
    highlight: {
      backgroundColor: "#29b6f6",
      color: "#ffffff",
      padding: "4px 8px",
      borderRadius: "4px",
    },
    smallText: {
      fontSize: "14px",
    },
  };

  return (
    <Html lang="en">
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Container style={styles.container}>
        <Section style={styles.sectionMargin}>
          <Row>
            <Column style={styles.textCenter}>
              <Text style={styles.heading}>Welcome, {fullName}!</Text>
              <Text style={styles.paragraph}>
                You've successfully created your account. Here are your details
                for future reference:
              </Text>
              <Text style={styles.paragraph}>
                Email: <span style={styles.highlight}>{email}</span>
              </Text>
              <Text style={styles.paragraph}>
                Password: <span style={styles.highlight}>{password}</span> (Keep
                this secure)
              </Text>
            </Column>
          </Row>
        </Section>
        <Section>
          <Row>
            <Column style={styles.textCenter}>
              <Text style={styles.smallText}>
                If you have any questions or need to secure your account, please
                do not hesitate to contact us.
              </Text>
            </Column>
          </Row>
        </Section>
      </Container>
    </Html>
  );
}

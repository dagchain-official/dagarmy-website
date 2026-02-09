import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

export const WelcomeEmail = ({ userName = 'there' }) => (
  <Html>
    <Head />
    <Preview>Welcome to DAGARMY - Master AI, Blockchain & Data Visualization</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Logo Section */}
        <Section style={logoSection}>
          <Img
            src="https://dagarmy.network/images/logo/logo.png"
            width="120"
            height="40"
            alt="DAGARMY"
            style={logo}
          />
        </Section>

        {/* Hero Section */}
        <Section style={heroSection}>
          <Heading style={h1}>Welcome to DAGARMY! 🚀</Heading>
          <Text style={heroText}>
            Hey {userName}, we're thrilled to have you join the Global Army of Vibe Coders!
          </Text>
        </Section>

        {/* Main Content */}
        <Section style={contentSection}>
          <Text style={paragraph}>
            You've just taken the first step towards mastering cutting-edge technologies like 
            <strong> AI, Blockchain, and Data Visualization</strong>. Get ready for an incredible learning journey!
          </Text>

          {/* Quick Start Cards */}
          <Section style={cardContainer}>
            <Section style={card}>
              <Text style={cardIcon}>📚</Text>
              <Text style={cardTitle}>Explore Courses</Text>
              <Text style={cardText}>
                Browse our comprehensive curriculum designed by industry experts
              </Text>
            </Section>

            <Section style={card}>
              <Text style={cardIcon}>🎯</Text>
              <Text style={cardTitle}>Set Your Goals</Text>
              <Text style={cardText}>
                Complete your profile and start tracking your learning progress
              </Text>
            </Section>

            <Section style={card}>
              <Text style={cardIcon}>💬</Text>
              <Text style={cardTitle}>Join Community</Text>
              <Text style={cardText}>
                Connect with fellow learners and share your journey
              </Text>
            </Section>
          </Section>

          {/* CTA Button */}
          <Section style={buttonContainer}>
            <Button style={button} href="https://dagarmy.network/dashboard">
              Get Started Now
            </Button>
          </Section>

          {/* What's Next Section */}
          <Section style={nextStepsSection}>
            <Heading style={h2}>What's Next?</Heading>
            <Text style={listItem}>✅ Complete your profile</Text>
            <Text style={listItem}>✅ Browse available courses</Text>
            <Text style={listItem}>✅ Join your first program</Text>
            <Text style={listItem}>✅ Start earning DAG points</Text>
          </Section>

          <Hr style={hr} />

          {/* Support Section */}
          <Text style={paragraph}>
            Need help getting started? Our support team is here for you!
          </Text>
          <Text style={paragraph}>
            📧 Email us at{' '}
            <Link href="mailto:support@dagarmy.network" style={link}>
              support@dagarmy.network
            </Link>
          </Text>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            © 2026 DAGARMY. All rights reserved.
          </Text>
          <Text style={footerText}>
            You're receiving this email because you signed up for DAGARMY.
          </Text>
          <Text style={footerLinks}>
            <Link href="https://dagarmy.network" style={footerLink}>
              Website
            </Link>
            {' • '}
            <Link href="https://dagarmy.network/courses" style={footerLink}>
              Courses
            </Link>
            {' • '}
            <Link href="https://dagarmy.network/about" style={footerLink}>
              About
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const logoSection = {
  padding: '32px 40px',
  textAlign: 'center',
};

const logo = {
  margin: '0 auto',
};

const heroSection = {
  padding: '0 40px 32px',
  textAlign: 'center',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '12px',
  margin: '0 20px',
};

const h1 = {
  color: '#ffffff',
  fontSize: '36px',
  fontWeight: 'bold',
  margin: '32px 0 16px',
  padding: '0',
  lineHeight: '1.3',
};

const heroText = {
  color: '#ffffff',
  fontSize: '18px',
  lineHeight: '1.6',
  margin: '0 0 32px',
  opacity: '0.95',
};

const contentSection = {
  padding: '32px 40px',
};

const paragraph = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0',
};

const cardContainer = {
  margin: '32px 0',
};

const card = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '24px',
  marginBottom: '16px',
  textAlign: 'center',
};

const cardIcon = {
  fontSize: '48px',
  margin: '0 0 12px',
};

const cardTitle = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 8px',
};

const cardText = {
  color: '#525f7f',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0',
};

const buttonContainer = {
  textAlign: 'center',
  margin: '32px 0',
};

const button = {
  backgroundColor: '#667eea',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  padding: '14px 40px',
  cursor: 'pointer',
};

const nextStepsSection = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '24px',
  margin: '32px 0',
};

const h2 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 16px',
};

const listItem = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '1.8',
  margin: '8px 0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '32px 0',
};

const link = {
  color: '#667eea',
  textDecoration: 'underline',
};

const footer = {
  padding: '0 40px',
  textAlign: 'center',
};

const footerText = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '1.5',
  margin: '8px 0',
};

const footerLinks = {
  margin: '16px 0 0',
};

const footerLink = {
  color: '#667eea',
  fontSize: '12px',
  textDecoration: 'none',
};

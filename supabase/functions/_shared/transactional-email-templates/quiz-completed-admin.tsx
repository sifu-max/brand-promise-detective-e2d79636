import * as React from 'npm:react@18.3.1'
import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Row { label: string; value: string }
interface Props {
  firstName?: string
  email?: string
  icp?: string
  tier?: string
  score?: string
  answers?: Row[]
  branding?: Row[]
  exportUrl?: string
}

const QuizCompletedAdmin = ({ firstName, email, icp, tier, score, answers = [], branding = [], exportUrl }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New quiz completed{firstName ? ` by ${firstName}` : ''}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Quiz Completed</Heading>
        <Text style={text}><b>Name:</b> {firstName || '—'}<br /><b>Email:</b> {email || '—'}<br /><b>Business type:</b> {icp || '—'}</Text>
        <Section style={scoreBox}>
          <Text style={scoreText}>{score || '—'} · {tier || '—'}</Text>
        </Section>
        {answers.length > 0 && (<>
          <Heading as="h2" style={h2}>Quiz Answers</Heading>
          {answers.map((r, i) => <Text key={i} style={row}><b>{r.label}:</b> {r.value || '—'}</Text>)}
        </>)}
        {branding.length > 0 && (<>
          <Hr style={hr} />
          <Heading as="h2" style={h2}>Branding Intake & Brand DNA</Heading>
          {branding.map((r, i) => <Text key={i} style={row}><b>{r.label}:</b> {r.value || '—'}</Text>)}
        </>)}
        {exportUrl && (
          <Section style={{ marginTop: '24px' }}>
            <Button href={exportUrl} style={button}>Download full JSON export</Button>
          </Section>
        )}
        <Text style={footer}>Powered by www.crmchains.com</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: QuizCompletedAdmin,
  subject: (d: Record<string, any>) => `New quiz completed: ${d.firstName || 'Unknown'} — ${d.tier || 'Results'}`,
  displayName: 'Quiz completed (admin copy)',
  to: 'sifu@medalloinnovations.ai',
  previewData: {
    firstName: 'Jane', email: 'jane@example.com', icp: 'coach-consultant', tier: 'Fragmented Infrastructure', score: '24 / 50',
    answers: [{ label: 'Conversation Capture', value: 'Most conversations are captured' }],
    branding: [{ label: 'Business Tagline', value: 'Your Growth, Our Mission.' }],
    exportUrl: 'https://example.com',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '600px' }
const h1 = { fontSize: '22px', color: '#3b1f6e', margin: '0 0 16px' }
const h2 = { fontSize: '16px', color: '#3b1f6e', margin: '20px 0 8px' }
const text = { fontSize: '14px', color: '#333', lineHeight: '22px' }
const row = { fontSize: '13px', color: '#333', lineHeight: '20px', margin: '4px 0' }
const scoreBox = { backgroundColor: '#f4effb', borderRadius: '8px', padding: '12px 16px' }
const scoreText = { fontSize: '16px', fontWeight: 'bold' as const, color: '#3b1f6e', margin: 0 }
const hr = { borderColor: '#eee', margin: '20px 0' }
const button = { backgroundColor: '#e8554e', color: '#ffffff', padding: '12px 20px', borderRadius: '8px', fontSize: '14px', textDecoration: 'none' }
const footer = { fontSize: '12px', color: '#999', marginTop: '28px' }

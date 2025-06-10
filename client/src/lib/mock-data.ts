import { ContactWithData } from "@shared/schema";

export const mockContact: ContactWithData = {
  id: "contact_001",
  directory: "Enterprise Customers",
  directoryFields: {
    name: "Sarah Johnson",
    email: "sarah.johnson@techcorp.com",
    phone: "+1-555-0101",
    company: "TechCorp Inc",
    role: "VP Marketing",
    industry: "Technology",
    annual_revenue: 250000,
    location: "San Francisco, CA",
    join_date: "2023-01-15",
    segment: "Enterprise"
  },
  createdAt: new Date("2023-01-15"),
  updatedAt: new Date(),
  activities: [
    {
      id: "act_001",
      contactId: "contact_001",
      activity: "Customer Satisfaction Survey",
      activityFields: {
        survey_id: "SUR-2024-003",
        category: "Feedback"
      },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: "act_002",
      contactId: "contact_001",
      activity: "Support Ticket",
      activityFields: {
        ticket_id: "SUP-2024-001",
        category: "Technical Support",
        priority: "Medium"
      },
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  ],
  surveys: [
    {
      id: "sur_001",
      contactId: "contact_001",
      activityId: "act_001",
      surveyTitle: "Customer Satisfaction Survey",
      feedbackRecipient: { name: "Sarah Johnson", email: "sarah.johnson@techcorp.com" },
      channel: "Email",
      sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      language: "English",
      status: "Completed",
      participationMethod: "Email Link",
      participationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
      surveyResponseLink: "https://survey.example.com/response/12345",
      metricScores: { nps: 9, csat: 4.8, ces: 3.2 },
      driverScores: { product_quality: 5, support_experience: 4.5, pricing: 3.8 },
      openEndedSentiment: "positive",
      openEndedThemes: ["Product Quality", "Support Experience"],
      openEndedEmotions: ["Satisfaction", "Trust"]
    }
  ],
  notes: [],
  communicationMetrics: {
    emailReadRate: 89,
    responseRate: 72,
    lastContact: "2 days ago"
  },
  tags: [
    { type: 'system', label: 'High Value', color: 'green' },
    { type: 'system', label: 'Promoter', color: 'blue' },
    { type: 'ai', label: 'Enterprise', color: 'purple' },
    { type: 'ai', label: 'Frequent Buyer', color: 'orange' }
  ],
  nlpInsights: {
    overallSentiment: 'positive',
    confidence: 85,
    themes: ['Product Quality', 'Support', 'Pricing'],
    emotions: ['Trust', 'Satisfaction', 'Loyalty'],
    analysis: [
      {
        theme: 'Product Quality',
        sentiment: 'positive',
        quote: 'The product exceeded my expectations. Very reliable and user-friendly interface.',
        emotions: ['Satisfaction', 'Quality']
      }
    ]
  }
};

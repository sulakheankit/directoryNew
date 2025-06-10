import { contacts, activities, surveys, notes, type Contact, type Activity, type Survey, type Note, type InsertContact, type InsertActivity, type InsertSurvey, type InsertNote, type ContactWithData } from "@shared/schema";

export interface IStorage {
  // Contacts
  getContact(id: string): Promise<Contact | undefined>;
  getContactWithData(id: string): Promise<ContactWithData | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;

  // Activities
  getActivitiesByContactId(contactId: string): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Surveys
  getSurveysByContactId(contactId: string): Promise<Survey[]>;
  createSurvey(survey: InsertSurvey): Promise<Survey>;

  // Notes
  getNotesByContactId(contactId: string): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;
}

export class MemStorage implements IStorage {
  private contacts: Map<string, Contact>;
  private activities: Map<string, Activity>;
  private surveys: Map<string, Survey>;
  private notes: Map<string, Note>;

  constructor() {
    this.contacts = new Map();
    this.activities = new Map();
    this.surveys = new Map();
    this.notes = new Map();
    this.initializeMockData();
  }

  private initializeMockData() {
    // Sample contact
    const contact: Contact = {
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
      updatedAt: new Date()
    };

    // Sample activities
    const activity1: Activity = {
      id: "act_001",
      contactId: "contact_001",
      activity: "Customer Satisfaction Survey",
      activityFields: {
        survey_id: "SUR-2024-003",
        category: "Feedback"
      },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    };

    const activity2: Activity = {
      id: "act_002",
      contactId: "contact_001",
      activity: "Support Ticket",
      activityFields: {
        ticket_id: "SUP-2024-001",
        category: "Technical Support",
        priority: "Medium"
      },
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 1 week ago
    };

    const activity3: Activity = {
      id: "act_003",
      contactId: "contact_001",
      activity: "Purchase",
      activityFields: {
        order_id: "ORD-2024-0158",
        product: "Enterprise License Renewal",
        amount: 25000,
        payment_method: "Bank Transfer"
      },
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 2 weeks ago
    };

    // Sample surveys
    const survey1: Survey = {
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
      participationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 4 hours after sent
      surveyResponseLink: "https://survey.example.com/response/12345",
      metricScores: {
        nps: 9,
        csat: 4.8,
        ces: 3.2
      },
      driverScores: {
        product_quality: 5,
        support_experience: 4.5,
        pricing: 3.8
      },
      openEndedSentiment: "positive",
      openEndedThemes: ["Product Quality", "Support Experience"],
      openEndedEmotions: ["Satisfaction", "Trust"]
    };

    const survey2: Survey = {
      id: "sur_002",
      contactId: "contact_001",
      activityId: null,
      surveyTitle: "Product Feedback Survey",
      feedbackRecipient: { name: "Sarah Johnson", email: "sarah.johnson@techcorp.com" },
      channel: "SMS",
      sentAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000),
      language: "English",
      status: "Read",
      participationMethod: null,
      participationDate: null,
      surveyResponseLink: "https://survey.example.com/response/12346",
      metricScores: null,
      driverScores: null,
      openEndedSentiment: null,
      openEndedThemes: null,
      openEndedEmotions: null
    };

    // Sample notes
    const note1: Note = {
      id: "note_001",
      contactId: "contact_001",
      content: "High-value customer showing interest in additional services. Follow up on enterprise package upgrade opportunities.",
      authorName: "John Doe",
      authorInitials: "JD",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    };

    const note2: Note = {
      id: "note_002",
      contactId: "contact_001",
      content: "Resolved technical issue with API integration. Customer very satisfied with support response time.",
      authorName: "Mike Smith",
      authorInitials: "MS",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    };

    const note3: Note = {
      id: "note_003",
      contactId: "contact_001",
      content: "Completed successful license renewal. Expressed interest in training services for new team members.",
      authorName: "Alice Lee",
      authorInitials: "AL",
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    };

    // Store data
    this.contacts.set(contact.id, contact);
    this.activities.set(activity1.id, activity1);
    this.activities.set(activity2.id, activity2);
    this.activities.set(activity3.id, activity3);
    this.surveys.set(survey1.id, survey1);
    this.surveys.set(survey2.id, survey2);
    this.notes.set(note1.id, note1);
    this.notes.set(note2.id, note2);
    this.notes.set(note3.id, note3);
  }

  async getContact(id: string): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async getContactWithData(id: string): Promise<ContactWithData | undefined> {
    const contact = this.contacts.get(id);
    if (!contact) return undefined;

    const activities = await this.getActivitiesByContactId(id);
    const surveys = await this.getSurveysByContactId(id);
    const notes = await this.getNotesByContactId(id);

    // Mock communication metrics
    const communicationMetrics = {
      emailReadRate: 89,
      responseRate: 72,
      lastContact: "2 days ago"
    };

    // Mock tags
    const tags = [
      { type: 'system' as const, label: 'High Value', color: 'green' },
      { type: 'system' as const, label: 'Promoter', color: 'blue' },
      { type: 'ai' as const, label: 'Enterprise', color: 'purple' },
      { type: 'ai' as const, label: 'Frequent Buyer', color: 'orange' }
    ];

    // Mock NLP insights
    const nlpInsights = {
      overallSentiment: 'positive' as const,
      confidence: 85,
      themes: ['Product Quality', 'Support', 'Pricing'],
      emotions: ['Trust', 'Satisfaction', 'Loyalty'],
      analysis: [
        {
          theme: 'Product Quality',
          sentiment: 'positive' as const,
          quote: 'The product exceeded my expectations. Very reliable and user-friendly interface.',
          emotions: ['Satisfaction', 'Quality']
        },
        {
          theme: 'Support Experience',
          sentiment: 'positive' as const,
          quote: 'Customer support was incredibly helpful and resolved my issue quickly.',
          emotions: ['Gratitude', 'Support']
        },
        {
          theme: 'Pricing',
          sentiment: 'neutral' as const,
          quote: 'The pricing is fair for the value provided, though could be more competitive.',
          emotions: ['Consideration', 'Pricing']
        }
      ]
    };

    return {
      ...contact,
      activities,
      surveys,
      notes,
      communicationMetrics,
      tags,
      nlpInsights
    };
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const newContact: Contact = {
      ...contact,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.contacts.set(newContact.id, newContact);
    return newContact;
  }

  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  async getActivitiesByContactId(contactId: string): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.contactId === contactId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const newActivity: Activity = {
      ...activity,
      createdAt: new Date()
    };
    this.activities.set(newActivity.id, newActivity);
    return newActivity;
  }

  async getSurveysByContactId(contactId: string): Promise<Survey[]> {
    return Array.from(this.surveys.values())
      .filter(survey => survey.contactId === contactId)
      .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
  }

  async createSurvey(survey: InsertSurvey): Promise<Survey> {
    this.surveys.set(survey.id, survey);
    return survey;
  }

  async getNotesByContactId(contactId: string): Promise<Note[]> {
    return Array.from(this.notes.values())
      .filter(note => note.contactId === contactId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createNote(note: InsertNote): Promise<Note> {
    const newNote: Note = {
      ...note,
      createdAt: new Date()
    };
    this.notes.set(newNote.id, newNote);
    return newNote;
  }
}

export const storage = new MemStorage();

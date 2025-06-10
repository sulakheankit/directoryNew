import { Contact, Activity, Survey, Note, InsertContact, InsertActivity, InsertSurvey, InsertNote, ContactWithData } from "@shared/schema";

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

  // Bulk operations
  deleteAllContacts(): Promise<void>;
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
    // Empty storage - no sample data
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

    return {
      ...contact,
      activities,
      surveys,
      notes,
      communicationMetrics: {
        emailReadRate: 0.85,
        responseRate: 0.72,
        lastContact: "2024-01-20",
      },
      tags: [
        { type: 'ai', label: 'High Value', color: 'green' },
        { type: 'system', label: 'Enterprise', color: 'blue' }
      ],
      nlpInsights: {
        overallSentiment: 'positive',
        confidence: 0.89,
        themes: ['satisfaction', 'value', 'support'],
        emotions: ['satisfaction', 'trust'],
        analysis: [
          {
            theme: 'Product Quality',
            sentiment: 'positive',
            quote: 'The product quality exceeds our expectations',
            emotions: ['satisfaction', 'trust']
          },
          {
            theme: 'Support Experience',
            sentiment: 'positive', 
            quote: 'Support team was very responsive and helpful',
            emotions: ['relief', 'confidence']
          }
        ]
      }
    };
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const newContact: Contact = {
      ...contact,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.contacts.set(newContact.id, newContact);
    return newContact;
  }

  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getActivitiesByContactId(contactId: string): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.contactId === contactId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const newActivity: Activity = {
      ...activity,
      createdAt: new Date(),
    };
    
    this.activities.set(newActivity.id, newActivity);
    return newActivity;
  }

  async getSurveysByContactId(contactId: string): Promise<Survey[]> {
    return Array.from(this.surveys.values())
      .filter(survey => survey.contactId === contactId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createSurvey(survey: InsertSurvey): Promise<Survey> {
    const newSurvey: Survey = {
      ...survey,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.surveys.set(newSurvey.id, newSurvey);
    return newSurvey;
  }

  async getNotesByContactId(contactId: string): Promise<Note[]> {
    return Array.from(this.notes.values())
      .filter(note => note.contactId === contactId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createNote(note: InsertNote): Promise<Note> {
    const newNote: Note = {
      ...note,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.notes.set(newNote.id, newNote);
    return newNote;
  }

  async deleteAllContacts(): Promise<void> {
    console.log(`Deleting all contacts and related data...`);
    console.log(`Before deletion - Contacts: ${this.contacts.size}, Activities: ${this.activities.size}, Surveys: ${this.surveys.size}, Notes: ${this.notes.size}`);
    
    this.contacts.clear();
    this.activities.clear();
    this.surveys.clear();
    this.notes.clear();
    
    console.log(`After deletion - Contacts: ${this.contacts.size}, Activities: ${this.activities.size}, Surveys: ${this.surveys.size}, Notes: ${this.notes.size}`);
    console.log("All contacts and related data deleted successfully");
  }
}

export const storage = new MemStorage();
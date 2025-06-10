import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNoteSchema, insertContactSchema, insertActivitySchema, insertSurveySchema } from "@shared/schema";
import multer from "multer";
import csv from "csv-parser";
import { Readable } from "stream";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure multer for file uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
      const allowedMimes = ['text/csv', 'application/json', 'text/plain', 'application/octet-stream'];
      const allowedExtensions = ['.csv', '.json'];
      const hasValidMime = allowedMimes.includes(file.mimetype);
      const hasValidExtension = allowedExtensions.some(ext => file.originalname.toLowerCase().endsWith(ext));
      
      if (hasValidMime || hasValidExtension) {
        cb(null, true);
      } else {
        cb(new Error('Only CSV and JSON files are allowed'));
      }
    }
  });

  // Get contact with all related data
  app.get("/api/contacts/:id", async (req, res) => {
    try {
      const contact = await storage.getContactWithData(req.params.id);
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      console.error("Error fetching contact:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all contacts
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Import contacts from CSV or JSON file
  app.post("/api/contacts/import", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileContent = req.file.buffer.toString('utf8');
      const contacts: any[] = [];
      const fileName = req.file.originalname.toLowerCase();

      if (fileName.endsWith('.json')) {
        // Parse JSON file
        try {
          const jsonData = JSON.parse(fileContent);
          const contactsArray = Array.isArray(jsonData) ? jsonData : [jsonData];
          
          // Transform the data format and extract unique contacts with associated data
          const contactMap = new Map();
          const activitiesMap = new Map();
          const surveysMap = new Map();
          
          for (const item of contactsArray) {
            console.log("Processing item:", JSON.stringify(item, null, 2));
            const contactId = item.contact_id || item.id || `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            // Only add contact if we haven't seen this contact ID before
            if (!contactMap.has(contactId)) {
              const contact = {
                id: contactId,
                directory: item.directory || "Imported Customers",
                directoryFields: item.directory_fields || item.directoryFields || {
                  name: item.name,
                  email: item.email,
                  phone: item.phone,
                  company: item.company,
                  role: item.role,
                  industry: item.industry,
                  annual_revenue: item.annual_revenue,
                  location: item.location,
                  join_date: item.join_date,
                  segment: item.segment
                }
              };
              contactMap.set(contactId, contact);
            }
            
            // Store activity data
            if (item.activity && item.activity_fields) {
              const activityId = `activity_${item.id || Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
              const activityData = {
                id: activityId,
                contactId: contactId,
                activity: item.activity,
                activityFields: item.activity_fields
              };
              activitiesMap.set(activityId, activityData);
              console.log("Extracted activity:", activityId, "for contact:", contactId);
              
              // Store survey data
              if (item.survey_id && item.survey_title) {
                const surveyData = {
                  id: item.survey_id,
                  contactId: contactId,
                  activityId: activityId,
                  surveyTitle: item.survey_title,
                  feedbackRecipient: item.feedback_recipient,
                  channel: item.channel,
                  sentAt: new Date(item.sent_at),
                  language: item.language || "English",
                  status: item.status,
                  participatedVia: item.participated_via,
                  participatedDate: item.participated_date ? new Date(item.participated_date) : null,
                  surveyResponseLink: item.survey_response_link,
                  metricsAndCustomMetrics: item.metrics_and_custom_metrics,
                  driverScores: item.driver_scores,
                  openEndedSentiment: item.open_ended_sentiment,
                  openEndedThemes: item.open_ended_themes,
                  openEndedEmotions: item.open_ended_emotions
                };
                surveysMap.set(item.survey_id, surveyData);
                console.log("Extracted survey:", item.survey_id, "for contact:", contactId);
              }
            }
          }
          
          // Convert maps to arrays
          contacts.push(...Array.from(contactMap.values()));
          
          // Store additional data for processing
          (contacts as any).activitiesData = Array.from(activitiesMap.values());
          (contacts as any).surveysData = Array.from(surveysMap.values());
        } catch (error) {
          console.error("JSON parsing error:", error);
          return res.status(400).json({ message: "Invalid JSON format: " + (error as Error).message });
        }
      } else if (fileName.endsWith('.csv')) {
        // Parse CSV file with JSON columns
        return new Promise((resolve, reject) => {
          const stream = Readable.from(fileContent);
          const contactMap = new Map();
          const activitiesMap = new Map();
          const surveysMap = new Map();
          
          stream
            .pipe(csv())
            .on('data', (data) => {
              console.log("Processing CSV row with keys:", Object.keys(data));
              console.log("Contact ID:", data['Contact ID']);
              console.log("Directory:", data['Directory']);
              console.log("Directory Fields raw:", data['Directory Fields (JSONb)']);
              
              try {
                const contactId = data['Contact ID'] || data['contact_id'] || `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                
                // Parse directory fields from JSON string
                let directoryFields = {};
                if (data['Directory Fields (JSONb)']) {
                  try {
                    // Handle escaped quotes in CSV JSON
                    let jsonStr = data['Directory Fields (JSONb)'];
                    // Remove outer quotes if they exist
                    if (jsonStr.startsWith('"') && jsonStr.endsWith('"')) {
                      jsonStr = jsonStr.slice(1, -1);
                    }
                    // Replace escaped quotes
                    jsonStr = jsonStr.replace(/""/g, '"');
                    directoryFields = JSON.parse(jsonStr);
                    console.log("Successfully parsed directory fields for", contactId, ":", directoryFields);
                  } catch (e) {
                    console.log("Error parsing directory fields JSON:", e);
                    console.log("Raw JSON string:", data['Directory Fields (JSONb)']);
                  }
                }
                
                // Only add contact if we haven't seen this contact ID before
                if (!contactMap.has(contactId)) {
                  const contact = {
                    id: contactId,
                    directory: data['Directory'] || "Imported Customers",
                    directoryFields: directoryFields
                  };
                  contactMap.set(contactId, contact);
                  console.log("Created CSV contact:", contactId, contact.directory);
                }
                
                // Parse activity data
                if (data['Activity'] && data['Activity Fields (JSONb)']) {
                  try {
                    let activityJsonStr = data['Activity Fields (JSONb)'];
                    if (activityJsonStr.startsWith('"') && activityJsonStr.endsWith('"')) {
                      activityJsonStr = activityJsonStr.slice(1, -1);
                    }
                    activityJsonStr = activityJsonStr.replace(/""/g, '"');
                    const activityFields = JSON.parse(activityJsonStr);
                    
                    const activityId = `activity_${contactId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    
                    const activityData = {
                      id: activityId,
                      contactId: contactId,
                      activity: data['Activity'],
                      activityFields: activityFields,
                      activityUploadDate: data['Activity Upload Date'] ? new Date(data['Activity Upload Date']) : null
                    };
                    activitiesMap.set(activityId, activityData);
                    console.log("Extracted CSV activity:", activityId, data['Activity']);
                  } catch (e) {
                    console.log("Error parsing activity fields JSON:", e);
                  }
                }
                
                // Parse survey data
                if (data['Survey ID'] && data['Survey Title']) {
                  try {
                    // Helper function to parse JSON fields
                    const parseJsonField = (jsonStr) => {
                      if (!jsonStr) return null;
                      if (jsonStr.startsWith('"') && jsonStr.endsWith('"')) {
                        jsonStr = jsonStr.slice(1, -1);
                      }
                      return JSON.parse(jsonStr.replace(/""/g, '"'));
                    };
                    
                    const surveyData = {
                      id: data['Survey ID'],
                      contactId: contactId,
                      activityId: null,
                      surveyTitle: data['Survey Title'],
                      feedbackRecipient: data['Feedback Recipient (JSONb)'] ? parseJsonField(data['Feedback Recipient (JSONb)']) : null,
                      channel: data['Channel'] || 'email',
                      sentAt: data['Sent At'] ? new Date(data['Sent At']) : new Date(),
                      language: data['Language'] || 'en',
                      status: data['Status'] || 'completed',
                      participatedVia: data['Participated Via'] || null,
                      participatedDate: data['Participated Date'] ? new Date(data['Participated Date']) : null,
                      surveyResponseLink: data['Survey Response Link'] || null,
                      metricScores: data['Metric and Custom Metric Scores (JSONb)'] ? parseJsonField(data['Metric and Custom Metric Scores (JSONb)']) : null,
                      driverScores: data['Driver Scores (JSONb)'] ? parseJsonField(data['Driver Scores (JSONb)']) : null,
                      openEndedSentiment: data['Open-Ended Sentiment'] || null,
                      openEndedThemes: data['Open-Ended Themes (JSONb)'] ? parseJsonField(data['Open-Ended Themes (JSONb)']) : null,
                      openEndedEmotions: data['Open-Ended Emotions (JSONb)'] ? parseJsonField(data['Open-Ended Emotions (JSONb)']) : null
                    };
                    surveysMap.set(data['Survey ID'], surveyData);
                    console.log("Extracted CSV survey:", data['Survey ID']);
                  } catch (e) {
                    console.log("Error parsing survey data JSON:", e);
                  }
                }
              } catch (error) {
                console.error("Error processing CSV row:", error);
              }
            })
            .on('end', async () => {
              try {
                const contactsArray = Array.from(contactMap.values());
                const activitiesArray = Array.from(activitiesMap.values());
                const surveysArray = Array.from(surveysMap.values());
                
                console.log(`Processing CSV: ${contactsArray.length} contacts, ${activitiesArray.length} activities, ${surveysArray.length} surveys`);
                
                const createdContacts = [];
                const createdActivities = [];
                const createdSurveys = [];
                
                // Create contacts
                for (const contactData of contactsArray) {
                  try {
                    const validatedContact = insertContactSchema.parse(contactData);
                    const createdContact = await storage.createContact(validatedContact);
                    createdContacts.push(createdContact);
                  } catch (validationError) {
                    console.error("Contact validation error:", validationError);
                  }
                }
                
                // Create activities
                for (const activityData of activitiesArray) {
                  try {
                    const validatedActivity = insertActivitySchema.parse(activityData);
                    const createdActivity = await storage.createActivity(validatedActivity);
                    createdActivities.push(createdActivity);
                  } catch (validationError) {
                    console.error("Activity validation error:", validationError);
                  }
                }
                
                // Create surveys
                for (const surveyData of surveysArray) {
                  try {
                    const validatedSurvey = insertSurveySchema.parse(surveyData);
                    const createdSurvey = await storage.createSurvey(validatedSurvey);
                    createdSurveys.push(createdSurvey);
                  } catch (validationError) {
                    console.error("Survey validation error:", validationError);
                  }
                }
                
                res.json({ 
                  message: `Successfully imported ${createdContacts.length} contacts with ${createdActivities.length} activities and ${createdSurveys.length} surveys`,
                  imported: createdContacts.length,
                  contacts: createdContacts,
                  activities: createdActivities,
                  surveys: createdSurveys
                });
                resolve(res);
              } catch (error) {
                console.error("Error creating contacts from CSV:", error);
                res.status(500).json({ message: "Error importing contacts" });
                reject(error);
              }
            })
            .on('error', (error) => {
              console.error("CSV parsing error:", error);
              res.status(400).json({ message: "Invalid CSV format" });
              reject(error);
            });
        });
      } else {
        return res.status(400).json({ message: "Unsupported file format. Please upload a CSV or JSON file." });
      }

      // Handle JSON import with complete data processing
      if (fileName.endsWith('.json')) {
        const createdContacts = [];
        const createdActivities = [];
        const createdSurveys = [];
        
        console.log(`Processing ${contacts.length} contacts for import`);
        
        // Get the additional data arrays
        const activitiesData = (contacts as any).activitiesData || [];
        const surveysData = (contacts as any).surveysData || [];
        
        // Create all contacts first
        for (const contactData of contacts) {
          try {
            console.log("Processing contact:", contactData.id, contactData.directory);
            
            if (!contactData.id) {
              contactData.id = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            }
            if (!contactData.directory) {
              contactData.directory = "Imported Customers";
            }
            
            const validatedContact = insertContactSchema.parse(contactData);
            const createdContact = await storage.createContact(validatedContact);
            createdContacts.push(createdContact);
            console.log("Created contact:", createdContact.id);
          } catch (validationError) {
            console.error("Validation error for contact:", contactData.id, validationError);
          }
        }
        
        // Create activities
        console.log(`Creating ${activitiesData.length} activities`);
        for (const activityData of activitiesData) {
          try {
            const validatedActivity = insertActivitySchema.parse(activityData);
            const createdActivity = await storage.createActivity(validatedActivity);
            createdActivities.push(createdActivity);
            console.log("Created activity:", createdActivity.id, "for contact:", createdActivity.contactId);
          } catch (validationError) {
            console.error("Validation error for activity:", activityData.id, validationError);
          }
        }
        
        // Create surveys
        console.log(`Creating ${surveysData.length} surveys`);
        for (const surveyData of surveysData) {
          try {
            const validatedSurvey = insertSurveySchema.parse(surveyData);
            const createdSurvey = await storage.createSurvey(validatedSurvey);
            createdSurveys.push(createdSurvey);
            console.log("Created survey:", createdSurvey.id, "for contact:", createdSurvey.contactId);
          } catch (validationError) {
            console.error("Validation error for survey:", surveyData.id, validationError);
          }
        }
        
        console.log(`Successfully created ${createdContacts.length} contacts, ${createdActivities.length} activities, ${createdSurveys.length} surveys`);
        res.json({ 
          message: `Successfully imported ${createdContacts.length} contacts with ${createdActivities.length} activities and ${createdSurveys.length} surveys`,
          imported: createdContacts.length,
          contacts: createdContacts,
          activities: createdActivities,
          surveys: createdSurveys
        });
      }

    } catch (error) {
      console.error("Error importing contacts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create a new note
  app.post("/api/contacts/:id/notes", async (req, res) => {
    try {
      const contactId = req.params.id;
      const noteData = insertNoteSchema.parse({
        ...req.body,
        contactId,
        id: `note_${Date.now()}`
      });

      const note = await storage.createNote(noteData);
      res.status(201).json(note);
    } catch (error) {
      console.error("Error creating note:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete all contacts endpoint
  app.delete("/api/contacts/all", async (req, res) => {
    try {
      await storage.deleteAllContacts();
      res.json({ message: "All contacts and associated data deleted successfully" });
    } catch (error) {
      console.error("Error deleting all contacts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

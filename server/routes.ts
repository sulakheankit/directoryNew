import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNoteSchema, insertContactSchema } from "@shared/schema";
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
          
          // Transform the data format and extract unique contacts
          const contactMap = new Map();
          
          for (const item of contactsArray) {
            const contactId = item.contact_id || item.id || `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            // Only add if we haven't seen this contact ID before
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
          }
          
          // Convert map values to array
          contacts.push(...Array.from(contactMap.values()));
        } catch (error) {
          console.error("JSON parsing error:", error);
          return res.status(400).json({ message: "Invalid JSON format: " + (error as Error).message });
        }
      } else if (fileName.endsWith('.csv')) {
        // Parse CSV file
        return new Promise((resolve, reject) => {
          const stream = Readable.from(fileContent);
          stream
            .pipe(csv())
            .on('data', (data) => {
              // Convert CSV row to contact format
              const contact = {
                id: data.contact_id || data.id || `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                directory: data.directory || "Imported Customers",
                directoryFields: {
                  name: data.name || `${data.first_name || ''} ${data.last_name || ''}`.trim(),
                  email: data.email,
                  phone: data.phone,
                  company: data.company,
                  role: data.role,
                  industry: data.industry,
                  annual_revenue: data.annual_revenue ? parseInt(data.annual_revenue) : undefined,
                  location: data.location || `${data.city || ''}, ${data.state || data.state_province || ''}`.trim(),
                  join_date: data.join_date || data.created_date,
                  segment: data.segment
                }
              };
              contacts.push(contact);
            })
            .on('end', async () => {
              try {
                const createdContacts = [];
                for (const contactData of contacts) {
                  try {
                    const validatedContact = insertContactSchema.parse(contactData);
                    const createdContact = await storage.createContact(validatedContact);
                    createdContacts.push(createdContact);
                  } catch (validationError) {
                    console.warn("Skipping invalid contact:", validationError);
                  }
                }
                res.json({ 
                  message: `Successfully imported ${createdContacts.length} contacts`,
                  imported: createdContacts.length,
                  contacts: createdContacts
                });
                resolve(res);
              } catch (error) {
                console.error("Error creating contacts:", error);
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

      // Handle JSON import
      if (fileName.endsWith('.json')) {
        const createdContacts = [];
        for (const contactData of contacts) {
          try {
            // Ensure required fields are present
            if (!contactData.id) {
              contactData.id = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            }
            if (!contactData.directory) {
              contactData.directory = "Imported Customers";
            }
            
            const validatedContact = insertContactSchema.parse(contactData);
            const createdContact = await storage.createContact(validatedContact);
            createdContacts.push(createdContact);
          } catch (validationError) {
            console.warn("Skipping invalid contact:", validationError);
          }
        }
        
        res.json({ 
          message: `Successfully imported ${createdContacts.length} contacts`,
          imported: createdContacts.length,
          contacts: createdContacts
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

  const httpServer = createServer(app);
  return httpServer;
}

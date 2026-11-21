import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { getDocuments, addDocument, deleteDocument } from '../services/dbService.js';
import { parseFileContent } from '../services/fileParser.js';
import { DocumentItem } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, '../../uploads');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

const router = Router();

// Get all documents
router.get('/', (req: Request, res: Response): void => {
  const userId = (req.query.userId as string) || 'user-alex-kumar';
  const docs = getDocuments(userId);
  res.json({ success: true, documents: docs });
});

// Upload file
router.post('/upload', upload.single('file'), (req: Request, res: Response): void => {
  try {
    const file = req.file;
    const { title, subject, chapter, topic, userId = 'user-alex-kumar' } = req.body;

    if (!file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const content = parseFileContent(file.path, file.originalname, file.mimetype);
    const ext = file.originalname.split('.').pop()?.toUpperCase() || 'FILE';

    const newDoc: DocumentItem = {
      id: `doc-${uuidv4().substring(0, 8)}`,
      userId,
      title: title || file.originalname,
      subject: subject || 'Computer Science',
      chapter: chapter || 'General Chapter',
      topic: topic || 'Overview',
      content,
      fileType: ext,
      uploadedAt: new Date().toISOString()
    };

    addDocument(newDoc);
    res.json({ success: true, document: newDoc });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error processing upload' });
  }
});

// Paste text notes
router.post('/paste', (req: Request, res: Response): void => {
  try {
    const { title, subject, chapter, topic, content, userId = 'user-alex-kumar' } = req.body;

    if (!content || content.trim().length === 0) {
      res.status(400).json({ success: false, message: 'Content cannot be empty' });
      return;
    }

    const newDoc: DocumentItem = {
      id: `doc-${uuidv4().substring(0, 8)}`,
      userId,
      title: title || 'Pasted Notes',
      subject: subject || 'Computer Science',
      chapter: chapter || 'Chapter 1',
      topic: topic || 'General Notes',
      content,
      fileType: 'TXT',
      uploadedAt: new Date().toISOString()
    };

    addDocument(newDoc);
    res.json({ success: true, document: newDoc });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error saving notes' });
  }
});

// Delete document
router.delete('/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  const userId = (req.query.userId as string) || 'user-alex-kumar';
  const success = deleteDocument(id, userId);
  res.json({ success });
});

export default router;

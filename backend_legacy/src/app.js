const express = require('express');
const cors = require('cors');
const dbConnect = require('./infrastructure/database/connect');

// Modules
const pagesController = require('./modules/pages/pages.controller');
const foldersController = require('./modules/folders/folders.controller');

const app = express();

// Robust CORS for Vercel
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        // Trust any origin
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Explicit OPTIONS handler for preflight
app.options('*', cors());
app.use(express.json());

// Connect to DB immediately
dbConnect().catch(err => console.error("Database connection error:", err));

// Routes - Pages
const pagesRouter = express.Router();
pagesRouter.get('/', pagesController.getPages);
pagesRouter.get('/id/:id', pagesController.getPageById);
pagesRouter.get('/slug/:slug', pagesController.getPageBySlug);
pagesRouter.post('/', pagesController.createPage);
pagesRouter.put('/:id', pagesController.updatePage);
pagesRouter.delete('/:id', pagesController.deletePage);
pagesRouter.post('/:id/view', pagesController.incrementView);

// Routes - Folders
const foldersRouter = express.Router();
foldersRouter.get('/', foldersController.getFolders);
foldersRouter.get('/:id', foldersController.getFolderById);
foldersRouter.post('/', foldersController.createFolder);
foldersRouter.delete('/:id', foldersController.deleteFolder);

// Mount Routes
app.use('/api/pages', pagesRouter);
app.use('/api/folders', foldersRouter);

// Health Checks
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Express Backend!' });
});

app.get('/', (req, res) => {
    res.send('Backend is running');
});

module.exports = app;

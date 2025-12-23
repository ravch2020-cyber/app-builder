const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const AEMPackageManager = require('./aemPackageManager');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../public')));

// In-memory storage for AEM credentials (for demo purposes)
// In production, use secure session management
let aemManager = null;

/**
 * POST /api/authenticate
 * Authenticate with AEM server
 */
app.post('/api/authenticate', (req, res) => {
  try {
    const { aemEndpoint, username, password } = req.body;

    if (!aemEndpoint || !username || !password) {
      return res.status(400).json({ 
        error: 'Missing required fields: aemEndpoint, username, password' 
      });
    }

    // Create AEM Package Manager instance
    aemManager = new AEMPackageManager(aemEndpoint, username, password);

    res.json({ 
      success: true, 
      message: 'Authentication successful' 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Authentication failed', 
      details: error.message 
    });
  }
});

/**
 * GET /api/packages
 * Fetch available packages from AEM
 */
app.get('/api/packages', async (req, res) => {
  try {
    if (!aemManager) {
      return res.status(401).json({ 
        error: 'Not authenticated. Please authenticate first.' 
      });
    }

    const packages = await aemManager.fetchPackages();
    res.json({ 
      success: true, 
      packages: packages 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch packages', 
      details: error.message 
    });
  }
});

/**
 * POST /api/download
 * Download a package from AEM
 */
app.post('/api/download', async (req, res) => {
  try {
    if (!aemManager) {
      return res.status(401).json({ 
        error: 'Not authenticated. Please authenticate first.' 
      });
    }

    const { packagePath } = req.body;

    if (!packagePath) {
      return res.status(400).json({ 
        error: 'Missing required field: packagePath' 
      });
    }

    const result = await aemManager.downloadPackageStream(packagePath);

    // Set headers for file download
    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);

    // Pipe the stream to response with error handling
    result.stream.on('error', (streamError) => {
      console.error('Stream error:', streamError);
      if (!res.headersSent) {
        res.status(500).json({ 
          error: 'Failed to download package', 
          details: streamError.message 
        });
      } else {
        res.end();
      }
    });

    result.stream.pipe(res);
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Failed to download package', 
        details: error.message 
      });
    }
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString() 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`AEM Package Downloader server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} to access the application`);
});

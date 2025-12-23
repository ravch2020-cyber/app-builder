# AEM Package Downloader

A Node.js application to download content packages from an Adobe Experience Manager (AEM) server as zip files to your local system.

## Features

- 🔐 **Secure Authentication**: Connect to AEM using Basic Authentication
- 📦 **Package Management**: Browse and list all available content packages
- ⬇️ **Easy Downloads**: Download packages directly to your local system
- 🌐 **Web Interface**: Simple and intuitive web-based UI
- 🚀 **RESTful API**: Backend API for integration with other tools

## Tech Stack

- **Backend**: Node.js with Express.js
- **HTTP Client**: Axios
- **Frontend**: HTML, CSS, JavaScript (Vanilla)

## Directory Structure

```
app-builder/
├── src/
│   └── main/
│       ├── aemPackageManager.js  # AEM integration logic
│       └── server.js              # Express server
├── public/
│   └── index.html                 # Frontend interface
├── .env.example                   # Environment configuration template
├── .gitignore                     # Git ignore rules
├── package.json                   # Node.js dependencies
└── README.md                      # This file
```

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd app-builder
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment (optional)**:
   ```bash
   cp .env.example .env
   # Edit .env with your default AEM settings
   ```

## Usage

### Starting the Application

```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

### Using the Web Interface

1. Open your browser and navigate to `http://localhost:3000`
2. Enter your AEM server details:
   - **AEM Endpoint**: Your AEM server URL (e.g., `https://your-aem-server.com`)
   - **Username**: Your AEM username
   - **Password**: Your AEM password
3. Click **Connect to AEM**
4. Browse the list of available packages
5. Click **Download** on any package to download it to your local system

### API Endpoints

#### 1. Health Check
```http
GET /api/health
```

**Response**:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### 2. Authenticate
```http
POST /api/authenticate
Content-Type: application/json

{
  "aemEndpoint": "https://your-aem-server.com",
  "username": "admin",
  "password": "admin"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Authentication successful"
}
```

#### 3. List Packages
```http
GET /api/packages
```

**Response**:
```json
{
  "success": true,
  "packages": [
    {
      "name": "example-package",
      "group": "my-packages",
      "version": "1.0.0",
      "path": "/etc/packages/my-packages/example-package-1.0.0.zip",
      "downloadName": "example-package-1.0.0.zip",
      "size": 1024000,
      "lastModified": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 4. Download Package
```http
POST /api/download
Content-Type: application/json

{
  "packagePath": "/etc/packages/my-packages/example-package-1.0.0.zip"
}
```

**Response**: Binary zip file download

## Security Considerations

⚠️ **Important Security Notes**:

1. **Never commit credentials**: The `.env` file is gitignored. Never commit actual credentials.
2. **HTTPS Only**: Always use HTTPS endpoints in production.
3. **Authentication**: This demo uses in-memory session management. For production, implement proper session management with secure tokens.
4. **CORS**: Configure CORS appropriately for your production environment.
5. **Input Validation**: Additional validation should be added for production use.

## Development

### Running in Development Mode

```bash
npm run dev
```

### Project Structure

- **`src/main/aemPackageManager.js`**: Core logic for interacting with AEM Package Manager API
- **`src/main/server.js`**: Express server with REST API endpoints
- **`public/index.html`**: Frontend user interface

## Troubleshooting

### Connection Issues

- Verify your AEM server URL is correct and accessible
- Ensure your AEM instance allows the Package Manager API
- Check network connectivity and firewall rules

### Authentication Failures

- Verify credentials are correct
- Ensure your AEM user has appropriate permissions
- Check if your AEM instance requires additional authentication headers

### Download Failures

- Verify the package path is correct
- Ensure you have sufficient disk space
- Check if the package exists in AEM

## Future Enhancements

- [ ] Add unit and integration tests
- [ ] Implement secure session management with JWT
- [ ] Add package upload functionality
- [ ] Support for package installation/uninstallation
- [ ] Enhanced frontend with React
- [ ] Package search and filtering
- [ ] Bulk download support
- [ ] Progress indicators for large downloads

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

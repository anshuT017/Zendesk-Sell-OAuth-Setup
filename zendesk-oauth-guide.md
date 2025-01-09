# Setting Up OAuth for Zendesk Sell - Implementation Guide

## Table of Contents
1. Prerequisites
2. Registering Your Application
3. Implementation Steps
4. Code Implementation
5. Testing
6. Troubleshooting

## 1. Prerequisites
- Zendesk Sell account
- Node.js installed (for JavaScript implementation)
- Python installed (for Python implementation)
- Basic understanding of OAuth 2.0

## 2. Registering Your Application
1. Log in to your Zendesk Sell account
2. Navigate to Settings → OAuth
3. Click "Add New Application"
4. Fill in required details:
   - Application Name
   - Redirect URI (e.g., http://localhost:5000/callback)
   - Description (optional)
5. Save the provided credentials:
   - Client ID
   - Client Secret

## 3. Implementation Steps

### 3.1 Environment Setup

Create a `.env` file with your credentials:
```
ZENDESK_CLIENT_ID=your_client_id
ZENDESK_CLIENT_SECRET=your_client_secret
REDIRECT_URI=http://localhost:5000/callback
PORT=5000
```

### 3.2 Dependencies Installation

For JavaScript (Node.js):
```bash
npm init -y
npm install express axios dotenv express-session
```

For Python:
```bash
pip install flask requests python-dotenv
```

## 4. Code Implementation

### 4.1 JavaScript Implementation
```javascript
const express = require('express');
const axios = require('axios');
require('dotenv').config();

// ... [Rest of the JavaScript code from previous implementation]
```

### 4.2 Python Implementation
```python
from flask import Flask, request, redirect, session, jsonify
import requests
import os
from dotenv import load_dotenv

# ... [Rest of the Python code from previous implementation]
```

## 5. Testing

1. Start the server:
   - JavaScript: `node app.js`
   - Python: `python app.py`

2. Access the application:
   - Open browser: http://localhost:5000
   - Click "Login with Zendesk"
   - Complete authorization

3. Verify responses:
   - Check browser for JSON response
   - Check console for token output
   - Test /tokens endpoint

## 6. OAuth Flow Endpoints

### Authorization Endpoint
```
https://api.getbase.com/oauth2/authorize
```
Required Parameters:
- client_id
- response_type=code
- redirect_uri

### Token Endpoint
```
https://api.getbase.com/oauth2/token
```
Required Parameters:
- grant_type=authorization_code
- code
- redirect_uri

## 7. Response Format

Successful token response:
```json
{
  "access_token": "your_access_token",
  "refresh_token": "your_refresh_token",
  "token_type": "bearer",
  "expires_in": 3600
}
```

## 8. Using the Access Token

Make API requests with the Bearer token:
```javascript
const headers = {
  'Authorization': `Bearer ${access_token}`,
  'Content-Type': 'application/json'
};
```

## 9. Troubleshooting

Common issues and solutions:

### Invalid Redirect URI
- Ensure the redirect URI matches exactly what's registered
- Check for trailing slashes
- Verify protocol (http/https)

### Authorization Failed
- Verify client ID and secret
- Check if credentials are properly set in .env
- Ensure proper encoding of credentials

### Token Request Failed
- Verify authorization code hasn't expired
- Check if redirect URI matches the one used in auth request
- Verify content-type headers

## 10. Best Practices

1. **Security**
   - Store credentials securely
   - Use environment variables
   - Implement proper error handling

2. **Token Management**
   - Store tokens securely
   - Implement token refresh logic
   - Handle token expiration

3. **Error Handling**
   - Implement proper error messages
   - Log errors appropriately
   - Provide user-friendly error responses

## 11. Additional Resources

- [Zendesk API Documentation](https://developer.zendesk.com)
- [OAuth 2.0 Specification](https://oauth.net/2/)
- [Express.js Documentation](https://expressjs.com)
- [Flask Documentation](https://flask.palletsprojects.com)

---

For any issues or questions, refer to the Zendesk support documentation or contact their support team.

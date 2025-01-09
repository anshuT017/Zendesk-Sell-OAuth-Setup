from flask import Flask, request, redirect, session, jsonify
import requests
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.urandom(24)

# Configuration
CLIENT_ID = os.getenv('ZENDESK_CLIENT_ID')
CLIENT_SECRET = os.getenv('ZENDESK_CLIENT_SECRET')
REDIRECT_URI = os.getenv('REDIRECT_URI')
AUTH_URL = 'https://api.getbase.com/oauth2/authorize'
TOKEN_URL = 'https://api.getbase.com/oauth2/token'

@app.route('/')
def index():
    return '''
        <h1>Zendesk OAuth Example</h1>
        <a href="/login">Login with Zendesk</a>
    '''

@app.route('/login')
def login():
    auth_params = {
        'client_id': CLIENT_ID,
        'response_type': 'code',
        'redirect_uri': REDIRECT_URI
    }
    
    query_string = '&'.join([f'{k}={v}' for k, v in auth_params.items()])
    auth_url = f'{AUTH_URL}?{query_string}'
    
    return redirect(auth_url)

@app.route('/callback')
def callback():
    code = request.args.get('code')
    if not code:
        return jsonify({'error': 'Authorization code not received.'}), 400
    
    token_data = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI
    }
    
    response = requests.post(
        TOKEN_URL,
        auth=(CLIENT_ID, CLIENT_SECRET),
        data=token_data
    )
    
    if response.status_code == 200:
        tokens = response.json()
        
        # Store tokens in session
        session['access_token'] = tokens['access_token']
        session['refresh_token'] = tokens['refresh_token']
        
        # Create JSON response
        token_response = {
            'access_token': tokens['access_token'],
            'refresh_token': tokens['refresh_token'],
            'token_type': tokens['token_type'],
            'expires_in': tokens['expires_in']
        }
        
        # Print tokens to console
        print("\n=== OAuth Tokens ===")
        print(json.dumps(token_response, indent=2))
        print("==================\n")
        
        # Return JSON response
        return jsonify(token_response)
    else:
        error_response = {
            'error': 'Failed to get access token',
            'details': response.text
        }
        print("\n=== OAuth Error ===")
        print(json.dumps(error_response, indent=2))
        print("=================\n")
        return jsonify(error_response), 400

@app.route('/tokens')
def get_tokens():
    if 'access_token' not in session or 'refresh_token' not in session:
        return jsonify({'error': 'No tokens found in session'}), 404
        
    tokens = {
        'access_token': session['access_token'],
        'refresh_token': session['refresh_token']
    }
    return jsonify(tokens)

if __name__ == '__main__':
    app.run(debug=True)
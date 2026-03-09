#!/bin/bash
# ============================================================
# Backend startup script template
# 1. Copy this file: cp start-backend.example.sh start-backend.sh
# 2. Fill in your real values in start-backend.sh
# 3. Make it executable once: chmod +x start-backend.sh
# 4. Run it: ./start-backend.sh
# ============================================================

# --- Database ---
export DB_USERNAME=<your_db_username>
export DB_PASSWORD=<your_db_password>

# --- Twilio (SMS) ---
export TWILIO_ACCOUNT_SID=<your_twilio_account_sid>
export TWILIO_AUTH_TOKEN=<your_twilio_auth_token>
export TWILIO_PHONE_NUMBER=<your_twilio_phone_number>

# --- Notify.EU (Email) ---
export NOTIFY_SECRET_KEY=<your_notify_secret_key>
export NOTIFY_CLIENT_ID=<your_notify_client_id>
export NOTIFY_TEMPLATE_ID=<your_notify_template_id>
export NOTIFYEU_API_KEY=<your_notifyeu_api_key>
export NOTIFYEU_SENDER=<your_notifyeu_sender>
export NOTIFYEU_RECIPIENT=<your_notifyeu_recipient>

# --- Start the server ---
./mvnw spring-boot:run

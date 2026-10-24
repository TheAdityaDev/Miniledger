💸 MiniLedger

A simple money-lending tracker built with Node.js, TypeScript, PostgreSQL, and React Native.

MiniLedger helps users track money lent to friends, manage repayments, and monitor overdue loans through a simple mobile application.

✨ Features
📱 Phone Authentication — Login using a phone number and mock OTP.
💰 Add Loans — Record friend's name, amount, and due date.
🔄 Track Repayments — Mark loans as repaid.
📊 Loan Summary — View total lent, total repaid, and overdue amount.
🚨 Overdue Tracking — Highlight overdue loans.
🧾 Receipt Upload — Optionally upload receipts for loan entries.
✅ Input Validation — Validate user inputs and API requests.
🧪 Testing — Basic API and application tests.
🛠️ Tech Stack

Backend

Node.js
Express.js
TypeScript
PostgreSQL

Mobile App

React Native
TypeScript
Axios

Optional Tools

Multer for file uploads
Jest and Supertest for testing
JWT for authentication
📁 Project Structure
MiniLedger/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── config/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── tests/
│   ├── .env.example
│   └── package.json
├── mobile/
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── services/
│   │   └── navigation/
│   └── package.json
├── .gitignore
└── README.md

🚀 Getting Started
Prerequisites
Node.js and npm
PostgreSQL
React Native development environment
Android Studio or Xcode
1. Clone the Repository
git clone <your-repository-url>
cd MiniLedger

2. Set Up the Backend
cd backend
npm install


Create a .env file:

PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/miniledger
JWT_SECRET=your_development_secret
NODE_ENV=development


Create the PostgreSQL database:

CREATE DATABASE miniledger;


Run the database migrations or schema setup, then start the server:

npm run dev


The backend runs at http://localhost:5000.

Note: The mock OTP is printed in the backend terminal for development and testing.

3. Set Up the Mobile App

Open a new terminal:

cd frontend
npm install


Configure the backend URL in your API configuration.

For an Android emulator, use:

export const API_BASE_URL = "http://10.0.2.2:5000";


Start Metro:

npx expo start


Run the Android application in another terminal:

npx react-native run-android


For iOS, on macOS:

npx react-native run-ios

🔗 API Endpoints

Base URL: http://localhost:5000/api

Method	Endpoint	Description
POST	/auth/login	Request a mock OTP
POST	/auth/verify-otp	Verify OTP and log in
POST	/loans	Create a loan entry
GET	/loans	Retrieve loan entries
GET	/loans/summary	Get the loan summary
PATCH	/loans/:id/repay	Mark a loan as repaid
POST	/file/upload	Upload a receipt image

Protected endpoints should require authentication if token-based authentication is implemented.

📊 Loan Summary

Example response from GET /loans/summary:

{
  "totalLent": 10000,
  "totalRepaid": 4000,
  "overdueAmount": 2000
}

Total Lent: Total original amount lent.
Total Repaid: Total amount repaid.
Overdue Amount: Outstanding amount on loans past their due date.
🗄️ Database

The application uses PostgreSQL to store user and loan information.

Users

id
phone
created_at

Loans

id
user_id
friend_name
amount
due_date
status
repaid_at
receipt_url
created_at

Loan records should be associated with their respective users to ensure data privacy.

🧪 Testing

If backend tests are configured:

cd backend
npm test


Recommended test coverage includes authentication, loan creation, repayment, summary calculations, validation, and receipt uploads.

🔐 Security Notes
Mock OTP authentication is for development only.
OTPs should never be logged in production.
Keep database credentials and secrets in environment variables.
Validate incoming requests and uploaded files.
Restrict users to accessing their own loan entries.
🔮 Future Enhancements
Real SMS OTP integration
Partial repayments and repayment history
Payment reminders and push notifications
Search and filter functionality
Cloud-based receipt storage
👨‍💻 Assignment

Developed as part of a Full Stack Development Internship Assignment.

MiniLedger — Track your loans. Stay on top of repayments. 💸
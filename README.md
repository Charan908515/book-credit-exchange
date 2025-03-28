
# Book Exchange Platform

A platform where users can exchange books using a credit system.

## Features

- List books for exchange
- Request books from other users
- Credit system for book exchanges
- User dashboard and profile management

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS, Shadcn UI
- Backend: Express.js, MongoDB, Mongoose
- State Management: React Query

## Getting Started

### Prerequisites

- Node.js
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```
   npm install
   ```
3. Install backend dependencies:
   ```
   cd src/server
   npm install
   ```

### Configuration

1. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/bookexchange
   PORT=5000
   ```

### Running the Application

1. Start the backend server:
   ```
   cd src/server
   npm run dev
   ```

2. Start the frontend development server:
   ```
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:8080`

## Database Models

### User
- Username
- Email
- Password
- Credits balance

### Book
- Title
- Author
- Genres
- Condition
- Credit value
- Cover image URL
- Owner ID

### Transaction
- User ID
- Book ID (optional)
- Type (credit/debit)
- Amount
- Description
- Date

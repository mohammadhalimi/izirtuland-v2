📋 Overview
porbarbaghestan Shop is a fully-featured e-commerce website designed for selling agricultural products such as chemical fertilizers, organic fertilizers, tools, and related items. The platform supports online purchasing, an administrative dashboard, user authentication via SMS panel, and a blog for SEO enhancement.

🛠️ Tech Stack
Frontend: Quik Framework (Built with Best Practice Architecture)

Backend: Express.js with Layered Architecture

Authentication: SMS-based verification (eliminating the need for repeated username/password entry)

Database: (MongoDB)

🏗️ Architecture
Frontend Architecture (Best Practice Patterns)
The frontend follows industry best practices including:

Component-Based Architecture: Modular, reusable components with clear separation of concerns

State Management: Efficient state handling for complex e-commerce interactions

Performance Optimization: Code splitting, lazy loading, and optimized rendering

Responsive Design: Mobile-first approach with adaptive layouts

Accessibility Compliance: WCAG standards implementation

Clean Code Principles: SOLID principles and consistent coding standards

Backend Architecture (Layered Architecture)
The backend implements a structured layered architecture:

text
┌─────────────────────────────────────┐
│         Presentation Layer          │
│    (Controllers / Route Handlers)   │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│           Service Layer             │
│      (Business Logic / Use Cases)   │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│          Data Access Layer          │
│   (Repositories / Database Models)  │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│         Database Layer              │
│             (MongoDB)
└─────────────────────────────────────┘
Architecture Benefits:

Separation of Concerns: Each layer has distinct responsibilities

Testability: Independent testing of each layer

Maintainability: Easy to modify or extend functionality

Scalability: Horizontal scaling capabilities

Security: Centralized validation and authorization

✨ Features
🛒 User Features
Product Browsing: View agricultural products with categories, descriptions, and pricing.

Online Purchasing: Add items to cart, checkout, and place orders securely.

Order Tracking: Users receive an order code and tracking code for their purchases.

SMS Authentication: Users log in/verify via SMS, eliminating manual username/password entry.

User Profile: Update profile picture, change display name, and modify password.

👑 Admin Panel
Role-Based Access Control:

Super Admin: Can add new admins, manage all roles, and oversee platform operations.

Admins: Manage products, orders, blog posts, and user lists.

Admin Profile Customization:

Upload profile pictures.

Change display names and passwords.

Order Management:

Confirm/reject orders.

View all user orders.

SMS Notifications:

Users receive SMS confirmation upon order placement.

Super Admin receives SMS alerts for new orders.

Product Management:

Add, edit, or delete products.

Blog Management:

Create, edit, or delete blog posts to improve SEO and engage users.

📦 Order Flow
User browses products and adds them to the cart.

User checks out and completes the order.

SMS confirmation is sent to the user.

Super Admin receives an SMS notification about the new order.

Admin confirms the order (or rejects it if necessary).

User receives order code and tracking details.

🚀 Installation & Setup
Prerequisites
Node.js installed

Database system (MongoDB)

SMS panel API credentials

Steps
Clone the repository:

bash
git clone https://github.com/mohammadhalimi/izirtuland-v2.git
Install dependencies for both frontend and backend:

bash
cd frontend && npm install  
cd ../backend && npm install  
Configure environment variables:

Create a .env file in the backend directory and add:

env
DATABASE_URL=your_database_connection_string  
SMS_API_KEY=your_sms_panel_api_key  
JWT_SECRET=your_jwt_secret  
NODE_ENV=development  
PORT=5000  
Run the development servers:

Backend (Express - Layered Architecture):

bash
cd backend && npm start  
Frontend (Quik - Best Practice Architecture):

bash
cd frontend && npm run dev  
Access the application:

Frontend: http://localhost:3000

Backend API: http://localhost:5000

📞 SMS Integration
Used for user authentication and order notifications.

Users receive a verification code via SMS to log in.

Super Admin receives alerts for new orders.

📈 SEO & Blog
Admins can publish, edit, and delete blog posts to improve organic search visibility.

Blog content focuses on agricultural tips, product guides, and industry news.

🔒 Security
SMS-based authentication for secure and convenient access.

Role-based permissions to restrict admin actions.

Protected API endpoints with JWT (if applicable).

Input validation and sanitization across all layers.

Secure password hashing and data encryption.

🧪 Testing
Frontend: Unit tests for components, integration tests for user flows

Backend:

Controller layer tests (API endpoints)

Service layer tests (business logic)

Repository layer tests (data access)

Integration tests (end-to-end flows)

📁 Project Structure
Frontend (Best Practice Architecture)
text
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Route-based page components
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Helper functions
│   ├── services/      # API service calls
│   ├── store/         # State management
│   ├── assets/        # Images, fonts, styles
│   └── types/         # TypeScript type definitions
Backend (Layered Architecture)
text
backend/
├── src/
│   ├── controllers/   # Route handlers (Presentation Layer)
│   ├── services/      # Business logic (Service Layer)
│   ├── repositories/  # Data access (Data Access Layer)
│   ├── models/        # Database schemas
│   ├── middleware/    # Custom middleware
│   ├── utils/         # Helper functions
│   ├── config/        # Configuration files
│   └── validators/    # Input validation schemas
🤝 Contribution
Fork the repository.

Create a feature branch (git checkout -b feature/AmazingFeature).

Commit changes (git commit -m 'Add some AmazingFeature').

Push to the branch (git push origin feature/AmazingFeature).

Open a Pull Request.

📄 License
Distributed under the MIT License. See LICENSE for more information.

👨‍💻 Contact
For questions or support, reach out via:

Email: mohammadhalimi.2001@gmail.com

GitHub Issues: Repository Issues Page

Happy Farming! 🌱
GitHub Issues: Repository Issues Page

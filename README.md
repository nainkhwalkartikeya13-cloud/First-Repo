<div align="center">
  <img src="frontend/src/assets/images/logo.png" alt="AEROLITH Logo" width="200" style="margin-bottom: 20px" onError="this.style.display='none'">
  
  # 🛍️ AEROLITH E-Commerce Platform
  
  **An Exclusive, High-Performance Destination for Luxury Shopping.**
  
  A modern, full-stack E-commerce platform built with the MERN stack. Designed with a premium aesthetic, featuring immersive 3D elements, secure scalable infrastructure, and a robust administrative dashboard.
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)](https://redux.js.org/)
  [![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
  
  [Report Bug](https://github.com/KartikeyaNainkhwal/aerolith/issues) · [Request Feature](https://github.com/KartikeyaNainkhwal/aerolith/issues)
</div>

<br />

## 🎥 Project Demo & Screenshots

### 🛒 User Journey (Customer Experience)
<div align="center">
  <img src="screenshots/1.png" alt="Hero Section" width="48%">
  <img src="screenshots/2.png" alt="Product Listing" width="48%">
  <br>
  <img src="screenshots/3.png" alt="Product Detail" width="48%">
  <img src="screenshots/4.png" alt="Cart View" width="48%">
  <br>
  <img src="screenshots/5.png" alt="Shipping Details" width="48%">
  <img src="screenshots/6.png" alt="Order Review" width="48%">
  <br>
  <img src="screenshots/7.png" alt="Razorpay Integration" width="48%">
  <img src="screenshots/8.png" alt="Order Confirmation" width="48%">
</div>

### 🛡️ Administrative Dashboard
<div align="center">
  <img src="screenshots/9.png" alt="Admin Analytics" width="48%">
  <img src="screenshots/10.png" alt="Product Management" width="48%">
  <br>
  <img src="screenshots/11.png" alt="Category Management" width="48%">
  <img src="screenshots/12.png" alt="Order Management" width="48%">
  <br>
  <img src="screenshots/13.png" alt="User Management" width="48%">
  <img src="screenshots/14.png" alt="Coupon Management" width="48%">
  <br>
  <img src="screenshots/15.png" alt="System Logs" width="48%">
</div>

---

## 📑 Table of Contents
<details>
  <summary>Click to expand</summary>
  
  1. [About The Project](#-about-the-project)
  2. [Key Features](#-key-features)
  3. [Architecture & Tech Stack](#-architecture--tech-stack)
  4. [Getting Started](#-getting-started)
     - [Prerequisites](#prerequisites)
     - [Installation](#installation)
     - [Environment Variables](#environment-variables)
  5. [Project Structure](#-project-structure)
  6. [Contributing](#-contributing)
  7. [License](#-license)
  8. [Contact](#-contact)
</details>

---

## 🚀 About The Project

**AEROLITH** is not just another e-commerce site; it's a meticulously crafted digital storefront designed for the modern web. Built specifically to handle high-value transactions with elegance, it combines cutting-edge frontend animations (using Framer Motion and WebGL via Spline) with a rock-solid Node.js/Express backend. 

Whether you are scaling a boutique brand or managing a large-scale enterprise catalog, Aerolith provides the infrastructure, the aesthetics, and the admin tools required to succeed in competitive online retail.

---

## ✨ Key Features

### 🛒 Customer Experience
* **Immersive UI/UX:** Fluid page transitions and interactive 3D elements that elevate the shopping experience.
* **Frictionless Authentication:** JWT-based secure login, supplemented by seamless Google OAuth integration.
* **Advanced Catalog Discovery:** Lightning-fast search, dynamic filtering, and detailed product views.
* **Streamlined Checkout:** Multi-step, conversion-optimized checkout flow with integrated cart management.
* **Enterprise-Grade Payments:** Bank-level security via integrated **Razorpay** payment gateway.
* **Order Tracking & Invoicing:** Real-time order status updates and automated PDF invoice generation.
* **Automated Communications:** Instant Email and WhatsApp notifications for order confirmations (Nodemailer & Twilio).

### 🛡️ Administrative Control
* **Command Center Dashboard:** Comprehensive analytics, revenue charts (ApexCharts), and real-time business metrics.
* **Inventory Management:** Intuitive CRUD interface for products with seamless Cloudinary media storage integration.
* **Marketing Tools:** Granular control over product categories and promotional discount campaigns.
* **Order Fulfillment Pipeline:** End-to-end tracking of customer orders from payment to delivery.
* **Access Control:** Role-based user management to protect sensitive operational data.

---

## 🛠️ Architecture & Tech Stack

Aerolith leverages a modern microservice-inspired architecture within a monorepo structure, ensuring separation of concerns while maintaining developer velocity.

### Frontend
| Technology | Description |
| :--- | :--- |
| **React.js (Vite)** | Blazing fast development server and optimized production builds. |
| **Redux Toolkit** | Centralized state management & caching via RTK Query. |
| **Tailwind CSS & Flowbite** | Utility-first styling for rapid, responsive UI development. |
| **Framer Motion & Spline** | Physics-based animations and 3D web graphics. |
| **Radix UI** | Unstyled, accessible UI primitives. |

### Backend
| Technology | Description |
| :--- | :--- |
| **Node.js & Express.js** | High-performance, event-driven server infrastructure. |
| **MongoDB & Mongoose** | Flexible, scalable NoSQL database with robust object modeling. |
| **JWT & Bcrypt** | Industry-standard authentication and password hashing. |
| **Cloudinary** | Cloud-native media asset management and optimization. |
| **Razorpay SDK** | Secure, compliant payment processing integration. |

---

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* [Node.js](https://nodejs.org/) (v16.x or higher)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
* [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas instance)
* Third-party accounts: [Cloudinary](https://cloudinary.com/) (Images), [Razorpay](https://razorpay.com/) (Payments).

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KartikeyaNainkhwal/aerolith.git
   cd aerolith
   ```

2. **Install Backend Dependencies**
   ```bash
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

### Environment Variables

For the application to function correctly, you must set up your environment variables. 
Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret

# Media Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Communications (Optional)
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password

# Twilio (Optional)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

### Running the Application

You can spin up both the frontend client and the backend server concurrently from the root directory:

```bash
npm run dev
```

* **Frontend Client:** accessible at `http://localhost:5173`
* **Backend API:** accessible at `http://localhost:5000`

---

## 📂 Project Structure

```text
aerolith/
├── backend/
│   ├── config/          # Configurations (DB, Cloudinary, Razorpay)
│   ├── controllers/     # Route dispatchers and business logic
│   ├── middlewares/     # Request interceptors (Auth, Error handling)
│   ├── models/          # Mongoose DB schemas
│   ├── routes/          # Express route definitions
│   └── utils/           # Shared modules (Email, Tokens, Helpers)
├── frontend/
│   ├── public/          # Static assets
│   └── src/
│       ├── assets/      # Local media and fonts
│       ├── components/  # Shared React components
│       ├── context/     # React Context providers
│       ├── pages/       # Next.js-style page components
│       ├── redux/       # Store setup and RTK endpoints
│       └── utils/       # Frontend utilities and formatters
└── package.json         # Root scripts and workspace config
```

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Crafted with ❤️ by <a href="https://github.com/KartikeyaNainkhwal">Kartikeya Nainkhwal</a></p>
</div>

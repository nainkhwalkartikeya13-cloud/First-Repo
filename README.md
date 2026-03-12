<div align="center">
  <img src="frontend/src/assets/images/logo.png" alt="AEROLITH Logo" width="200" style="margin-bottom: 20px" onError="this.style.display='none'">
  
  # 🛍️ AEROLITH
  
  **Your Exclusive Destination for Luxury Shopping.**
  
  A modern, full-stack E-commerce platform built with the MERN stack. Designed with a premium aesthetic, featuring 3D elements, secure payments, and a robust admin dashboard.
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

---

## ✨ Features

### 🛒 For Customers
- **Authentication:** Secure login/signup via JWT & Google OAuth.
- **Product Catalog:** Browse, search, filter, and view detailed product information.
- **Interactive UI:** Smooth animations with Framer Motion and 3D scenes using Spline.
- **Shopping Cart & Checkout:** Seamless cart management and multi-step checkout.
- **Secure Payments:** Integrated with **Razorpay** for reliable transactions.
- **Order Management:** Track orders, view order history, and download PDF invoices.
- **Customer Notifications:** Order confirmations and updates via Email/WhatsApp (Nodemailer & Twilio).

### 🛡️ For Administrators
- **Dashboard Overview:** Sales analytics, charts (ApexCharts), and real-time statistics.
- **Product Management:** Add, edit, or delete products with image uploads via Cloudinary.
- **Category & Coupon Management:** Create product categories and promotional discount codes.
- **Order Fulfillment:** Update order statuses and track deliveries.
- **User Management:** View customer details and manage administrative access.

---

## 🛠️ Technology Stack

**Frontend:**
- React.js (Vite)
- Redux Toolkit (State Management & RTK Query)
- Tailwind CSS & Flowbite (Styling)
- Framer Motion & Spline (Animations & 3D WebGL)
- Radix UI (Accessible Components)
- jsPDF (Invoice Generation)
- Razorpay Checkout

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose ORM
- JWT (JSON Web Tokens) & Bcrypt (Security)
- Cloudinary & Multer (Media Storage)
- Nodemailer & Twilio (Communications)
- Razorpay Node SDK

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 1️⃣ Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- Accounts for [Cloudinary](https://cloudinary.com/), [Razorpay](https://razorpay.com/), and optionally Google, Twilio, and an SMTP server.

### 2️⃣ Clone the Repository
```bash
git clone https://github.com/KartikeyaNainkhwal/aerolith.git
cd aerolith
```

### 3️⃣ Install Dependencies

Install root backend dependencies:
```bash
npm install
```

Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

### 4️⃣ Set up Environment Variables

Create a `backend/.env` file and add the following keys:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_secret_key

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret

# Cloudinary (Media Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email / Notifications (Optional)
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password

# Twilio (Optional)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

### 5️⃣ Run the Application

You can run both the frontend and backend servers concurrently using a single command from the root directory:

```bash
npm run dev
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend:** [http://localhost:5000](http://localhost:5000)

*(Alternatively, you can run `npm run frontend` and `npm run backend` in separate terminals).*

---

## 📂 Project Structure

```text
aerolith/
│
├── backend/                  # Node.js + Express Backend
│   ├── config/               # Database & external service configurations
│   ├── controllers/          # API Route Logic (Product, User, Order, etc.)
│   ├── middlewares/          # Custom Middlewares (Auth, Error Handling)
│   ├── models/               # Mongoose Database Schemas
│   ├── routes/               # API Endpoints definition
│   └── utils/                # Helper functions (Tokens, Emails, WhatsApp)
│
├── frontend/                 # React + Vite Frontend
│   ├── public/               # Static assets
│   └── src/
│       ├── assets/           # Images, Fonts
│       ├── components/       # Reusable React components (UI, Layouts)
│       ├── context/          # React Contexts (Theme)
│       ├── pages/            # Application Pages (Home, Shop, Admin suite, etc.)
│       ├── redux/            # RTK slices and API endpoints definition
│       └── utils/            # Helper utilities (Cart tools, LocalStorage, Invoice)
│
└── package.json              # Root package and concurrent scripts
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

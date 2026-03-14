<div align="center">
  <img src="frontend/public/aerolith_logo_full.png" alt="AEROLITH Logo" width="180" onError="this.style.display='none'">

  <h1>🛍️ AEROLITH</h1>
  <p><strong>A Premium Full-Stack E-Commerce Platform — Built for Real Business</strong></p>

  <p>
    <a href="https://aerolith-seven.vercel.app/" target="_blank">
      <img src="https://img.shields.io/badge/🚀%20Live%20Demo-Visit%20App-4CAF50?style=for-the-badge" alt="Live Demo">
    </a>
    <a href="https://github.com/KartikeyaNainkhwal/AEROLITH-">
      <img src="https://img.shields.io/badge/GitHub-Source%20Code-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
    </a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white">
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white">
    <img src="https://img.shields.io/badge/Redux_Toolkit-593D88?style=for-the-badge&logo=redux&logoColor=white">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white">
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white">
  </p>

  <p>
    <img src="https://img.shields.io/badge/Deployment-Vercel%20+%20Railway-black?style=flat-square">
    <img src="https://img.shields.io/badge/Payments-Razorpay%20Integrated-blue?style=flat-square">
    <img src="https://img.shields.io/badge/Status-Live%20%26%20Production%20Ready-brightgreen?style=flat-square">
  </p>
</div>

---

## 🎯 What Is AEROLITH?

**AEROLITH** is a production-deployed, full-stack e-commerce platform built for high-value online retail. It's not a tutorial clone — it's a complete business system with real payments, automated notifications, 3D UI, and a powerful admin command center.

> Built to show what a real client's e-commerce store would look like — not a demo, a deployable product.

| Problem | Solution |
|---|---|
| Customers need a seamless shopping experience | Immersive 3D UI, fluid Framer Motion transitions, instant search |
| Businesses need secure, reliable payments | Razorpay production gateway — real transactions, not mocks |
| Admins need full operational control | Revenue analytics, inventory, orders, coupons — one dashboard |
| Customers expect instant communication | Auto email + WhatsApp notifications via Nodemailer & Twilio |
| Scale requires media management | Cloudinary for all product images — no server storage |

---

## 🎥 Demo Video

> 📽️ **[Watch Full Demo on Loom](#)** ← *(replace with your Loom link)*

---

## 📸 Screenshots

### 🛒 Customer Experience

<div align="center">
  <img src="./1.png" alt="Hero Section" width="48%">
  <img src="./2.png" alt="Product Listing" width="48%">
  <br><br>
  <img src="./3.png" alt="Product Detail" width="48%">
  <img src="./4.png" alt="Cart View" width="48%">
  <br><br>
  <img src="./5.png" alt="Shipping Details" width="48%">
  <img src="./6.png" alt="Order Review" width="48%">
  <br><br>
  <img src="./7.png" alt="Razorpay Payment" width="48%">
  <img src="./8.png" alt="Order Confirmation" width="48%">
</div>

### 🛡️ Admin Dashboard

<div align="center">
  <img src="./9.png" alt="Revenue Analytics" width="48%">
  <img src="./10.png" alt="Product Management" width="48%">
  <br><br>
  <img src="./11.png" alt="Category Management" width="48%">
  <img src="./12.png" alt="Order Management" width="48%">
  <br><br>
  <img src="./13.png" alt="User Management" width="48%">
  <img src="./14.png" alt="Coupon Management" width="48%">
  <br><br>
  <img src="./15.png" alt="System Logs" width="48%">
</div>

---

## ✨ Features

### 🛒 Customer Side
- **Immersive 3D UI** — Interactive WebGL elements via Spline + fluid page transitions with Framer Motion
- **Google OAuth + JWT Auth** — One-click Google login or secure email/password authentication
- **Smart Product Discovery** — Real-time search, dynamic filters, and detailed product views
- **Cart & Checkout** — Multi-step, conversion-optimized flow with live cart state via Redux Toolkit
- **Razorpay Payments** — Production-grade payment gateway — real transactions, bank-level security
- **Order Tracking** — Real-time order status from payment to delivery
- **Auto Notifications** — Instant email (Nodemailer) + WhatsApp message (Twilio) on every order
- **PDF Invoice Generation** — Automated invoice created and sent on order confirmation

### 🛡️ Admin Side
- **Analytics Dashboard** — Revenue charts, sales metrics, and business KPIs via ApexCharts
- **Product & Inventory Management** — Full CRUD with Cloudinary image uploads
- **Category & Coupon Management** — Create categories, run discount campaigns
- **Order Fulfillment Pipeline** — Track and update every order from placement to delivery
- **User Management** — Role-based access control for staff and customers
- **System Logs** — Monitor every critical platform event in real time

---

## 🛠️ Tech Stack

### Frontend
| Technology | Role |
|---|---|
| React.js + Vite | UI framework with fast builds |
| Redux Toolkit + RTK Query | State management and API caching |
| Tailwind CSS + Flowbite | Utility-first responsive styling |
| Framer Motion | Physics-based animations and transitions |
| Spline (WebGL) | Interactive 3D homepage elements |
| Radix UI | Accessible headless UI primitives |

### Backend
| Technology | Role |
|---|---|
| Node.js + Express.js | REST API server |
| MongoDB + Mongoose | NoSQL database with object modeling |
| JWT + Bcrypt | Secure authentication and password hashing |
| Razorpay SDK | Payment processing integration |
| Cloudinary | Cloud media storage and optimization |
| Nodemailer | Automated email notifications |
| Twilio | WhatsApp order notifications |

### Infrastructure
| Service | Usage |
|---|---|
| Vercel | Frontend deployment (CDN) |
| Railway | Backend deployment (always-on, no cold starts) |
| MongoDB Atlas | Cloud database hosting |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- MongoDB Atlas account
- Cloudinary account
- Razorpay account
- Twilio account (for WhatsApp notifications)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/KartikeyaNainkhwal/AEROLITH-.git
cd AEROLITH-

# 2. Install backend dependencies
npm install

# 3. Install frontend dependencies
cd frontend && npm install && cd ..
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Nodemailer)
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password

# Twilio (WhatsApp)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

### Run Locally

```bash
# Run both frontend and backend concurrently
npm run dev

# Frontend → http://localhost:5173
# Backend  → http://localhost:5000
```

---

## 📁 Project Structure

```
AEROLITH/
├── backend/
│   ├── config/         # DB, Cloudinary, Razorpay config
│   ├── controllers/    # Business logic per feature
│   ├── middlewares/    # Auth guards, error handling
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express route definitions
│   └── utils/          # Email, tokens, helpers
├── frontend/
│   └── src/
│       ├── components/ # Shared React components
│       ├── pages/      # Page-level components
│       ├── redux/      # Store + RTK Query endpoints
│       └── utils/      # Frontend utilities
└── package.json        # Root scripts
```

---

## 🤝 Contributing

1. Fork the repo
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "feat: describe your change"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License.

---

<div align="center">
  <p>Built by <a href="https://github.com/KartikeyaNainkhwal"><strong>Kartikeya Nainkhwal</strong></a> · Full-Stack Developer · IIT Bhilai</p>
  <p>
    <a href="https://aerolith-seven.vercel.app/">🌐 Live Demo</a> ·
    <a href="mailto:kartikeyak@iitbhilai.ac.in">📧 Hire Me</a> ·
    <a href="https://github.com/KartikeyaNainkhwal">👨‍💻 GitHub</a>
  </p>
  <p><em>Open for freelance projects — let's build something great together.</em></p>
</div>


# 🛡️ MediVerify Pro
### **Advanced Medicine Authenticity & Inventory Management System**

**MediVerify Pro** is a professional Full-Stack solution (MERN Architecture) designed to combat counterfeit medicine. It empowers medical administrators to manage pharmaceutical inventory and generate unique, secure serial numbers, while providing a public portal for consumers to instantly verify product authenticity and safety status.

---

## 📸 Project Showcases

| Dark Mode Interface | Light Mode Interface |
| :---: | :---: |
| ![Dark Mode](/DarkMode.png) | ![Light Mode](/LightMode.png) |
| *Premium Glassmorphism Design* | *Clean & Professional UI* |

---

## ✨ Core Features

### 👤 Administrative Portal (Protected)
- **Secure Access:** Robust login/registration system using **JWT** (JSON Web Tokens) and **Bcryptjs** for password hashing.
- **Inventory Control (CRUD):** Full management of medicine records (Create, Read, Update, Delete).
- **Smart Serial Generation:** Utilizes **Nanoid** and **Crypto** to generate high-entropy, unique identifiers (e.g., MV-A1B2C3).
- **Live Search:** Instant client-side filtering to navigate through large medicine databases efficiently.

### 🔍 Consumer Verification Engine
- **Instant Check:** Consumers can verify product serial numbers without an account.
- **Double-Safety Logic:** The system checks if the serial exists AND validates the **Expiry Date** to warn against outdated products.
- **Dynamic Alerts:** High-end interactive notifications using **SweetAlert2** (Success for Authentic, Error for Fake, Warning for Expired).

### 🎨 Visual Experience
- **Glassmorphism UI:** Modern translucent panels with backdrop blur effects.
- **Theme Persistence:** Automated Dark/Light mode based on user preference, saved in `localStorage`.

---

## 🛠️ Technical Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | HTML5, Tailwind CSS, JavaScript (ES6+), SweetAlert2, FontAwesome 6 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Security** | JWT, Bcryptjs, CORS |
| **Utilities** | Nanoid (ID Generation), Dotenv |

---

## 📁 Project Structure

```text
├── config/
│   └── db.js                # MongoDB Connection configuration
├── middleware/
│   └── authMiddleware.js     # JWT Verification & Route protection
├── models/
│   ├── Medicine.js          # Mongoose Schema for medicine records
│   └── User.js              # Mongoose Schema for admin users
├── public/
│   ├── index.html           # Main SPA entry point
│   ├── script.js            # Frontend logic & API integration
│   └── style.css            # Custom CSS & Glassmorphism styling
├── routes/
│   ├── authRoutes.js        # Authentication API endpoints
│   └── medicineRoutes.js    # Medicine CRUD & Verification endpoints
├── utils/
│   └── errorResponse.js     # Custom Error Handling class
├── .env                     # Environment variables (Private)
├── .gitignore               # Files to be excluded from Git
├── app.js                   # Server entry point & Middleware setup
├── package.json             # Project dependencies & Scripts
├── package-lock.json        # Locked dependency versions
└── README.md                
```
# Project documentation

---

## ⚙️ Installation & Deployment
### Clone the repository:
git clone [https://github.com/Username/MediVerify-Pro.git](https://github.com/Username/MediVerify-Pro.git)

cd MediVerify-Pro
---
## ⚙️ Install dependencies:
npm install

---

## ⚙️ Environment Setup: 
## Create a .env file in the root directory:
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key

# 🚀 Launch the system:
Development: npm run dev (via Nodemon)
Production: npm start

# 🔒 Reliability & Performance

## 🟠 CORS Enabled: Cross-Origin Resource Sharing configured for secure frontend-backend communication.

## 🟢 Centralized Error Handling: Standardized API responses for every possible error scenario using a custom ErrorResponse class.

## 🟠 Efficient ID Generation: Using Nanoid for collision-resistant and URL-friendly serial numbers.

# 👨‍💻 Developed By:
## Momen Elsayed
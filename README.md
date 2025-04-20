# 🏡 Travel Nest

**Travel Nest** is a full-stack travel accommodation platform where users can discover, list, and book unique places to stay. Inspired by modern booking platforms, Travel Nest offers seamless user experience, secure authentication, property management, and a community-driven review system.

---

## 🌐 Live Demo

[Visit Travel Nest 🔗](#) *(https://travelnest-f16d.onrender.com/listings)*

---

## 🚀 Features

- 🏘️ **Property Listings:** Users can browse all available properties with prices, images, and detailed descriptions.
- 📝 **Post Your Property:** Authenticated users can upload, edit, or delete their listings.
- ⭐ **Review System:** Users can leave star ratings and reviews for properties.
- 🔐 **Secure Authentication:** Sign up, login, and account management using **Passport.js**.
- 📷 **Image Uploads:** Upload property photos via **Multer** and **Cloudinary**.
- 📱 **Responsive Design:** Fully responsive layout for all screen sizes.
- ✉️ **Flash Messaging:** Real-time alerts for actions like login, logout, errors, etc.

---

## 🛠️ Tech Stack

**Frontend:**
- HTML5, CSS3
- EJS (Embedded JavaScript Templates)

**Backend:**
- Node.js
- Express.js

**Database:**
- MongoDB + Mongoose

**Authentication & Uploads:**
- Passport.js
- Multer
- Cloudinary

**Other Libraries:**
- Express-session
- Connect-flash
- Cookie-parser

---

## 📁 Project Structure

```
TravelNest/
│
├── public/                 # Static files (CSS, JS, images)
├── views/                  # EJS templates
├── models/                 # Mongoose schemas
├── routes/                 # Express route handlers
├── controllers/            # Logic for routes (MVC)
├── middleware.js           # Custom middlewares
├── cloudConfig.js          # Cloudinary setup
├── index.js                # Entry point
└── .env                    # Environment variables
```

---

## ⚙️ Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/Purvesh271/TravelNest.git
cd travel-nest
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file and add your credentials**
```env
ATLASDB_URL=your_mongodb_atlas_url
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret
SECRET=your_session_secret

```

4. **Run the application**
```bash
npm start
```

5. **Visit the app**
```
http://localhost:8080
```

---

## 📌 Future Enhancements

- 🔍 Advanced search and filters
- 📅 Booking calendar integration
- 💬 Real-time chat between host and guest
- 🧾 Payment gateway for bookings
- 🌎 Add map-based location previews

---

## 📃 License

This project is licensed under the MIT License.

---

## 🤝 Contribute

If you'd like to contribute, fork the repo and use a feature branch. Pull requests are warmly welcome.

---

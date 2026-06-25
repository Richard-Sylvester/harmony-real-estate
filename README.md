#  Harmony Real Estate

Harmony is a premium, full-stack real estate platform built with the MERN stack. It connects verified buyers, sellers, and renters with properties across the city. The application features a native-feeling adaptive mobile design, secure authentication, and a robust property management dashboard.

## ✨ Key Features

**For Buyers & Renters:**
* **Advanced Filtering:** Dynamic search Mega Menu with mutually exclusive tabs for Buy, Rent, PG, and Commercial properties.
* **Saved Homes Wishlist:** Users can favorite properties to save them to their personalized dashboard.
* **Interactive Maps:** Integration with OpenStreetMap/Nominatim for automatic geocoding and map pin generation.
* **Adaptive Mobile UI:** A custom React hook detects screen size to serve a mobile-specific Side Drawer and Bottom Navigation, mimicking native apps like 99acres.

**For Sellers:**
* **Property Dashboard:** A comprehensive UI to post, edit, and delete properties.
* **Track Record Management:** Sellers can mark properties as "Sold" or "Rented" to display their historical track record to potential clients without deleting the data.
* **Cloud Image Uploads:** Seamless property photo management utilizing Cloudinary and Multer middleware.

**Account & Security Features:**
* **Soft Deletion Pipeline:** Account deletion requests trigger a 30-day "grace period" where listings are hidden. An automated Node.js Cron Job permanently scrubs the data after 30 days.
* **Enterprise Security:** Backend protected against NoSQL injections and metadata scraping using `helmet` and `express-mongo-sanitize`.
* **Authentication:** Secure login and registration using JWT and bcrypt password hashing.

##  Tech Stack

* **Frontend:** React.js (Vite), Custom CSS, React Router, Lucide React (Icons), Axios
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Media Management:** Cloudinary API, Multer
* **Task Scheduling:** Node-Cron

##  Getting Started

### Prerequisites
* Node.js installed on your machine
* A MongoDB URI
* A Cloudinary Account

### Environment Variables
Create a `.env` file in your **backend** directory with the following credentials:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
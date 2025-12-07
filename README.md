# 🎬 Cinema Reservation Platform

An all-in-one MERN-based system for booking movie tickets, featuring instant seat reservation, user/admin roles, and robust security. Discover films, reserve seats, manage venues, and view analytics with realistic preloaded data.

## ✨ Main Highlights

### For Moviegoers 👥
- **Explore Films**: View details for 20+ movies, including cast, crew, ratings, and feedback
- **Advanced Search**: Sort movies by category, language, or score
- **Venue Selection**: Browse 21+ cinemas in 5 cities with up-to-date showtimes
- **Seat Reservation**: Pick seats interactively with live updates via WebSocket
- **Submit Reviews**: Rate and comment on movies and venues (1-5 stars)
- **Booking Records**: See your previous and upcoming reservations
- **Account Settings**: Edit your profile and preferences

### For Administrators 🔑
- **Film Management**: Add, update, or delete movies with full details
- **Venue Control**: Oversee cinemas, halls, and screening schedules
- **Show Planning**: Schedule screenings with conflict checks
- **User Oversight**: Manage user accounts
- **Analytics Panel**: View booking stats and trends (13,195 sample bookings)
- **Review Moderation**: Approve or remove user and critic feedback
- **Data Initialization**: Fill the database with realistic test entries

### Security & Optimization 🔒
- **Token Authentication**: Secure login with JWT, valid for 7 days
- **Role Permissions**: Separate access for admins and users
- **Password Protection**: Hashed passwords using bcrypt
- **Security Headers**: Helmet.js for extra safety
- **Request Limiting**: Prevent brute-force and DDoS attacks
- **Input Cleaning**: Defend against injection and XSS
- **CORS Policy**: Restrict cross-origin requests
- **Live Updates**: Real-time seat status with Socket.IO
- **Compression**: Gzip for faster load times

## 🏗️ Technologies Used

### Backend
- **Runtime**: Node.js v22
- **Framework**: Express.js
- **Database**: MongoDB v7 with Mongoose
- **Auth**: JWT tokens
- **Security**: Helmet, bcrypt, rate limiting, sanitization, XSS protection, HPP
- **Live Data**: Socket.IO for seat status
- **Validation**: Zod
- **Logging**: Custom logger (Winston)

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS & DaisyUI
- **State**: Redux Toolkit
- **Data**: React Query v5
- **Routing**: React Router v6
- **Live Data**: Socket.IO Client
- **Security**: DOMPurify, crypto-js

### DevOps
- **Containers**: Docker & Docker Compose
- **Development**: Hot reload with Nodemon & Vite
- **Packages**: pnpm (preferred) or npm

## 📁 Folder Layout

```
MovieBookingApp/
├── Backend/                    # Express API
│   ├── controllers/           # Logic handlers
│   ├── models/                # Database schemas
│   ├── routes/                # API endpoints
│   │   ├── auth.routes.js    # Login/signup
│   │   ├── public.routes.js  # Public info
│   │   ├── booking.routes.js # Reservations
│   │   └── admin.routes.js   # Admin features
│   ├── services/              # Core logic
│   ├── middlewares/           # Auth, errors, cleaning
│   ├── config/                # Security & CORS
│   ├── seeds/                 # Sample data ⭐
│   ├── utils/                 # Logging, hashing, sockets
│   └── lib/validators/        # Data validation
│
├── Frontend/                   # React app
│   ├── src/
│   │   ├── components/        # UI elements
│   │   ├── pages/             # Screens
│   │   ├── hooks/             # Custom hooks
│   │   ├── store/             # Redux
│   │   ├── contexts/          # Context providers
│   │   ├── api/               # API setup
│   │   └── utils/             # Helpers
│   └── public/                # Static files
│
├── docker-compose.yml          # Container orchestration
├── DOCKER_SETUP.md            # Docker guide
├── QUICKSTART.md              # Quick start
└── README.md                  # This file
```

## 🚀 Quick Start

You can launch this project in **two ways**: with Docker (recommended) or using npm/pnpm.

---

### 🐳 Option 1: Docker (Recommended)

**Best for**: Fast setup, consistent environment, production-like deployment

#### Requirements
- Docker Desktop installed
- Docker Compose (comes with Docker Desktop)

#### Steps

1. **Clone the repo**
  ```powershell
  git clone <repository-url>
  cd MovieBookingApp
  ```

2. **Start all services with one command**
   ```powershell
   docker compose up -d
   ```

   This command will:
   - ✅ Pull MongoDB 7 image
   - ✅ Build backend and frontend containers
   - ✅ Start all three services (MongoDB, Backend, Frontend)
   - ✅ Automatically seed the database with 18,438 test records (first run only)

3. **Access the application**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:8000
   - **MongoDB**: mongodb://localhost:27017

4. **Useful Docker Commands**
   ```powershell
   # View running containers
   docker ps

   # View logs (all services)
   docker compose logs -f

   # View backend logs only
   docker logs moviebooking-backend -f

   # Stop all services
   docker compose down

   # Stop and remove all data (fresh start)
   docker compose down -v

   # Rebuild after code changes
   docker compose build
   docker compose up -d

   # Manually re-seed database
   docker exec moviebooking-backend pnpm run seed
   ```

**Note**: The Docker setup includes hot-reloading for both frontend and backend. Code changes are automatically reflected without rebuilding!

---

### 💻 Method 2: Traditional npm/pnpm Setup

**Perfect for**: Development without Docker, manual control, learning the stack

#### Prerequisites
- Node.js v16+ (v22 recommended)
- MongoDB v5+ installed and running locally
- npm or pnpm package manager

#### Steps

1. **Clone the repository**
   ```powershell
   git clone <repository-url>
   cd MovieBookingApp
   ```

2. **Start MongoDB** (if not already running)
   ```powershell
   # If MongoDB is installed as a service
   net start MongoDB

   # Or start manually
   mongod --dbpath "C:\data\db"
   ```

3. **Setup Backend**
   ```powershell
   cd Backend

   # Install dependencies (choose one)
   npm install
   # OR
   pnpm install

   # Create .env file
   New-Item -Path .env -ItemType File
   ```

   Add the following to `Backend/.env`:
   ```env
   PORT=8000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/movie-booking-app
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
   JWT_EXPIRATION=7d
   CLIENT_URL=http://localhost:5173
   ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
   ```

4. **Seed the Database** (Required for first-time setup)
   ```powershell
   # Still in Backend directory
   npm run seed
   # OR
   pnpm run seed
   ```

   This populates the database with:
   - 21 theatres across 5 cities
   - 103 theatre halls
   - 20 movies with cast and crew
   - 15 test user accounts
   - 679 reviews (theatre, movie, critic)
   - 3,885 show schedules
   - 13,195 historical bookings

5. **Start Backend Server**
   ```powershell
   # Development mode (with auto-reload)
   npm run dev
   # OR
   pnpm run dev

   # Production mode
   npm start
   # OR
   pnpm start
   ```

   Backend should now be running on http://localhost:8000

6. **Setup Frontend** (in a new terminal)
   ```powershell
   cd Frontend

   # Install dependencies (choose one)
   npm install
   # OR
   pnpm install

   # Create .env file
   New-Item -Path .env -ItemType File
   ```

   Add the following to `Frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

7. **Start Frontend Server**
   ```powershell
   # Development mode (with HMR)
   npm run dev
   # OR
   pnpm run dev
   ```

   Frontend should now be running on http://localhost:5173

8. **Verify Setup**
   ```powershell
   # Test backend API
   curl http://localhost:8000/api/movies

   # Or use PowerShell
   Invoke-RestMethod -Uri http://localhost:8000/api/movies
   ```

#### Running Backend and Frontend Simultaneously

**Option 1**: Use two terminal windows
- Terminal 1: `cd Backend && npm run dev`
- Terminal 2: `cd Frontend && npm run dev`

**Option 2**: Use background processes (PowerShell)
```powershell
# Start backend in background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Backend; npm run dev"

# Start frontend in background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Frontend; npm run dev"
```

---

## 📊 Pre-Seeded Test Data

Both setup methods include automatic database seeding with production-like data:

| Data Type | Count | Description |
|-----------|-------|-------------|
| 🎭 Theatres | 21 | Major chains across 5 cities |
| 🏢 Theatre Halls | 103 | Standard, IMAX, 4DX halls |
| 🎬 Movies | 20 | Popular movies with metadata |
| 👥 Cast & Crew | 245 | Actors, Directors, Producers |
| 🎭 Role Mappings | 275 | Cast/crew assignments |
| 👤 Users | 15 | Admin and test users |
| ⭐ Theatre Reviews | 273 | User ratings & comments |
| ⭐ Movie Reviews | 260 | User ratings & comments |
| ⭐ Critic Reviews | 146 | Professional ratings |
| 🎟️ Show Schedules | 3,885 | 7-day schedules |
| 🎫 Bookings | 13,195 | 6 months historical data |

**Total: 18,438 records** ready for immediate testing!

## 🔐 User Accounts & Authentication

### Test User Credentials

All pre-seeded users have the password: **`Password123!`**

#### 👑 Admin Accounts
```
Email: admin@moviebooking.com
Email: superadmin@moviebooking.com
Role: admin
```

**Admin Capabilities**:
- Full access to all admin routes
- Create, update, delete movies
- Manage theatres and halls
- Create and modify show schedules
- View all bookings and analytics
- User management capabilities

#### 👤 Regular User Accounts
```
Email: demo@example.com
Email: test@example.com
Email: john.doe@example.com
Email: jane.smith@example.com
Email: sarah.johnson@example.com
Email: mike.wilson@example.com
... (and 9 more users)
Role: user
```

**User Capabilities**:
- Browse movies and theatres
- View show schedules
- Book movie tickets
- View and manage personal bookings
- Submit movie and theatre reviews
- Update profile information

### User Registration

New users can register via:
- **API**: `POST /auth/sign-up`
- **Frontend**: Registration page at `/signup`

**Required Fields**:
- First Name (minimum 2 characters)
- Last Name (optional)
- Email (valid email format, unique)
- Password (minimum 8 characters, includes uppercase, lowercase, number, special character)

**Default Role**: All new registrations are assigned the `user` role by default. Admin roles must be manually assigned in the database.

### Authentication Flow

1. **Login**: `POST /auth/sign-in` with email and password
2. **Receive JWT**: Valid for 7 days
3. **Include Token**: Add to `Authorization: Bearer <token>` header for protected routes
4. **Auto-Refresh**: Frontend automatically includes token in all authenticated requests

### Password Security

- **Hashing Algorithm**: bcrypt with salt rounds
- **Storage**: Only hashed passwords stored in database
- **Validation**: Enforced strong password requirements
- **Migration**: Includes password migration script for legacy data

## � Security Features

This application implements comprehensive security measures following industry best practices:

### 🛡️ Backend Security

#### 1. **Authentication & Authorization**
- **JWT Tokens**: Stateless authentication with configurable expiration (default: 7 days)
- **Role-Based Access Control (RBAC)**: Two-tier role system (admin/user)
- **Middleware Protection**: Route-level authentication and authorization
- **Token Validation**: Automatic token verification on protected routes

#### 2. **Password Security**
- **Bcrypt Hashing**: Industry-standard password hashing with salt rounds
- **No Plain Text Storage**: Passwords never stored in readable format
- **Secure Password Policy**: Enforced complexity requirements
- **Migration Support**: Password hash migration script included

#### 3. **Input Validation & Sanitization**
- **Zod Schemas**: Type-safe validation for all API inputs
- **MongoDB Injection Prevention**: `express-mongo-sanitize` middleware
- **XSS Protection**: `xss-clean` middleware strips malicious scripts
- **HPP Protection**: `hpp` prevents HTTP parameter pollution attacks
- **DOMPurify**: Client-side sanitization of user-generated content

#### 4. **HTTP Security Headers** (via Helmet.js)
- **Content Security Policy (CSP)**: Prevents XSS and code injection
- **X-Frame-Options**: Clickjacking protection
- **X-Content-Type-Options**: MIME-sniffing prevention
- **Strict-Transport-Security**: Forces HTTPS connections
- **X-XSS-Protection**: Legacy XSS filter support

#### 5. **Rate Limiting**
```javascript
General API Endpoints:    100 requests / 15 minutes / IP
Authentication Endpoints:   5 requests / 15 minutes / IP
Booking Endpoints:         50 requests / 15 minutes / IP
```
- **DDoS Protection**: Prevents overwhelming the server
- **Brute Force Prevention**: Limits authentication attempts
- **Per-IP Tracking**: Individual rate limits per client

#### 6. **CORS Configuration**
- **Allowed Origins**: Whitelist of permitted frontend domains
- **Credentials Support**: Secure cookie and authentication handling
- **Method Restrictions**: Only allowed HTTP methods accepted
- **Environment-Based**: Different settings for dev/production

#### 7. **Database Security**
- **Connection String Encryption**: Sensitive credentials in environment variables
- **Mongoose Schema Validation**: Database-level data integrity
- **Index Optimization**: Prevents enumeration attacks
- **No Sensitive Data Exposure**: Passwords excluded from API responses

#### 8. **Real-Time Security** (Socket.IO)
- **Origin Validation**: Restricted to allowed domains
- **Message Size Limits**: Maximum 1MB buffer size
- **Event Validation**: ShowID format verification (MongoDB ObjectId)
- **Connection Logging**: Tracks all socket connections
- **Error Handling**: Secure error messages without info leakage

### 🔐 Frontend Security

#### 1. **Client-Side Protection**
- **DOMPurify Integration**: Sanitizes all user-generated HTML content
- **Crypto-JS Encryption**: Encrypts sensitive data before storage
- **No Sensitive Storage**: JWT tokens stored securely, no plain passwords

#### 2. **API Communication**
- **HTTPS Enforcement**: Production builds require secure connections
- **Token Management**: Automatic token inclusion in requests
- **Error Handling**: Sanitized error messages to users

#### 3. **Input Validation**
- **Form Validation**: Client-side validation before API calls
- **Type Safety**: React prop types and TypeScript support (partial)
- **XSS Prevention**: All dynamic content sanitized before render

### 🔧 Security Configuration Files

- **`Backend/config/security.config.js`**: Centralized security middleware
- **`Backend/middlewares/auth.middleware.js`**: Authentication logic
- **`Backend/middlewares/sanitize.middleware.js`**: Input sanitization
- **`Backend/config/cors.config.js`**: CORS settings

### 🚨 Security Best Practices Implemented

✅ Never store passwords in plain text  
✅ Use environment variables for secrets  
✅ Validate all user inputs  
✅ Sanitize data before database operations  
✅ Implement proper error handling without exposing internals  
✅ Use HTTPS in production  
✅ Keep dependencies updated (npm audit)  
✅ Implement logging for security events  
✅ Use prepared statements (Mongoose queries)  
✅ Implement graceful shutdown handling  

### 🔍 Security Audit Commands

```powershell
# Backend security audit
cd Backend
npm run security:audit        # Check for vulnerabilities
npm run security:audit:fix    # Auto-fix known issues
npm run security:check        # Check for outdated packages

# Frontend security audit
cd Frontend
npm run security:audit
npm run security:audit:fix
npm run security:check
```

### 🛠️ Environment Variables Security

**Never commit `.env` files to version control!**

Required environment variables are documented but values must be set securely:

**Backend (`Backend/.env`)**:
```env
JWT_SECRET=<minimum-32-character-random-string>
MONGODB_URI=<database-connection-string>
PORT=8000
NODE_ENV=production
CLIENT_URL=<frontend-url>
ALLOWED_ORIGINS=<comma-separated-origins>
```

**Frontend (`Frontend/.env`)**:
```env
VITE_API_URL=<backend-api-url>
```

**Generate Secure Keys**:
```powershell
# Generate JWT secret (Node.js)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use frontend script
cd Frontend
npm run security:generate-key
```

## 📊 API Endpoints

### Public Routes (No Authentication Required)

#### Movies
- `GET /api/movies` - List all movies with pagination
- `GET /api/movies/:id` - Get movie details by ID
- `GET /api/movies/:movieId/cast` - Get movie cast members
- `GET /api/movies/:movieId/crew` - Get movie crew members
- `GET /api/movies/:movieId/roles` - Get all cast and crew
- `GET /api/movies/:movieId/reviews` - Get user reviews for movie
- `GET /api/movies/:movieId/critic-reviews` - Get critic reviews

#### Theatres
- `GET /api/theatres` - List all theatres
- `GET /api/theatres/:id` - Get theatre details
- `GET /api/:city/theatres` - Get theatres by city
- `GET /api/theatres/:theatreId/reviews` - Get theatre reviews
- `GET /api/theatres/:theatreId/halls` - Get theatre halls

#### Shows
- `GET /api/:city/shows/:movieId` - Get shows by city and movie
- `GET /api/shows/:showId` - Get show details
- `GET /api/shows/:showId/seats` - Get seat availability

#### Persons
- `GET /api/persons/:id` - Get actor/director/crew details

### Authentication Routes

- `POST /auth/sign-up` - Register new user account
  - Body: `{ firstname, lastname, email, password, role }`
- `POST /auth/sign-in` - User login
  - Body: `{ email, password }`
  - Returns: JWT token
- `GET /auth/me` - Get current user profile (requires auth)
- `PUT /auth/update-profile` - Update user profile (requires auth)
  - Body: `{ firstname, lastname, email }`

### User Routes (Authentication Required)

#### Bookings
- `POST /booking/book` - Create new booking
  - Body: `{ showId, seatNumbers, totalPrice }`
- `GET /booking/my-bookings` - Get user's booking history
- `GET /booking/:bookingId` - Get booking details
- `DELETE /booking/:bookingId` - Cancel booking

#### Reviews
- `POST /api/movie-reviews` - Submit movie review (authenticated)
  - Body: `{ movieId, rating, comment }`
- `POST /api/theatre-reviews` - Submit theatre review (authenticated)
  - Body: `{ theatreId, rating, comment }`

### Admin Routes (Admin Role Required)

#### Movie Management
- `POST /admin/movies` - Add new movie
- `PUT /admin/movies/:id` - Update movie details
- `DELETE /admin/movies/:id` - Delete movie

#### Theatre Management
- `POST /admin/theatres` - Add new theatre
- `PUT /admin/theatres/:id` - Update theatre
- `DELETE /admin/theatres/:id` - Delete theatre
- `POST /admin/theatres/:id/halls` - Add hall to theatre

#### Show Management
- `POST /admin/shows` - Create show schedule
- `PUT /admin/shows/:id` - Update show
- `DELETE /admin/shows/:id` - Delete show

#### Analytics (Admin)
- `GET /admin/analytics/bookings` - Booking statistics
- `GET /admin/analytics/revenue` - Revenue reports
- `GET /admin/analytics/popular-movies` - Most booked movies

### API Request Examples

#### Get All Movies
```powershell
curl http://localhost:8000/api/movies

# PowerShell
Invoke-RestMethod -Uri http://localhost:8000/api/movies
```

#### User Login
```powershell
curl -X POST http://localhost:8000/auth/sign-in `
  -H "Content-Type: application/json" `
  -d '{"email":"demo@example.com","password":"Password123!"}'
```

#### Create Booking (with authentication)
```powershell
$token = "your-jwt-token-here"
curl -X POST http://localhost:8000/booking/book `
  -H "Authorization: Bearer $token" `
  -H "Content-Type: application/json" `
  -d '{"showId":"123","seatNumbers":[1,2,3],"totalPrice":750}'
```

### Response Format

All API responses follow a consistent format:

**Success Response**:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

### Rate Limiting Headers

Responses include rate limit information:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1635789600
```

## 🗃️ Database Models

### User Management
- **User** (`user`): User accounts with authentication
  - Fields: firstname, lastname, email, password (hashed), role (admin/user)
  - Indexes: email (unique)
  - Validation: Email format, password complexity

### Movie & Theatre Content
- **Movie** (`movies`): Movie information with metadata
  - Fields: title, genre, language, duration, rating, release_date, description
  - Relationships: Has many reviews, cast, crew
  
- **Theatre** (`theatre`): Theatre locations and details
  - Fields: name, location, city, rating, facilities
  - Relationships: Has many halls, reviews

- **TheatreHall** (`theatrehall`): Individual screening rooms
  - Fields: name, theatre_id, capacity, screen_type (Standard/IMAX/4DX)
  - Relationships: Belongs to theatre, has many shows

### Cast & Crew
- **Person** (`person`): Actors, directors, producers, crew
  - Fields: name, role, bio, image_url
  
- **MovieRoleMapping** (`movierolemapping`): Cast/crew assignments
  - Fields: movie_id, person_id, role_type, character_name
  - Relationships: Links movies and persons

### Reviews & Ratings
- **MovieReview** (`moviereview`): User reviews for movies
  - Fields: user_id, movie_id, rating (1-5), comment
  - Validation: Rating range, unique user-movie combination

- **TheatreReview** (`theatrereview`): User reviews for theatres
  - Fields: user_id, theatre_id, rating (1-5), comment
  
- **CriticReview** (`criticreview`): Professional critic ratings
  - Fields: movie_id, critic_name, rating, review, source

### Booking System
- **TheatreHallMovieMapping** (`theatrehallmoviemapping`): Show schedules
  - Fields: theatre_hall_id, movie_id, show_time, show_date, price, available_seats
  - Features: Automatic overlap detection, dynamic pricing
  
- **Booking** (`booking`): User ticket bookings
  - Fields: user_id, show_id, seat_numbers, total_price, booking_status
  - States: confirmed, cancelled, pending

- **SeatLock** (`seatlock`): Temporary seat reservations
  - Fields: show_id, seat_numbers, user_id, locked_until
  - Purpose: Prevents double-booking during checkout

## 🎟️ Show Scheduling Features

The application includes an intelligent show scheduling system:

### Key Features
- **Dynamic Start Times**: Theatres start at staggered times (7:30 AM - 12:30 PM)
- **Smart Movie Selection**: Halls prioritize high-rated movies
- **Automatic Overlap Detection**: Prevents scheduling conflicts
- **Realistic Scheduling**: 20-minute cleanup time between shows
- **7-Day Schedules**: Shows generated for the next week
- **Capacity Optimization**: Larger theatres show more diverse movies

### Example Schedule
```
PVR INOX Forum Mall - Hall 1 (Oct 26, 2025)
├── 09:30 - 12:02 | The Dark Knight (₹260)
├── 12:22 - 14:44 | The Shawshank Redemption (₹260)
├── 15:04 - 17:54 | 3 Idiots (₹260)
├── 18:14 - 20:42 | Inception (₹260)
└── 21:02 - 23:51 | Interstellar (₹260)
```

### Pricing Strategy
- **Standard Halls**: ₹150-200
- **IMAX/Premium**: ₹250-350
- **4DX/Luxury**: ₹300-500
- **Dynamic Pricing**: Weekend and evening shows cost more

## 🧪 Testing & Development

### Manual Database Seeding

```powershell
# Seed all data at once
cd Backend
npm run seed

# Seed specific data types
node seeds/user.seed.js          # Users only
node seeds/movie.seed.js         # Movies only
node seeds/theatre.seed.js       # Theatres only
node seeds/booking.seed.js       # Bookings only
node seeds/seed-reviews.js       # Reviews only
```

### View Seeded Data

```powershell
# Check show schedules
node seeds/view-schedules.js

# Verify data integrity
node seeds/verify-shows.js

# Check for duplicates
node seeds/check-duplicates.js
```

### Testing the API

```powershell
# Test movies endpoint
$response = Invoke-WebRequest -Uri "http://localhost:8000/api/movies" -UseBasicParsing
$data = ($response.Content | ConvertFrom-Json)
Write-Host "Total movies: $($data.movies.Count)"

# Test authentication
$loginData = @{
    email = "demo@example.com"
    password = "Password123!"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8000/auth/sign-in" `
    -Method Post `
    -ContentType "application/json" `
    -Body $loginData

$token = $response.token
Write-Host "Token: $token"

# Test authenticated endpoint
$headers = @{ Authorization = "Bearer $token" }
$bookings = Invoke-RestMethod -Uri "http://localhost:8000/booking/my-bookings" `
    -Headers $headers
```

## 🎯 Sample Data Overview

### Cities & Theatres
- **Bangalore** (5 theatres): PVR INOX Forum Mall, Cinépolis Royal Meenakshi, INOX Garuda, PVR Orion, Cinépolis Nexus
- **Mumbai** (6 theatres): PVR Phoenix Palladium, INOX R-City, Cinépolis Seawoods, PVR INOX Juhu
- **Delhi** (7 theatres): PVR Select Citywalk, PVR Priya, INOX Nehru Place, Cinépolis DLF Place
- **Pune** (2 theatres): Cinépolis City One, INOX Jaswant Tuli
- **Nagpur** (1 theatre): Cinépolis VR Nagpur

### Movie Genres
- Action, Drama, Sci-Fi, Comedy, Thriller, Romance, Crime, Biography
- Languages: English, Hindi, Telugu, Tamil
- Durations: 120-180 minutes
- Ratings: 7.5-9.3 (IMDB-style)

##  Real-Time Features (WebSocket)

The application uses Socket.IO for real-time updates:

### Features
- **Live Seat Availability**: Seats update in real-time across all connected clients
- **Seat Locking**: Temporary locks prevent double-booking during checkout
- **Show Room Updates**: Join/leave show rooms for targeted updates
- **Connection Management**: Automatic reconnection and error handling

### Socket Events

**Client  Server**:
- `join-show`: Join a show room to receive updates
- `leave-show`: Leave a show room
- `lock-seats`: Temporarily lock seats during booking

**Server  Client**:
- `seats-updated`: Broadcast seat availability changes
- `booking-confirmed`: Notify about successful bookings
- `error`: Send error messages

### Usage Example (Frontend)
```javascript
import { io } from 'socket.io-client'

const socket = io('http://localhost:8000')

// Join show room
socket.emit('join-show', showId)

// Listen for seat updates
socket.on('seats-updated', (data) => {
  console.log('Seats updated:', data)
})

// Leave when done
socket.emit('leave-show', showId)
```

##  Performance Optimizations

- **Database Indexing**: Optimized queries for movies, theatres, and bookings
- **Gzip Compression**: Reduced payload sizes for faster transfers
- **React Query Caching**: Frontend data caching and automatic refetching
- **Pagination**: Large datasets split into manageable chunks
- **Lazy Loading**: Components loaded on-demand
- **CDN-Ready**: Static assets optimized for CDN delivery
- **Connection Pooling**: MongoDB connection reuse

##  Troubleshooting

### Docker Issues

**Problem**: Port already in use
```powershell
# Find process using port
netstat -ano | findstr :5173

# Kill process
taskkill /PID <PID> /F
```

**Problem**: Database not seeding
```powershell
# Check logs
docker logs moviebooking-backend

# Manually trigger seeding
docker exec moviebooking-backend pnpm run seed

# Fresh start
docker compose down -v
docker compose up -d
```

**Problem**: Frontend not loading
```powershell
# Rebuild frontend
docker compose build frontend
docker compose up -d frontend
```

### npm/pnpm Issues

**Problem**: MongoDB connection failed
```powershell
# Check if MongoDB is running
Get-Service MongoDB

# Start MongoDB service
net start MongoDB

# Or start manually
mongod --dbpath "C:\data\db"
```

**Problem**: Dependencies not installing
```powershell
# Clear cache
npm cache clean --force
# or
pnpm store prune

# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

**Problem**: Backend crashes on startup
```powershell
# Check .env file exists and has correct values
Get-Content Backend\.env

# Check MongoDB URI is correct
# Check JWT_SECRET is at least 32 characters
```

**Problem**: CORS errors
```powershell
# Ensure CLIENT_URL in backend .env matches frontend URL
# Default: CLIENT_URL=http://localhost:5173
```

### Common Errors

**Error**: "Authentication required"
- Ensure JWT token is included in Authorization header
- Token format: `Bearer <token>`
- Check token hasn't expired (7-day default)

**Error**: "Access Denied"
- User doesn't have required role (admin vs user)
- Try logging in with admin account

**Error**: "Too many requests"
- Rate limit exceeded
- Wait 15 minutes or adjust rate limits in security.config.js

**Error**: "Seat already booked"
- Seat was booked by another user
- Refresh seat availability and select different seats

##  Additional Documentation

- **[QUICKSTART.md](QUICKSTART.md)**: Quick start guide for Docker setup
- **[DOCKER_SETUP.md](DOCKER_SETUP.md)**: Comprehensive Docker documentation
- **Backend Seeds**: Check `Backend/seeds/` directory for seeding scripts

##  CI/CD & Deployment

### Environment-Specific Configurations

**Development**:
```env
NODE_ENV=development
# Verbose logging
# Hot-reloading enabled
# Less strict security for testing
```

**Production**:
```env
NODE_ENV=production
# Minimal logging
# Optimized builds
# Strict security enforcement
# HTTPS required
```

### Docker Production Build

```powershell
# Build production images
docker compose -f docker-compose.prod.yml build

# Run in production mode
docker compose -f docker-compose.prod.yml up -d
```

### Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Generate strong JWT_SECRET (32+ characters)
- [ ] Use secure MongoDB credentials
- [ ] Enable HTTPS/SSL certificates
- [ ] Update CORS allowed origins
- [ ] Configure proper rate limits
- [ ] Set up monitoring and logging
- [ ] Enable database backups
- [ ] Review and test security headers
- [ ] Update API_URL to production domain

##  Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Code Style
- Follow existing code patterns
- Use ESLint configuration provided
- Write meaningful commit messages
- Add comments for complex logic

### Testing
- Test all new features thoroughly
- Ensure no breaking changes
- Verify both Docker and npm setups work


##  Acknowledgments

- **Theatre Data**: Inspired by major cinema chains in India (PVR, INOX, Cin�polis)
- **Movie Data**: Popular films across various genres and languages
- **Scheduling Algorithm**: Intelligent time slot optimization
- **Security Best Practices**: OWASP guidelines and Node.js security recommendations
- **UI Components**: DaisyUI and Tailwind CSS

##  Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting section

---

**Built with  using MERN Stack**

Happy coding! 

# Trip Management System (GK Project Backlog)

A full-stack, enterprise-grade Trip Management and Travel Compliance System implementing all **13 User Stories** across the **3 Epics** from the Jira backlog.

---

## 📋 Jira User Stories & Implementation Mapping

### 1. Epic: login&signup
| Story ID | Story Title | Estimate | Status | Implementation Details |
|---|---|---|---|---|
| **GK-2** | **Signup** | 3 pts | Completed | Registration form with validation, role selector (`Traveler` vs `Government Official`), department attribution, and bcrypt password hashing. |
| **GK-3** | **Login** | 2 pts | Completed | Secure JWT authentication, session persistence, role-based dashboard routing, and one-click demo credentials. |

### 2. Epic: Trip Information Management
| Story ID | Story Title | Estimate | Status | Implementation Details |
|---|---|---|---|---|
| **GK-8** | **Create New Trip** | 3 pts | Completed | Itinerary creation with title, destination city/country, travel date range, theme/purpose, and estimated budget. Saved initially as `Draft`. |
| **GK-9** | **Add places** | 3 pts | Completed | Record visited sights, attractions, and waypoints with visit dates, experience star ratings (1-5), and personal highlight notes. |
| **GK-10** | **Add description and photos** | 5 pts | Completed | Attach narrative descriptions to trips and upload/link photos with captions and landmark tags. |
| **GK-12** | **Submit trip** | 2 pts | Completed | Workflow lock mechanism transitioning trip from `Draft` to `Submitted`, stamping submission timestamp, and forwarding to official government audit registry. |
| **GK-13** | **Previous Trip** | 3 pts | Completed | Archive view of past journeys, categorized by Draft vs Officially Submitted, with travel duration and budget totals. |
| **GK-14** | **Edit and Delete Trip Details** | 3 pts | Completed | Full CRUD over trip metadata, itinerary places, and photo evidence prior to submission. |

### 3. Epic: Government travel data management
| Story ID | Story Title | Estimate | Status | Implementation Details |
|---|---|---|---|---|
| **GK-16** | **View Submitted Trip Details** | 5 pts | Completed | Official compliance registry with tabular & audit inspection modal showing complete traveler dossier, timestamps, places, and media. |
| **GK-17** | **Search and Filter records** | 3 pts | Completed | Real-time multi-attribute search across traveler names, destinations, itinerary titles, and travel date overlap filters. |
| **GK-19** | **View Destination** | 3 pts | Completed | Tourism intelligence dashboard tracking destination rankings, total trips, unique citizen volume, and destination breakdown. |
| **GK-20** | **View travel activity by date** | 3 pts | Completed | Temporal travel density view with interactive date-picker, active traveler counts on specific calendar days, and month-long activity timeline. |
| **GK-21** | **View photos/descriptions** | 3 pts | Completed | Auditor evidence lightbox gallery reviewing traveler-submitted photos, captions, and destination logs. |

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React Icons
- **Backend**: Node.js, Express.js REST API, JWT Authentication, Bcrypt.js, CORS
- **Storage / Database**: Structured JSON document store with seed data for instant zero-config evaluation
- **Testing**: Automated end-to-end integration test suite (`tests/api.test.js`)

---

## 🚀 Quick Start Guide

### 1. Start the Backend API (Port 5000)
```bash
cd backend
npm install
npm start
```
*Health check: `http://localhost:5000/api/health`*

### 2. Start the Frontend Application (Port 3000)
```bash
cd frontend
npm install
npm run dev
```
*Access in browser: `http://localhost:3000`*

### 3. Run Backend Integration Test Suite
```bash
cd backend
npm test
```
*Executes automated verification across all 13 stories.*

---

## 🔑 Demo Accounts (Pre-configured)

| Role | Email | Password | What You Can Test |
|---|---|---|---|
| **Traveler** | `traveler@example.com` | `pass123` | Create trips, add places, attach photos, edit/delete details, submit trip, view past history. |
| **Govt Official** | `official@govt.gov` | `admin123` | Audit submitted trips, search & filter, destination intelligence, activity by date, photo gallery. |

*Note: You can switch between roles at any time using the "Switch Role" button in the navigation bar!*

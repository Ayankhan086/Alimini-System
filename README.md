# UET Mardan Alumni Management System (AMS)

**The UET Mardan Alumni Management System (AMS)** is a premium, full-stack web application designed to bridge the gap between the university and its graduates. Built with modern web technologies (Next.js, React, and Prisma), it serves as a centralized platform for the UET Mardan Alumni Association (UETMAA).

## Core Objective
To foster lifelong networking, collaboration, and mentorship by providing a secure, interactive portal where alumni can connect, update their professional profiles, and stay informed about university events.

## End-Product Functionality

### 1. Public & Guest Functionality (Unauthenticated Users)
The public-facing side of the application acts as the digital front door for the Alumni Association.
* **Landing Page (Home):** A beautifully designed, dynamic introduction to the UETMAA, highlighting the mission, vision, and benefits of joining.
* **Authentication Portal:** 
  * **Secure Registration:** A detailed multi-step form capturing essential verification data (Registration Number, CNIC, Admission/Graduation Year, Degree Level).
  * **Login & Password Recovery:** Secure access for returning alumni and administrators using email/password authentication.
* **Public Announcements:** A section highlighting major university news, upcoming public events, and notable alumni achievements.

### 2. Alumni Portal Functionality (Authenticated Users)
Once an alumnus registers and is verified, they gain access to a dedicated, personalized portal.
* **Alumni Dashboard:** A central hub displaying quick actions, recent announcements, upcoming events, and a progress bar encouraging them to reach 100% profile completion.
* **Profile Management:**
  * **Academic & Career Tracking:** Alumni can securely update their current employer, job title, industry, and location.
  * **Skills & Certifications:** The ability to add technical skills and certifications to their profile.
  * **Avatar & Social Links:** Uploading a profile picture (via Cloudinary integration) and linking their professional LinkedIn profile.
* **Alumni Directory & Networking:**
  * A searchable, filterable database of all verified alumni.
  * Users can filter peers by Graduation Year, Department, Industry, or Location to facilitate networking, mentorship, and career opportunities.
* **Event Management:**
  * Browse upcoming university and alumni association events (e.g., reunions, workshops, seminars).
  * One-click registration for events and a tracking system to see which events they are scheduled to attend.
* **Membership Status:** A dedicated section where alumni can view their verification status (Pending, Approved, Rejected) and track any association membership fees or tier statuses.

### 3. Admin Portal Functionality (ORIC Administrators)
The backend command center for university staff to manage the network and ensure its integrity.
* **Admin Dashboard:** A high-level analytics view showing key metrics (Total Registered Alumni, Pending Verifications, Approval/Rejection rates) using interactive charts.
* **Verification Workflow (Crucial Feature):**
  * A secure queue of incoming alumni registrations. 
  * Admins can review submitted data (like Registration Number and CNIC) against university records.
  * One-click "Approve" or "Reject" actions that automatically update the user's role and grant them access to the network.
* **User Management:** The ability to view, edit, suspend, or delete any alumni profile within the system to maintain moderation.
* **Event & Announcement Broadcasting:** Tools for the admin to create new events, track RSVPs, and broadcast announcements directly to the alumni dashboards.

### 4. System-Wide Technical Features
* **Adaptive Premium UI/UX:** A state-of-the-art "Midnight Obsidian & Luminous Gold" design system that seamlessly transitions between Light and Dark modes. It features glassmorphism, fluid micro-animations, and a highly responsive mobile-first layout.
* **Robust Security:** Passwords are encrypted, and protected routes ensure that unverified users or guests cannot access the private directory or dashboards.
* **Scalable Database:** Powered by Prisma ORM and a relational database, ensuring complex queries (like searching the directory) remain lightning-fast even as the alumni network grows.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

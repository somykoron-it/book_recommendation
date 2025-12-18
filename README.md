# BookWise - Online Book Community Platform

BookWise is a full-stack Next.js application that allows users to discover books, manage reading lists, share reviews, follow friends, and receive personalized recommendations.

## Getting Started

### Prerequisites

- Node.js (version 18 or later recommended)
- A package manager: npm, yarn, pnpm, or bun

### Setup and Run the Project Locally

1. **Clone the repository**

   ```bash
   git clone https://github.com/somykoron-it/book_recommendation.git
   cd book_recommendation
   ```

2. **Install dependencies**

   ```bash

   npm install

   yarn install

   pnpm install

   ```

3. **Install dependencies**

    ```bash

    MONGODB_URI=

    NEXT_PUBLIC_BASE_URL=http://localhost:3000

    JWT_SECRET=

    ```

3. **Run Project**

    ```bash

    npm run dev

    yarn dev

    pnpm dev

    ```


### Open http://localhost:3000 in your browser.The app will automatically reload when you make changes to the code.

## Features

### User Management

- Registration & Login – Secure user signup and login (supports email/password and OAuth providers like Google)

- Profile Update – Users can edit their profile, upload avatar, bio, favorite genres, and reading preferences

### Book Discovery

- Search – Full-text search for books by title, author, ISBN, or keywords

- Filter & Browse – Filter by genre, publication year, language, popularity; browse trending, new releases, and genre-specific lists

### Recommendation Engine

- Content-Based Filtering – Personalized book recommendations based on user's reading history, ratings, and favorite genres

### Community Feedback

- Reviews and Ratings – Users can write detailed reviews and rate books on a 5-star scale

- Reviews are displayed on book pages with sorting options (most recent, most helpful)

### Reading List Management

- Want to Read, Currently Reading, Finished – Dedicated shelves for organizing personal reading progress

- Easy drag-and-drop or button-based updates between lists

### Social Features

- Follow Other Users – Build a network by following friends or interesting readers

- Activity Feed – See what your followed users are reading, rating, reviewing, or adding to their lists

### Notifications

- Real-time or email notifications for:

- Friend activities (new reviews, finished books, etc.)

- New personalized recommendations

- Follow requests and interactions

## Live Demo

🔗 Live Link: https://book-recommendation-dun.vercel.app

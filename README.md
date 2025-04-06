# Contributrack

## Overview

Contributrack is a Next.js application designed to help organizations manage and
track donations effectively. It provides a user-friendly interface for managing
donors, recording donations, generating reports, and visualizing donation
trends.

## Features

- **Donor Management:** Add, edit, and manage donor information.
- **Donation Tracking:** Record and track donations with details such as date,
  amount, and donor.
- **Data Visualization:** Visualize donation trends using charts and graphs.
- **PDF Report Generation:** Generate annual donation reports in PDF format.
- **Customizable Date Ranges:** Filter data by custom date ranges for specific
  reporting periods.
- **Webhook Integration:** Integrate with other services using webhooks.
- **Modern UI:** Built with shadcn/ui for a clean and responsive
  user experience.

## Technologies Used

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [PostgreSQL](https://www.postgresql.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [lucide-react](https://lucide.dev/)

## Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/contributrack.git
    cd contributrack
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Set up your PostgreSQL database:**

    - Create a new PostgreSQL database.
    - Update the database connection string in your `.env` file.

4.  **Run database migrations:**

    ```bash
    pnpm drizzle-kit generate
    pnpm drizzle-kit studio
    ```

5.  **Run the application:**

    ```bash
    pnpm dev
    ```

    Open your browser and navigate to `http://localhost:3000`.

## Contributing

We welcome contributions to Contributrack! If you'd like to contribute, please
follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with clear, concise messages.
4.  Submit a pull request.

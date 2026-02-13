# AI Agent Observability Frontend

A modern Next.js dashboard for monitoring, analyzing, and managing AI
agent behavior, decisions, and performance in real time.

## Overview

This frontend application provides a comprehensive observability layer
for AI agents. It enables real-time monitoring, trace exploration,
decision analytics, behavior analysis, and performance optimization
through interactive dashboards and detailed insights.

------------------------------------------------------------------------

## Features

### Real-Time Monitoring

-   Agent performance metrics including success rates, quality scores,
    and execution times\
-   Quality distribution visualizations for trace analysis\
-   Performance trends tracking over time

### Decision Analytics

-   Breakdown of decisions by type with associated quality scores\
-   Comparison of decision quality between successful and failed traces\
-   Context length analysis and decision pattern tracking

### Insights and Recommendations

-   Self-evaluation metrics and behavioral analysis\
-   Prioritized, actionable recommendations for improving agent
    performance\
-   Trend analysis with confidence distribution insights

### Behavior Pattern Detection

-   Identification of common execution sequences\
-   Error pattern tracking and visualization\
-   Time-based execution analysis\
-   Behavioral consistency measurement

### Task Management

-   Create and manage multiple task types\
-   View recent task history with status and quality scores\
-   Detailed trace inspection including decisions and events

------------------------------------------------------------------------

## Tech Stack

-   Framework: Next.js 16 (App Router)\
-   Language: TypeScript\
-   Styling: Tailwind CSS\
-   UI Components: shadcn/ui\
-   Data Fetching: SWR\
-   Charts: Recharts\
-   Icons: Lucide React\
-   Forms: React Hook Form with Zod\
-   Package Manager: npm

------------------------------------------------------------------------

## Prerequisites

Before running the project, ensure the following are installed:

-   Node.js 20.x or later\
-   npm 10.x or later\
-   Backend API running locally or remotely

------------------------------------------------------------------------

## Getting Started

### 1. Clone the Repository

``` bash
git clone https://github.com/ezzine-mouhamed/observability_project-frontend.git
cd observability_project-frontend
```

### 2. Install Dependencies

``` bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

``` env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Run the Development Server

``` bash
npm run dev
```

The application will be available at:

http://localhost:3000

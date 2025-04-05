# Memoria - Photo Gallery App

A modern, responsive photo gallery application built with Next.js, Convex, and Clerk for authentication. Users can create albums, upload photos, and share with others.


## Features

- Secure authentication with Clerk
- Real-time database with Convex
- Create public or private albums
- Upload, edit, and categorize photos
- Search and explore public photos
- Tag-based organization
- Responsive design with Tailwind CSS

## Tech Stack

- <b>Frontend:</b> Next.js, React, Tailwind CSS
- <b>Backend:</b> Convex for database and file storage
- <b>Authentication:</b> Clerk
- <b>State Management:</b> React hooks with Convex client
- <b>UI Components:</b> Custom components with Tailwind

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Clerk account
- Convex account

### Installation

1. Clone the repository:
	```bash
	git clone https://github.com/e-nk/memoria.git

	cd memoria
	```
2. Install dependencies:
	```bash
	npm install
	```
3. Configure environment variables:
	```bash
	# Create a .env.local file with your credentials
	NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
	CLERK_SECRET_KEY=your_clerk_secret_key
	NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
	NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
	NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/home
	NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/home
	CLERK_WEBHOOK_SECRET=your_webhook_secret
	NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
	```
4. Initialize Convex:
	```bash
	npm convex dev
	```
5. Run the development server:
 
		npm run dev
6. Open http://localhost:3000 in your browser.

## Convex Setup

1. Create a Convex account at convex.dev
2. Set up a new project and copy your deployment URL
3. Configure Convex schema and functions from the project files

## Clerk Setup

1. Create a Clerk account at clerk.dev
2. Set up a new application
3. Configure OAuth providers (Google, GitHub, etc.) as needed
4. Add your domain to the allowed origins
5. Configure webhooks with `/api/webhooks/clerk` as the endpoint

## Project Structure

```bash 
/app                   # Next.js app router
  /(home)              # Authenticated routes
    /home              # Main home page after login
    /album/[id]        # Album detail page
    /photo/[id]        # Photo detail page
    /albums            # User's albums page
    /explore           # Explore photos page
/components            # React components
/convex                # Convex schema and functions
/hooks                 # Custom React hooks
/utils                 # Utility functions
/public                # Static files
```

## Key Components

- `MainLayout:` Base layout with background effects
- ``AuthLayout:`` Layout for authenticated pages
- `AlbumsList:` Displays album grid with photo previews
- `PhotoGrid:` Displays photos in a responsive grid
- `PhotoUpload:` Handles photo uploading
- `PhotoEditor:` Edits photo metadata

## License
MIT

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
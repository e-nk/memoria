# Memoria - Technical Documentation

## 🏗️ **Project Architecture Overview**

```
Authentication (Clerk) → Context (AuthContext) → Database (Convex) → UI (React Components)
```

Memoria is a modern photo gallery application built with Next.js, Convex, and Clerk authentication. Users can create public/private albums, upload photos with metadata, and explore other users' content with real-time updates and responsive design.

---

## 🔐 **Authentication Flow (The Foundation)**

### **Authentication Process**
```
User signs in with Clerk → Webhook triggers → User data synced to Convex → AuthContext provides user state
```

**Files involved:**
- `src/app/api/webhooks/clerk/route.ts` - Receives Clerk webhooks
- `convex/auth.ts` - Handles user sync to Convex database
- `src/context/AuthContext.tsx` - Provides authentication state to entire app

**How it works:**
1. User signs in via Clerk (Google/GitHub/Facebook)
2. Clerk sends webhook to your API route
3. API route calls Convex `syncClerkUser` function
4. User record created/updated in Convex database
5. AuthContext makes this user data available throughout app

---

## 🎣 **Hooks (Data Layer)**

### **`src/hooks/useConvexAuth.ts`**
- **Purpose:** Bridges Clerk authentication with Convex database
- **What it does:** 
  - Syncs Clerk user to Convex when they first sign in
  - Provides current user data from Convex
  - Manages loading states

### **`src/hooks/useAlbums.ts`**
- **Purpose:** All album-related operations
- **Functions:**
  - `createAlbum()` - Creates new albums
  - `updateAlbum()` - Edits album details
  - `deleteAlbum()` - Deletes albums (and all photos)
  - `userAlbums` query - Gets user's albums
  - `searchAlbums()` - Searches public albums

### **`src/hooks/usePhotos.ts`**
- **Purpose:** All photo-related operations
- **Functions:**
  - `addPhoto()` - Uploads new photos
  - `updatePhoto()` - Edits photo metadata
  - `deletePhoto()` - Removes photos
  - `getAlbumPhotos()` - Gets photos in an album
  - `getExplorePhotos()` - Gets public photos for explore page

---

## 🛠️ **Utils (Helper Functions)**

### **`src/utils/uploadUtils.ts`**
- **Purpose:** Handles file uploads to Convex
- **Key functions:**
  - `validateImageFile()` - Checks file type and size
  - `usePhotoUpload()` - Custom hook for uploading photos
  - Handles the complex flow: Generate upload URL → Upload file → Save metadata

---

## 🎨 **Components Architecture**

### **📱 Layout Components**

#### **`src/components/layouts/MainLayout.tsx`**
- **Used for:** Public pages (homepage)
- **What it does:** 
  - Provides header and footer
  - Background gradient effects
  - Responsive container structure

#### **`src/components/layouts/AuthLayout.tsx`**
- **Used for:** Protected pages (everything after login)
- **What it does:**
  - Checks if user is authenticated
  - Redirects to homepage if not logged in
  - Provides navigation and layout for authenticated users

#### **`src/components/layouts/Container.tsx`**
- **Purpose:** Consistent page width and spacing
- **Options:** Boxed styling, full width, custom padding

---

### **🧭 Navigation Components**

#### **`src/components/navigation/Navigation.tsx`**
- **Purpose:** Main navigation for authenticated users
- **Features:**
  - Home, My Albums, Explore links
  - User avatar with Clerk UserButton
  - Mobile hamburger menu
  - Active page highlighting
  - Scroll-based background transparency

#### **`src/components/layouts/Header.tsx`**
- **Purpose:** Header for public pages
- **Features:**
  - Sign in button for non-authenticated users
  - Links to explore for authenticated users

---

### **🏠 Home Page Components**

#### **`src/components/home/HomeHeader.tsx`**
- **Purpose:** Welcome message on home page
- **Content:** "Welcome back, [Name]" with gradient styling

#### **`src/components/home/UserCard.tsx`**
- **Purpose:** Individual user card in the users list
- **Features:**
  - User avatar, name, username, email
  - Album count for each user
  - Click to view user's profile

#### **`src/components/home/UsersList.tsx`**
- **Purpose:** Grid layout of all user cards
- **Usage:** Displays all registered users on home page

---

### **📚 Albums Components**

#### **`src/components/albums/MyAlbumsHeader.tsx`**
- **Purpose:** Header for user's albums page
- **Features:**
  - Shows "[User]'s Albums" title
  - Album count display
  - "New Album" button

#### **`src/components/albums/AlbumCreateForm.tsx`**
- **Purpose:** Form to create new albums
- **Features:**
  - Title, description, category fields
  - Public/Private radio buttons
  - Form validation and error handling
  - Calls `createAlbum` mutation

---

### **📖 Individual Album Components**

#### **`src/components/album/AlbumHeader.tsx`**
- **Purpose:** Header for individual album pages
- **Features:**
  - Album title, description, category
  - Public/Private indicator
  - Owner controls (Add Photos, Edit, Delete buttons)
  - Breadcrumb navigation back to user

#### **`src/components/album/PhotoGrid.tsx`**
- **Purpose:** Grid display of photos in an album
- **Features:**
  - Responsive grid layout (2-5 columns based on screen)
  - Photo thumbnails with hover effects
  - Owner controls (Edit, Delete buttons on hover)
  - Tags preview under each photo

---

### **🖼️ Photo Components**

#### **`src/components/photo/PhotoUpload.tsx`**
- **Purpose:** Upload interface for adding photos
- **Features:**
  - Drag-and-drop area
  - File validation (type, size)
  - Image preview before upload
  - Form for title, description, tags
  - Progress indicators

#### **`src/components/photo/PhotoHeader.tsx`**
- **Purpose:** Header for individual photo pages
- **Features:**
  - Breadcrumb back to album
  - Photo ID display
  - Owner controls (Edit, Delete buttons)
  - Album context information

#### **`src/components/photo/PhotoEditor.tsx`**
- **Purpose:** Inline editing form for photo metadata
- **Features:**
  - Edit title, description, tags
  - Form validation
  - Save/Cancel buttons
  - Calls `updatePhoto` mutation

---

### **🔍 Explore Components**

#### **`src/components/explore/ExploreHeader.tsx`**
- **Purpose:** Header with search functionality
- **Features:**
  - Search input field
  - Clear search button
  - "Explore Photos" title

#### **`src/components/explore/ExploreGrid.tsx`**
- **Purpose:** Grid of public photos for discovery
- **Features:**
  - Similar to PhotoGrid but for public photos
  - No owner controls (since viewing others' photos)
  - Click to view individual photos

---

### **👤 User Profile Components**

#### **`src/components/user/UserHeader.tsx`**
- **Purpose:** Header for individual user profile pages
- **Features:**
  - User information display
  - Contact details
  - Album count
  - Breadcrumb back to home

#### **`src/components/user/AlbumsList.tsx`**
- **Purpose:** Grid of user's public albums
- **Features:**
  - Album cards with photo previews
  - Shows up to 4 photos per album
  - Gradient placeholders for empty albums
  - Privacy indicators
  - Owner controls if viewing own albums

#### **`src/components/user/AlbumPlaceholder.tsx`**
- **Purpose:** Placeholder for albums without photos
- **Features:** Consistent styling with icon and text

---

## 🗃️ **Database Layer (Convex)**

### **Schema Structure (convex/schema.ts)**
```
Users ← Albums ← Photos
     ← Likes
```

### **Database Functions**

#### **`convex/users.ts`**
- `createOrUpdateUser` - Syncs from Clerk
- `getCurrentUser` - Gets user by Clerk ID
- `getAllUsers` - For home page user listing

#### **`convex/albums.ts`**
- `createAlbum` - Creates new albums
- `getAlbumsByUser` - Gets user's albums (with privacy filter)
- `getPublicAlbums` - For explore functionality
- `updateAlbum` - Edits album details
- `deleteAlbum` - Removes album and all photos

#### **`convex/photos.ts`**
- `addPhoto` - Adds photo to album
- `getPhotosByAlbum` - Gets photos in album
- `getExplorePhotos` - Random public photos
- `updatePhoto` - Edits photo metadata
- `deletePhoto` - Removes photo

---

## 🔄 **Data Flow Examples**

### **Creating an Album**
1. User clicks "New Album" → `AlbumCreateForm` appears
2. User fills form → `handleSubmit` called
3. Form calls `createAlbum` from `useAlbums` hook
4. Hook calls Convex `createAlbum` mutation
5. Database updated → UI automatically refreshes

### **Uploading a Photo**
1. User drags image → `PhotoUpload` validates file
2. User fills metadata → clicks upload
3. `usePhotoUpload` generates upload URL
4. File uploaded to Convex storage
5. Photo metadata saved to database
6. `PhotoGrid` automatically shows new photo

### **Authentication Check**
1. Every protected page wrapped in `AuthLayout`
2. `AuthLayout` uses `useAuth` hook
3. Hook checks `useConvexAuth` for user state
4. If not authenticated → redirect to homepage
5. If authenticated → render page content

---

## 🎯 **Key Integration Points**

1. **Clerk Webhooks** sync user data to Convex
2. **AuthContext** provides user state to all components
3. **Custom hooks** abstract database operations
4. **Convex queries** automatically update UI when data changes
5. **Tailwind CSS** provides consistent styling across all components

---

## 🚀 **Getting Started**

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
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏛️ **Architecture Benefits**

This architecture creates a seamless flow where authentication, data management, and UI updates all work together automatically. The real-time nature of Convex means when one user uploads a photo, other users see it immediately without page refresh.

**Key Benefits:**
- **Real-time updates** without WebSocket configuration
- **Type-safe** database operations
- **Automatic UI synchronization** with data changes
- **Scalable authentication** with Clerk
- **Responsive design** with Tailwind CSS
- **Modern React patterns** with hooks and context

---

## 📁 **Project Structure**

```
memoria/
├── src/
│   ├── app/
│   │   ├── (home)/          # Protected authenticated routes
│   │   ├── api/             # API routes (webhooks)
│   │   ├── globals.css      # Global styles
│   │   └── layout.tsx       # Root layout
│   ├── components/
│   │   ├── albums/          # Album-related components
│   │   ├── album/           # Individual album components
│   │   ├── explore/         # Explore page components
│   │   ├── home/            # Home page components
│   │   ├── layouts/         # Layout components
│   │   ├── navigation/      # Navigation components
│   │   ├── photo/           # Photo-related components
│   │   ├── user/            # User profile components
│   │   └── ui/              # Reusable UI components
│   ├── context/             # React contexts
│   ├── hooks/               # Custom React hooks
│   └── utils/               # Utility functions
├── convex/
│   ├── schema.ts            # Database schema
│   ├── users.ts             # User-related functions
│   ├── albums.ts            # Album-related functions
│   ├── photos.ts            # Photo-related functions
│   └── auth.ts              # Authentication functions
└── public/                  # Static assets
```

---

## 🔧 **Technology Stack**

- **Frontend:** Next.js 14, React, TypeScript
- **Styling:** Tailwind CSS
- **Database:** Convex (real-time database)
- **Authentication:** Clerk
- **File Storage:** Convex File Storage
- **Deployment:** Vercel (frontend), Convex (backend)

---

## 📝 **Notes**

- The application uses Convex for both database and file storage
- Real-time updates are handled automatically by Convex
- Authentication is managed through Clerk with webhook synchronization
- All components are fully responsive and accessible
- The project follows modern React patterns with hooks and context
// app/(home)/home/photo/[id]/edit/page.tsx
"use client";

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PhotoPage from '../page';

export default function PhotoEditPage() {
  const router = useRouter();
  const params = useParams();
  
  // This page simply renders the photo page but with edit mode immediately enabled
  // The PhotoPage component will handle the edit mode based on the URL
  
  return (
    <PhotoPage />
  );
}
# Orpheus Personal Website - Bug Analysis Report

## Overview
This document records the bugs found during testing, their root causes, and solutions.

---

## Bug 1: Academic Papers PDF Download Issue

### Symptoms
- Files uploaded via backend admin interface cannot be downloaded from public website
- "Download PDF" button shows "Coming Soon" toast

### Root Cause
- The `AdminPapers.tsx` component only had a text input for PDF URL
- There was no actual PDF file upload functionality
- The backend has `upload.pdf` API but frontend didn't use it

### Solution Applied
- ✅ Added PDF file upload component to `AdminPapers.tsx`
- ✅ Integrated `trpc.upload.pdf` mutation for file uploads
- ✅ Store both URL and key in the database
- ✅ Improved `Academic.tsx` download function to properly download files

---

## Bug 2: Backend Content Overwrite Issue

### Symptoms
- When files are uploaded in backend, all existing frontend content disappears
- Only newly uploaded content is visible

### Root Cause
- Frontend uses static/mock data as fallback when database is empty
- First upload triggers real data sync, replacing mock data with only the new entry
- No initial seed data in database

### Solution Applied
- ✅ Created `server/seed.ts` with default content for photos, essays, and papers
- ✅ Added `pnpm db:seed` command to `package.json`
- ✅ Seed script checks if tables are empty before inserting
- ✅ Includes 6 photos, 4 essays, and 3 papers as initial content

---

## Bug 3: Photography Module Interaction Issue

### Symptoms
- Images only show as previews
- Cannot click to view enlarged versions
- Cannot download images

### Root Cause
- Lightbox state management was not properly synchronized
- Missing keyboard navigation support
- No download functionality

### Solution Applied
- ✅ Refactored `Photography.tsx` with improved lightbox state management
- ✅ Added separate `isLightboxOpen` state for better control
- ✅ Added keyboard navigation (ESC to close, Arrow keys to navigate)
- ✅ Added download button on hover and in lightbox
- ✅ Improved accessibility with ARIA labels and keyboard support
- ✅ Increased z-index to ensure lightbox appears above all content

---

## Additional Improvements Made

### Code Quality
- Added proper error handling for file downloads
- Improved toast notifications with Chinese localization
- Added photo counter in lightbox (e.g., "3 / 6")

### User Experience
- Added hover effects with zoom and download buttons
- Smooth animations for lightbox open/close
- Responsive design improvements

---

## Files Modified

1. `client/src/pages/admin/AdminPapers.tsx` - Added PDF upload functionality
2. `client/src/pages/Photography.tsx` - Fixed lightbox and added download
3. `client/src/pages/Academic.tsx` - Improved PDF download function
4. `server/seed.ts` - New file for database seeding
5. `package.json` - Added db:seed script

---

## Deployment Notes

1. Run `pnpm db:seed` after deployment to initialize database with default content
2. Ensure storage service is properly configured for PDF uploads
3. Test PDF download functionality after deployment

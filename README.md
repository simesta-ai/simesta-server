# Simesta - AI-powered Learning Assistant (Backend)
Simesta is an under-development learning application that leverages the power of AI to create personalized learning paths for users.

# Project Overview
This repository contains the backend code for Simesta, built with Express and Typescript.

Key Features:

- Personalized Learning Paths: Users can specify a course title (and optionally topics) and Simesta generates a tailored learning journey with text and video content.
- Text to Text: The application utilizes the Gemini Pro model to generate textual learning materials.
- Text to Image: The Imagen model provides visual aids in the form of images based on the learning content.
- Video Generation: Leveraging the Youtube API, Simesta integrates relevant videos into the learning path.
- Authentication: Secure user access is ensured through Google OAuth2 authorization and token-based authentication using JWT.

Technologies Used:

- Backend: Express, Typescript
- AI Models:
Text to Text: Gemini Pro
Text to Image: Imagen
- External API: Youtube API
Authentication: Google OAuth2, JWT
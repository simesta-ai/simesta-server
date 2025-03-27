# Simesta - AI-powered Learning Assistant (Backend)

![Simesta Logo](/simestaw.jpeg)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Build Status](https://github.com/simesta-ai/simesta-server/actions/workflows/build.yml/badge.svg)](https://github.com/simesta-ai/simesta-server/actions)
[![Contributors](https://img.shields.io/github/contributors/simesta-ai/simesta-server.svg)](https://github.com/simesta-ai/simesta-server/graphs/contributors)

## Overview

Simesta is a learning application that leverages AI to create personalized learning paths for users.

## Features

- **Personalized Learning Paths:** Generate tailored learning journeys based on user-specified course titles and topics.
- **AI-Generated Content:** Utilize advanced AI models for textual materials and visual aids.
- **Video Integration:** Incorporate relevant videos into the learning path using the YouTube API.
- **Secure Authentication:** Implement Google OAuth2 and JWT for user authentication.

## Technologies Used

- **Backend:** Express, TypeScript
- **AI Models:** Advanced text and image generation models
- **External APIs:** YouTube API for video content
- **Authentication:** Google OAuth2, JWT

## Getting Started

### Prerequisites

- Node.js v14 or higher
- npm or yarn
- Google API credentials

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/simesta-ai/simesta-server.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd simesta-server
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Set up environment variables:**
   Create a .env file in the root directory and configure the following variables:

  ```env
   NODE_ENV=
   PORT=
   DB_NAME=
   DB_USER=
   DB_HOST=
   DB_PASSWORD=
   DB_PORT=
   GOOGLE_CLOUD_API_KEY=
   JWT_SECRET=
   SESSION_SECRET=
   GOOGLE_CLOUD_ID=
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   OPENAI_API_KEY=
   REDIS_SECRET=
   REDIS_HOST=
   REDIS_PORT=
   PAT=
   USER_ID=
   APP_ID=
   MODEL_ID=
   TEXT_MODEL_USER_ID=
   TEXT_MODEL_APP_ID=
   TEXT_MODEL_VERSION_ID=
   TEXT_MODEL_ID=
   MODEL_VERSION_ID=
   CLOUDINARY_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   DATABASE_URL=
   AZURE_ACCOUNT_NAME=
   AZURE_ACCOUNT_KEY=
   AZURE_CONTAINER_NAME=
   SPEECH_KEY=
   SPEECH_REGION=
   HOST_EMAIL_ADDRESS=
   HOST_EMAIL_PASSWORD=
  ```


## Running the Application

### Development Mode:
npm run start:dev

### Production Mode:
npm start


## Usage

1. **Register/Login**: Use **Google OAuth2** to create an account or log in.  
2. **Create a Course**: Input the **course title, subtopics of interest, and any files**.  
3. **Generate Learning Path**: Simesta will curate a **personalized learning journey** with **text, images, and videos**.  

## Contributing

Contributions are restricted to inhouse developers for now. Please follow our [Contributing Guidelines](CONTRIBUTING.md) to get started.

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## Contact

For questions or suggestions, please open an **issue** or contact us at [simestaai@gmail.com](mailto:simestaai@gmail.com).

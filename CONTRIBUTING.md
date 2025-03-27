# Contributing to Simesta

Thank you for your interest in contributing to Simesta! Currently, contributions are **limited to in-house developers** as we refine the core features. If you are part of the Simesta development team, please follow the guidelines below.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
  - [Branching Strategy](#branching-strategy)
  - [Submitting Pull Requests](#submitting-pull-requests)
- [Development Setup](#development-setup)
- [Code Style](#code-style)
- [License](#license)

## Code of Conduct
All contributors must adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) to maintain a professional and inclusive environment.

## How to Contribute

### Branching Strategy
- **Main branch (`main`)**: Stable production-ready code.
- **Development branch (`develop`)**: Active development branch where features are merged before release.
- **Feature branches (`feature/<feature-name>`)**: New features should be developed in a dedicated branch.
- **Bugfix branches (`bugfix/<bug-name>`)**: Bug fixes should be done in separate branches before merging into `develop`.

### Submitting Pull Requests
1. Ensure your branch is up to date with `develop`.
2. Commit meaningful changes with clear commit messages.
3. Push your branch and create a **Pull Request (PR)** against `develop`.
4. Request a review from a **team lead(https://github.com/samthemogul)**.
5. Address any feedback before merging.

## Development Setup
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
   ```bash
   cp .env.example .env
   ```
   Fill in the necessary credentials.
5. **Run the application:**
   ```bash
   npm run start:dev
   ```

## Code Style
- Follow **ESLint & Prettier** configurations.
- Use meaningful variable and function names.
- Keep PRs **small and focused** on a single feature or fix.

## License
By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
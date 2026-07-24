# AI Project Compiler (APC)

Transform AI conversations into complete, searchable, versioned development projects.

## Overview

The AI Project Compiler is not a simple conversation exporter—it's an intelligent knowledge compiler that transforms exploratory AI conversations into structured, reusable development assets.

### Core Philosophy

**The conversation is not the product—the knowledge inside the conversation is.**

The application extracts, classifies, enriches, versions, and organizes that knowledge into a maintainable project workspace.

## Features (Phase 1 MVP)

- ✅ **Conversation Import**: Support multiple formats (text, markdown, JSON)
- ✅ **AI Parsing Pipeline**: Multi-stage extraction and classification
- ✅ **Knowledge Extraction**: Automatically identify requirements, features, architecture, tasks
- ✅ **Project Classification**: Detect tech stack with confidence scores
- ✅ **Intelligent Folder Generation**: Auto-scaffold project structure based on detected stack
- ✅ **Code & Doc Extraction**: Pull code snippets and documentation automatically
- ✅ **Project Workspace**: Persistent storage with revision history
- ✅ **ZIP Export**: Generate complete project bundles
- ✅ **Semantic Search**: Find concepts across conversations
- ✅ **Multi-AI Support**: OpenAI, Anthropic, local Ollama, and more

## Architecture

```
Frontend (React + TypeScript)
        ↓
REST API (NestJS)
        ↓
AI Processing Pipeline
        ↓
Knowledge Graph Engine
        ↓
SQLite Database + File Storage
```

## Project Structure

```
ai-project-compiler/
├── backend/              # NestJS application
├── frontend/             # React application
├── shared/               # Shared types and utilities
├── docker-compose.yml    # Local development setup
├── README.md
└── .env.example
```

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- SQLite3
- Docker (optional, for local Ollama)

### Development Setup

```bash
# Clone and install
git clone https://github.com/dawgu89-art/ai-project-compiler
cd ai-project-compiler

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development servers
npm run dev
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Docs: http://localhost:3001/api/docs

## Usage Flow

1. **Import**: Upload a conversation (text, markdown, or JSON export)
2. **Parse**: System automatically analyzes and extracts knowledge
3. **Classify**: Detects tech stack, project type, and architecture
4. **Review**: Adjust detected classifications if needed
5. **Generate**: Creates folder structure and scaffolds project
6. **Export**: Download as ZIP or save as workspace
7. **Iterate**: Reopen and refine with new conversations

## Configuration

See `.env.example` for all configuration options:

```env
# AI Providers
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
OLLAMA_BASE_URL=http://localhost:11434

# Database
DATABASE_URL=file:./data/projects.db

# Frontend
VITE_API_URL=http://localhost:3001
VITE_AI_PROVIDER=openai
```

## Development

```bash
# Run both frontend and backend
npm run dev

# Run backend only
npm run dev:backend

# Run frontend only
npm run dev:frontend

# Build for production
npm run build

# Run tests
npm run test

# Lint and format
npm run lint
npm run format
```

## API Documentation

Once backend is running, visit `http://localhost:3001/api/docs` for interactive Swagger documentation.

Key endpoints:
- `POST /api/projects` - Create new project
- `POST /api/projects/:id/import` - Import conversation
- `POST /api/projects/:id/parse` - Parse and extract knowledge
- `GET /api/projects/:id` - Get project details
- `GET /api/projects/:id/export` - Export as ZIP
- `POST /api/search` - Semantic search across projects

## Data Model

### Project
- id, name, description, createdAt, updatedAt
- techStack (detected frameworks, languages, databases)
- features, requirements, architecture, roadmap
- conversations (linked import history)
- revisions (version history)

### Conversation
- id, projectId, content, format, importedAt
- extractedAt, parsedAt, status
- metadata (message count, detected languages, code blocks)

### Knowledge Items
- Requirements: Goals, constraints, acceptance criteria
- Features: Functionality, priority, status
- Architecture: Components, relationships, decisions
- Tasks: Todos, assigned to features/requirements
- Dependencies: External libraries, APIs, services

## Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: NestJS
- **Database**: SQLite + Prisma ORM
- **AI Integration**: OpenAI SDK, Anthropic SDK, Ollama client
- **Search**: SQLite FTS5 + semantic embeddings
- **Validation**: class-validator, class-transformer
- **API Docs**: Swagger/OpenAPI

### Frontend
- **Framework**: React 18 + TypeScript
- **Build**: Vite
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **State**: TanStack Query + Zustand
- **Forms**: React Hook Form
- **Editor**: Monaco Editor
- **Visualization**: React Flow (for graphs), Chart.js

### DevOps
- Docker & Docker Compose
- SQLite for local development
- GitHub Actions for CI/CD

## Roadmap

### Phase 1 (Current)
- Conversation import and parsing
- Basic knowledge extraction
- Project folder generation
- ZIP export

### Phase 2
- Knowledge graph with relationships
- Semantic search with embeddings
- Revision history and diffing
- Multi-project workspaces

### Phase 3
- Collaborative workspaces
- Plugin SDK
- Enterprise features (permissions, approvals)
- Team management

## Contributing

See CONTRIBUTING.md for guidelines.

## License

MIT

## Support

For issues, questions, or suggestions, please open a GitHub issue.

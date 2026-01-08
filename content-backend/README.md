# Feishu Integration Backend (NestJS)

Backend service integrating with **Feishu (Lark)** for authentication, data synchronization, and automated workflows.

## Tech Stack
- **Framework**: NestJS
- **Database**: PostgreSQL (via TypeORM)
- **Infrastructure**: Docker Compose
- **SDK**: `larksuiteoapi` (Official Feishu SDK)
- **Email**: IMAP Integration for email-based workflows

## Features
- **Multi-Channel Trigger**:
  - **Feishu Bot**: Handles file uploads via Feishu Chat.
  - **Email**: Polls inbox for ZIP attachments.
- **Frontend Integration**: Serves Vue frontend for complex processing (Config -> Parse -> Adjust).
- **Authentication**: Feishu OAuth Login (Passport Strategy).
- **Employee Sync**: Syncs User Roster from Feishu Base.

## Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose

### Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Database**
   ```bash
   docker-compose up -d
   ```

3. **Configure Environment**
   Check `.env` and fill in:
   - `FEISHU_APP_ID`
   - `FEISHU_APP_SECRET`
   - `DATABASE_URL`
   - `EMAIL_USER` / `EMAIL_PASS` (for Email workflow)

4. **Run Development Server**
   ```bash
   npm run start:dev
   ```

## Architecture
- **FeishuModule**: Handles OAuth, Sync, and Bot Events (`im.message.receive_v1`).
- **EmailModule**: Polls IMAP for incoming files.
- **ArticleModule**: Core business logic (Steps 1-4).

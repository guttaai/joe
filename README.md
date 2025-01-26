# Joe Porject

This project uses `@guttaai/core` to automatically invest in tokens on DEX exchanges using the latest AI technology for auditing.

## Quick Start

### Docker

```bash
# Navigate to the project root
cd joe

# Build and start the containers
docker compose up

# Stop the containers
docker compose down
```

### Manual

#### Server

```bash
cd server
npm install
npx ts-node src/main.ts
```

#### Client

```bash
cd client
npm install
npm run dev
```

# Joe Porject

This project uses `@guttaai/core` to automatically invest in tokens on DEX exchanges using the latest AI technology for auditing.

## Quick Start

### Docker

For quick start, you can use [Docker](https://www.docker.com/) to run the project.

```bash
# Navigate to the project root
cd joe

# Build and start the containers
docker compose up -d --build

# Stop the containers
docker compose down
```


#### Useful Commands

```bash
# Enter the server container
docker exec -it joe-server sh

# Enter the client container
docker exec -it joe-client sh

# Show server logs
docker logs -f joe-server

# Show client logs
docker logs -f joe-client
```

### Manual

If you want to run the project manually (without Docker), you will need to have Node.js and npm installed.

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

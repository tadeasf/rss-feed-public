#!/bin/bash

# Colors and formatting
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'
BOLD='\033[1m'

# Spinner characters
spinner=( '⠋' '⠙' '⠹' '⠸' '⠼' '⠴' '⠦' '⠧' '⠇' '⠏' )

# Function to show spinner
spin() {
  local pid=$1
  local message=$2
  local i=0
  while kill -0 $pid 2>/dev/null; do
    printf "\r${BLUE}${spinner[i]}${NC} ${message}"
    i=$(( (i+1) % ${#spinner[@]} ))
    sleep 0.1
  done
  printf "\r${GREEN}✓${NC} ${message}\n"
}

# Function to show help
show_help() {
  echo -e "${BOLD}Usage:${NC} ./run.sh [mode] [options]"
  echo
  echo -e "${BOLD}Modes:${NC}"
  echo "  dev                 Run in development mode"
  echo "  prod               Run in production mode"
  echo
  echo -e "${BOLD}Options:${NC}"
  echo "  --clean            Deep clean: remove volumes, node_modules, and rebuild"
  echo "  --build            Force rebuild containers"
  echo "  --logs [service]   Follow logs (app/torrent)"
  echo "  --help             Show this help message"
  echo
  echo -e "${BOLD}Examples:${NC}"
  echo "  ./run.sh dev"
  echo "  ./run.sh prod --clean"
  echo "  ./run.sh dev --logs app"
}

# Function to perform deep clean
deep_clean() {
  echo -e "${YELLOW}Performing deep clean...${NC}"
  
  docker compose down -v &
  spin $! "Stopping containers and removing volumes"
  
  rm -rf node_modules services/torrent-service/node_modules .next &
  spin $! "Removing node_modules and build artifacts"
  
  rm -f bun.lockb services/torrent-service/package-lock.json &
  spin $! "Removing lock files"
  
  bun install &
  spin $! "Installing root dependencies"
  
  (cd services/torrent-service && npm install) &
  spin $! "Installing torrent-service dependencies"
  
  bun run build &
  spin $! "Building application"
}

# Parse arguments
MODE=""
CLEAN=false
BUILD=false
LOGS=""

while [[ $# -gt 0 ]]; do
  case $1 in
    dev|prod)
      MODE=$1
      shift
      ;;
    --clean)
      CLEAN=true
      shift
      ;;
    --build)
      BUILD=true
      shift
      ;;
    --logs)
      shift
      LOGS=$1
      shift
      ;;
    --help)
      show_help
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      show_help
      exit 1
      ;;
  esac
done

# Validate mode
if [[ -z "$MODE" ]]; then
  echo -e "${RED}Error: Mode (dev/prod) must be specified${NC}"
  show_help
  exit 1
fi

# Set compose file based on mode
COMPOSE_FILE="docker-compose.yml"
if [[ "$MODE" == "dev" ]]; then
  COMPOSE_FILE="docker-compose_dev.yml"
fi

# Perform deep clean if requested
if [[ "$CLEAN" == true ]]; then
  deep_clean
fi

# Build and start containers
BUILD_FLAG=""
if [[ "$BUILD" == true ]]; then
  BUILD_FLAG="--build"
fi

echo -e "${BLUE}Starting in ${MODE} mode...${NC}"
docker compose -f $COMPOSE_FILE up -d $BUILD_FLAG &
spin $! "Starting containers"

# Follow logs if requested
if [[ -n "$LOGS" ]]; then
  sleep 2  # Give containers time to start
  case $LOGS in
    app)
      docker logs rss-feed-app-1 -f
      ;;
    torrent)
      docker logs rss-feed-torrent-service-1 -f
      ;;
    *)
      echo -e "${RED}Invalid service for logs. Use 'app' or 'torrent'${NC}"
      exit 1
      ;;
  esac
fi

echo -e "${GREEN}${BOLD}Setup complete!${NC}"
if [[ "$MODE" == "dev" ]]; then
  echo -e "App running at ${BLUE}http://localhost:3000${NC}"
else
  echo -e "App running at ${BLUE}http://localhost:24212${NC}"
fi
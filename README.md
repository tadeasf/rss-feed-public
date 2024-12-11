# RSS Feed Application

A Next.js application for managing torrent RSS feeds, built with Bun and Docker. This application is designed to work together with [transmission-pia-compose](https://github.com/tadeasf/transmission-pia-compose) and [plex-compose](https://github.com/tadeasf/plex-compose) to create a complete self-hosted streaming platform.

## System Overview

This application is part of a larger ecosystem:

1. RSS Feed App (this repo) - Manages and monitors torrent RSS feeds
2. [transmission-pia-compose](https://github.com/tadeasf/transmission-pia-compose-public) - Handles torrent downloading with VPN protection
3. [plex-compose](https://github.com/tadeasf/plex-compose-public) - Provides media streaming capabilities

Together, these components create an independent, self-hosted streaming platform.

## Prerequisites

- Docker and Docker Compose
- Bun (for local development)
- Node.js (for torrent-service)
- Recommended: Set up transmission-pia-compose and plex-compose first

## Quick Start

The application can be run in either development or production mode using our initialization script `run.sh`:

```bash
  chmod +x run.sh
  ./run.sh --help
```

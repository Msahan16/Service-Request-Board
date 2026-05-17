#!/bin/bash

# Service Request Board - Quick Start Script
# This script sets up and runs both backend and frontend

echo "================================"
echo "Service Request Board - Quick Start"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo -e "${BLUE}Step 1: Installing backend dependencies...${NC}"
cd backend
npm install
echo -e "${GREEN}✓ Backend dependencies installed${NC}"
echo ""

echo -e "${BLUE}Step 2: Installing frontend dependencies...${NC}"
cd ../frontend
npm install
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
echo ""

echo ""
echo "================================"
echo "Setup Complete!"
echo "================================"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 - Start Backend:"
echo "  cd backend"
echo "  npm run dev"
echo "  (runs on http://localhost:5000)"
echo ""
echo "Terminal 2 - Start Frontend:"
echo "  cd frontend"
echo "  npm run dev"
echo "  (runs on http://localhost:3000)"
echo ""
echo "Optional - Seed Database:"
echo "  cd backend"
echo "  node seed.js"
echo ""
echo "================================"

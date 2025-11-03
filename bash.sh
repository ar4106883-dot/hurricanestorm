#!/bin/bash

# Raincloud Deployment Script
# This script safely deploys to GitHub without exposing API keys

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🌧️  Raincloud Deployment Script${NC}"
echo "=================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found!${NC}"
    echo -e "${YELLOW}Please create a .env file based on .env.example${NC}"
    echo "Run: cp .env.example .env"
    echo "Then edit .env with your actual API keys"
    exit 1
fi

# Load environment variables from .env
echo -e "${GREEN}📋 Loading environment variables...${NC}"
export $(grep -v '^#' .env | xargs)

# Verify required environment variables
REQUIRED_VARS=(
    "ANTHROPIC_API_KEY"
    "OPENAI_API_KEY"
)

MISSING_VARS=()
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo -e "${RED}❌ Missing required environment variables:${NC}"
    printf '%s\n' "${MISSING_VARS[@]}"
    exit 1
fi

echo -e "${GREEN}✅ All required environment variables are set${NC}"

# Check if .gitignore exists and includes .env
if [ ! -f .gitignore ] || ! grep -q "^\.env$" .gitignore; then
    echo -e "${YELLOW}⚠️  Warning: .env not in .gitignore${NC}"
    echo "Adding .env to .gitignore..."
    echo ".env" >> .gitignore
fi

# Git operations
echo -e "${GREEN}📦 Preparing Git commit...${NC}"

# Add all files except those in .gitignore
git add .

# Show what will be committed (to catch any accidental key exposure)
echo -e "${YELLOW}Files to be committed:${NC}"
git status --short

# Confirm before committing
read -p "Continue with commit? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Deployment cancelled${NC}"
    exit 1
fi

# Get commit message
echo -e "${GREEN}Enter commit message:${NC}"
read -r COMMIT_MSG

if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="Update Raincloud deployment"
fi

# Commit and push
echo -e "${GREEN}🚀 Committing and pushing to GitHub...${NC}"
git commit -m "$COMMIT_MSG"
git push origin main

echo -e "${GREEN}✅ Successfully deployed to GitHub!${NC}"
echo -e "${YELLOW}📝 Note: Netlify will automatically deploy from GitHub${NC}"
echo -e "${YELLOW}   Make sure to set environment variables in Netlify:${NC}"
echo "   Settings → Environment Variables → Add each key from .env"

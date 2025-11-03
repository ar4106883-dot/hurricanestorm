#!/bin/bash

# Quick Setup Script for Raincloud
# This sets up your local environment securely

set -e

echo "🌧️  Raincloud Quick Setup"
echo "========================"
echo

# Check if .env.example exists
if [ ! -f .env.example ]; then
    echo "❌ Error: .env.example not found!"
    exit 1
fi

# Check if .env already exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists!"
    read -p "Overwrite it? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled"
        exit 0
    fi
fi

# Copy .env.example to .env
echo "📋 Creating .env file from template..."
cp .env.example .env

echo "✅ .env file created!"
echo
echo "📝 Next steps:"
echo "1. Edit .env file and add your API keys:"
echo "   nano .env"
echo
echo "2. Make bash.sh executable:"
echo "   chmod +x bash.sh"
echo
echo "3. Run deployment script:"
echo "   ./bash.sh"
echo
echo "🔒 Security reminder:"
echo "   - NEVER commit the .env file"
echo "   - Add API keys to Netlify environment variables"
echo "   - Check DEPLOYMENT_README.md for full instructions"

#!/bin/bash

echo "🔍 Running Dependency Audit..."

if [ -f "package.json" ]; then
    echo "📦 Node.js project detected."
    npm audit --audit-level=high
else
    echo "❓ No package.json found. Skipping npm audit."
fi

# Add more dependency checks here (e.g., pip audit) if needed.

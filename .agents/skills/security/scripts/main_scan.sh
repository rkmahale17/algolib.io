#!/bin/bash

# Security Scan Wrapper Script

echo "========================================"
echo "🛡️  ALGO LIB SECURITY SCAN"
echo "========================================"
echo ""

# 1. Run secret scan
echo "🔑 Scanning for secrets..."
python3 .agents/skills/security/scripts/scan_secrets.py
echo ""

# 2. Run network scan
echo "🌐 Scanning for network/cyber-attack patterns..."
python3 .agents/skills/security/scripts/scan_network.py
echo ""

# 3. Run dependency scan
bash .agents/skills/security/scripts/scan_deps.sh
echo ""

echo "========================================"
echo "✅ Security Scan Complete."
echo "========================================"

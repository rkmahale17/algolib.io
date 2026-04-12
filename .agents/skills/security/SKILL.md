---
name: Security Scan
description: Skill for scanning the repository for sensitive data, keys, network vulnerabilities, and cyber attack patterns.
---

# Security Scan Skill

This skill is invoked when the user requests a security audit, a scan for secrets, or checks for network vulnerabilities. Keywords: `security scan`, `audit`, `secrets`, `leaks`, `vulnerabilities`.

## Workflow Process

### 1. Preparation
- Ensure all dependencies for the scanning scripts are available (Python, Shell).
- Identify the scope of the scan (entire repo or specific subdirectories).

### 2. Execution
Run the integrated security scan using the provided scripts:
- **Secret Detection**: Checks for hardcoded API keys, tokens, and credentials.
- **Network Check**: Identifies hardcoded IP addresses and usage of insecure protocols (e.g., `http://` where `https://` is expected).
- **Dependency Audit**: Runs `npm audit` to find vulnerable packages.

### 3. Reporting
- Organize findings into a clear, formatted report in the chat.
- Categorize issues by severity: **High**, **Medium**, **Low**.
- Provide actionable advice for each finding (e.g., "Rotate this key", "Upgrade this package").

### 4. Safety First
- **IMPORTANT**: If a real secret is found, DO NOT display the full secret in the chat. Mask it (e.g., `AKIA...XXXX`).
- Warn the user about the risks of committing secrets to the repository.

## Commands
The primary command to run the full scan is:
```bash
bash .agents/skills/security/scripts/main_scan.sh
```

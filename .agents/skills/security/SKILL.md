---
name: security-scan
description: "Scan the repository for hardcoded secrets, exposed API keys, insecure network configurations, and vulnerable dependencies. Use when the user asks for a security audit, secret detection, credential scan, vulnerability check, or wants to find leaked tokens in the codebase."
---

# Security Scan

Detect hardcoded secrets, insecure network patterns, and vulnerable dependencies in the repository using integrated scanning scripts.

## Workflow

### 1. Determine scope

Identify whether to scan the entire repo or specific subdirectories based on the user request.

### 2. Run the scan

```bash
bash .agents/skills/security/scripts/main_scan.sh
```

The scan checks three categories:

- **Secret detection**: Hardcoded API keys, tokens, passwords, and credentials (e.g., patterns like `AKIA`, `sk-`, `ghp_`, `Bearer`)
- **Network check**: Hardcoded IP addresses and insecure protocol usage (`http://` where `https://` is expected)
- **Dependency audit**: `npm audit` for vulnerable packages

If the main script is unavailable, run checks manually:

```bash
# Secret patterns
grep -rn "AKIA\|sk-\|ghp_\|password\s*=\|api_key\s*=" --include="*.ts" --include="*.js" --include="*.env" .

# Insecure protocols
grep -rn "http://" --include="*.ts" --include="*.js" . | grep -v localhost

# Dependency vulnerabilities
npm audit --json
```

### 3. Report findings

Organize results by severity:

| Severity | Examples |
|----------|----------|
| **High** | Exposed API keys, hardcoded passwords, leaked tokens |
| **Medium** | Insecure protocol usage, hardcoded IPs in production code |
| **Low** | Outdated dependencies with low-severity CVEs |

Provide actionable remediation for each finding (e.g., "Rotate this key and move to environment variable", "Upgrade package X to version Y").

### 4. Safety

**CRITICAL**: Never display a full secret in the output. Mask all sensitive values (e.g., `AKIA...XXXX`, `sk-...abcd`). Warn the user about the risk of committing secrets to version control.

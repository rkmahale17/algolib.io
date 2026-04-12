import re
import os
import sys

# Define common secret patterns
PATTERNS = {
    "AWS Access Key ID": r"AKIA[0-9A-Z]{16}",
    "AWS Secret Access Key": r"secret_access_key\s*[:=]\s*['\"][A-Za-z0-9/+=]{40}['\"]",
    "GitHub Personal Access Token": r"ghp_[A-Za-z0-9_]{36}",
    "Stripe API Key": r"sk_test_[A-Za-z0-9]{24}|sk_live_[A-Za-z0-9]{24}",
    "Google API Key": r"AIza[0-9A-Za-z-_]{35}",
    "Generic Secret/Password": r"(secret|password|passwd|api_key|token)\s*[:=]\s*['\"][A-Za-z0-9_\-\.]{10,}['\"]",
    "Supabase Key": r"supabase_(key|secret|service_role)\s*[:=]\s*['\"][A-Za-z0-9-_=\.]{10,}['\"]",
}

def scan_file(filepath):
    findings = []
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            for name, pattern in PATTERNS.items():
                matches = re.finditer(pattern, content)
                for match in matches:
                    line_no = content.count('\n', 0, match.start()) + 1
                    snippet = match.group(0)
                    # Mask the secret partially
                    masked = snippet[:10] + "..." + snippet[-4:] if len(snippet) > 15 else "****"
                    findings.append({
                        "type": name,
                        "line": line_no,
                        "match": masked
                    })
    except Exception as e:
        pass
    return findings

def main():
    repo_path = "."
    if len(sys.argv) > 1:
        repo_path = sys.argv[1]

    all_findings = {}
    
    # Files/directories to ignore
    ignore_dirs = {'.git', 'node_modules', '.agents', '.next', 'dist', 'build'}
    ignore_files = {'package-lock.json', 'yarn.lock', 'scan_secrets.py'}

    for root, dirs, files in os.walk(repo_path):
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        for file in files:
            if file in ignore_files:
                continue
            
            filepath = os.path.join(root, file)
            findings = scan_file(filepath)
            if findings:
                all_findings[filepath] = findings

    if not all_findings:
        print("✅ No secrets found.")
    else:
        print("❌ Potential secrets found:")
        for file, findings in all_findings.items():
            print(f"\n📄 {file}")
            for f in findings:
                print(f"  - [{f['type']}] Line {f['line']}: {f['match']}")

if __name__ == "__main__":
    main()

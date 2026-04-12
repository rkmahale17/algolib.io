import re
import os
import sys

# Patterns for network misconfigurations and interesting artifacts
PATTERNS = {
    "Hardcoded IP Address": r"\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b",
    "Insecure Protocol (HTTP)": r"http://(?!(?:localhost|127\.0\.0\.1|0\.0\.0\.0))[\w\.-]+",
    "Internal Port Exposure": r"[:=]\s*(?:3000|5432|6379|8080|27017|9200)\b",
    "Dangerous Execution (eval)": r"\beval\s*\(",
    "Potential SQL Injection Pattern": r"\.query\s*\(\s*['\"].*?\$\{",
    "Hardcoded Private Key": r"-----BEGIN (?:RSA|OPENSSH|PRIVATE) KEY-----",
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
                    findings.append({
                        "type": name,
                        "line": line_no,
                        "match": snippet
                    })
    except Exception as e:
        pass
    return findings

def main():
    repo_path = "."
    if len(sys.argv) > 1:
        repo_path = sys.argv[1]

    all_findings = {}
    
    ignore_dirs = {'.git', 'node_modules', '.agents', '.next', 'dist', 'build'}
    ignore_files = {'package-lock.json', 'yarn.lock', 'scan_network.py'}

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
        print("✅ No network/attack patterns found.")
    else:
        print("⚠️ Potential network/cyber-attack patterns found:")
        for file, findings in all_findings.items():
            print(f"\n📄 {file}")
            for f in findings:
                print(f"  - [{f['type']}] Line {f['line']}: {f['match']}")

if __name__ == "__main__":
    main()

const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\RMahale\\.gemini\\antigravity\\brain';

if (fs.existsSync(brainDir)) {
  const dirs = fs.readdirSync(brainDir);
  console.log("Subdirectories in brain folder:", dirs);
  
  dirs.forEach(dir => {
    const logFile = path.join(brainDir, dir, '.system_generated', 'logs', 'transcript.jsonl');
    if (fs.existsSync(logFile)) {
      const stats = fs.statSync(logFile);
      console.log(`  Conversation: ${dir}, transcript size: ${(stats.size / 1024).toFixed(2)} KB`);
    }
  });
} else {
  console.log("Brain directory does not exist:", brainDir);
}

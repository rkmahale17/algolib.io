const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\RMahale\\.gemini\\antigravity\\brain\\f21e218f-30a1-4bc5-b5fb-7807f690193c\\.system_generated\\logs\\transcript_full.jsonl';

if (fs.existsSync(logPath)) {
  try {
    const fileContent = fs.readFileSync(logPath, 'utf8');
    const lines = fileContent.split('\n');
    lines.forEach((line, index) => {
      if (line.trim()) {
        const stepObj = JSON.parse(line);
        if (stepObj.type === 'USER_INPUT') {
          console.log(`User Input at line ${index + 1}:`);
          const content = stepObj.content || '';
          console.log(content.substring(0, 1000));
          console.log('----------------------------------------------------');
        }
      }
    });
  } catch (err) {
    console.error("Error reading target log: ", err.message);
  }
} else {
  console.log("Log path not found:", logPath);
}

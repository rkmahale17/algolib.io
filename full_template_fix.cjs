const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'supabase', 'functions', 'send-email', '_templates');
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.tsx') && f !== 'shared.tsx');

const previews = {
  'welcome.tsx': 'Confirm your email address for RulCode',
  'login-welcome.tsx': 'Sign in to RulCode - Your Magic Link',
  'subscription-success.tsx': 'Welcome to RulCode Pro! 🚀',
  'subscription-cancelled.tsx': 'RulCode Pro: Subscription Cancelled',
  'reset-password.tsx': 'Reset your RulCode password',
  'invite-user.tsx': "You're invited to RulCode!",
  'change-email.tsx': 'Verify your new email address for RulCode',
  'reauthenticate.tsx': 'Confirm your identity on RulCode',
  'onboarding-welcome.tsx': 'Welcome to the future of algorithm mastery!'
};

for (const file of files) {
  const filePath = path.join(templatesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Fix Preview
  if (previews[file]) {
    content = content.replace(/<Preview>[\s\S]*?<\/Preview>/, `<Preview>${previews[file]}</Preview>`);
  }

  // 2. Fix Column width to 52px
  content = content.replace(/<Column style=\{\{[\s\S]*?width:\s*'\d+px'[\s\S]*?\}\}>([\s\S]*?src=\{LOGO_URL\}[\s\S]*?)<\/Column>/g, (match, inner) => {
    return `<Column style={{ width: '52px', verticalAlign: 'middle' }}>${inner}</Column>`;
  });

  // 3. Fix Img dimensions to 42x39 for the logo
  content = content.replace(/<Img[\s\S]*?src=\{LOGO_URL\}[\s\S]*?\/>/g, (match) => {
    let updated = match;
    updated = updated.replace(/width="\d+"/, 'width="42"');
    updated = updated.replace(/height="\d+"/, 'height="39"');
    return updated;
  });

  fs.writeFileSync(filePath, content);
  console.log(`Fully updated ${file}`);
}

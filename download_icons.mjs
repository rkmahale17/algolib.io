import fs from 'fs';
import path from 'path';
import https from 'https';

const COMPANIES = [
  { id: "amazon", iconSlug: "amazon", svglSlug: "amazon" },
  { id: "google", iconSlug: "google", svglSlug: "google" },
  { id: "microsoft", iconSlug: "microsoft", svglSlug: "microsoft" },
  { id: "meta", iconSlug: "meta", svglSlug: "meta" },
  { id: "apple", iconSlug: "apple", svglSlug: "apple" },
  { id: "netflix", iconSlug: "netflix", svglSlug: "netflix" },
  { id: "uber", iconSlug: "uber", svglSlug: "uber" },
  { id: "bloomberg", iconSlug: "bloomberg", svglSlug: "bloomberg" },
  { id: "adobe", iconSlug: "adobe", svglSlug: "adobe" },
  { id: "linkedin", iconSlug: "linkedin", svglSlug: "linkedin" },
  { id: "salesforce", iconSlug: "salesforce", svglSlug: "salesforce" },
  { id: "tiktok", iconSlug: "tiktok", svglSlug: "tiktok" },
  { id: "oracle", iconSlug: "oracle", svglSlug: "oracle" },
  { id: "nvidia", iconSlug: "nvidia", svglSlug: "nvidia" },
  { id: "atlassian", iconSlug: "atlassian", svglSlug: "atlassian" },
  { id: "stripe", iconSlug: "stripe", svglSlug: "stripe" },
  { id: "goldman_sachs", iconSlug: "goldmansachs", svglSlug: "goldman-sachs" },
  { id: "morgan_stanley", iconSlug: "morganstanley", svglSlug: "morgan-stanley" },
  { id: "jpmorgan", iconSlug: "chase", svglSlug: "jpmorgan-chase" },
  { id: "spotify", iconSlug: "spotify", svglSlug: "spotify" },
  { id: "twitter", iconSlug: "x", svglSlug: "x" },
  { id: "snapchat", iconSlug: "snapchat", svglSlug: "snapchat" },
  { id: "pinterest", iconSlug: "pinterest", svglSlug: "pinterest" },
  { id: "byte_dance", iconSlug: "bytedance", svglSlug: "bytedance" },
  { id: "two_sigma", iconSlug: "twosigma", svglSlug: "two-sigma" }
];

const downloadSvg = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        let data = '';
        response.on('data', (chunk) => data += chunk);
        response.on('end', () => resolve(data));
      } else {
        response.resume();
        reject(new Error(`Failed with status code: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
};

const run = async () => {
    for (const company of COMPANIES) {
        const dest = path.join(process.cwd(), 'public', 'icons', 'companies', `${company.iconSlug}.svg`);
        
        try {
            const svglUrl = `https://api.svgl.app/static/icons/${company.svglSlug}.svg`;
            const data = await downloadSvg(svglUrl);
            fs.writeFileSync(dest, data);
            console.log(`Downloaded ${company.id} from SVGL`);
            continue;
        } catch (e) {
            console.log(`SVGL failed for ${company.id}`);
        }
        
        try {
            const simpleiconUrl = `https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/${company.iconSlug}.svg`;
            const data = await downloadSvg(simpleiconUrl);
            fs.writeFileSync(dest, data);
            console.log(`Downloaded ${company.id} from SimpleIcons`);
            continue;
        } catch (e) {
            console.log(`SimpleIcons failed for ${company.id}`);
        }
        
        console.log(`Failed to download icon for ${company.id}`);
    }
}

run();

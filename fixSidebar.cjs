const fs = require('fs');
let content = fs.readFileSync('src/config/sidebarNav.ts', 'utf-8');

const search = `export function isSidebarRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  if (`;

const replace = `export function isSidebarRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  if (pathname.startsWith("/frontend/problems/") && pathname !== "/frontend/problems/") return false;
  if (`;

content = content.replace(search, replace);
fs.writeFileSync('src/config/sidebarNav.ts', content, 'utf-8');

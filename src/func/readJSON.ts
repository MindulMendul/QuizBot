import fs from 'fs';

export default function readJSON(dir: string) {
  const raw = fs.readFileSync(dir, 'utf-8');
  return JSON.parse(raw);
}

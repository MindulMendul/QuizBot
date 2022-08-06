import fs from 'fs';

export default function writeJSON(dir: string, input: any) {
  fs.writeFileSync(dir, JSON.stringify(input));
}

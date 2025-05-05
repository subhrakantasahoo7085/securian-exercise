

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read and parse JSON config
const raw = readFileSync(resolve(__dirname, '../../resources/retirementData.json'), 'utf-8');
const jsonData = JSON.parse(raw);

// Combine baseUrl with other config
const env = {
  baseUrl: 'https://www.securian.com',
  ...jsonData
};

export default env;

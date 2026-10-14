import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createApp } from './createApp.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const PORT = Number(process.env.PORT) || 3001;
const app = createApp();

app.listen(PORT, () => {
  console.log(`API: http://localhost:${PORT}`);
  if (!process.env.GEMINI_API_KEY?.trim()) {
    console.warn('GEMINI_API_KEY не задан — чат через API недоступен.');
  }
});

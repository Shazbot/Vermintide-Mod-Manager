import fs from 'fs';
import path from 'path';
import electron from 'electron';
import Preset from './models/Preset';

let presets: Preset[] = [];
const presetsPath = path.join(electron.remote.app.getPath('userData'), 'presets.json');

if (fs.existsSync(presetsPath)) {
  presets = JSON.parse(fs.readFileSync(presetsPath, 'utf8'));
}

export { presetsPath };
export default presets;

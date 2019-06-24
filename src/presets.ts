import fs from 'fs';
import path from 'path';
import electron from 'electron';

export interface Preset {
    mods: any;
    value: string;
    label: string;
}
let presets: Preset[] = [];
const presetsPath = path.join(electron.remote.app.getPath('userData'), 'presets.json');

if (fs.existsSync(presetsPath)) {
    presets = JSON.parse(fs.readFileSync(presetsPath, 'utf8'));
}

const presetData = { currentPreset: undefined } as { currentPreset: Preset | undefined };

export { presetData, presetsPath };
export default presets;

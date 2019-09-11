const SJSON = require('simplified-json');
import { userSettingsPath } from './userSettings';
import fs from 'fs';

const getMods = () => SJSON.parse(fs.readFileSync(userSettingsPath, 'utf8')).mods;
export default getMods;

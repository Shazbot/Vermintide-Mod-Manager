import electron from 'electron';
import path from 'path';

const userSettingsPath = path.join(
  electron.remote.app.getPath('appData'),
  'Fatshark/Vermintide 2/user_settings.config'
);
export { userSettingsPath };

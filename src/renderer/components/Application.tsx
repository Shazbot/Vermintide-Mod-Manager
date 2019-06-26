import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import fs from 'fs';
import { userSettingsPath } from '../../userSettings';

const SJSON = require('simplified-json');
import List from './List';
import Dropdown from './Dropdown';
import Mod from '../../models/Mod';
import { presetData } from '../../presets';
import psList from 'ps-list';
import _ from 'lodash';

require('./Application.scss');

interface ApplicationState {
  mods: Mod[];
  isLauncherRunning: boolean;
}

class Application extends React.Component<{}, ApplicationState> {
  constructor(props: {}) {
    super(props);

    fs.watch(userSettingsPath, {}, (_, filename) => {
      if (filename) {
        this.setState(() => {
          return { mods: this.getMods() };
        });
      }
    });
    this.state = {
      mods: this.getMods(),
      isLauncherRunning: false,
    };

    setTimeout(this.checkProcesses, 1500);
  }
  checkProcesses = () => {
    psList()
      .then(result => {
        const launcher = _(result).find(process => process.name === 'Launcher.exe');
        this.setState(() => {
          return { isLauncherRunning: launcher !== undefined };
        });
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        setTimeout(this.checkProcesses, 1500);
      });
  };
  getMods = () => {
    return SJSON.parse(fs.readFileSync(userSettingsPath, 'utf8')).mods;
  };
  onReloadMods = () => {
    this.setState(() => {
      return { mods: this.getMods() };
    });
  };
  onPresetSelect = (selected: string) => {
    console.log(selected);
    const newMods = _.cloneDeep(presetData.currentPreset!.mods);
    this.state.mods.sort((modFirst, modSecond) => {
      const presetModFirst = _(newMods).find(mod => mod.name === modFirst.name);
      const presetModSecond = _(newMods).find(mod => mod.name === modSecond.name);

      if (!presetModFirst && !presetModSecond) {
        return 0;
      }

      if (!presetModFirst) {
        return 1;
      }
      if (!presetModSecond) {
        return -1;
      }

      const indexSecond = newMods.indexOf(presetModSecond);
      const indexFirst = newMods.indexOf(presetModFirst);

      return indexFirst - indexSecond;
    });
    _(newMods).forEach(presetMod => {
      const mod = _(this.state.mods).find(mod => mod.id === presetMod.id);
      if (mod) {
        mod.enabled = presetMod.enabled;
      }
    });
    this.setState(() => {
      return { mods: this.state.mods };
    });
  };
  render() {
    return (
      <div>
        <div className="list">
          <List mods={this.state.mods} />
        </div>
        <div className="dropdown">
          <Dropdown
            mods={this.state.mods}
            onReloadMods={this.onReloadMods}
            onPresetSelect={this.onPresetSelect}
          />
        </div>
        {this.state.isLauncherRunning && (
          <div className="launcher-warning">
            WARNING:
            <br />
            LAUNCHER IS RUNNING
            <br />
            CLOSE THE LAUNCHER IF YOU WANT TO MAKE ANY CHANGES
          </div>
        )}
      </div>
    );
  }
}

export default hot(Application);

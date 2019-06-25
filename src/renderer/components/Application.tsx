import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import fs from 'fs';
import { userSettingsPath } from '../../userSettings';

const SJSON = require('simplified-json');
import List from './List';
import Dropdown from './Dropdown';
import Mod from './Mod';
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
    this.setState(() => {
      return { mods: _.cloneDeep(presetData.currentPreset!.mods) };
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

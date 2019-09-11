import fs from 'fs';
import _ from 'lodash';
import psList from 'ps-list';
import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import { userSettingsPath } from '../../userSettings';
import { RELOAD_MODS } from '../actions/modList/reloadMods';
import store from '../store';
import Dropdown from './Dropdown';
import List from './List';

require('./Application.scss');

interface ApplicationState {
  isLauncherRunning: boolean;
}

class Application extends React.Component<{}, ApplicationState> {
  constructor(props: {}) {
    super(props);

    fs.watch(userSettingsPath, {}, (_, filename) => {
      if (filename) {
        store.dispatch({ type: RELOAD_MODS });
      }
    });
    this.state = {
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
        // console.error(err);
      })
      .finally(() => {
        setTimeout(this.checkProcesses, 1500);
      });
  };
  render() {
    return (
      <div>
        <div className="list">
          <List />
        </div>
        <div className="dropdown">
          <Dropdown />
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

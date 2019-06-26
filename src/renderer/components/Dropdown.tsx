import React from 'react';
import _ from 'lodash';
import ReactTooltip from 'react-tooltip';
// @ts-ignore
import Creatable from 'react-select/creatable';
import fs from 'fs';
import { userSettingsPath } from '../../userSettings';
const SJSON = require('simplified-json');

import presets, { presetData, presetsPath } from '../../presets';
import Preset from '../../models/Preset';

import electronSettings from 'electron-settings';
import { ActionMeta } from 'react-select/lib/types';
import Mod from '../../models/Mod';
let settings = electronSettings.get('mod-list');
if (settings === undefined) {
  settings = [];
  electronSettings.set('mod-list', settings);
}

export interface DropdownProps {
  mods: Mod[];
  onPresetSelect: (selected: string) => void;
  onReloadMods: () => void;
}
interface DropdownState {
  mods: Mod[];
  options: Preset[];
  value: Preset | null;
  hasValue: boolean;
  modDiffs: { deltaMods: Mod[] | undefined; deltaPreset: Mod[] | undefined };
}

class Dropdown extends React.Component<DropdownProps, DropdownState> {
  onPresetSelect: (selected: string) => void;
  constructor(props: DropdownProps) {
    super(props);
    this.onPresetSelect = props.onPresetSelect;
    this.onReloadMods = props.onReloadMods;
    this.state = {
      mods: props.mods,
      options: presets,
      value: null,
      hasValue: false,
      modDiffs: { deltaMods: undefined, deltaPreset: undefined },
    };
  }
  handleChange = (newValue: Preset, actionMeta: ActionMeta) => {
    console.group('Value Changed');
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
    presetData.currentPreset = newValue;
    this.onPresetSelect(newValue.value);

    this.setState({ value: newValue, hasValue: true });
    ReactTooltip.rebuild();
  };
  onCreateOption = (newOption: string) => {
    console.log(newOption);
    const newPreset = {
      mods: _.cloneDeep(this.state.mods),
      value: newOption,
      label: newOption,
    };
    presets.push(newPreset);
    presetData.currentPreset = newPreset;
    this.setState({
      options: presets,
      value: newPreset,
      hasValue: true,
      modDiffs: {
        deltaMods: this.getModDiffs(this.state.mods, newPreset.mods),
        deltaPreset: this.getModDiffs(newPreset.mods, this.state.mods),
      },
    });
    this.serializePresets();
  };
  serializePresets = () => {
    fs.writeFileSync(presetsPath, JSON.stringify(presets), 'utf8');
  };
  onSavePreset = () => {
    if (presetData.currentPreset) {
      presetData.currentPreset.mods = _.cloneDeep(this.state.mods);
      this.setState({
        modDiffs: { deltaMods: undefined, deltaPreset: undefined },
      });
    }
    this.serializePresets();
  };
  getModDiffs = (
    mods_first: Mod[] | undefined,
    mods_second: Mod[] | undefined
  ): Mod[] | undefined => {
    if (!mods_first || !mods_second) {
      return undefined;
    }
    return _(mods_first)
      .differenceBy(mods_second, 'name')
      .value();
  };
  componentDidUpdate = (prevProps: { mods: Mod[] }) => {
    const deltaMods = this.getModDiffs(
      this.props.mods,
      presetData.currentPreset && presetData.currentPreset.mods
    );

    const deltaPreset = this.getModDiffs(
      presetData.currentPreset && presetData.currentPreset.mods,
      this.props.mods
    );

    if (
      !_.isEqual(_.sortBy(deltaMods), _.sortBy(this.state.modDiffs.deltaMods)) ||
      !_.isEqual(_.sortBy(deltaPreset), _.sortBy(this.state.modDiffs.deltaPreset))
    ) {
      this.setState(() => {
        return {
          mods: this.props.mods,
          modDiffs: {
            deltaMods,
            deltaPreset,
          },
        };
      });
    }
    ReactTooltip.rebuild();
  };
  onSaveMods = () => {
    const userSettings = SJSON.parse(fs.readFileSync(userSettingsPath));
    userSettings.mods = this.state.mods;
    fs.writeFileSync(userSettingsPath, SJSON.stringify(userSettings), 'utf8');
  };
  onReloadMods = () => {
    this.onReloadMods();
  };
  onDeletePreset = () => {
    if (presetData.currentPreset) {
      presets.splice(
        0,
        presets.length,
        ...presets.filter(val => {
          return val !== presetData.currentPreset;
        })
      );
      presetData.currentPreset = undefined;
    }
    this.setState({ value: null, options: presets, hasValue: false });
    this.serializePresets();
    ReactTooltip.hide();
  };
  isPresetSelected = () => {
    return presetData.currentPreset !== undefined;
  };
  render() {
    return (
      <div className="presets-container">
        <div className="centered-outer">
          <div className="centered-inner">
            <button
              data-tip="Save mods to user_settings."
              onClick={this.onSaveMods}
              className="save-mods"
            >
              Save Mods
            </button>
            <button
              data-tip="Re-import mods from user_settings."
              onClick={this.onReloadMods}
              className="reload-mods"
            >
              Reload Mods
            </button>
          </div>
        </div>
        <hr />
        <div className="centered-outer">
          <div className="centered-inner">
            <button
              data-tip="Update current preset."
              onClick={this.onSavePreset}
              disabled={!this.isPresetSelected()}
              className="save-preset"
            >
              Update Preset
            </button>
            <button
              data-tip="Delete current preset."
              disabled={!this.isPresetSelected()}
              onClick={this.onDeletePreset}
              className="delete-preset"
            >
              Delete Preset
            </button>
          </div>
        </div>
        <Creatable
          placeholder="Select or type to create new preset..."
          className="creatable"
          defaultValue={undefined}
          onChange={this.handleChange}
          options={this.state.options}
          value={this.state.value}
          hasValue={this.state.hasValue}
          onCreateOption={this.onCreateOption}
        />
        <div className="centered-outer">
          <div className="centered-inner">
            <div className="preset-mod-diffs">
              {this.state.modDiffs &&
                this.state.modDiffs.deltaMods &&
                this.state.modDiffs.deltaMods.length > 0 &&
                [
                  <div key={`item-0`}>
                    <span
                      data-multiline="true"
                      data-tip="New mods missing from the preset.<br>Consider updating the preset."
                    >
                      New mods:
                    </span>
                  </div>,
                ].concat(
                  this.state.modDiffs.deltaMods.map((mod: Mod, index: number) => (
                    <div key={`item-${index + 1}`}>{mod.name}</div>
                  ))
                )}
            </div>
            <div className="preset-mod-diffs">
              {this.state.modDiffs &&
                this.state.modDiffs.deltaPreset &&
                this.state.modDiffs.deltaPreset.length > 0 &&
                [
                  <div
                    data-multiline="true"
                    data-tip="Mods saved in the preset but missing from user_settings.<br>Consider updating the preset."
                    key={`item-0`}
                  >
                    Missing mods:
                  </div>,
                ].concat(
                  this.state.modDiffs.deltaPreset.map((mod: Mod, index: number) => (
                    <div key={`item-${index}`}>{mod.name}</div>
                  ))
                )}
            </div>
          </div>
        </div>
        <ReactTooltip />
      </div>
    );
  }
}

export default Dropdown;

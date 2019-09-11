import electronSettings from 'electron-settings';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import Creatable from 'react-select/creatable';
import { ActionMeta, ValueType } from 'react-select/src/types';
import ReactTooltip from 'react-tooltip';
import { Dispatch } from 'redux';
import Mod from '../../models/Mod';
import Preset from '../../models/Preset';
import { APPLY_PRESET } from '../actions/modList/applyPreset';
import { RELOAD_MODS } from '../actions/modList/reloadMods';
import { SAVE_MODS } from '../actions/modList/saveMods';
import { PresetsAction } from '../actions/presets';
import { createPreset, CreatePresetAction } from '../actions/presets/createPreset';
import { deletePreset, DeletePresetAction } from '../actions/presets/deletePreset';
import { selectPreset, SelectPresetAction } from '../actions/presets/selectPreset';
import { updatePreset, UpdatePresetAction } from '../actions/presets/updatePreset';
import { RootState } from '../reducers';
import store from '../store';

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

interface PresetsDispatchProps {
  createPreset: (id: string, mods: Mod[]) => CreatePresetAction;
  updatePreset: (mods: Mod[]) => UpdatePresetAction;
  selectPreset: (id: string) => SelectPresetAction;
  deletePreset: () => DeletePresetAction;
}

export interface PresetsOwnProps {}

export interface PresetsStateProps {
  mods: Mod[];
  presets: Preset[];
  currentPreset: Preset | null;
  modDiffs: { deltaMods: Mod[] | undefined; deltaPreset: Mod[] | undefined };
}

type PresetsProps = PresetsStateProps & PresetsDispatchProps & PresetsOwnProps;

interface DropdownState {
  isPresetSelected: boolean;
  modDiffs: { deltaMods: Mod[] | undefined; deltaPreset: Mod[] | undefined };
}

class Dropdown extends React.Component<PresetsProps, DropdownState> {
  constructor(props: PresetsProps) {
    super(props);
    this.state = {
      modDiffs: { deltaMods: undefined, deltaPreset: undefined },
      isPresetSelected: props.currentPreset !== null,
    };
  }
  handleChange = (selectedValue: ValueType<Preset>, actionMeta: ActionMeta) => {
    console.group('Value Changed');
    console.log(selectedValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
    const newValue = selectedValue as Preset;
    this.props.selectPreset(newValue.id);
    store.dispatch({
      type: APPLY_PRESET,
      preset: this.props.currentPreset,
    });

    ReactTooltip.rebuild();
  };
  onCreateOption = (newOption: string) => {
    this.props.createPreset(newOption, store.getState()!.modList.mods);
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
  componentDidUpdate = (prevProps: PresetsProps) => {
    if (prevProps.currentPreset !== this.props.currentPreset) {
      this.setState(() => {
        return {
          isPresetSelected: this.props.currentPreset !== null,
        };
      });
    }

    const deltaMods = this.getModDiffs(this.props.mods, prevProps.mods);

    const deltaPreset = this.getModDiffs(prevProps.mods, this.props.mods);

    if (
      !_.isEqual(_.sortBy(deltaMods), _.sortBy(this.state.modDiffs.deltaMods)) ||
      !_.isEqual(_.sortBy(deltaPreset), _.sortBy(this.state.modDiffs.deltaPreset))
    ) {
      this.setState(() => {
        return {
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
    store.dispatch({
      type: SAVE_MODS,
    });
  };
  onReloadMods = () => {
    store.dispatch({
      type: RELOAD_MODS,
    });
  };
  onDeletePreset = () => {
    this.props.deletePreset();
    ReactTooltip.hide();
  };
  getOptionLabel = (preset: Preset | { value: string; label: string }) => {
    if ('id' in preset) {
      return preset.id;
    }

    return preset.label;
  };
  getOptionValue = (preset: Preset) => {
    return preset.id;
  };
  onUpdatePreset = () => {
    this.props.updatePreset(store.getState()!.modList.mods);
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
              onClick={this.onUpdatePreset}
              disabled={!this.state.isPresetSelected}
              className="save-preset"
            >
              Update Preset
            </button>
            <button
              data-tip="Delete current preset."
              disabled={!this.state.isPresetSelected}
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
          options={this.props.presets}
          value={this.props.currentPreset}
          hasValue={this.state.isPresetSelected}
          onCreateOption={this.onCreateOption}
          getOptionLabel={this.getOptionLabel}
          getOptionValue={this.getOptionValue}
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

const mapStateToProps = (state: RootState): PresetsStateProps => ({
  mods: state.modList.mods,
  presets: state.presets.presets,
  currentPreset: state.presets.currentPreset,
  modDiffs: { deltaMods: undefined, deltaPreset: undefined },
});

const mapDispatchToProps = (dispatch: Dispatch<PresetsAction>) => ({
  createPreset: (id: string, mods: Mod[]) => dispatch(createPreset(id, mods)),
  deletePreset: () => dispatch(deletePreset()),
  updatePreset: (mods: Mod[]) => dispatch(updatePreset(mods)),
  selectPreset: (id: string) => dispatch(selectPreset(id)),
});

export default connect<PresetsStateProps, PresetsDispatchProps, PresetsOwnProps, RootState>(
  mapStateToProps,
  mapDispatchToProps
)(Dropdown);

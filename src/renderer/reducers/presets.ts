import { SELECT_PRESET } from './../actions/presets/selectPreset';
import { UPDATE_PRESET } from './../actions/presets/updatePreset';
import { CreatePresetAction, CREATE_PRESET } from './../actions/presets/createPreset';
import { Reducer } from 'redux';
import fs from 'fs';
import _ from 'lodash';
import { PresetsState } from '../types/presetsState';
import presets, { presetsPath } from '../../presets';
import { PresetsAction } from '../actions/presets';
import store from '../store';
import Preset from '../../models/Preset';
import { DELETE_PRESET } from '../actions/presets/deletePreset';
import { RELOAD_MODS } from '../actions/modList/reloadMods';

export const defaultState: PresetsState = {
  presets,
  currentPreset: presets[0],
};

const serializePresets = (presets: Preset[]) => {
  fs.writeFileSync(presetsPath, JSON.stringify(presets), 'utf8');
};

const presetsReducer: Reducer<PresetsState> = (state = defaultState, action: PresetsAction) => {
  console.log(action.type);
  switch (action.type) {
    case CREATE_PRESET: {
      const presets = state.presets.concat([
        {
          mods: _.cloneDeep(store.getState()!.modList.mods),
          id: action.value,
        },
      ]);
      serializePresets(presets);
      return {
        ...state,
        presets,
      };
    }
    case DELETE_PRESET: {
      const presets = _.filter((preset: Preset) => {
        return preset !== state.currentPreset;
      });
      serializePresets(presets);
      return {
        ...state,
        presets,
      };
    }
    case UPDATE_PRESET:
      state.currentPreset!.mods = _.cloneDeep(store.getState()!.modList.mods);
      serializePresets(state.presets);
      return { ...state };

    case SELECT_PRESET:
      return {
        ...state,
        currentPreset: state.presets.find(preset => preset.id === action.value)!,
      };
    default:
      return state;
  }
};

export default presetsReducer;

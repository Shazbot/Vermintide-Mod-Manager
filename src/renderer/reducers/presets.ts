import fs from 'fs';
import _ from 'lodash';
import { Reducer } from 'redux';
import Preset from '../../models/Preset';
import presets, { presetsPath } from '../../presets';
import { PresetsAction } from '../actions/presets';
import { DELETE_PRESET } from '../actions/presets/deletePreset';
import { PresetsState } from '../types/presetsState';
import { CREATE_PRESET } from './../actions/presets/createPreset';
import { SELECT_PRESET } from './../actions/presets/selectPreset';
import { UPDATE_PRESET } from './../actions/presets/updatePreset';

export const defaultState: PresetsState = {
  presets,
  currentPreset: null,
};

const serializePresets = (presets: Preset[]) => {
  fs.writeFileSync(presetsPath, JSON.stringify(presets), 'utf8');
};

const presetsReducer: Reducer<PresetsState> = (state = defaultState, action: PresetsAction) => {
  console.log(action.type);
  switch (action.type) {
    case CREATE_PRESET: {
      const newPreset = {
        mods: _.cloneDeep(action.mods),
        id: action.value,
      };
      const presets = state.presets.concat([newPreset]);

      serializePresets(presets);
      return {
        ...state,
        presets,
        currentPreset: newPreset,
      };
    }
    case DELETE_PRESET: {
      const presets = _.filter(state.presets, (preset: Preset) => {
        return preset !== state.currentPreset;
      });
      serializePresets(presets);
      return {
        ...state,
        presets,
        currentPreset: null,
      };
    }
    case UPDATE_PRESET:
      state.currentPreset!.mods = _.cloneDeep(action.mods);
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

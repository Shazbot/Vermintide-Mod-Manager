import { SET_MOD_FILTER } from './../actions/modList/setModFilter';
const arrayMove = require('array-move');
import { MOD_SORTED } from './../actions/modList/modSorted';
import { TOGGLE_SELECT_SANCTIONED_MODS } from './../actions/modList/toggleSelectSanctioned';
import { TOGGLE_SELECT_ALL } from '../actions/modList/toggleSelectAll';
import { Reducer } from 'redux';
const SJSON = require('simplified-json');
import getMods from '../../getMods';
import fs from 'fs';
import { ModListAction } from '../actions/modList';
import _ from 'lodash';
import { TOGGLE_MOD } from '../actions/modCheckbox/toggleMod';
import { ModListState } from '../types/modListState';
import { RELOAD_MODS } from '../actions/modList/reloadMods';
import { SAVE_MODS } from '../actions/modList/saveMods';
import Mod from '../../models/Mod';
import { userSettingsPath } from '../../userSettings';

export const defaultState: ModListState = {
  mods: getMods(),
  isSelectAllChecked: false,
  isSelectSanctionedModsChecked: false,
  modFilterValue: '',
};

const serializeMods = (mods: Mod[]) => {
  const userSettings = SJSON.parse(fs.readFileSync(userSettingsPath));
  userSettings.mods = mods;
  fs.writeFileSync(userSettingsPath, SJSON.stringify(userSettings), 'utf8');
};

const modListReducer: Reducer<ModListState> = (state = defaultState, action: ModListAction) => {
  console.log(action.type);
  switch (action.type) {
    case TOGGLE_MOD: {
      const id = action.id;
      return {
        ...state,
        mods: _.map(state.mods, mod => (mod.id === id && { ...mod, enabled: !mod.enabled }) || mod),
      };
    }
    case SET_MOD_FILTER: {
      return {
        ...state,
        modFilterValue: action.value,
      };
    }
    case TOGGLE_SELECT_ALL: {
      const isSelectAllChecked = !state.isSelectAllChecked;
      return {
        ...state,
        isSelectAllChecked,
        isSelectSanctionedModsChecked: isSelectAllChecked,
        mods: _.map(state.mods, mod => ({ ...mod, enabled: isSelectAllChecked })),
      };
    }
    case TOGGLE_SELECT_SANCTIONED_MODS: {
      const isSelectSanctionedModsChecked = !state.isSelectSanctionedModsChecked;
      const mods = [...state.mods];
      _.filter(mods, mod => mod.sanctioned).forEach(
        mod => (mod.enabled = isSelectSanctionedModsChecked)
      );
      return {
        ...state,
        mods,
        isSelectSanctionedModsChecked,
      };
    }
    case MOD_SORTED: {
      return {
        ...state,
        mods: arrayMove(state.mods, action.oldIndex, action.newIndex),
      };
    }
    case RELOAD_MODS: {
      return {
        ...state,
        mods: getMods(),
      };
    }
    case SAVE_MODS: {
      serializeMods(state.mods);
      return {
        ...state,
      };
    }
    default:
      return state;
  }
};

export default modListReducer;

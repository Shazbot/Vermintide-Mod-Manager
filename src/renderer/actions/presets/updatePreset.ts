import { Action, ActionCreator } from 'redux';
import Mod from '../../../models/Mod';

export const UPDATE_PRESET = 'UPDATE_PRESET';

export interface UpdatePresetAction extends Action {
  type: typeof UPDATE_PRESET;
  mods: Mod[];
}

export const updatePreset: ActionCreator<UpdatePresetAction> = mods => ({
  mods,
  type: UPDATE_PRESET,
});

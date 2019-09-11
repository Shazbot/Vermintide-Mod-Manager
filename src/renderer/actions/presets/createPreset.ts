import { Action, ActionCreator } from 'redux';
import Mod from '../../../models/Mod';

export const CREATE_PRESET = 'CREATE_PRESET';

export interface CreatePresetAction extends Action {
  type: typeof CREATE_PRESET;
  value: string;
  mods: Mod[];
}

export const createPreset: ActionCreator<CreatePresetAction> = (value, mods) => ({
  value,
  mods,
  type: CREATE_PRESET,
});

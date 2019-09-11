import { Action, ActionCreator } from 'redux';

export const SAVE_MODS = 'SAVE_MODS';

export interface SaveModsAction extends Action {
  type: typeof SAVE_MODS;
}

export const deletePreset: ActionCreator<SaveModsAction> = () => ({
  type: SAVE_MODS,
});

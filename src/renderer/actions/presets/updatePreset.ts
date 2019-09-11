import { Action, ActionCreator } from 'redux';

export const UPDATE_PRESET = 'UPDATE_PRESET';

export interface UpdatePresetAction extends Action {
  type: typeof UPDATE_PRESET;
}

export const updatePreset: ActionCreator<UpdatePresetAction> = () => ({
  type: UPDATE_PRESET,
});

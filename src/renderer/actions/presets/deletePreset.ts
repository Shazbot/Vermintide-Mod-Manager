import { Action, ActionCreator } from 'redux';

export const DELETE_PRESET = 'DELETE_PRESET';

export interface DeletePresetAction extends Action {
  type: typeof DELETE_PRESET;
}

export const deletePreset: ActionCreator<DeletePresetAction> = () => ({
  type: DELETE_PRESET,
});

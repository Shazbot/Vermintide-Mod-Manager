import { Action, ActionCreator } from 'redux';

export const SELECT_PRESET = 'SELECT_PRESET';

export interface SelectPresetAction extends Action {
  type: typeof SELECT_PRESET;
  value: string;
}

export const selectPreset: ActionCreator<SelectPresetAction> = value => ({
  value,
  type: SELECT_PRESET,
});

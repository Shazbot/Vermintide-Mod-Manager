import { Action, ActionCreator } from 'redux';

export const CREATE_PRESET = 'CREATE_PRESET';

export interface CreatePresetAction extends Action {
  type: typeof CREATE_PRESET;
  value: string;
}

export const createPreset: ActionCreator<CreatePresetAction> = value => ({
  value,
  type: CREATE_PRESET,
});

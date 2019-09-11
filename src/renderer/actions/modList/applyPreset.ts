import { Action, ActionCreator } from 'redux';
import Preset from '../../../models/Preset';

export const APPLY_PRESET = 'APPLY_PRESET';

export interface ApplyPresetAction extends Action {
  type: typeof APPLY_PRESET;
  preset: Preset;
}

export const applyPreset: ActionCreator<ApplyPresetAction> = (preset: Preset) => ({
  preset,
  type: APPLY_PRESET,
});

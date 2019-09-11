import { SelectPresetAction } from './selectPreset';
import { DeletePresetAction } from './deletePreset';
import { CreatePresetAction } from './createPreset';
import { UpdatePresetAction } from './updatePreset';

export type PresetsAction =
  | SelectPresetAction
  | CreatePresetAction
  | DeletePresetAction
  | UpdatePresetAction;

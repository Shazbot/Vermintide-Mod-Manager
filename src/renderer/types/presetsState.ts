import Preset from '../../models/Preset';

export interface PresetsState {
  presets: Preset[];
  currentPreset: Preset | null;
}

import Mod from './Mod';

export default interface Preset {
  mods: Mod[];
  value: string;
  label: string;
}

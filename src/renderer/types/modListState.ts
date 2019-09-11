import Mod from '../../models/Mod';

export interface ModListState {
  mods: Mod[];
  isSelectAllChecked: boolean;
  isSelectSanctionedModsChecked: boolean;
  modFilterValue: string;
}

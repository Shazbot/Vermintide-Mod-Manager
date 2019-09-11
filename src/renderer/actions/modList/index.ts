import { ReloadModsAction } from './reloadMods';
import { ModSortedAction } from './modSorted';
import { ToggleSelectSanctionedModsAction } from './toggleSelectSanctioned';
import { ToggleSelectAllAction } from './toggleSelectAll';
import { ToggleModAction } from '../modCheckbox/toggleMod';
import { SetModFilterAction } from './setModFilter';
import { SaveModsAction } from './saveMods';

export type ModListAction =
  | ToggleSelectAllAction
  | ToggleSelectSanctionedModsAction
  | ModSortedAction
  | ToggleModAction
  | ReloadModsAction
  | SaveModsAction
  | SetModFilterAction;

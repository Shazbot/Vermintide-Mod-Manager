import { Action, ActionCreator } from 'redux';

export const TOGGLE_SELECT_SANCTIONED_MODS = 'TOGGLE_SELECT_SANCTIONED_MODS';

export interface ToggleSelectSanctionedModsAction extends Action {
  type: typeof TOGGLE_SELECT_SANCTIONED_MODS;
}

export const toggleSelectSanctionedMods: ActionCreator<ToggleSelectSanctionedModsAction> = () => ({
  type: TOGGLE_SELECT_SANCTIONED_MODS,
});

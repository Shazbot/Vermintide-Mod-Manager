import { Action, ActionCreator } from 'redux';

export const RELOAD_MODS = 'RELOAD_MODS';

export interface ReloadModsAction extends Action {
  type: typeof RELOAD_MODS;
}

export const reloadMods: ActionCreator<ReloadModsAction> = () => ({
  type: RELOAD_MODS,
});

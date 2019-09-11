import { Action, ActionCreator } from 'redux';

export const TOGGLE_MOD = 'TOGGLE_MOD';

export interface ToggleModAction extends Action {
  type: typeof TOGGLE_MOD;
  id: string;
}

export const toggleMod: ActionCreator<ToggleModAction> = id => ({
  id,
  type: TOGGLE_MOD,
});

export type ModCheckboxAction = ToggleModAction;

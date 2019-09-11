import { Action, ActionCreator } from 'redux';

export const TOGGLE_SELECT_ALL = 'TOGGLE_SELECT_ALL';

export interface ToggleSelectAllAction extends Action {
  type: typeof TOGGLE_SELECT_ALL;
}

export const toggleSelectAll: ActionCreator<ToggleSelectAllAction> = () => ({
  type: TOGGLE_SELECT_ALL,
});

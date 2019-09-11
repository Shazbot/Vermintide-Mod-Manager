import { Action, ActionCreator } from 'redux';

export const SET_MOD_FILTER = 'SET_MOD_FILTER';

export interface SetModFilterAction extends Action {
  type: typeof SET_MOD_FILTER;
  value: string;
}

export const toggleSelectAll: ActionCreator<SetModFilterAction> = value => ({
  value,
  type: SET_MOD_FILTER,
});

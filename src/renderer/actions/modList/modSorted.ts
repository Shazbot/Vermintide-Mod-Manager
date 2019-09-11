import { Action, ActionCreator } from 'redux';

export const MOD_SORTED = 'MOD_SORTED';

export interface ModSortedAction extends Action {
  type: typeof MOD_SORTED;
  oldIndex: number;
  newIndex: number;
}

export const modSorted: ActionCreator<ModSortedAction> = (oldIndex: number, newIndex: number) => ({
  oldIndex,
  newIndex,
  type: MOD_SORTED,
});

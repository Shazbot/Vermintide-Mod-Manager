import { combineReducers } from 'redux';
import { ModListState } from '../types/modListState';
import modListReducer from '../reducers/modList';
import presetsReducer from '../reducers/presets';
import { PresetsState } from '../types/presetsState';

export interface RootState {
  modList: ModListState;
  presets: PresetsState;
}

export default combineReducers<RootState | undefined>({
  modList: modListReducer,
  presets: presetsReducer,
});

import { ModCheckboxAction, TOGGLE_MOD } from './../actions/modCheckbox/toggleMod';
import { Reducer } from 'redux';

import Mod from '../../models/Mod';
import _ from 'lodash';

export interface ModCheckboxState {
  mod: Mod;
  isEnabled: boolean;
}

const defaultMod: Mod = {
  name: '',
  enabled: false,
  dependency_error: '',
  sanctioned: false,
  id: '',
};

export const defaultState: ModCheckboxState = {
  mod: defaultMod,
  isEnabled: false,
};

const modCheckbox: Reducer<ModCheckboxState, ModCheckboxAction> = (
  state = defaultState,
  action: ModCheckboxAction
) => {
  console.log(action.type);
  switch (action.type) {
    default:
      return state;
  }
};

export default modCheckbox;

import lodashUniqueid from 'lodash.uniqueid';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import Mod from '../../models/Mod';
import {
  ModCheckboxAction,
  toggleMod,
  ToggleModAction,
  TOGGLE_MOD,
} from '../actions/modCheckbox/toggleMod';
import { RootState } from '../reducers';
import store from '../store';

export interface CheckboxState {
  mod: Mod;
  isFilterMatch: boolean;
}

export interface ModCheckboxStateProps {
  isSanctioned: boolean;
  dependencyError: string;
  isFilterMatch: boolean;
  name: string;
  isEnabled: boolean;
}

export interface ModCheckboxOwnProps {
  id: string;
  index: number;
  key: any;
}

export interface ModCheckboxDispatchProps {
  toggleMod: () => ToggleModAction;
}

export type CheckboxProps = ModCheckboxStateProps & ModCheckboxDispatchProps & ModCheckboxOwnProps;

class Checkbox extends React.Component<CheckboxProps, CheckboxState> {
  id: string;
  isFilterMatch: boolean;
  constructor(props: CheckboxProps) {
    super(props);
    this.id = lodashUniqueid('mod-checkbox-');
    this.isFilterMatch = props.isFilterMatch;
  }

  handleInputChange = () => {
    store.dispatch({
      type: TOGGLE_MOD,
      id: this.props.id,
    });
  };

  render() {
    return (
      <div className="mod-item">
        <input
          type="checkbox"
          id={this.id}
          checked={this.props.isEnabled}
          onChange={this.handleInputChange}
        />
        <label htmlFor={this.id}>
          <span
            className={`${(this.props.isSanctioned ? 'sanctioned-markup' : '') +
              (this.props.isFilterMatch ? ' filter-match' : '')}`}
          >
            {this.props.name}
          </span>
          {this.props.dependencyError !== '' && (
            <span className="dependancy-error">- {this.props.dependencyError}</span>
          )}
        </label>
      </div>
    );
  }
}

const mapStateToProps = (
  state: RootState,
  ownProps: ModCheckboxOwnProps
): ModCheckboxStateProps => {
  const mod = state.modList.mods.find(mod => mod.id === ownProps.id)!;

  return {
    name: mod.name,
    isEnabled: mod.enabled,
    isSanctioned: mod.sanctioned,
    dependencyError: mod.dependency_error,
    isFilterMatch:
      state.modList.modFilterValue !== '' &&
      mod.name.toLowerCase().indexOf(state.modList.modFilterValue.toLowerCase()) !== -1,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<ModCheckboxAction>) => ({
  toggleMod: () => dispatch(toggleMod()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Checkbox);

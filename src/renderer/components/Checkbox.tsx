import * as React from 'react';
import lodashUniqueid from 'lodash.uniqueid';
import Mod from '../../models/Mod';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
  ModCheckboxAction,
  toggleMod,
  ToggleModAction,
  TOGGLE_MOD,
} from '../actions/modCheckbox/toggleMod';
import { Dispatch } from 'redux';
import { RootState } from '../reducers';
import store from '../store';

// export interface CheckboxProps {
//   mod: Mod;
//   onModToggled: (mod: Mod) => void;
//   isFilterMatch: boolean;
// }
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
  // state: CheckboxState;
  isFilterMatch: boolean;
  constructor(props: CheckboxProps) {
    super(props);
    // this.state = { mod: props.mod, isFilterMatch: props.isFilterMatch };
    this.id = lodashUniqueid('mod-checkbox-');
    // this.onModToggled = props.onModToggled;
    this.isFilterMatch = props.isFilterMatch;
  }
  // onModToggled: (mod: Mod) => void;

  // componentDidUpdate = (prevProps: CheckboxProps) => {
  //   if (this.props !== prevProps) {
  //     this.setState(() => {
  //       return this.props;
  //     });
  //   }
  // };

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    store.dispatch({
      type: TOGGLE_MOD,
      id: this.props.id,
    });

    // this.state.mod.enabled = checked;
    // this.setState(() => {
    //   return { mod: this.state.mod };
    // });
    // this.onModToggled(this.state.mod);
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

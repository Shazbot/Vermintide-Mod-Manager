import * as React from 'react';
import lodashUniqueid from 'lodash.uniqueid';
import Mod from '../../models/Mod';
import _ from 'lodash';

export interface CheckboxProps {
  mod: Mod;
  onModToggled: (mod: Mod) => void;
  isFilterMatch: boolean;
}
export interface CheckboxState {
  mod: Mod;
  isFilterMatch: boolean;
}

class Checkbox extends React.Component<CheckboxProps, CheckboxState> {
  id: string;
  state: CheckboxState;
  isFilterMatch: boolean;
  constructor(props: CheckboxProps) {
    super(props);
    this.state = { mod: props.mod, isFilterMatch: props.isFilterMatch };
    this.id = lodashUniqueid('mod-checkbox-');
    this.onModToggled = props.onModToggled;
    this.isFilterMatch = props.isFilterMatch;
  }
  onModToggled: (mod: Mod) => void;

  componentDidUpdate = (prevProps: CheckboxProps) => {
    if (this.props !== prevProps) {
      this.setState(() => {
        return this.props;
      });
    }
  };

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const checked = target.checked;

    this.state.mod.enabled = checked;
    this.setState(() => {
      return { mod: this.state.mod };
    });
    this.onModToggled(this.state.mod);
  };

  render() {
    return (
      <div className="mod-item">
        <input
          type="checkbox"
          id={this.id}
          checked={this.state.mod.enabled}
          onChange={this.handleInputChange}
        />
        <label htmlFor={this.id}>
          <span
            className={`${(this.state.mod.sanctioned ? 'sanctioned-markup' : '') +
              (this.state.isFilterMatch ? ' filter-match' : '')}`}
          >
            {this.state.mod.name}
          </span>
          {this.state.mod.dependency_error !== '' && (
            <span className="dependancy-error">- {this.state.mod.dependency_error}</span>
          )}
        </label>
      </div>
    );
  }
}

export default Checkbox;

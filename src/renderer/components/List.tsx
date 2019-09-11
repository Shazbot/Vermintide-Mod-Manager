import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { Dispatch } from 'redux';
import Mod from '../../models/Mod';
import { ModListAction } from '../actions/modList';
import { modSorted, ModSortedAction } from '../actions/modList/modSorted';
import { SET_MOD_FILTER } from '../actions/modList/setModFilter';
import { toggleSelectAll, ToggleSelectAllAction } from '../actions/modList/toggleSelectAll';
import {
  toggleSelectSanctionedMods,
  ToggleSelectSanctionedModsAction,
} from '../actions/modList/toggleSelectSanctioned';
import { RootState } from '../reducers';
import store from '../store';
import Checkbox, { ModCheckboxOwnProps } from './Checkbox';

require('./List.scss');

const SortableItem = SortableElement((props: ModCheckboxOwnProps) => (
  <li>
    <Checkbox {...props} />
  </li>
));

interface SortableListProps {
  mods: Mod[];
  fitlerMatchingMods: Mod[];
}

const SortableList = SortableContainer((props: SortableListProps) => {
  return (
    <ul className="mod-list">
      {props.mods.map((mod: Mod, index: number) => (
        <SortableItem index={index} key={`item-${index}`} id={mod.id} />
      ))}
    </ul>
  );
});

interface ModListDispatchProps {
  toggleSelectAll: () => ToggleSelectAllAction;
  toggleSelectSanctionedMods: () => ToggleSelectSanctionedModsAction;
  modSorted: (oldIndex: number, newIndex: number) => ModSortedAction;
}

interface ModListStateProps {
  mods: Mod[];
  isSelectAllChecked: boolean;
  isSelectSanctionedModsChecked: boolean;
}
interface ModListOwnProps {}

interface SortableComponentState {
  mods: Mod[];
  isSelectAllChecked: boolean;
  fitlerMatchingMods: Mod[];
}

type ModListProps = ModListStateProps & ModListDispatchProps & ModListOwnProps;

class SortableComponent extends Component<ModListProps, SortableComponentState> {
  selectAllId: string = 'selectAllId';
  selectSanctionedModsId: string = 'selectSanctionedModsId';
  constructor(props: any) {
    super(props);
  }
  onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
    this.props.modSorted(oldIndex, newIndex);
  };
  filterList = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const text = target.value;

    store.dispatch({
      type: SET_MOD_FILTER,
      value: text,
    });
  };
  render() {
    return (
      <div>
        <div className="select-all-toggle">
          <input
            type="checkbox"
            id={this.selectAllId}
            checked={this.props.isSelectAllChecked}
            onChange={this.props.toggleSelectAll}
          />
          <label htmlFor={this.selectAllId}>Select All</label>
        </div>
        <div className="sanctioned-mods-toggle">
          <input
            type="checkbox"
            id={this.selectSanctionedModsId}
            checked={this.props.isSelectSanctionedModsChecked}
            onChange={this.props.toggleSelectSanctionedMods}
          />
          <label htmlFor={this.selectSanctionedModsId}>Select Sanctioned</label>
        </div>
        <div className="filter-mods">
          <input type="text" placeholder="Search" onChange={this.filterList} />
        </div>
        <SortableList mods={this.props.mods} fitlerMatchingMods={[]} onSortEnd={this.onSortEnd} />
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): ModListStateProps => ({
  mods: state.modList.mods,
  isSelectAllChecked: state.modList.isSelectAllChecked,
  isSelectSanctionedModsChecked: state.modList.isSelectSanctionedModsChecked,
});

const mapDispatchToProps = (dispatch: Dispatch<ModListAction>) => ({
  toggleSelectAll: () => dispatch(toggleSelectAll()),
  toggleSelectSanctionedMods: () => dispatch(toggleSelectSanctionedMods()),
  modSorted: (oldIndex: number, newIndex: number) => dispatch(modSorted(oldIndex, newIndex)),
});

export default connect<ModListStateProps, ModListDispatchProps, ModListOwnProps, RootState>(
  mapStateToProps,
  mapDispatchToProps
)(SortableComponent);

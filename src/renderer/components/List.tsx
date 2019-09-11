import { SortableContainer, SortableElement, SortEndHandler } from 'react-sortable-hoc';
import React, { Component } from 'react';
import Mod from '../../models/Mod';
import _ from 'lodash';
import Checkbox, { ModCheckboxOwnProps } from './Checkbox';
import { connect } from 'react-redux';
import { toggleSelectAll, ToggleSelectAllAction } from '../actions/modList/toggleSelectAll';
import { Dispatch } from 'redux';
import { RootState } from '../reducers';
import { ModListAction } from '../actions/modList';
import {
  ToggleSelectSanctionedModsAction,
  toggleSelectSanctionedMods,
} from '../actions/modList/toggleSelectSanctioned';
import { ModSortedAction, modSorted } from '../actions/modList/modSorted';
import store from '../store';
import { SET_MOD_FILTER } from '../actions/modList/setModFilter';

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

const areAllModsEnabled = (mods?: Mod[]) => {
  if (!mods) return false;

  return _(mods).reduce((result, mod) => {
    return result && mod.enabled;
  }, true);
};

class SortableComponent extends Component<ModListProps, SortableComponentState> {
  selectAllId: string = 'selectAllId';
  selectSanctionedModsId: string = 'selectSanctionedModsId';
  setMods: (mods: Mod[]) => void;
  constructor(props: any) {
    super(props);
    this.setMods = props.setMods;
    // this.state = {
    //   mods: [],
    //   isSelectAllChecked: areAllModsEnabled(props.mods),
    //   isSelectSanctionedModsChecked: this.areAllSanctionedModsEnabled(props.mods),
    //   fitlerMatchingMods: [],
    // };
  }

  areAllSanctionedModsEnabled = (mods?: Mod[]) => {
    // return _(mods || this.props.mods)
    //   .filter(mod => {
    //     return mod.sanctioned;
    //   })
    //   .reduce((result, mod) => {
    //     return result && mod.enabled;
    //   }, true);
  };
  componentDidUpdate = (prevProps: { mods: Mod[] }) => {
    // if (prevProps.mods !== this.props.mods) {
    //   this.setState(() => {
    //     return {
    //       mods: this.props.mods,
    //       isSelectAllChecked: areAllModsEnabled(),
    //       isSelectSanctionedModsChecked: this.areAllSanctionedModsEnabled(),
    //     };
    //   });
    // }
  };
  onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
    // this.setState(() => {
    //   arrayMove.mutate(this.props.mods, oldIndex, newIndex);
    //   return {
    //     mods: this.props.mods,
    //     isSelectAllChecked: areAllModsEnabled(),
    //     isSelectSanctionedModsChecked: this.areAllSanctionedModsEnabled(),
    //   };
    // });
    // this.setMods(this.props.mods);
    this.props.modSorted(oldIndex, newIndex);
  };
  handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // const target = event.target;
    // const checked = target.checked;
    // _(this.props.mods).forEach(mod => {
    //   mod.enabled = checked;
    // });
    // this.setState(() => {
    //   return {
    //     mods: this.props.mods,
    //     isSelectAllChecked: checked,
    //     isSelectSanctionedModsChecked: checked,
    //   };
    // });
  };
  handleSelectSanctionedModsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // const target = event.target;
    // const checked = target.checked;
    // _(this.props.mods)
    //   .filter(mod => {
    //     return mod.sanctioned;
    //   })
    //   .forEach(mod => {
    //     mod.enabled = checked;
    //   });
    // this.setState(() => {
    //   return {
    //     isSelectAllChecked: areAllModsEnabled(),
    //     isSelectSanctionedModsChecked: checked,
    //   };
    // });
  };
  filterList = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const text = target.value;

    store.dispatch({
      type: SET_MOD_FILTER,
      value: text,
    });
    // let matches: Mod[] = [];
    // if (text) {
    //   matches = _.filter(this.props.mods, mod => {
    //     return mod.name.toLowerCase().indexOf(text.toLowerCase()) !== -1;
    //   });
    // }
    // this.setState(() => {
    //   return {
    //     fitlerMatchingMods: matches,
    //   };
    // });
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

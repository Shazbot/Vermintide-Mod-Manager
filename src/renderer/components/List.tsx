import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import React, { Component } from 'react';
import Mod from '../../models/Mod';
import _ from 'lodash';
import Checkbox, { CheckboxProps } from './Checkbox';

require('./List.scss');

const SortableItem = SortableElement((props: CheckboxProps) => (
  <li>
    <Checkbox {...props} />
  </li>
));

interface SortableListProps {
  mods: Mod[];
  fitlerMatchingMods: Mod[];
  onModToggled: (mod: Mod) => void;
}

const SortableList = SortableContainer((props: SortableListProps) => {
  return (
    <ul className="mod-list">
      {props.mods.map((mod: Mod, index: number) => (
        <SortableItem
          isFilterMatch={
            props.fitlerMatchingMods.find(filteredMod => filteredMod.id === mod.id) !== undefined
          }
          onModToggled={props.onModToggled}
          index={index}
          key={`item-${index}`}
          mod={mod}
        />
      ))}
    </ul>
  );
});

interface SortableComponentProps {
  mods: Mod[];
  setMods: (mods: Mod[]) => void;
}
interface SortableComponentState {
  mods: Mod[];
  isSelectAllChecked: boolean;
  isSelectSanctionedModsChecked: boolean;
  fitlerMatchingMods: Mod[];
}

class SortableComponent extends Component<SortableComponentProps, SortableComponentState> {
  selectAllId: string = 'selectAllId';
  selectSanctionedModsId: string = 'selectSanctionedModsId';
  setMods: (mods: Mod[]) => void;
  constructor(props: any) {
    super(props);
    this.setMods = props.setMods;
    this.state = {
      mods: props.mods,
      isSelectAllChecked: this.areAllModsEnabled(props.mods),
      isSelectSanctionedModsChecked: this.areAllSanctionedModsEnabled(props.mods),
      fitlerMatchingMods: [],
    };
  }
  areAllModsEnabled = (mods?: Mod[]) => {
    return _(mods || this.state.mods).reduce((result, mod) => {
      return result && mod.enabled;
    }, true);
  };
  areAllSanctionedModsEnabled = (mods?: Mod[]) => {
    return _(mods || this.state.mods)
      .filter(mod => {
        return mod.sanctioned;
      })
      .reduce((result, mod) => {
        return result && mod.enabled;
      }, true);
  };
  componentDidUpdate = (prevProps: { mods: Mod[] }) => {
    if (prevProps.mods !== this.props.mods) {
      this.setState(() => {
        return {
          mods: this.props.mods,
          isSelectAllChecked: this.areAllModsEnabled(),
          isSelectSanctionedModsChecked: this.areAllSanctionedModsEnabled(),
        };
      });
    }
  };
  onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
    this.setState(() => {
      arrayMove.mutate(this.state.mods, oldIndex, newIndex);
      return {
        mods: this.state.mods,
        isSelectAllChecked: this.areAllModsEnabled(),
        isSelectSanctionedModsChecked: this.areAllSanctionedModsEnabled(),
      };
    });
    this.setMods(this.state.mods);
  };
  handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const checked = target.checked;

    _(this.state.mods).forEach(mod => {
      mod.enabled = checked;
    });

    this.setState(() => {
      return {
        mods: this.state.mods,
        isSelectAllChecked: checked,
        isSelectSanctionedModsChecked: checked,
      };
    });
  };
  handleSelectSanctionedModsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const checked = target.checked;

    _(this.state.mods)
      .filter(mod => {
        return mod.sanctioned;
      })
      .forEach(mod => {
        mod.enabled = checked;
      });

    this.setState(() => {
      return {
        isSelectAllChecked: this.areAllModsEnabled(),
        isSelectSanctionedModsChecked: checked,
      };
    });
  };
  filterList = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const text = target.value;

    let matches: Mod[] = [];
    if (text) {
      matches = _.filter(this.state.mods, mod => {
        return mod.name.toLowerCase().indexOf(text.toLowerCase()) !== -1;
      });
    }

    this.setState(() => {
      return {
        fitlerMatchingMods: matches,
      };
    });
  };
  onModToggled = () => {
    this.setState(() => {
      return {
        isSelectAllChecked: this.areAllModsEnabled(),
        isSelectSanctionedModsChecked: this.areAllSanctionedModsEnabled(),
      };
    });
  };
  render() {
    return (
      <div>
        <div className="select-all-toggle">
          <input
            type="checkbox"
            id={this.selectAllId}
            checked={this.state.isSelectAllChecked}
            onChange={this.handleSelectAllChange}
          />
          <label htmlFor={this.selectAllId}>Select All</label>
        </div>
        <div className="sanctioned-mods-toggle">
          <input
            type="checkbox"
            id={this.selectSanctionedModsId}
            checked={this.state.isSelectSanctionedModsChecked}
            onChange={this.handleSelectSanctionedModsChange}
          />
          <label htmlFor={this.selectSanctionedModsId}>Select Sanctioned</label>
        </div>
        <div className="filter-mods">
          <input type="text" placeholder="Search" onChange={this.filterList} />
        </div>
        <SortableList
          onModToggled={this.onModToggled}
          mods={this.state.mods}
          fitlerMatchingMods={this.state.fitlerMatchingMods}
          onSortEnd={this.onSortEnd}
        />
      </div>
    );
  }
}

export default SortableComponent;

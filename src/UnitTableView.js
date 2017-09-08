import React, { Component } from 'react';
import inventory from './LocalData.js'
import UnitView from './UnitView.js'
import classnames from 'classnames';


class UnitTableView extends Component {
    constructor(props){
        super(props)
        this.state = this.getState();
        this.onInventoryChange = this.onInventoryChange.bind(this);
    };

    componentDidMount() {
        document.addEventListener('invChange', this.onInventoryChange);
        document.addEventListener('abilityChange', this.onInventoryChange);
    }

    componentWillUnmount() {
        document.removeEventListener('abilityChange', this.onInventoryChange);
        document.removeEventListener('invChange', this.onInventoryChange);
    }

    render() {
          var self = this;

          var count = self.state.abilities.length;

          if (!count) {
              return(null);
          }
          else
          return(
              <div className='unitContainer'>
              <table className={classnames('centered', 'unitcosttable')}><tbody>
              <tr>
                  <th>Unit</th>
                  <th>Ability</th>
                  <th>Type</th>
                  <th className='unitcost'>T1</th>
                  <th className='unitcost'>T2</th>
                  <th className='unitcost'>T3</th>
                  <th className='unitcost'>T4</th>
                  <th className='unitcost'>T5</th>
              </tr>
              {self.state.abilities.map(function(item, index) {
                    var aKey = self.state.abilitiesKeys[index];
                    return (<UnitView unitId={item.unit} abilityId={item.ability} abilityKey={aKey} key={aKey} jp={self.props.jp}/>);
              })}
              </tbody></table></div>
          );
    }

    getState() {
        return{
            abilities: inventory.abilities.slice(0),
            abilitiesKeys: inventory.abilitiesKeys.slice(0),
        };
    }

    onInventoryChange() {
        this.setState( this.getState() );
    }
}

export default UnitTableView

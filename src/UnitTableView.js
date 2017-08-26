import React, { Component } from 'react';
import data from './data_gl.json'
import inventory from './LocalData.js'
import UnitView from './UnitView.js'

class UnitTableView extends Component {
    constructor(props){
        super(props)
        this.state = this.getState();
        this.onInventoryChange = this.onInventoryChange.bind(this);
    };

    componentDidMount() {
        document.addEventListener('abilityChange', this.onInventoryChange);
    }

    componentWillUnmount() {
        document.removeEventListener('abilityChange', this.onInventoryChange);
    }

    render() {
          var self = this;

          return(
              <div className='unitContainer'>
              <table className='centered'><tbody>
              <tr><th>Unit</th><th>Ability</th><th>Type</th><th>T1</th><th>T2</th><th>T3</th><th>T4</th><th>T5</th></tr>
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
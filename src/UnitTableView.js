import React, { Component } from 'react';
import data from './data.json'
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

          var totalGil = self.getGilCost(self.props.jp);

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
                  <th className='unitcost'>Gil</th>
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
              <tr><td className='noborder'/>
                  <td className='noborder'/>
                  <td className='noborder'>Total Gil: </td>
                  <td className='noborder'>{totalGil}</td>
                  <td className='noborder'/>
                  <td className='noborder'/>
                  <td className='noborder'/>
                  <td className='noborder'/>
                  <td className='noborder'/></tr>
              </tbody></table></div>
          );
    }

    getGilCost() {
        var total = 0;
        var self = this;
        this.state.abilities.forEach(function(ab) {
            var unitId = ab.unit;
            var abilityId = ab.ability;

            var unit = data.filter(function(u) {
                return u.id === unitId;
            })
            var ability_arr = unit[0].ability.filter(function(a) {
                return a.id === abilityId;
            })

            var ability = ability_arr[0];
            if (ability.hasOwnProperty('cost')) {
                total = total + ability.cost;
            }
            else if (self.props.jp && ability.hasOwnProperty('cj')) {
                total = total + ability.cj;
            }
            else {
                total = total + ability.ce;
            }
        })

        return total;
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

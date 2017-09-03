import React, { Component } from 'react';
import inventory from './LocalData.js';
import Consts from './Consts.js'
import classnames from 'classnames'
import './table.css'

class InventoryView extends Component {
    constructor(props){
        super(props);
        this.state = {
            _inventory: inventory.crystals,
        };
        this.handleChange = this.handleChange.bind(this);
        this.onInventoryChange = this.onInventoryChange.bind(this);
    }

    componentDidMount() {        
        document.addEventListener('invChange', this.onInventoryChange);
    }

    componentWillReceiveProps (nextProps) {
        this.setState({tmpName:nextProps.name});
    }
    componentWillUnmount() {
        document.removeEventListener('invChange', this.onInventoryChange);
    }


    render() {
        var self = this;
        return (
               <div className='tableContainer' align='center'>
               <h2>Have</h2>
               <table className='centered'><tbody>
               <tr><th/>
               {
                   Consts.crystalTiers.map(function(item) {
                       return(<th title={item.name}>{item.shortName}</th>);
                   })
               }
               </tr>
               {Consts.crystalTypes.map(function(type,index) {
                 var outerKey = 'index'+index;
                 var title = Consts.crystalTypes[index].name;
                 return(
                   <tr key={outerKey} className={type.name}>
                    <td><img src={Consts.crystalTypes[index].src}
                             height = '30'
                             width = '30'
                             alt = {title}
                             title = {title}/></td>
                     {self.state._inventory[index].map(function(cell, innerIndex) {
                         var innerKey = 'inner' + innerIndex;
                         var cellId = index.toString() + innerIndex.toString();
                         return(<td key={innerKey}>
                                  <input
                                    className={classnames('cell', type.name)}
                                    type="number"
                                    pattern="\d*"
                                    data-material-id = {cellId}
                                    value={cell}
                                    onChange={self.handleChange}
                                  />
                                </td>);
                       })}
                   </tr>
                 );
               })}
              </tbody></table>
              </div>
        );
    }

    handleChange(event) {
        event.preventDefault();

        var strValue = event.currentTarget.value;
        if (!strValue) {
            strValue = '0';
        }

        var newValue = parseInt(strValue, 10);
        if (!Number.isInteger(newValue))
            return;

        newValue = Math.max(0, newValue);
        var invIds = event.currentTarget.getAttribute('data-material-id').split('');
        var invTypeId = parseInt(invIds[0], 10);
        var invTierId = parseInt(invIds[1], 10);
        if (!Number.isInteger(invTypeId))
            return;
        if (!Number.isInteger(invTierId))
            return;

        inventory.update(invTypeId, invTierId, newValue);
    }

    onInventoryChange() {
        this.setState(this.refreshState());
    }

    refreshState() {
        return {
            _inventory: inventory.crystals
        };
    }
}

export default InventoryView

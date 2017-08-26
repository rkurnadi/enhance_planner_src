import React, { Component } from 'react';
import inventory from './LocalData.js';
import Consts from './Consts.js';
import classnames from 'classnames';
import './table.css'

class PlannedView extends Component {
    constructor(props){
        super(props);
        this.state = {
            planned: inventory.getNeededCrystals(this.props.jp)
        };
        this.onInventoryChange = this.onInventoryChange.bind(this);
    }

    componentDidMount() {
        document.addEventListener('invChange', this.onInventoryChange);
        document.addEventListener('abilityChange', this.onInventoryChange);
    }

    componentWillUnmount() {
        document.removeEventListener('invChange', this.onInventoryChange);
        document.removeEventListener('abilityChange', this.onInventoryChange);
    }

    render() {
        var self = this;
        return(
            <div className='tableContainer' align='center'>
                <h2>Needed Crystals</h2>
                <table className='centered'><tbody>
                <tr><th/>
                {
                    Consts.crystalTiers.map(function(item) {
                        var t1 = item;
                        return(<th title={item.name}>{item.shortName}</th>);
                    })
                }
                </tr>
                    {self.state.planned.map(function(row, index) {
                        var outerKey = 'plan_out_'+index;
                        var title = Consts.crystalTypes[index].name;
                        return(
                            <tr key={outerKey} className={Consts.crystalTypes[index].name}>
                                <td><img src={Consts.crystalTypes[index].src}
                                         height = '30'
                                         width = '30'
                                         alt = {title}
                                         title = {title}/></td>
                                  {self.state.planned[index].map(function(cell, innerIndex) {
                                        var innerKey = 'plan_in_' + index + '-' + innerIndex;
                                        return(
                                            <td key={innerKey}>
                                                <input
                                                    className={classnames('cell', Consts.crystalTypes[index].name)}
                                                    type="text"
                                                    value={Math.max(cell, 0)}
                                                    readOnly
                                                />
                                            </td>
                                        );
                                  })}
                            </tr>
                        );
                    })}

                </tbody></table>
            </div>
        );
    }

    onInventoryChange() {
        this.setState(this.refreshState());
    }

    refreshState() {
        return {
            planned:inventory.getNeededCrystals(this.props.jp)
        };
    }
}

export default PlannedView

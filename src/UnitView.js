import React, { Component } from 'react';
import gl_data from './data_gl.json'
import jp_data from './data_jp.json'
import inventory from './LocalData.js'
import Consts from './Consts.js'

class UnitView extends Component {

  constructor(props){
      super(props)
      this.state = {
          unitId: props.unitId,
          abilityId: props.abilityId,
          abilityKey: props.abilityKey,
          //inventoryMats: inventory.getMaterials(),
      };

      this.onRemove = this.onRemove.bind(this);
      this.onEnhance = this.onEnhance.bind(this);
      //this.onAwakeThisUnit = this.onAwakeThisUnit.bind(this);
      //this.onRemoveThisSummon = this.onRemoveThisSummon.bind(this);
      //this.onMaterialChange = this.onMaterialChange.bind(this);
  };

  render() {
      var unitData = this.getRowData(this.state.unitId, this.state.abilityId, this.props.jp);
      //console.log(unitData);
      //console.log(unitData.name);
      //console.log(unitData.ability);
      var typeName = Consts.crystalTypes[unitData.ability.type].name;
      return( <tr>
              <td>{unitData.name}</td>
              <td>{unitData.ability.name}</td>
              <td>{typeName}</td>
              <td className='unitcost'>{unitData.ability.mats[0]}</td>
              <td className='unitcost'>{unitData.ability.mats[1]}</td>
              <td className='unitcost'>{unitData.ability.mats[2]}</td>
              <td className='unitcost'>{unitData.ability.mats[3]}</td>
              <td className='unitcost'>{unitData.ability.mats[4]}</td>
              <td><button onClick={this.onEnhance} title='Enhance'>Enhance</button></td>
              <td><button onClick={this.onRemove} title='Remove'>Remove</button></td>
             </tr>
           );
  }

  getRowData(unitId, abilityId, jp) {
      var data;
      if (jp) {
          data = jp_data;
      }
      else {
          data = gl_data;
      }
      var rowData = [];
      var unit = data.filter(function(u) {
          return u.id === unitId;
      })
      var ability_arr = unit[0].ability.filter(function(a) {
          return a.id === abilityId;
      })
      rowData.name = unit[0].name;
      rowData.ability = ability_arr[0];
      return rowData;
  }

  onEnhance() {
      inventory.enhanceAbility(this.state.abilityKey, this.props.jp);
  }

  onRemove() {
      //e.preventDefault();
      inventory.removeAbility(this.state.abilityKey);
  }
}

export default UnitView;

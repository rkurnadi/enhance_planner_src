import React, { Component } from 'react';
import data from './data.json'
//import jp_data from './data_jp.json'
import inventory from './LocalData.js'
import Consts from './Consts.js'
import check from './images/check-mark.png'
import cross from './images/close-cross.png'

class UnitView extends Component {

  constructor(props){
      super(props)
      this.state = {
          unitId: props.unitId,
          abilityId: props.abilityId,
          abilityKey: props.abilityKey,
      };

      this.onRemove = this.onRemove.bind(this);
      this.onEnhance = this.onEnhance.bind(this);
  };

  render() {
      var unitData = this.getRowData(this.state.unitId, this.state.abilityId);
      if (!unitData) {
          return (null);
      }
      var abilitymats;
      if (unitData.ability.hasOwnProperty("mc")) {
          abilitymats = unitData.ability.mc;
      }
      else if (this.props.jp) {
          abilitymats = unitData.ability.mj;
      }
      else {
          abilitymats = unitData.ability.me;
      }
      var typeName = this.props.jp ? Consts.crystalTypes[unitData.ability.type].name_jp : Consts.crystalTypes[unitData.ability.type].name;
      var name = this.props.jp ? unitData.nj : unitData.ne
      var ability = this.props.jp ? unitData.ability.nj : unitData.ability.ne
      ability = ability + unitData.ability.level
      const inventoryMats = inventory.crystals

      var canEnhance = this.canEnhance(unitData.ability);

      var wikiLink = null;
      if (this.props.jp || unitData.ability.hasOwnProperty('jp')) {
          var rid_string = unitData.rid.toString();
          if (rid_string.length < 3)
          {
              rid_string = ('00' + rid_string).slice(-3);
          }
          wikiLink = 'https://www.reddit.com/r/FFBraveExvius/wiki/units/' + rid_string + '#wiki_enhancements';
      }
      else {
        wikiLink = 'https://exvius.gamepedia.com/' + unitData.ne + '#Ability_Awakening';
      }

      var gilCost;
      if (unitData.ability.hasOwnProperty('cost')) {
          gilCost = unitData.ability.cost;
      }
      else if (this.props.jp) {
          gilCost = unitData.ability.cj;
      }
      else {
          gilCost = unitData.ability.ce;
      }

      return( <tr>
              <td className='unitName'>{name}</td>
              <td className='abilityName'>{wikiLink ? <a href={wikiLink} target='_blank'>{ability}</a> : {ability}}</td>
              <td className='typeName'>{typeName}</td>
              <td className='unitcost'>{gilCost}</td>
              <td className={'unitcost' + (inventoryMats[unitData.ability.type][0] < abilitymats[0] ? ' deficit' : '')}>{abilitymats[0]}</td>
              <td className={'unitcost' + (inventoryMats[unitData.ability.type][1] < abilitymats[1] ? ' deficit' : '')}>{abilitymats[1]}</td>
              <td className={'unitcost' + (inventoryMats[unitData.ability.type][2] < abilitymats[2] ? ' deficit' : '')}>{abilitymats[2]}</td>
              <td className={'unitcost' + (inventoryMats[unitData.ability.type][3] < abilitymats[3] ? ' deficit' : '')}>{abilitymats[3]}</td>
              <td className={'unitcost' + (inventoryMats[unitData.ability.type][4] < abilitymats[4] ? ' deficit' : '')}>{abilitymats[4]}</td>
              <td className='enh_cell'><input type='image' src={check} className={'enhanceImg' + (canEnhance ? '' : ' can-not-enhance')} alt='Enhance' onClick={this.onEnhance} disabled={!canEnhance} title={(!canEnhance ? 'Not enough crystals to enhance' : 'Enhance')}/></td>
              <td className='rmv_cell'><input type='image' src={cross} className='removeImg' alt='Remove' onClick={this.onRemove} title='Remove from list'/></td>
             </tr>
           );
  }

  getRowData(unitId, abilityId) {
      var rowData = [];
      var unit = data.filter(function(u) {
          return u.id === unitId;
      })
      var ability_arr = unit[0].ability.filter(function(a) {
          return a.id === abilityId;
      })
      rowData.ne = unit[0].ne;
      rowData.nj = unit[0].nj;
      rowData.rid = unit[0].rid;
      rowData.ability = ability_arr[0];

      if (this.props.jp) {
          if (!rowData.nj) {
              return null;
          }
          if (!rowData.ability.hasOwnProperty('nj')) {
              return null;
          }
      }
      return rowData;
  }

  canEnhance(unitAbility) {
      var abilityMats;
      if (unitAbility.hasOwnProperty("mc")) {
          abilityMats = unitAbility.mc;
      } else if (this.props.jp) {
          abilityMats = unitAbility.mj;
      }
      else {
          abilityMats = unitAbility.me;
      }

      var canAwake = true;
      for (var k = 0; k < 5; k++) {
          if (abilityMats[k] > inventory.crystals[unitAbility.type][k]) {
              canAwake = false;
              break;
          }
      }

      return canAwake;
  }

  onEnhance() {
      inventory.enhanceAbility(this.state.abilityKey, this.props.jp);
  }

  onRemove() {
      inventory.removeAbility(this.state.abilityKey);
  }
}

export default UnitView;

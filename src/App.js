import React, { Component } from 'react';
import './App.css';
import data from './data.json'
//import jp_data from './data_jp.json'
import UnitTableView from './UnitTableView';
import classnames from 'classnames';
import inventory from './LocalData.js'
import InventoryView from './InventoryView.js'
import PlannedView from './PlannedView.js'

const LOCAL_STORAGE_SERVER = "ffbe-abi-awa-server";

class App extends Component {
  constructor(props) {
      super(props)
      this.state = {
          checked : true
      }

      this.onServerChange = this.onServerChange.bind(this)
  }

  componentWillMount() {
      const server = localStorage.getItem(LOCAL_STORAGE_SERVER);
      if (server) {
          if (server === 'jp') {
              this.setState({checked:false});
          }
          else {
              this.setState({checked:true});
          }
      }
  }

  onServerChange() {
      this.setState ({ checked: !this.state.checked});
      var event = inventory.createNewEvent('abilityChange');
      document.dispatchEvent(event);
      var serverchoice = this.state.checked ? 'jp' : 'gl';

      localStorage.setItem(LOCAL_STORAGE_SERVER , serverchoice);
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>FFBE Enhancement Planner</h2>
        </div>

        <label className={classnames('switch', 'switch-left-right')}>
	           <input className='switch-input' type='checkbox' style={{textAlign:'center'}} onChange={this.onServerChange} checked={this.state.checked}/>
	           <span className='switch-label' data-on='GL' data-off='JP'></span>
	           <span className='switch-handle'></span>
        </label>

        <div className="parent">
          <InventoryView/>
          <PlannedView jp={!this.state.checked}/>
        </div>
        { !this.state.checked && <MyForm data={data} jp={true}/> }
        { this.state.checked && <MyForm data={data} jp={false}/> }
        <UnitTableView jp={!this.state.checked}/>
      </div>
    );
  }
}
export default App;

class MyForm extends Component {
  constructor(props) {
    super(props)

    this.handleFirstLevelChange = this.handleFirstLevelChange.bind(this)
    this.handleSecondLevelChange = this.handleSecondLevelChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleSubmitAll = this.handleSubmitAll.bind(this)
	  this.sortjp = this.sortjp.bind(this)

    this.state = {
      firstLevel: Object.keys(props.data)[0],
      firstLevelIndex: 0,
      secondLevel: Object.keys(props.data)[0][0],
      secondLevelIndex: 0,
      backgroundColor: 'grey',
      test:'no',
    }
  }

  handleFirstLevelChange(event) {
    this.setState({firstLevelIndex: event.target.selectedIndex});
    this.setState({firstLevel: event.target.value});
	  this.setState({secondLevelIndex: 0});
  }

  handleSecondLevelChange(event) {
    this.setState({secondLevelIndex: event.target.selectedIndex});
    this.setState({secondLevel: event.target.value});
  }

  handleSubmit(event) {
  	var self = this;
    var unitId;
  	var abilityId;
  	if (!self.props.jp) {
  		unitId = self.props.data[self.state.firstLevelIndex].id
  		abilityId = self.props.data[self.state.firstLevelIndex].ability[self.state.secondLevelIndex].id
  	}
  	else {
  		var units = this.props.data.filter(function(a) {
  					  var name = self.state.firstLevel;
  					  if (name === "0") {
  						name = self.props.data[0].nj;
  					  }
  					  if (a.hasOwnProperty('nj')){
  						return a.nj === name;
  					  }
  					  else return false;
  				  })
  		var selectedUnit = units[0]
  		unitId = selectedUnit.id;
  		abilityId = selectedUnit.ability[this.state.secondLevelIndex].id;
  	}
    inventory.addAbility(unitId, abilityId);
  }

  handleSubmitAll(event) {
    var self = this;
    var unitId;
    var selectedUnit;

    if(!self.props.jp) {
      selectedUnit = self.props.data[self.state.firstLevelIndex];
    }
    else {
      var units = this.props.data.filter(function(a) {
  					  var name = self.state.firstLevel;
  					  if (name === "0") {
  						name = self.props.data[0].nj;
  					  }
  					  if (a.hasOwnProperty('nj')){
  						return a.nj === name;
  					  }
  					  else return false;
  				  })
  		selectedUnit = units[0]

    }

    unitId = selectedUnit.id;
    selectedUnit.ability.forEach(function(ability) {
        var abilityId = ability.id;
        inventory.addAbility(unitId, abilityId);
    });
  }

  sortjp(a, b) {
    if (this.props.jp) {
      if (a.rid > b.rid) {
        return 1;
      } else if (a.rid < b.rid) {
        return -1;
      }
      else return 0;
    }
    else if (a.hasOwnProperty('jp') && (!(b.hasOwnProperty('jp')))) {
          return 1;
    }
    else if (b.hasOwnProperty('jp') && (!(a.hasOwnProperty('jp')))) {
          return -1;
    }
    else {
      if (a.ne > b.ne) {
        return 1;
      } else if (a.ne < b.ne) {
        return -1;
      }
      else return 0;
  	}
  }

  getFirstLevelOptions() {
    var items = [];
    var count = this.props.data.length;
    var tempdata = this.props.data;

    tempdata.sort(this.sortjp);

    for (var i = 0; i < count; i++) {
      var unit = this.props.data[i];
      var choice_gl = this.props.data[i].ne;
      var choice_jp = this.props.data[i].nj;

      if (this.props.jp) {
        //if gl_exclusive unit in jp_view, choice_jp would be undefined, nothing should be added to options
        if (choice_jp) {
          items.push(<option key={i} value={choice_jp}>{choice_jp}</option>);
        }
      }
      else if (!this.props.jp && unit.hasOwnProperty('jp')) {
        //unit has received enhancement in jp but not gl, show it in gl_view with grey background
        items.push(<option key={i} value={choice_gl} style={{background:this.state.backgroundColor}}>{choice_gl}</option>);
      }
      else {
        items.push(<option key={i} value={choice_gl}>{choice_gl}</option>);
      }
    }
    return items;
  }

  getSecondLevelOptions() {
      var self = this;
      var items = [];
      var abilities;
      if (!this.props.jp) {
          abilities = this.props.data[this.state.firstLevelIndex].ability;
      }
      else {
          //first load, self.state.firstLevel is not initialized yet
          //set abilities to first unit's abilities
          if (self.state.firstLevel === "0") {
              abilities = this.props.data[0].ability;
          }
          else {
              //can't use firstLevelIndex since gl_exclusive units like Elza causes index mismatch
              var units = this.props.data.filter(function(a) {
                  var idx = self.state.firstLevel;
                  if (a.hasOwnProperty('nj')){
                      return a.nj === idx;
                  }
                  else return false;
              })
              abilities = units[0].ability;
          }
      }
      var count = abilities.length;
      for (var i = 0; i < count; i++) {
        var ab = abilities[i];
        var level = abilities[i].level;
        var choice_gl = abilities[i].ne + level;
        var choice_jp = abilities[i].nj;
        if (choice_jp) {
            choice_jp = abilities[i].nj + level;
        }

        if (this.props.jp) {
            //gl_exclusive enhancements would have choice_jp === undefined, should not add to option
            if (choice_jp) {
                items.push(<option key={i} value={choice_jp}>{choice_jp}</option>);
            }
        }
        else if (!this.props.jp && ab.hasOwnProperty('jp')) {
            items.push(<option key={i} value={choice_gl} style={{background:this.state.backgroundColor}}>{choice_gl}</option>);
        }
        else {
            items.push(<option key={i} value={choice_gl}>{choice_gl}</option>);
        }

      }
      return items;
  }

  render() {
    const firstLevelOptions = this.getFirstLevelOptions();
    const secondLevelOptions = this.getSecondLevelOptions();

    return (
      <div className = "selection">
      <br/>
      <select className='unit-select' onChange={this.handleFirstLevelChange} value={this.state.firstLevel} style={{width:'200px'}}>
        {firstLevelOptions}
      </select>

      <select className='unit-select' onChange={this.handleSecondLevelChange} value={this.state.secondLevel} style={{width:'200px'}}>
        {secondLevelOptions}
      </select>

      <button className={classnames('button', 'unit-select')} onClick={this.handleSubmit}>Add</button>
      <button className={classnames('button', 'unit-select')} onClick={this.handleSubmitAll}>Add All</button>
      </div>
    )
  }
}

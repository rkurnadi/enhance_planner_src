import React, { Component } from 'react';
import './App.css';
import data from './data_gl.json'
import jp_data from './data_jp.json'
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

  componentDidMount() {
      const server = localStorage.getItem(LOCAL_STORAGE_SERVER);
      if (server) {
          if (server == 'jp') {
              this.setState({checked:false});
          }
          else {
              this.setState({checked:true});
          }
      }
  }

  onServerChange() {
      this.setState ({ checked: !this.state.checked});
      var event = new Event('abilityChange');
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
        { !this.state.checked && <MyForm data={jp_data} jp={true}/> }
        { this.state.checked && <MyForm data={data} jp={false}/> }
        <UnitTableView jp={!this.state.checked}/>
        <p>Footer</p>
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

    this.state = {
      firstLevel: Object.keys(props.data)[0],
      firstLevelIndex: 0,
      secondLevel: Object.keys(props.data)[0][0],
      secondLevelIndex: 0,
      backgroundColor: 'grey',
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
    var unitId = this.props.data[this.state.firstLevelIndex].id
    var abilityId = this.props.data[this.state.firstLevelIndex].ability[this.state.secondLevelIndex].id
    inventory.addAbility(unitId, abilityId);
  }

  getFirstLevelOptions() {
    let items = [];
    let count = this.props.data.length
    for (let i = 0; i < count; i++) {
      let unit = this.props.data[i]
      let choice = this.props.data[i].name

      if (!this.props.jp && unit.hasOwnProperty('jp')) {
        items.push(<option key={i} value={choice} style={{background:this.state.backgroundColor}}>{choice}</option>)
      }
      else {
        items.push(<option key={i} value={choice}>{choice}</option>)
      }
    }
    return items
  }

  getSecondLevelOptions() {
      let items = []
      let count = this.props.data[this.state.firstLevelIndex].ability.length
      for (let i = 0; i < count; i++) {
        let ab = this.props.data[this.state.firstLevelIndex].ability[i]
        let choice = this.props.data[this.state.firstLevelIndex].ability[i].name
        if (!this.props.jp && ab.hasOwnProperty('name_jp')) {
            items.push(<option key={i} value={choice} style={{background:this.state.backgroundColor}}>{choice}</option>)
        }
        else {
            items.push(<option key={i} value={choice}>{choice}</option>)
        }

      }
      return items
  }

  refresh() {
      return {invname:this.state.firstLevel};
  }
  render() {
    const firstLevelOptions = this.getFirstLevelOptions()
    const secondLevelOptions = this.getSecondLevelOptions()

    return (
      <div className = "selection">
      <br/>
      <select className='unit-select' onChange={this.handleFirstLevelChange} value={this.state.firstLevel} style={{width:'200px'}}>
        {firstLevelOptions}
      </select>

      <select className='unit-select' onChange={this.handleSecondLevelChange} value={this.state.secondLevel} style={{width:'250px'}}>
        {secondLevelOptions}
      </select>

      <button className={classnames('button', 'unit-select')} onClick={this.handleSubmit}>Add</button>
      </div>
    )
  }
}

import gl_data from './data_gl.json'
import jp_data from './data_jp.json'
import Consts from './Consts.js'

const LOCAL_STORAGE_INVENTORY = "inventory-id-";
const LOCAL_STORAGE_ABILITIES = "planned-abilities";

var counter = 0;

class LocalData {
    crystals = [];
    abilities = [];
    abilitiesKeys = [];
    listeners = {};

    LISTEN = {
        ABILITIES: 'LISTEN_ABILITIES',
        MATS:   'LISTEN_MATS',
        FILTER: 'LISTEN_FILTER',
        AWAKENING_MODE: 'LISTEN_AWAKENING_MODE',
        AWAKENING_ANIM: 'LISTEN_AWAKENING_ANIM',
    };

    update = function(typeId, tierId, value) {
        // Negatives not allowed
        value = Math.max(0, value);
        this.crystals[typeId][tierId] = value;
        localStorage.setItem(LOCAL_STORAGE_INVENTORY + typeId + '-' + tierId, value);
        //this.notifyListeners(this.LISTEN.MATS);
        var event = new Event('invChange');
        document.dispatchEvent(event);
    };

    addAbility = function(unitId, abilityId) {
        var entry = {unit: unitId,
                     ability: abilityId};
        this.abilities.push(entry);
        this.abilitiesKeys.push(counter++);
        localStorage.setItem(LOCAL_STORAGE_ABILITIES , JSON.stringify(this.abilities));
        //this.notifyListeners(this.LISTEN.ABILITIES);
        var event = new Event('abilityChange');
        document.dispatchEvent(event);

    }

    removeAbility = function(abilityKey) {
        var index = this.abilitiesKeys.indexOf(abilityKey);

        this.abilities.splice(index, 1);
        this.abilitiesKeys.splice(index, 1);

        localStorage.setItem(LOCAL_STORAGE_ABILITIES , JSON.stringify(this.abilities));
        //this.notifyListeners(this.LISTEN.ABILITIES);
        var event = new Event('abilityChange');
        document.dispatchEvent(event);
    }

    enhanceAbility = function(abilityKey, jp) {
        var index = this.abilitiesKeys.indexOf(abilityKey);

        var data;
        if (jp) {
            data = jp_data;
        }
        else {
            data = gl_data;
        }
        var abilityInfo = this.abilities[index];
        var dataLen = data.length;
        //var tempData = data;
        for (var i = 0; i < dataLen; i++) {
            if (data[i].id === abilityInfo.unit) {
                var unit = data[i];
                break;
            }
        }

        for (var j=0; j < unit.ability.length; j++) {
            if(unit.ability[j].id === abilityInfo.ability) {
                var enhancedAbility = unit.ability[j];
                break;
            }
        }
        
        var crystTypeId = enhancedAbility.type;

        this.removeAbility(abilityKey);
        for (var k=0; k<5; k++)
        {
          this.update(crystTypeId, k, this.crystals[crystTypeId][k] - enhancedAbility.mats[k]);
        }
        /*
        this.update(crystTypeId, 1, this.crystals[crystTypeId][1] - enhancedAbility.T2);
        this.update(crystTypeId, 2, this.crystals[crystTypeId][2] - enhancedAbility.T3);
        this.update(crystTypeId, 3, this.crystals[crystTypeId][3] - enhancedAbility.T4);
        this.update(crystTypeId, 4, this.crystals[crystTypeId][4] - enhancedAbility.T5);
        */

        console.log('calculated')

        console.log('found enhanced');
        console.log(enhancedAbility);
        //this.notifyListeners(this.LISTEN.ABILITIES);
        var event = new Event('abilityChange');
        document.dispatchEvent(event);
    }

    addListener = function( listener, listenType ) {
        var group = this.listeners[listenType];
        if (!Array.isArray(group)) {
            group = this.listeners[listenType] = [];
        }
        group.push(listener);
    };

    removeListener = function( listener, listenType ) {
        var group = this.listeners[listenType];
        if (!Array.isArray(group)) {
            return;
        }
        var index = group.indexOf( listener );
        if (index !== -1) {
            group.splice(index, 1);
        }
    };

    notifyListeners = function(listenType) {
        var group = this.listeners[listenType];
        if (!Array.isArray(group)) {
            return;
        }
        group.forEach(function(listener) {
            listener();
        });
    };

    //calculate needed crystals based on this.state.crystals and this.state.abilities
    //
    getNeededCrystals = function(jp) {
        var self = this;
        var retArr = [];
        //initialize the matrix
        //var localTiersArr = Array.from(Object.keys(Consts.crystalTiers));
        //var localTypesArr = Array.from(Object.keys(Consts.crystalTypes));

        Consts.crystalTypes.forEach(function(type, outerIndex) {
            var typeArr = [];
            Consts.crystalTiers.forEach(function(tier, innerIndex){
                typeArr[innerIndex] = 0;
            });
            retArr[outerIndex] = typeArr;
        });

        var data;
        if (jp) {
            data = jp_data;
        }
        else {
            data = gl_data;
        }
        //calculate total of needed crystals
        self.abilities.forEach(function(abilityInfo) {
            //var unitId = abilityInfo.unit;
            //var abilityId = abilityInfo.ability;
            //var ability = data[abilityInfo.unit].ability[abilityInfo.ability];
            var unit = data.filter(function(u) {
                return u.id === abilityInfo.unit;
            })
            var ability_arr = unit[0].ability.filter(function(a) {
                return a.id === abilityInfo.ability;
            })
            var ability = ability_arr[0];
            /*
            var crystType = ability.type;
            var type = Consts.crystalTypes.filter(function(a) {
                return a.name === crystType;
            })
            */
            var crystTypeNumber = ability.type;
            for (var i = 0; i<5; i++)
            {
                retArr[crystTypeNumber][i] += ability.mats[i];
            }
            /*
            retArr[crystTypeNumber][0] += ability.T1;
            retArr[crystTypeNumber][1] += ability.T2;
            retArr[crystTypeNumber][2] += ability.T3;
            retArr[crystTypeNumber][3] += ability.T4;
            retArr[crystTypeNumber][4] += ability.T5;
            */
        });

        //adjust with inventory values
        retArr.forEach(function(row, outerIndex) {
            row.forEach(function(cell, innerIndex){
                retArr[outerIndex][innerIndex] -= self.crystals[outerIndex][innerIndex];
            });
        });

        return retArr;
    };

}

var inventory = new LocalData();

//var cType = Object.keys(Consts.crystalTypes);
//var cTier = Object.keys(Consts.crystalTiers);
//var tierCount = cTier.length;

//var index = 0;
//initialize crystals inventory from localStorage
Consts.crystalTypes.forEach(function(crystalType, typeIndex) {
    var tierArray = []
    Consts.crystalTiers.forEach(function(tier, tierIndex) {
        tierArray[tierIndex] = localStorage.getItem(LOCAL_STORAGE_INVENTORY + typeIndex + '-' + tierIndex) || 0;
    })
    inventory.crystals[typeIndex] = tierArray;
});

//initialize stored abilities from localStorage
var _tempAbilities = localStorage.getItem(LOCAL_STORAGE_ABILITIES);
if (_tempAbilities) {
    inventory.abilities = JSON.parse(_tempAbilities);
    inventory.abilitiesKeys = inventory.abilities.map(function() {
        return counter++;
    })
}

export default inventory;

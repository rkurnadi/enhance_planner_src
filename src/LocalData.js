import data from './data.json'
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

        var event = this.createNewEvent('invChange');
        document.dispatchEvent(event);
    };

    createNewEvent(eventName) {
        if(typeof(Event) === 'function') {
            var event = new Event(eventName);
        } else {
            var event = document.createEvent('Event');
            event.initEvent(eventName, true, true);
        }
        return event;
    }

    addAbility = function(unitId, abilityId) {
        var entry = {unit: unitId,
                     ability: abilityId};
        this.abilities.push(entry);
        this.abilitiesKeys.push(counter++);
        localStorage.setItem(LOCAL_STORAGE_ABILITIES , JSON.stringify(this.abilities));

        var event = this.createNewEvent('abilityChange');
        document.dispatchEvent(event);

    }

    removeAbility = function(abilityKey) {
        var index = this.abilitiesKeys.indexOf(abilityKey);

        this.abilities.splice(index, 1);
        this.abilitiesKeys.splice(index, 1);
        localStorage.setItem(LOCAL_STORAGE_ABILITIES , JSON.stringify(this.abilities));

        var event = this.createNewEvent('abilityChange');
        document.dispatchEvent(event);
    }

    enhanceAbility = function(abilityKey, jp) {
        var index = this.abilitiesKeys.indexOf(abilityKey);

        var abilityInfo = this.abilities[index];
        var dataLen = data.length;

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

        var abilitymats;
        if (enhancedAbility.hasOwnProperty("mc"))
        {
            abilitymats = enhancedAbility.mc;
        }
        else if (jp) {
            abilitymats = enhancedAbility.mj;
        }
        else {
            abilitymats = enhancedAbility.me;
        }

        this.removeAbility(abilityKey);
        for (var k=0; k<5; k++)
        {
          this.update(crystTypeId, k, this.crystals[crystTypeId][k] - abilitymats[k]);
        }

        var event = this.createNewEvent('abilityChange');
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

        Consts.crystalTypes.forEach(function(type, outerIndex) {
            var typeArr = [];
            Consts.crystalTiers.forEach(function(tier, innerIndex){
                typeArr[innerIndex] = 0;
            });
            retArr[outerIndex] = typeArr;
        });

        //calculate total of needed crystals
        self.abilities.forEach(function(abilityInfo) {
            var unit = data.filter(function(u) {
                return u.id === abilityInfo.unit;
            })
            var ability_arr = unit[0].ability.filter(function(a) {
                return a.id === abilityInfo.ability;
            })
            var ability = ability_arr[0];

            if (jp && !ability.hasOwnProperty('nj')) {
                return;
            }
            
            var crystTypeNumber = ability.type;

            var abilitymats;
            if (ability.hasOwnProperty("mc"))
            {
                abilitymats = ability.mc;
            }
            else if (jp) {
                abilitymats = ability.mj;
            }
            else {
                abilitymats = ability.me;
            }

            for (var i = 0; i<5; i++)
            {
                retArr[crystTypeNumber][i] += abilitymats[i];
            }
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

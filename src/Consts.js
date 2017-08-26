import whiteCryst from './images/Icon-White_Purecryst.png';
import blackCryst from './images/Icon-Black_Purecryst.png';
import greenCryst from './images/Icon-Green_Purecryst.png';
import powerCryst from './images/Icon-Power_Purecryst.png';
import guardCryst from './images/Icon-Guard_Purecryst.png';
import healingCryst from './images/Icon-Healing_Purecryst.png';
import supportCryst from './images/Icon-Support_Purecryst.png';
import techCryst from './images/Icon-Tech_Purecryst.png';

class Consts {

    T1 = {
        id: 0,
        name: 'Alcryst',
        shortName: 'T1',
    };
    T2 = {
        id:1,
        name:'Milcryst',
        shortName: 'T2',
    };
    T3 = {
        id:2,
        name:'Heavicryst',
        shortName: 'T3',
    };
    T4 = {
        id:3,
        name:'Giancryst',
        shortName: 'T4',
    };
    T5 = {
        id:4,
        name:'Purecryst',
        shortName: 'T5',
    };

    White = {
        id:0,
        src : whiteCryst,
        name: 'White',
    };

    Black = {
        id:1,
        src : blackCryst,
        name: 'Black',
    };

    Green = {
        id:2,
        src : greenCryst,
        name: 'Green',
    };

    Power = {
        id:3,
        src : powerCryst,
        name: 'Power',
    };

    Guard = {
        id:4,
        src : guardCryst,
        name: 'Guard',
    };

    Healing = {
        id:5,
        src : healingCryst,
        name: 'Healing',
    };

    Support = {
        id:6,
        src : supportCryst,
        name: 'Support',
    };

    Tech = {
        id:7,
        src : techCryst,
        name: 'Tech',
    };

    crystalTypes = [
        this.White,
        this.Black,
        this.Green,
        this.Power,
        this.Guard,
        this.Healing,
        this.Support,
        this.Tech,
    ];

    crystalTiers = [
        this.T1,
        this.T2,
        this.T3,
        this.T4,
        this.T5,
    ];
}

export default ( new Consts() );

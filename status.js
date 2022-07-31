const {
    generateRandInt,
    readStats,
    waitFor,
    gameConsole
} = require('./util.js');
//Status Constructor
function Status(name, duration, effectType) {
    this.name = name;
    this.duration = duration;
    this.effectType = effectType
    this.turnApplied = 0;
    this.effect = statusEffectMap.get(name);
    this.getParams = () => {
        return [this.name, this.duration, this.effectType];
    }
}
//Status effect functionality
const normalStatus = async (fighter) => {
    //normal status
    return;
}
const poisonStatus = async (fighter) => {
    //Effect for testing the system
    const effectDmg = Math.round(fighter.maxHealth * 0.1);
    fighter.currentHealth -= effectDmg;
    await gameConsole(.75, `${fighter.name} takes ${effectDmg} damage from poison`);
    if (fighter.currentHealth <= 0) fighter.currentHealth = 0;
    await gameConsole(.5, `${fighter.name} has ${fighter.currentHealth}/${fighter.maxHealth} health left...`);
}
const drowsyStatus = async (dmgValue) => {
    //Effect called in damage calculation, amplifies damage taken
    await gameConsole(.5, `The target is drowsy and takes increased damage!`);
    dmgValue *= 1.2;
    return dmgValue;
}
//Map for status effect assignment
const statusEffectMap = new Map();
statusEffectMap.set('normal', normalStatus);
statusEffectMap.set('poison', poisonStatus);
statusEffectMap.set('drowsy', drowsyStatus);
//create status objects
const normal = new Status('normal', 1000, 'none');
const poison = new Status('poison', 3, 'dmg');
const drowsy = new Status('drowsy', 3, 'vuln');
//status object map
const statusObjectMap = new Map();
statusObjectMap.set('normal', normal);
statusObjectMap.set('poison', poison);
statusObjectMap.set('drowsy', drowsy);

module.exports = { Status, statusObjectMap };
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
const testStatus = async (fighter) => {
    //Effect for testing the system
    effectDmg = Math.round(fighter.maxHealth * 0.1);
    fighter.currentHealth -= effectDmg;
    await gameConsole(.75, `${fighter.name} takes ${effectDmg} damage from test status`);
    if (fighter.currentHealth <= 0) fighter.currentHealth = 0;
    await gameConsole(.5, `${fighter.name} has ${fighter.currentHealth}/${fighter.maxHealth} health left...`);
}
//Map for status effect assignment
const statusEffectMap = new Map();
statusEffectMap.set('normal', normalStatus);
statusEffectMap.set('test', testStatus);
//create status objects
const normal = new Status('normal', 1000, 'none');
const test = new Status('test', 3, 'dmg');
//status object map
const statusObjectMap = new Map();
statusObjectMap.set('normal', normal);
statusObjectMap.set('test', test);

module.exports = { Status, statusObjectMap };
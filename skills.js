const { generateRandInt } = require('./util.js');
//Create skill constructor
function Skill(name, skillCost){
    this.name = name;
    this.skillCost = skillCost
    this.use = useSkillMap.get(name);
}
//Skill Functions
//Test Skill
const useBonk = (dmgCalc, attacker, target, party) => {
    target.currentHealth -= attacker.atkPow;
    if (target.currentHealth <= 0) target.currentHealth = 0;
    console.log(`${target.name} got bonked hard as hell! ${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`);
}
//Wizard skills
const useFireball = (dmgCalc, attacker, target, party) => {
    //Wizard skill will ignore opponents physical defense
    console.log(`${attacker.name} gathers a huge Fireball and hurls it at the enemy!`);
    dmgCalc = Math.round((attacker.buffness / target.buffness) * attacker.atkPow);
    //Enemy Damage Taken Calc
    target.currentHealth -= Math.round(dmgCalc * 1.2);
    if (target.currentHealth <= 0) target.currentHealth = 0;
    console.log(`${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`);
}
//Warrior Skills
const useCharge = (dmgCalc, attacker, target, party) => {
    //Strikes opponent for reduced damage and raise the attack stat of party members, inspire style of ability
    console.log(`${attacker.name} leads the Charge and headbutts the enemy! The allied party is inspired by the bravery!`);
    //Enemy Damage Taken Calc
    target.currentHealth -= Math.round(dmgCalc * .65);
    if (target.currentHealth <= 0) target.currentHealth = 0;
    console.log(`${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`);
    //Ally Attack Buff Calc and Application, multiplicative bonus currently
    party.forEach(member => {
        member.atkPow += Math.round(member.atkPow * .15);
        console.log(`${member.name}\'s attack power has increased to ${member.atkPow}!`);
    })
}
//Assassin Skills
const useRapidStrike = (dmgCalc, attacker, target, party) => {
    //Assassin skill will strike multiple times (3-5 times maybe) at reduced damage per strike
    console.log(`${attacker.name} sneaks up on the enemy and unleashes a flurry of Rapid Strikes!`);
    //assign minimum and maximum amouint of hits
    const minHits = 2;
    const maxHits = 4;
    //modify damage calculation per hit
    const hitDmg = Math.round(dmgCalc * 0.7);
    //generate a random amount of hits
    let totalHits = generateRandInt(minHits, maxHits);
    //Loop through damage application to apply hits equal to the amount generated above
    console.log(`${attacker.name}\'s flurry connects with its target dealing ${hitDmg * minHits} damage!`)
    let i = 1;
    for (i; i <= totalHits; i++) {
        if (i <= minHits) {
            target.currentHealth -= hitDmg;
        } else {
            target.currentHealth -= Math.round(hitDmg * (minHits / maxHits));
            console.log(`${attacker.name}\ continues the assault dealing ${Math.round(hitDmg * (minHits / maxHits))} damage!`)
        }
    };
    //reset the counter to 1 after the loop has completed for future uses of this ability
    i = 1;
    if (target.currentHealth <= 0) target.currentHealth = 0;
    console.log(`${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`);
}
//Marksman Skills
const useCriticalShot = (dmgCalc, attacker, target, party) => {
    //Will do the equivalent of a guaranteed critical hit, maybe with armor piercing effect
    console.log(`${attacker.name} identifies the enemy's weakness and lands a Critical Shot!`);
    //Enemy Damage Taken Calc
    target.currentHealth -= Math.round(dmgCalc * 1.3);
    if (target.currentHealth <= 0) target.currentHealth = 0;
    console.log(`${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`)
}
//Priest Skills
const useHolyLight = (dmgCalc, attacker, target, party) => {
    //Low damage attack that also heals the party for some ratio of the damage dealt (very low damage but will ignore physical defense)
    console.log(`${attacker.name} summons Holy Light, burning their enemy and healing their allies!`);
    dmgCalc = Math.round((attacker.buffness / target.buffness) * attacker.atkPow);
    //Enemy Damage Taken Calc
    target.currentHealth -= Math.round(dmgCalc * 0.65);
    if (target.currentHealth <= 0) target.currentHealth = 0;
    console.log(`${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`)
    //Ally Healing Calc
    party.forEach(member => {
        member.currentHealth += Math.round(dmgCalc * 0.65);
        if (member.currentHealth > member.maxHealth) member.currentHealth = member.maxHealth;
        console.log(`${member.name} has ${member.currentHealth}/${member.maxHealth} health left...`)
    });
}
//Beast Skills
const useBloodlust = (dmgCalc, attacker, target, party) => {
    //Some effect related to biting, maybe with a lifesteal effect
    console.log(`${attacker.name} is overtaken by Bloodlust and charges their enemy to quench its thirst!`);
    //Enemy Damage Taken Calc
    target.currentHealth -= dmgCalc;
    if (target.currentHealth <= 0) target.currentHealth = 0;
    console.log(`${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`)
    //Attacker Healing Calc
    attacker.currentHealth += Math.round(dmgCalc * 0.75);
    if (attacker.currentHealth > attacker.maxHealth) attacker.currentHealth = attacker.maxHealth;
    console.log(`${attacker.name} has ${attacker.currentHealth}/${attacker.maxHealth} health left...`)
}
//Elemental Skills
const useNaturePower = (dmgCalc, attacker, target, party) => {
    console.log(`${attacker.name} invokes the Power of Nature, overwhelming their targets defense`);
    dmgCalc = Math.round((attacker.buffness / target.buffness) * (attacker.atkPow - (target.pDef * .25)))
    //Enemy Damage Taken Calc
    target.currentHealth -= Math.round(dmgCalc * 1.15);
    if (target.currentHealth <= 0) target.currentHealth = 0;
    console.log(`${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`);
}
//Undead Skills
const useCursedEnergy = (dmgCalc, attacker, target, party) =>{
     //Attacks and Debuffs the target's defense stat, mulitplicatively for now
     console.log(`${attacker.name} is enveloped by Cursed Energy, damaging and weakening its target's resolve!`);
     //Debuff defense calc and announcements
     target.pDef -= Math.round(target.pDef * .15);
     console.log(`${target.name}\'s defense has dropped to ${target.pDef}!`);
     //Enemy Damage Taken Calc
     target.currentHealth -= Math.round(dmgCalc * .85);
     if (target.currentHealth <= 0) target.currentHealth = 0;
     console.log(`${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`);
}
//Skill Function Map
const useSkillMap = new Map();
useSkillMap.set('BONK', useBonk);
useSkillMap.set('Fireball', useFireball);
useSkillMap.set('Charge', useCharge);
useSkillMap.set('Rapid Strike', useRapidStrike);
useSkillMap.set('Critical Shot', useCriticalShot);
useSkillMap.set('Holy Light', useHolyLight);
useSkillMap.set('Bloodlust', useBloodlust);
useSkillMap.set('Nature Power', useNaturePower);
useSkillMap.set('Cursed Energy', useCursedEnergy);
//Create the skill objects
//Test skill
const bonk = new Skill('BONK', 4);
//Wizard Skills
const fireball = new Skill('Fireball', 4);
//Warrior Skills
const charge = new Skill('Charge', 3);
//Assassin Skills
const rapidStrike = new Skill('Rapid Strike', 6);
//Marksman Skills
const criticalShot = new Skill('Critical Shot', 4);
//Priest Skills
const holyLight = new Skill('Holy Light', 4);
//Beast Skills
const bloodlust = new Skill('Bloodlust', 4);
//Elemental Skills
const naturePower = new Skill('Nature Power', 4);
//Undead Skills
const cursedEnergy = new Skill('Cursed Energy', 4);
//Skill object map
const skillsMap = new Map();
skillsMap.set('BONK', bonk);
skillsMap.set('Fireball', fireball);
skillsMap.set('Charge', charge);
skillsMap.set('Rapid Strike', rapidStrike);
skillsMap.set('Critical Shot', criticalShot);
skillsMap.set('Holy Light', holyLight);
skillsMap.set('Bloodlust', bloodlust);
skillsMap.set('Nature Power', naturePower);
skillsMap.set('Cursed Energy', cursedEnergy);
//Class Skill Map
const classSkillMap = new Map();
classSkillMap.set('Testing', [bonk]);
classSkillMap.set('Wizard', [fireball, bonk]);
classSkillMap.set('Warrior', [charge, bonk]);
classSkillMap.set('Assassin', [rapidStrike, bonk]);
classSkillMap.set('Marksman', [criticalShot, bonk]);
classSkillMap.set('Priest', [holyLight, bonk]);
classSkillMap.set('Beast', [bloodlust, bonk]);
classSkillMap.set('Elemental', [naturePower, bonk]);
classSkillMap.set('Undead', [cursedEnergy, bonk]);

module.exports = { skillsMap, classSkillMap }
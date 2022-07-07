const {
    generateRandInt,
    waitFor } = require('./util.js');
//Create skill constructor
function Skill(name, skillCost) {
    this.name = name;
    this.skillCost = skillCost
    this.use = useSkillMap.get(name);
}
//Skill Functions
//Test Skill
const useBonk = async (dmgCalc, attacker, target, party) => {
    target.currentHealth -= attacker.atkPow;
    if (target.currentHealth <= 0) target.currentHealth = 0;
    console.log(`${target.name} got bonked hard as hell!`);
    await waitFor(.75);
    console.log(`${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`);
}
//Wizard skills
const useFireball = async (dmgCalc, attacker, target, party) => {
    //Wizard skill will ignore opponents physical defense
    console.log(`${attacker.name} gathers a huge Fireball and hurls it at the enemy!`);
    dmgCalc = Math.round((attacker.buffness / target.buffness) * attacker.atkPow);
    //Enemy Damage Taken Calc
    await waitFor(0.75);
    target.currentHealth -= Math.round(dmgCalc * 1.2);
    if (target.currentHealth <= 0) target.currentHealth = 0;
    console.log(`${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`);
}
const useEarthenSpire = async (dmgCalc, attacker, target, party) => {
    //Wizard skill will ignore opponents physical defense
    console.log(`${attacker.name} strikes the ground with their staff and summons an Earthen Spire beneath the enemy!`);
    //Enemy Damage Taken Calc, This Spell strikes Physically so uses default dmgCalc, reduces attack
    target.atkPow = Math.round(target.atkPow * .9);
    const dmgValue = Math.round(dmgCalc * .8)
    target.currentHealth -= dmgValue;
    if (target.currentHealth <= 0) target.currentHealth = 0;
    await waitFor(.75);
    console.log(`${target.name} took ${dmgValue} damage and has ${target.currentHealth}/${target.maxHealth} health left...`)
}
//Warrior Skills
const useDefiantStrike = async (dmgCalc, attacker, target, party) => {
    console.log(`${attacker.name} ignores the damage they've taken and unleashes a Defiant Strike!`);
    //Enemy Damage Taken Calc, Enrage style attack, increases damage based on own accumulated damage
    missingHealth = attacker.maxHealth - attacker.currentHealth
    const dmgValue = Math.round((dmgCalc * .8) + (missingHealth * .5));
    target.currentHealth -= dmgValue;
    if (target.currentHealth <= 0) target.currentHealth = 0;
    await waitFor(.75);
    console.log(`${target.name} took ${dmgValue} damage and has ${target.currentHealth}/${target.maxHealth} health left...`);
}
const useCharge = async (dmgCalc, attacker, target, party) => {
    //Strikes opponent for reduced damage and raise the attack stat of party members, inspire style of ability
    console.log(`${attacker.name} leads the Charge and headbutts the enemy!`);
    //Enemy Damage Taken Calc
    target.currentHealth -= Math.round(dmgCalc * .65);
    if (target.currentHealth <= 0) target.currentHealth = 0;
    await waitFor(.75)
    console.log(`${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`);
    //Ally Attack Buff Calc and Application, multiplicative bonus currently
    await waitFor(.5);
    console.log(`The allied party is inspired by the bravery!`);
    if (typeof party === 'array') {
        party.forEach(member => {
            member.atkPow += Math.round(member.atkPow * .15);
            console.log(`${member.name}\'s attack power has increased to ${member.atkPow}!`);
        })
    } else {
        attacker.atkPow += Math.round(attacker.atkPow * .15);
        console.log(`${attacker.name}\'s attack power has increased to ${attacker.atkPow}!`);
    }
}
//Assassin Skills
const useRapidStrike = async (dmgCalc, attacker, target, party) => {
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
    await waitFor(.75);
    console.log(`${attacker.name}\'s flurry connects with its target dealing ${hitDmg * minHits} damage!`)
    let i = 1;
    for (i; i <= totalHits; i++) {
        if (i <= minHits) {
            target.currentHealth -= hitDmg;
        } else {
            target.currentHealth -= Math.round(hitDmg * (minHits / maxHits));
            await waitFor(.5);
            console.log(`${attacker.name}\ continues the assault dealing ${Math.round(hitDmg * (minHits / maxHits))} damage!`)
        }
    };
    //reset the counter to 1 after the loop has completed for future uses of this ability
    i = 1;
    if (target.currentHealth <= 0) target.currentHealth = 0;
    await waitFor(.75);
    console.log(`${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`);
}
const useMortalBlow = async (dmgCalc, attacker, target, party) => {
    //Will do the equivalent of a guaranteed critical hit, maybe with armor piercing effect
    console.log(`${attacker.name} exploits the weakened enemy and lands a Mortal Blow!`);
    //Enemy Damage Taken Calc, Execution Style Ability, execute guaranteed at 20% health
    missingHealth = target.maxHealth - target.currentHealth
    const dmgValue = Math.round((dmgCalc * 0.4) + (missingHealth * .25));
    target.currentHealth -= dmgValue;
    if (target.currentHealth <= 0) target.currentHealth = 0;
    await waitFor(.75);
    console.log(`${target.name} took ${dmgValue} damage and has ${target.currentHealth}/${target.maxHealth} health left...`)
}
//Hunter Skills
const useCriticalShot = async (dmgCalc, attacker, target, party) => {
    //Will do the equivalent of a guaranteed critical hit, maybe with armor piercing effect
    console.log(`${attacker.name} identifies the enemy's weakness and lands a Critical Shot!`);
    //Enemy Damage Taken Calc, ignores 50% defense
    dmgCalc = Math.round((this.buffness / target.buffness) * this.atkPow * (200 / (200 + (target.pDef *.5))));
    const dmgValue = Math.round(dmgCalc * 1.3)
    target.currentHealth -= dmgValue;
    if (target.currentHealth <= 0) target.currentHealth = 0;
    await waitFor(.75);
    console.log(`${target.name} took ${dmgValue} damage and has ${target.currentHealth}/${target.maxHealth} health left...`);
}
const usePitfall = async (dmgCalc, attacker, target, party) => {
    console.log(`${attacker.name} sets a Pitfall trap for the enemy! The bigger they are, the harder they fall...`);
    //Enemy Damage Taken Calc, will do more damage based on max health and defense of the enemy
    const dmgValue = Math.round((dmgCalc * .2) + (target.maxHealth * .1) + target.pDef);
    target.currentHealth -= dmgValue;
    if (target.currentHealth <= 0) target.currentHealth = 0;
    await waitFor(.75);
    console.log(`${target.name} took ${dmgValue} damage and has ${target.currentHealth}/${target.maxHealth} health left...`);
}
const useTranquilizer = async (dmgCalc, attacker, target, party) => {
    //Attacks and Debuffs the target's defense stat, mulitplicatively for now
    console.log(`${attacker.name} fires a Tranquilizer dart! This should dull the enemy's senses`);
    await waitFor(.75);
    //Enemy Damage Taken Calc
    const dmgValue = Math.round(dmgCalc * .6);
    target.currentHealth -= dmgValue;
    if (target.currentHealth <= 0) target.currentHealth = 0;
    console.log(`${target.name} took ${dmgValue} damage and has ${target.currentHealth}/${target.maxHealth} health left...`);
    await waitFor(.75);
    //Debuff attack calc and announcements
    target.atkPow -= Math.round(target.atkPow * .25);
    console.log(`${target.name}\'s attack power has dropped to ${target.atkPow}!`);
}
//Priest Skills
const useHolyLight = async (dmgCalc, attacker, target, party) => {
    //Low damage attack that also heals the party for some ratio of the damage dealt (very low damage but will ignore physical defense)
    console.log(`${attacker.name} summons Holy Light, burning their enemy and healing their allies!`);
    dmgCalc = Math.round((attacker.buffness / target.buffness) * attacker.atkPow);
    //Enemy Damage Taken Calc
    target.currentHealth -= Math.round(dmgCalc * 0.65);
    await waitFor(.75);
    if (target.currentHealth <= 0) target.currentHealth = 0;
    console.log(`${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`)
    //Ally Healing Calc
    await waitFor(.5);
    if (Array.isArray(party)) {
        party.forEach(member => {
            member.currentHealth += Math.round(dmgCalc * 0.65);
            if (member.currentHealth > member.maxHealth) member.currentHealth = member.maxHealth;
            console.log(`${member.name} has ${member.currentHealth}/${member.maxHealth} health left...`)
        });
    } else {
        attacker.currentHealth += Math.round(dmgCalc * 0.65);
        if (attacker.currentHealth > attacker.maxHealth) attacker.currentHealth = attacker.maxHealth;
        console.log(`${attacker.name} has ${attacker.currentHealth}/${attacker.maxHealth} health left...`)
    };
}
const useDivineProtection = async (dmgCalc, attacker, target, party) => {
    //Non damaging skill. Heal party and Buff their defense
    console.log(`${attacker.name} prays for Divine Protection, healing their allies and increasing their resilience!`);
    dmgCalc = Math.round(attacker.atkPow);
    //Ally Defense Buff
    await waitFor(.75);
    if (Array.isArray(party)) {
        party.forEach(member => {
            member.pDef += Math.round(member.pDef * .25);
            console.log(`${member.name}\'s defense has increase to ${member.pDef}!`)
        });
    } else {
        attacker.pDef += Math.round(attacker.pDef * .25);
        console.log(`${attacker.name}\'s defense has increased to ${attacker.pDef}!`)
    };
    //Ally Healing Calc
    await waitFor(.75);
    if (Array.isArray(party)) {
        party.forEach(member => {
            member.currentHealth += Math.round(dmgCalc);
            if (member.currentHealth > member.maxHealth) member.currentHealth = member.maxHealth;
            console.log(`${member.name} has ${member.currentHealth}/${member.maxHealth} health left...`)
        });
    } else {
        attacker.currentHealth += Math.round(dmgCalc);
        if (attacker.currentHealth > attacker.maxHealth) attacker.currentHealth = attacker.maxHealth;
        console.log(`${attacker.name} has ${attacker.currentHealth}/${attacker.maxHealth} health left...`)
    };
}
//Beast Skills
const useBloodlust = async (dmgCalc, attacker, target, party) => {
    //Some effect related to biting, maybe with a lifesteal effect
    console.log(`${attacker.name} is overtaken by Bloodlust and charges their enemy to quench its thirst!`);
    //Enemy Damage Taken Calc
    target.currentHealth -= dmgCalc;
    await waitFor(.75);
    if (target.currentHealth <= 0) target.currentHealth = 0;
    console.log(`${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`)
    //Attacker Healing Calc
    await waitFor(.75);
    attacker.currentHealth += Math.round(dmgCalc * 0.75);
    if (attacker.currentHealth > attacker.maxHealth) attacker.currentHealth = attacker.maxHealth;
    console.log(`${attacker.name} has ${attacker.currentHealth}/${attacker.maxHealth} health left...`)
}
//Elemental Skills
const useNaturePower = async (dmgCalc, attacker, target, party) => {
    console.log(`${attacker.name} invokes the Power of Nature, overwhelming their targets defense`);
    //Enhance attack power before damage calculation
    attacker.atkPow = Math.round(attacker.atkPow * 1.15)
    await waitFor(.75);
    console.log(`${attacker.name} attack increased to ${attacker.atkPow}!`)
    //Enemy Damage Taken Calc
    dmgCalc = Math.round((attacker.buffness / target.buffness) * (attacker.atkPow))
    const dmgValue = Math.round(dmgCalc)
    target.currentHealth -= dmgValue;
    if (target.currentHealth <= 0) target.currentHealth = 0;
    await waitFor(.75);
    console.log(`${target.name} took ${dmgValue} damage and has ${target.currentHealth}/${target.maxHealth} health left...`);
}
//Undead Skills
const useCursedEnergy = async (dmgCalc, attacker, target, party) => {
    //Attacks and Debuffs the target's defense stat, mulitplicatively for now
    console.log(`${attacker.name} is enveloped by Cursed Energy, damaging and weakening its target's resolve!`);
    await waitFor(.75);
    //Enemy Damage Taken Calc
    target.currentHealth -= Math.round(dmgCalc * .85);
    if (target.currentHealth <= 0) target.currentHealth = 0;
    console.log(`${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`);
    await waitFor(.75);
    //Debuff defense calc and announcements
    target.pDef -= Math.round(target.pDef * .22);
    console.log(`${target.name}\'s defense has dropped to ${target.pDef}!`);
}
//Skill Function Map
const useSkillMap = new Map();
useSkillMap.set('BONK', useBonk);
//Wizard
useSkillMap.set('Fireball', useFireball);
useSkillMap.set('Earthen Spire', useEarthenSpire);
//Warrior
useSkillMap.set('Defiant Strike', useDefiantStrike);
useSkillMap.set('Charge', useCharge);
//Assassin
useSkillMap.set('Rapid Strike', useRapidStrike);
useSkillMap.set('Mortal Blow', useMortalBlow);
//Hunter
useSkillMap.set('Critical Shot', useCriticalShot);
useSkillMap.set('Pitfall', usePitfall);
useSkillMap.set('Tranquilizer', useTranquilizer);
//Priest
useSkillMap.set('Holy Light', useHolyLight);
useSkillMap.set('Divine Protection', useDivineProtection);
//Beast
useSkillMap.set('Bloodlust', useBloodlust);
//Elemental
useSkillMap.set('Nature Power', useNaturePower);
//Undead
useSkillMap.set('Cursed Energy', useCursedEnergy);
//Create the skill objects
//Test skill
const bonk = new Skill('BONK', 4);
//Wizard Skills
const fireball = new Skill('Fireball', 4);
const earthenSpire = new Skill('Earthen Spire', 4);
//Warrior Skills
const defiantStrike = new Skill('Defiant Strike', 3);
const charge = new Skill('Charge', 3);
//Assassin Skills
const rapidStrike = new Skill('Rapid Strike', 5);
const mortalBlow = new Skill('Mortal Blow', 2);
//Hunter Skills
const criticalShot = new Skill('Critical Shot', 4);
const pitfall = new Skill('Pitfall', 4);
const tranquilizer = new Skill('Tranquilizer', 4);
//Priest Skills
const holyLight = new Skill('Holy Light', 4);
const divineProtection = new Skill('Divine Protection', 4);
//Beast Skills
const bloodlust = new Skill('Bloodlust', 4);
//Elemental Skills
const naturePower = new Skill('Nature Power', 4);
//Undead Skills
const cursedEnergy = new Skill('Cursed Energy', 4);
//Skill object map
const skillsMap = new Map();
skillsMap.set('BONK', bonk);
//Wizard
skillsMap.set('Fireball', fireball);
skillsMap.set('Earthen Spire', earthenSpire);
//warrior
skillsMap.set('Defiant Strike', defiantStrike);
skillsMap.set('Charge', charge);
//assassin
skillsMap.set('Rapid Strike', rapidStrike);
skillsMap.set('Mortal Blow', mortalBlow);
//Hunter
skillsMap.set('Critical Shot', criticalShot);
skillsMap.set('Pitfall', pitfall);
skillsMap.set('Tranquilizer', tranquilizer);
//priest
skillsMap.set('Holy Light', holyLight);
skillsMap.set('Divine Protection', divineProtection);
//beast
skillsMap.set('Bloodlust', bloodlust);
//elemental
skillsMap.set('Nature Power', naturePower);
//undead
skillsMap.set('Cursed Energy', cursedEnergy);
//Class Skill Map
const classSkillMap = new Map();
classSkillMap.set('Testing', [bonk, fireball, earthenSpire, defiantStrike, charge, rapidStrike, mortalBlow, criticalShot, pitfall, tranquilizer, holyLight, divineProtection, bloodlust, naturePower, cursedEnergy]);
classSkillMap.set('Wizard', [fireball, earthenSpire]);
classSkillMap.set('Warrior', [defiantStrike, charge]);
classSkillMap.set('Assassin', [rapidStrike, mortalBlow]);
classSkillMap.set('Hunter', [criticalShot, pitfall, tranquilizer]);
classSkillMap.set('Priest', [holyLight, divineProtection]);
classSkillMap.set('Beast', [bloodlust, bonk]);
classSkillMap.set('Elemental', [naturePower, bonk]);
classSkillMap.set('Undead', [cursedEnergy, bonk]);

module.exports = { skillsMap, classSkillMap }
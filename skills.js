const {
    generateRandInt,
    waitFor,
    gameConsole,
    damageCalculation
} = require('./util.js');
//Create skill constructor
function Skill(name, skillCost) {
    this.name = name;
    this.skillCost = skillCost
    this.use = useSkillMap.get(name);
}
//Skill Functions
//Test Skill
const useBonk = async (attacker, target, party, currentTurn) => {
    //test skill for testing
    console.log(`${target.name} got bonked hard as hell!`);
    const dmgType = 'phys';
    const defenseIgnore = .5;
    const dmgValue = damageCalculation(attacker, target, dmgType, defenseIgnore);
    target.takeDamage(dmgValue);
    await gameConsole(.75, `${target.name} took ${dmgValue} damage and has ${target.currentHealth}/${target.maxHealth} health left...`);
    await target.applyStatus('test', currentTurn);
    const buffRatio = 1.25 / currentTurn;
    const debuffRatio = .75 * currentTurn;
    await attacker.buffed(currentTurn, 'atk', buffRatio, 3);
    await attacker.buffed(currentTurn, 'def', buffRatio, 3);
    await target.debuffed(currentTurn, 'atk', debuffRatio, 3);
    await target.debuffed(currentTurn, 'def', debuffRatio, 3);
}
//Wizard skills
const useFireball = async (attacker, target, party, currentTurn) => {
    const dmgType = 'magic';
    //Wizard skill will ignore opponents physical defense
    console.log(`${attacker.name} gathers a huge Fireball and hurls it at the enemy!`);
    const dmgValue = Math.round(1.2 * damageCalculation(attacker, target, dmgType));
    //Enemy Damage Taken Calc
    target.takeDamage(dmgValue);
    await gameConsole(.75, `${target.name} took ${dmgValue} damage and has ${target.currentHealth}/${target.maxHealth} health left...`);
    //apply burning status once created
}
const useEarthenSpire = async (attacker, target, party, currentTurn) => {
    const dmgType = 'phys';
    console.log(`${attacker.name} strikes the ground with their staff and summons an Earthen Spire beneath the enemy!`);
    //Enemy Damage Taken Calc, This Spell strikes Physically so uses default dmgCalc, reduces attack
    await target.debuffed(currentTurn, 'atk', .9, 3);
    const dmgValue = Math.round(damageCalculation(attacker, target, dmgType) * .8)
    target.takeDamage(dmgValue);
    await gameConsole(.75, `${target.name} took ${dmgValue} damage and has ${target.currentHealth}/${target.maxHealth} health left...`);
}
const useArcLightning = async (attacker, target, party, currentTurn) => {
    //Idea is for this to be Tesla Coil-esque effect, with the electricity arcing a random amount of times at reduced damage per strike
    // I want this to have a lot of hits at a low amount of damage (3-5 times maybe)
    console.log(`${attacker.name} staff gathers electrical energy and begins discharging Arcs of Lightning!`);
    //magic damage calculation (ignores physical defense)
    const dmgType = 'magic';
    //assign minimum and maximum amouint of hits
    const minHits = 4;
    const maxHits = 8;
    //modify damage calculation per hit, currently using assassin rapid strikes skill numbers for ratio
    const hitDmg = Math.round(damageCalculation(attacker, target, dmgType) * 0.25);
    //generate a random amount of hits
    let totalHits = generateRandInt(minHits, maxHits);
    //Loop through damage application to apply hits equal to the amount generated above
    let j = 1;
    for (j; j <= totalHits; j++) {
        //Initially the zaps are stronger since there is more electrical energy
        if (j <= minHits) {
            target.takeDamage(hitDmg);
            await gameConsole(.5, `${target.name} is zapped by a large arc and takes ${hitDmg} damage!`);
        } else {
            //Less electrical energy left, so the zapare hitting for a ratio of the original damage
            target.takeDamage(Math.round(hitDmg * (minHits / maxHits)));
            await gameConsole(.5, `${target.name} is zapped by a small arc as the energy from the staff begins to wane, taking ${Math.round(hitDmg * (minHits / maxHits))} damage!`);
        }
    };
    await gameConsole(.75, `${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`);
}
const useGravity = async (attacker, target, party, currentTurn) => {
    console.log(`${attacker.name} channels their true magical potential to create an intense Gravity field on their target!`);
    //Gravity spell similar to FF style gravity, have max health damage component
    const dmgValue = Math.round((target.maxHealth * .2) + target.pDef);
    target.takeDamage(dmgValue);
    await gameConsole(.75, `${target.name} is crushed under their own weight, taking ${dmgValue} damage!`);
    await gameConsole(.4, `${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`);
    //Exhaustion type of effect, the users loses some health do to the strain. More recoil at lower health
    const missingHealthRatio = (attacker.maxHealth - attacker.currentHealth) / attacker.maxHealth;
    const recoilDmg = Math.round(attacker.currentHealth * (.1 + missingHealthRatio));
    attacker.takeDamage(recoilDmg);
    //overwrite 0 health to not die from recoil
    if (attacker.currentHealth <= 0) attacker.currentHealth = 1;
    await gameConsole(.75, `The overwhelming spell takes it's toll on ${attacker.name}...`);
    await gameConsole(.4, `${attacker.name} takes ${recoilDmg} damage as recoil and has ${attacker.currentHealth}/${attacker.maxHealth} health left...`);
}
//Warrior Skills
const useDefiantStrike = async (attacker, target, party, currentTurn) => {
    const dmgType = 'phys';
    console.log(`${attacker.name} ignores the damage they've taken and unleashes a Defiant Strike!`);
    //Enemy Damage Taken Calc, Enrage style attack, increases damage based on own accumulated damage
    missingHealth = attacker.maxHealth - attacker.currentHealth
    const dmgValue = Math.round((damageCalculation(attacker, target, dmgType) * .6) + (missingHealth * .5));
    target.takeDamage(dmgValue);
    await gameConsole(.75, `${target.name} took ${dmgValue} damage and has ${target.currentHealth}/${target.maxHealth} health left...`);
}
const useCharge = async (attacker, target, party, currentTurn) => {
    const dmgType = 'phys';
    //Strikes opponent for reduced damage and raise the attack stat of party members, inspire style of ability
    console.log(`${attacker.name} leads the Charge and headbutts the enemy!`);
    //Enemy Damage Taken Calc
    const dmgValue = Math.round(damageCalculation(attacker, target, dmgType) * .65);
    target.takeDamage(dmgValue);
    await gameConsole(.75, `${target.name} took ${dmgValue} damage and has ${target.currentHealth}/${target.maxHealth} health left...`);
    //Ally Attack Buff Calc and Application, multiplicative bonus currently
    await gameConsole(.5, `The allied party is inspired by the bravery!`);
    if (Array.isArray(party)) {
        for (j = 0; j < party.length; j++) {
            await party[j].buffed(currentTurn, 'atk', 1.25, 3);
            await gameConsole(.5, `${party[j].name}\'s attack power is ${Math.round(party[j].atkPow * party[j].buffs.atk.ratio * party[j].debuffs.atk.ratio)}!`);
        }
    } else {
        await attacker.buffed(currentTurn, 'atk', 1.25, 3);
        await gameConsole(.5, `${attacker.name}\'s attack power is ${Math.round(attacker.atkPow * attacker.buffs.atk.ratio * attacker.debuffs.atk.ratio)}!`);
    }
}
const useGrit = async (attacker, target, party, currentTurn) => {
    //missing health scaling defensive buff
    console.log(`${attacker.name} shows their Grit in the face of adversity, stealing their resolve to stay in the fight`);
    const missingHealthRatio = (attacker.maxHealth - attacker.currentHealth) / attacker.maxHealth;
    //Self attack buff, increasing strength of buff with lower health, max is ~304% scaling down to ~3%
    const buffRate = (3.1 / (3 - (2 * missingHealthRatio)));
    await attacker.buffed(currentTurn, 'def', buffRate, 3);
    await gameConsole(.75, `${attacker.name}\'s defense is ${Math.round(attacker.pDef * attacker.buffs.def.ratio * attacker.debuffs.def.ratio)}!`);
}
const useStandoff = async (attacker, target, party, currentTurn) => {
    //1v1 Duel type of skill, takes an extra attack without defense calc from the enemy to unleash an immensely powerful attack
    console.log(`${attacker.name} discards their shield and has a Stand Off with the target!`);
    await gameConsole(.75, 'The combatants rush each other!');
    //Attacker damage taken
    const targDmgType = target.role.dmgType;
    const targetDefIgnore = 1;
    dmgTaken = Math.round(damageCalculation(target, attacker, targDmgType, targetDefIgnore));
    attacker.takeDamage(dmgTaken);
    if (attacker.currentHealth <= 0) attacker.currentHealth = 1;
    await gameConsole(.75, `The enemy lands a blow on ${attacker.name}!`);
    await gameConsole(.5, `${attacker.name} took ${dmgTaken} damage and has ${attacker.currentHealth}/${attacker.maxHealth} health left...`);
    //Enemy damage taken
    const dmgType = 'phys';
    const dmgValue = Math.round(damageCalculation(attacker, target, dmgType) * 2.5)
    target.takeDamage(dmgValue);
    await gameConsole(.75, `${attacker.name} absorbs the blow and lands an immense, full power strike of their own!`);
    await gameConsole(.5, `${target.name} took ${dmgValue} damage and has ${target.currentHealth}/${target.maxHealth} health left...`);
}
//Assassin Skills
const useRapidStrike = async (attacker, target, party, currentTurn) => {
    const dmgType = 'phys';
    //Assassin skill will strike multiple times (3-5 times maybe) at reduced damage per strike
    console.log(`${attacker.name} sneaks up on the enemy and unleashes a flurry of Rapid Strikes!`);
    //assign minimum and maximum amouint of hits
    const minHits = 2;
    const maxHits = 4;
    //modify damage calculation per hit
    const hitDmg = Math.round(damageCalculation(attacker, target, dmgType) * 0.7);
    //generate a random amount of hits
    let totalHits = generateRandInt(minHits, maxHits);
    //Loop through damage application to apply hits equal to the amount generated above
    await gameConsole(.75, `${attacker.name}\'s flurry connects with its target dealing ${hitDmg * minHits} damage!`);
    let j = 1;
    for (j; j <= totalHits; j++) {
        if (j <= minHits) {
            target.takeDamage(hitDmg);
        } else {
            target.takeDamage(Math.round(hitDmg * (minHits / maxHits)));
            await gameConsole(.5, `${attacker.name}\ continues the assault dealing ${Math.round(hitDmg * (minHits / maxHits))} damage!`);
        }
    };
    await gameConsole(.75, `${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`);
}
const useMortalBlow = async (attacker, target, party, currentTurn) => {
    const dmgType = 'phys';
    console.log(`${attacker.name} exploits the weakened enemy and lands a Mortal Blow!`);
    //Enemy Damage Taken Calc, Execution Style Ability, execute guaranteed at 20% health, but deals reduced dmg vs High health targets
    missingHealth = target.maxHealth - target.currentHealth
    const dmgValue = Math.round((damageCalculation(attacker, target, dmgType) * 0.4) + (missingHealth * .25));
    target.takeDamage(dmgValue);
    await gameConsole(.75, `${target.name} took ${dmgValue} damage and has ${target.currentHealth}/${target.maxHealth} health left...`);
}
const useApplyToxin = async (attacker, target, party, currentTurn) => {
    //Will raise effectiveness of own attacks, while lowering the target's resistance, maybe have a status effect in the future
    console.log(`${attacker.name} Applies a special Toxin to their blade, increasing the severity of their attacks!`);
    const dmgType = 'phys';
    //increase attack and recalc dmgValue
    const buffRatio = 1.2;
    await attacker.buffed(currentTurn, 'atk', buffRatio, 3);
    const dmgValue = damageCalculation(attacker, target, dmgType);
    //Enemy Damage Taken
    target.takeDamage(dmgValue);
    await gameConsole(.75, `${attacker.name} slashes the opponent with the tainted blade!`);
    await gameConsole(.75, `${target.name} took ${dmgValue} damage and has ${target.currentHealth}/${target.maxHealth} health left...`);
    //Enemy Defense Debuff
    const debuffRatio = .4;
    await target.debuffed(currentTurn, 'def', debuffRatio, 3);
    await gameConsole(.75, `${target.name} feels the toxin's effects and becomes disoriented...`)
    await gameConsole(.5, `${target.name}\'s defense is ${Math.round(target.pDef * target.buffs.def.ratio * target.debuffs.def.ratio)}!`);
    //Add poison effect once status is created
}
const useMachSlash = async (attacker, target, party, currentTurn) => {
    const slashType = 'phys';
    const shockType = 'magic';
    //Debuff own defense to unleash a powerful attack with an aftershock that ignore defense
    console.log(`${attacker.name} removes unnecessary weight and attacks the target at the speed of sound!`);
    //Self Defense Debuff
    const selfDefDebuffRate = 0;
    await attacker.debuffed(currentTurn, 'def', selfDefDebuffRate, 3);
    await gameConsole(.75, `${attacker.name}\'s defense is ${Math.round(attacker.pDef * attacker.buffs.def.ratio * attacker.debuffs.def.ratio)}!`)
    //Enemy Initial damage
    const slashDmg = Math.round(damageCalculation(attacker, target, slashType) * 1.5);
    await gameConsole(.75, `${target.name} took ${slashDmg} damage from the slash!`)
    //Enemy Shockwave damage
    shockwaveDmg = Math.round(damageCalculation(attacker, target, shockType) * 1.5);
    target.takeDamage(slashDmg + shockwaveDmg);
    await gameConsole(.75, `The speed of the attack creates a sonic boom in its wake, dealing ${shockwaveDmg} damage!`)
    await gameConsole(.5, `${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`)
}
//Hunter Skills
const useCriticalShot = async (attacker, target, party, currentTurn) => {
    const dmgType = 'phys'
    //Will do the equivalent of a guaranteed critical hit, maybe with armor piercing effect
    console.log(`${attacker.name} identifies the enemy's weakness and lands a Critical Shot!`);
    //Enemy Damage Taken Calc, ignores 50% defense
    defenseIgnore = .5;
    const dmgValue = Math.round(damageCalculation(attacker, target, dmgType, defenseIgnore) * 1.5);
    target.takeDamage(dmgValue);
    await gameConsole(.75, `${target.name} took ${dmgValue} damage and has ${target.currentHealth}/${target.maxHealth} health left...`);
}
const usePitfall = async (attacker, target, party, currentTurn) => {
    const dmgType = 'phys';
    console.log(`${attacker.name} sets a Pitfall trap for the enemy! The bigger they are, the harder they fall...`);
    //Enemy Damage Taken Calc, will do more damage based on max health and defense of the enemy
    const targEffectiveDef = Math.round(target.pDef * target.buffs.def.ratio * target.debuffs.def.ratio);
    const dmgValue = Math.round((damageCalculation(attacker, target, dmgType) * .2) + (target.maxHealth * .1) + targEffectiveDef);
    target.takeDamage(dmgValue);
    await gameConsole(.75, `${target.name} took ${dmgValue} damage and has ${target.currentHealth}/${target.maxHealth} health left...`);
}
const useTranquilizer = async (attacker, target, party, currentTurn) => {
    const dmgType = 'phys';
    //Attacks and Debuffs the target's defense stat, mulitplicatively for now
    console.log(`${attacker.name} fires a Tranquilizer dart! This should dull the enemy's senses`);
    //Enemy Damage Taken Calc
    const dmgValue = Math.round(damageCalculation(attacker, target, dmgType) * .6);
    target.takeDamage(dmgValue);
    await gameConsole(.75, `${target.name} took ${dmgValue} damage and has ${target.currentHealth}/${target.maxHealth} health left...`);
    //Debuff attack calc and announcements
    const debuffRatio = .75;
    await target.debuffed(currentTurn, 'atk', debuffRatio, 3);
    await gameConsole(.75, `${target.name}\'s attack is ${Math.round(target.atkPow * target.buffs.atk.ratio * target.debuffs.atk.ratio)}!`);
}
const useAmbush = async (attacker, target, party, currentTurn) => {
    //This skill will work similarly to the move Beat Up in Pokemon, allowing each member to hit the target during the hunter's turn
    console.log(`${attacker.name} baits the target in as their party waits to ambush...`);
    await gameConsole(1.25, `${target.name} takes the bait and the party attacks!!`);
    //Enemy damage taken
    if (Array.isArray(party)) {
        //Loops through party Array to let each member attack
        for (j = 0; j < party.length; j++) {
            await party[j].attack(target);
        };
    } else {
        await attacker.attack(target);
    };
    await waitFor(.3);
}
//Priest Skills
const useHolyLight = async (attacker, target, party, currentTurn) => {
    const dmgType = 'magic';
    //Low damage attack that also heals the party for some ratio of the damage dealt (very low damage but will ignore physical defense)
    console.log(`${attacker.name} summons Holy Light, burning their enemy and healing their allies!`);
    //Enemy Damage Taken Calc
    const dmgValue = Math.round(damageCalculation(attacker, target, dmgType) * 0.65)
    target.takeDamage(dmgValue);
    await gameConsole(.75, `${target.name} took ${dmgValue} damage and has ${target.currentHealth}/${target.maxHealth} health left...`);
    //Ally Healing Calc
    if (Array.isArray(party)) {
        for (j = 0; j < party.length; j++) {
            party[j].currentHealth += dmgValue;
            if (party[j].currentHealth > party[j].maxHealth) party[j].currentHealth = party[j].maxHealth;
            await gameConsole(.5, `${party[j].name} healed for ${dmgValue} and has ${party[j].currentHealth}/${party[j].maxHealth} health left...`)
        };
    } else {
        attacker.currentHealth += dmgValue;
        if (attacker.currentHealth > attacker.maxHealth) attacker.currentHealth = attacker.maxHealth;
        await gameConsole(.5, `${attacker.name} healed for ${dmgValue} and has ${attacker.currentHealth}/${attacker.maxHealth} health left...`)
    };
}
const useDivineProtection = async (attacker, target, party, currentTurn) => {
    //Non damaging skill. Heal party and Buff their defense
    console.log(`${attacker.name} prays for Divine Protection, healing their allies and increasing their resilience!`);
    //Ally Defense Buff
    const buffRatio = 1.5;
    if (Array.isArray(party)) {
        for (j = 0; j < party.length; j++){
            await party[j].buffed(currentTurn, 'def', buffRatio, 3);
            await gameConsole(.5,`${party[j].name}\'s defense is ${Math.round(party[j].pDef * party[j].buffs.def.ratio * party[j].debuffs.def.ratio)}!`)
        };
    } else {
        await attacker.buffed(currentTurn, 'def', buffRatio, 3);
        await gameConsole(.5,`${attacker.name}\'s defense is ${Math.round(attacker.pDef * attacker.buffs.def.ratio * attacker.debuffs.def.ratio)}!`)
    };
    //Ally Healing Calc
    const healCalc = Math.round(attacker.atkPow * attacker.buffs.atk.ratio * attacker.debuffs.atk.ratio);
    if (Array.isArray(party)) {
        for (k = 0; k < party.length; k++){
            party[k].currentHealth += Math.round(healCalc);
            if (party[k].currentHealth > party[k].maxHealth) party[k].currentHealth = party[k].maxHealth;
            await gameConsole(.75, `${party[k].name} healed for ${healCalc} and has ${party[k].currentHealth}/${party[k].maxHealth} health left...`)
        };
    } else {
        attacker.currentHealth += Math.round(healCalc);
        if (attacker.currentHealth > attacker.maxHealth) attacker.currentHealth = attacker.maxHealth;
        console.log(`${attacker.name} healed for ${healCalc} and has ${attacker.currentHealth}/${attacker.maxHealth} health left...`)
    };
}
const useHolyWater = async (attacker, target, party, currentTurn) => {
    const dmgType = 'magic';
    //currentHealth damage ability and attack debuff
    console.log(`${attacker.name} throws Holy Water on the enemy and weakens them!`)
    //Enemy Damage
    const dmgValue = Math.round((damageCalculation(attacker, target, dmgType) * .4) + (target.currentHealth * .15));
    target.takeDamage(dmgValue);
    await gameConsole(.75, `${target.name} took ${dmgValue} damage and has ${target.currentHealth}/${target.maxHealth} health left...`);
    //Enemy Attack Debuff
    const debuffRatio = .8;
    await target.debuffed(currentTurn, 'atk', debuffRatio, 3);
    await gameConsole(.75, `${target.name}\'s attack power is ${Math.round(target.atkPow * target.buffs.atk.ratio * target.debuffs.atk.ratio)}!`);
}
const useDivineIntervention = async (attacker, target, party, currentTurn) => {
    const dmgType = 'magic';
    //Random outcome type ability, will use random role to generate action
    console.log(`${attacker.name} prays for Divine Intervention`);
    //Generates a random outcome: Big Damage Attack, Full Recovery for party, or Large Buff and Heal for the Priest
    const prayerAnswer = generateRandInt(1, 3);
    await gameConsole(.75, `${attacker.name}\'s prayer has been answered!`)
    switch (prayerAnswer) {
        //Damaging Attack
        case 1:
            const dmgValue = Math.round(damageCalculation(attacker, target, dmgType) * 2.5);
            target.takeDamage(dmgValue);
            await gameConsole(.75, `A intense beam of light descends from the sky, dealing ${dmgValue} damage to the target!`);
            await gameConsole(.75, `${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`);
            break;
        //Party Recover
        case 2:
            await gameConsole(.75, `A divine rain shower washes over the party, healing away the wear of the battle!`)
            if (Array.isArray(party)) {
                for (j = 0; j < party.length; j++) {
                    party[j].currentHealth = party[j].maxHealth;
                    party[j].currentSP = party[j].maxSP;
                    await gameConsole(.6, `${party[j].name} has ${party[j].currentHealth}/${party[j].maxHealth} health left...`);
                    await gameConsole(.3, `${party[j].name} has ${party[j].currentSP}/${party[j].maxSP} SP left...`);
                };
            } else {
                attacker.currentHealth = attacker.maxHealth;
                await gameConsole(.6, `${attacker.name} has ${attacker.currentHealth}/${attacker.maxHealth} health left...`);
            }
            break;
        //Priest Power-up
        case 3:
            await gameConsole(.75, `A divine wind envelopes ${attacker.name}, healing their wounds and empowering offensive ability!`)
            attacker.currentHealth = attacker.maxHealth;
            await gameConsole(.6, `${attacker.name} has ${attacker.currentHealth}/${attacker.maxHealth} health left...`);
            const buffRatio = 2.25;
            await attacker.buffed(currentTurn, 'atk', buffRatio, 3);
            await gameConsole(.6, `${attacker.name} attack is ${Math.round(attacker.atkPow * attacker.buffs.atk.ratio * attacker.debuffs.atk.ratio)}!`);
            break;

    }
}
//Beast Skills
const useBloodlust = async (attacker, target, party, currentTurn) => {
    const dmgType = 'phys';
    //Some effect related to biting, maybe with a lifesteal effect
    console.log(`${attacker.name} is overtaken by Bloodlust and charges their enemy to quench its thirst!`);
    //Enemy Damage Taken Calc
    const dmgValue = damageCalculation(attacker, target, dmgType);
    target.takeDamage(dmgValue);
    await gameConsole(.75, `${target.name} took ${dmgValue} damage and has ${target.currentHealth}/${target.maxHealth} health left...`);
    //Attacker Healing Calc
    const healCalc = Math.round(dmgValue * 0.75)
    attacker.currentHealth += healCalc;
    if (attacker.currentHealth > attacker.maxHealth) attacker.currentHealth = attacker.maxHealth;
    await gameConsole(.75, `${attacker.name} healed for ${healCalc} and has ${attacker.currentHealth}/${attacker.maxHealth} health left...`);
    //Add Bleed status once created
}
const useAdrenalineRush = async (attacker, target, party, currentTurn) => {
    const dmgType = 'phys';
    //Powers up based on missing health, then attacks with that increased attack power
    console.log(`${attacker.name} is fighting for survival and gets an Adrenaline rush!`);
    const missingHealthRatio = (attacker.maxHealth - attacker.currentHealth) / attacker.maxHealth;
    //Self attack buff, increasing strength of buff with lower health, max is ~50% scaling down to 16%, use
    const buffRatio = 1 + (1 / (3 / (.5 + missingHealthRatio)));
    await attacker.buffed(currentTurn, 'atk', buffRatio, 3);
    await gameConsole(.75, `${attacker.name}\'s attack is ${Math.round(attacker.atkPow * attacker.buffs.atk.ratio * attacker.debuffs.atk.ratio)}!`);
    //Enemy Damage Taken Calc, increases damage based on own accumulated damage
    const dmgValue = Math.round(damageCalculation(attacker, target, dmgType) * (.75 + missingHealthRatio));
    target.takeDamage(dmgValue);
    await gameConsole(.75, `${target.name} took ${dmgValue} damage and has ${target.currentHealth}/${target.maxHealth} health left...`);
}
const useThroatChomp = async (attacker, target, party, currentTurn) => {
    const dmgType = 'phys';
    console.log(`${attacker.name} goes in for the kill, Chomping at their target's Throat!`);
    //Enemy Damage Taken Calc, Execution Style Ability, execute guaranteed at 30% health, but deals massively reduced dmg vs High health targets
    missingHealth = target.maxHealth - target.currentHealth
    const dmgValue = Math.round((damageCalculation(attacker, target, dmgType) * 0.1) + (missingHealth * .42));
    target.takeDamage(dmgValue);
    await gameConsole(.75, `${target.name} took ${dmgValue} damage and has ${target.currentHealth}/${target.maxHealth} health left...`);
}
//Elemental Skills
const useNaturePower = async (attacker, target, party, currentTurn) => {
    const dmgType = 'magic';
    console.log(`${attacker.name} invokes the Power of Nature, overwhelming their targets defense`);
    //Enhance attack power before damage calculation
    const buffRatio = 1.25;
    await attacker.buffed(currentTurn, 'atk', buffRatio, 3);
    await gameConsole(.75, `${attacker.name} attack is ${Math.round(attacker.atkPow * attacker.buffs.atk.ratio * attacker.debuffs.atk.ratio)}!`);
    //Enemy Damage Taken Calc
    const dmgValue = Math.round(damageCalculation(attacker, target, dmgType))
    target.takeDamage(dmgValue);
    await gameConsole(.75, `${target.name} took ${dmgValue} damage and has ${target.currentHealth}/${target.maxHealth} health left...`);
}
const useSyphonMana = async (attacker, target, party, currentTurn) => {
    //Non damaging skill. Heal party and Buff their attack
    console.log(`${attacker.name} Syphons Mana from the environment to empower their allies, healing their allies and increasing their strength!`);
    const healCalc = Math.round(attacker.atkPow * attacker.buffs.atk.ratio * attacker.debuffs.atk.ratio);
    //Ally Attack Buff
    const buffRatio = 1.4;
    if (Array.isArray(party)) {
        for (j = 0;j < party.length; j++) {
            await party[j].buffed(currentTurn, 'atk', buffRatio, 3);
            await gameConsole(.75, `${party[j].name}\'s attack is ${Math.round(party[j].atkPow * party[j].buffs.atk.ratio * party[j].debuffs.atk.ratio)}!`);
        };
    } else {
        await attacker.buffed(currentTurn, 'atk', buffRatio, 3);
        await gameConsole(.75, `${attacker.name}\'s attack is ${Math.round(attacker.atkPow * attacker.buffs.atk.ratio * attacker.debuffs.atk.ratio)}!`)
    };
    //Ally Healing Calc
    if (Array.isArray(party)) {
        for (k = 0;k < party.length; k++) {
            party[k].currentHealth += healCalc;
            if (party[k].currentHealth > party[k].maxHealth) party[k].currentHealth = party[k].maxHealth;
            await gameConsole(.75, `${party[k].name} healed for ${healCalc} and has ${party[k].currentHealth}/${party[k].maxHealth} health left...`);
        };
    } else {
        attacker.currentHealth += healCalc;
        if (attacker.currentHealth > attacker.maxHealth) attacker.currentHealth = attacker.maxHealth;
        console.log(`${attacker.name} healed for ${healCalc} and has ${attacker.currentHealth}/${attacker.maxHealth} health left...`)
    };
}
const useEnergyConversion = async (attacker, target, party, currentTurn) => {
    const dmgType = 'magic';
    //Attack will convert a small portion of damage to skill point resource
    console.log(`${attacker.name} channels the power of element and emits a blast of Energy!`);
    //Enemy Damage Taken Calc
    const dmgValue = Math.round(damageCalculation(attacker, target, dmgType) * 1.05);
    target.takeDamage(dmgValue);
    await gameConsole(0.75, `${target.name} takes ${dmgValue} and has ${target.currentHealth}/${target.maxHealth} health left...`);
    //SP conversion amount, small element of randomness
    const effectiveAtk = attacker.atkPow * attacker.buffs.atk.ratio * attacker.debuffs.atk.ratio;
    const gainedSP = 1 + generateRandInt(0, 2) + Math.round(dmgValue / effectiveAtk);
    attacker.currentSP += gainedSP;
    await gameConsole(.5, `${attacker.name} retains some of the gathered Energy and Converts it to SP!`);
    await gameConsole(.5, `${attacker.name} recovers ${gainedSP} SP...`);
}
//Undead Skills
const useCursedEnergy = async (attacker, target, party, currentTurn) => {
    const dmgType = 'phys';
    //Attacks and Debuffs the target's defense stat,
    console.log(`${attacker.name} is enveloped by Cursed Energy, damaging and weakening its target's resolve!`);
    //Enemy Damage Taken Calc
    const dmgValue = damageCalculation(attacker, target, dmgType);
    target.takeDamage(dmgValue);
    await gameConsole(.75, `${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`);
    //Debuff defense calc and announcements
    const debuffRatio = .7;
    await target.debuffed(currentTurn, 'def', debuffRatio, 3);
    await gameConsole(.75, `${target.name}\'s defense is ${Math.round(target.pDef * target.buffs.def.ratio * target.debuffs.def.ratio)}!`);
}
const useWither = async (attacker, target, party, currentTurn) => {
    const dmgType = 'magic';
    //Does damage based on target's current health, stronger vs healthier target, also attack debuff
    console.log(`${attacker.name} channels evil energy on their target, causing their strength to Wither away!`);
    //Enemy Damage Taken Calc, stronger vs healthier target
    const currentHealthRatio = (target.currentHealth / target.maxHealth);
    // In the dmgValue: 1.3333 - currentHealthRatio makes this do Triple dmg vs full health target scaling down to ~75%
    const dmgValue = Math.round(damageCalculation(attacker, target, dmgType) / (1.3333 - currentHealthRatio));
    target.takeDamage(dmgValue);
    await gameConsole(.75, `${target.name} took ${dmgValue} damage and has ${target.currentHealth}/${target.maxHealth} health left...`);
    //Debuff attack calc, more powerful if target is healthier as well, this debuff starts at 33% and decreases exponentially
    const debuffRatio = 1 - (1 / 3 * Math.pow(currentHealthRatio, 3));
    await target.debuffed(currentTurn, 'atk', debuffRatio, 3);
    await gameConsole(.75, `${target.name}\'s attack is ${Math.round(target.atkPow * target.buffs.atk.ratio * target.debuffs.atk.ratio)}!`);
}
const useEssenceDrain = async (attacker, target, party, currentTurn) => {
    //Non-damaging ability, steals stats
    console.log(`${attacker.name} uses forbidden magic and Drains the Essence of their target, stealing their strength!`);
    //Steal Attack
    const debuffRatio = .6667;
    const buffRatio = 1 / debuffRatio;
    await target.debuffed(currentTurn, 'atk', debuffRatio, 3);
    await gameConsole(.5, `${target.name} had their attack stolen!`);
    await gameConsole(.5, `${target.name}\'s attack is ${Math.round(target.atkPow * target.buffs.atk.ratio * target.debuffs.atk.ratio)}!`);
    await attacker.buffed(currentTurn, 'atk', buffRatio, 3);
    await gameConsole(.5, `${attacker.name}\'s attack is ${Math.round(attacker.atkPow * attacker.buffs.atk.ratio * attacker.debuffs.atk.ratio)}!`);
    //Steal Defense
    await gameConsole(.5, `${target.name} had their defense stolen!`);
    await target.debuffed(currentTurn, 'def', debuffRatio, 3);
    await gameConsole(.5, `${target.name}\'s defense is ${Math.round(target.pDef * target.buffs.def.ratio * target.debuffs.def.ratio)}!`);
    await attacker.buffed(currentTurn, 'def', buffRatio, 3);
    await gameConsole(.5, `${attacker.name}\'s defense is ${Math.round(attacker.pDef * attacker.buffs.def.ratio * attacker.debuffs.def.ratio)}!`);
}
//Skill Function Map
const useSkillMap = new Map();
useSkillMap.set('BONK', useBonk);
//Wizard
useSkillMap.set('Fireball', useFireball);
useSkillMap.set('Earthen Spire', useEarthenSpire);
useSkillMap.set('Arc Lightning', useArcLightning);
useSkillMap.set('Gravity', useGravity);
//Warrior
useSkillMap.set('Defiant Strike', useDefiantStrike);
useSkillMap.set('Charge', useCharge);
useSkillMap.set('Grit', useGrit);
useSkillMap.set('Stand Off', useStandoff);
//Assassin
useSkillMap.set('Rapid Strike', useRapidStrike);
useSkillMap.set('Mortal Blow', useMortalBlow);
useSkillMap.set('Apply Toxin', useApplyToxin);
useSkillMap.set('Mach Slash', useMachSlash);
//Hunter
useSkillMap.set('Critical Shot', useCriticalShot);
useSkillMap.set('Pitfall', usePitfall);
useSkillMap.set('Tranquilizer', useTranquilizer);
useSkillMap.set('Ambush', useAmbush);
//Priest
useSkillMap.set('Holy Light', useHolyLight);
useSkillMap.set('Divine Protection', useDivineProtection);
useSkillMap.set('Holy Water', useHolyWater);
useSkillMap.set('Divine Intervention', useDivineIntervention);
//Beast
useSkillMap.set('Bloodlust', useBloodlust);
useSkillMap.set('Adrenaline Rush', useAdrenalineRush);
useSkillMap.set('Throat Chomp', useThroatChomp);
//Elemental
useSkillMap.set('Nature Power', useNaturePower);
useSkillMap.set('Syphon Mana', useSyphonMana);
useSkillMap.set('Energy Conversion', useEnergyConversion);
//Undead
useSkillMap.set('Cursed Energy', useCursedEnergy);
useSkillMap.set('Wither', useWither);
useSkillMap.set('Essence Drain', useEssenceDrain);
//Create the skill objects
//Test skill
const bonk = new Skill('BONK', 4);
//Wizard Skills
const fireball = new Skill('Fireball', 4);
const earthenSpire = new Skill('Earthen Spire', 3);
const arcLightning = new Skill('Arc Lightning', 5);
const gravity = new Skill('Gravity', 7);
//Warrior Skills
const defiantStrike = new Skill('Defiant Strike', 3);
const charge = new Skill('Charge', 3);
const grit = new Skill('Grit', 3);
const standOff = new Skill('Stand Off', 6);
//Assassin Skills
const rapidStrike = new Skill('Rapid Strike', 5);
const mortalBlow = new Skill('Mortal Blow', 2);
const applyToxin = new Skill('Apply Toxin', 5);
const machSlash = new Skill('Mach Slash', 7);
//Hunter Skills
const criticalShot = new Skill('Critical Shot', 4);
const pitfall = new Skill('Pitfall', 4);
const tranquilizer = new Skill('Tranquilizer', 4);
const ambush = new Skill('Ambush', 8);
//Priest Skills
const holyLight = new Skill('Holy Light', 3);
const divineProtection = new Skill('Divine Protection', 3);
const holyWater = new Skill('Holy Water', 4);
const divineIntervention = new Skill('Divine Intervention', 6);
//Beast Skills
const bloodlust = new Skill('Bloodlust', 4);
const adrenalineRush = new Skill('Adrenaline Rush', 4);
const throatChomp = new Skill('Throat Chomp', 2);
//Elemental Skills
const naturePower = new Skill('Nature Power', 5);
const syphonMana = new Skill('Syphon Mana', 3);
const energyConversion = new Skill('Energy Conversion', 3);
//Undead Skills
const cursedEnergy = new Skill('Cursed Energy', 3);
const wither = new Skill('Wither', 6);
const essenceDrain = new Skill('Essence Drain', 3);
//Skill object map
const skillsMap = new Map();
skillsMap.set('BONK', bonk);
//Wizard
skillsMap.set('Fireball', fireball);
skillsMap.set('Earthen Spire', earthenSpire);
skillsMap.set('Arc Lightning', arcLightning);
skillsMap.set('Gravity', gravity);
//warrior
skillsMap.set('Defiant Strike', defiantStrike);
skillsMap.set('Charge', charge);
skillsMap.set('Grit', grit);
skillsMap.set('Stand Off', standOff);
//assassin
skillsMap.set('Rapid Strike', rapidStrike);
skillsMap.set('Mortal Blow', mortalBlow);
skillsMap.set('Apply Toxin', applyToxin);
skillsMap.set('Mach Slash', machSlash);
//Hunter
skillsMap.set('Critical Shot', criticalShot);
skillsMap.set('Pitfall', pitfall);
skillsMap.set('Tranquilizer', tranquilizer);
skillsMap.set('Ambush', ambush);
//priest
skillsMap.set('Holy Light', holyLight);
skillsMap.set('Divine Protection', divineProtection);
skillsMap.set('Holy Water', holyWater);
skillsMap.set('Divine Intervention', divineIntervention);
//beast
skillsMap.set('Bloodlust', bloodlust);
skillsMap.set('Adrenaline Rush', adrenalineRush);
skillsMap.set('Throat Chomp', throatChomp);
//elemental
skillsMap.set('Nature Power', naturePower);
skillsMap.set('Syphon Mana', syphonMana);
skillsMap.set('Energy Conversion', energyConversion);
//undead
skillsMap.set('Cursed Energy', cursedEnergy);
skillsMap.set('Wither', wither);
skillsMap.set('Essence Drain', essenceDrain);
//Class Skill Map
const classSkillMap = new Map();
//Can add skills that need testing as necessary
classSkillMap.set('Testing', [bonk]);
//Skill Lists for in game classes
classSkillMap.set('Wizard', [fireball, earthenSpire, arcLightning, gravity]);
classSkillMap.set('Warrior', [defiantStrike, charge, grit, standOff]);
classSkillMap.set('Assassin', [rapidStrike, mortalBlow, applyToxin, machSlash]);
classSkillMap.set('Hunter', [criticalShot, pitfall, tranquilizer, ambush]);
classSkillMap.set('Priest', [holyLight, divineProtection, holyWater, divineIntervention]);
classSkillMap.set('Beast', [bloodlust, adrenalineRush, throatChomp]);
classSkillMap.set('Elemental', [naturePower, syphonMana, energyConversion]);
classSkillMap.set('Undead', [cursedEnergy, wither, essenceDrain]);

module.exports = { skillsMap, classSkillMap }
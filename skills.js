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
const useBonk = async (dmgCalc, attacker, target, party, currentTurn) => {
    target.currentHealth -= attacker.atkPow;
    if (target.currentHealth <= 0) target.currentHealth = 0;
    console.log(`${target.name} got bonked hard as hell!`);
    await waitFor(.75);
    console.log(`${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`);
    await target.applyStatus('test', currentTurn);
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
    console.log(`${target.name} took ${dmgValue} damage and has ${target.currentHealth}/${target.maxHealth} health left...`);
}
const useArcLightning = async (dmgCalc, attacker, target, party) => {
    //Idea is for this to be Tesla Coil-esque effect, with the electricity arcing a random amount of times at reduced damage per strike
    // I want this to have a lot of hits at a low amount of damage (3-5 times maybe)
    console.log(`${attacker.name} staff gathers electrical energy and begins discharging Arcs of Lightning!`);
    //magic damage calculation (ignores physical defense)
    dmgCalc = Math.round((attacker.buffness / target.buffness) * attacker.atkPow);
    //assign minimum and maximum amouint of hits
    const minHits = 4;
    const maxHits = 8;
    //modify damage calculation per hit, currently using assassin rapid strikes skill numbers for ratio
    const hitDmg = Math.round(dmgCalc * 0.25);
    //generate a random amount of hits
    let totalHits = generateRandInt(minHits, maxHits);
    //Loop through damage application to apply hits equal to the amount generated above
    let i = 1;
    for (i; i <= totalHits; i++) {
        //Initially the zaps are stronger since there is more electrical energy
        if (i <= minHits) {
            target.currentHealth -= hitDmg;
            await waitFor(.5);
            console.log(`${target.name} is zapped by a large arc and takes ${hitDmg} damage!`)
        } else {
            //Less electrical energy left, so the zapare hitting for a ratio of the original damage
            target.currentHealth -= Math.round(hitDmg * (minHits / maxHits));
            await waitFor(.5);
            console.log(`${target.name} is zapped by a small arc as the energy from the staff begins to wane, taking ${Math.round(hitDmg * (minHits / maxHits))} damage!`);
        }
    };
    // //reset the counter to 1 after the loop has completed for future uses of this ability
    // i = 1;
    if (target.currentHealth <= 0) target.currentHealth = 0;
    await waitFor(.75);
    console.log(`${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`);
}
const useGravity = async (dmgCalc, attacker, target, party) => {
    console.log(`${attacker.name} channels their true magical potential to create an intense Gravity field on their target!`);
    //Gravity spell similar to FF style gravity, have max health damage component
    const dmgValue = Math.round((target.maxHealth * .2) + target.pDef);
    target.currentHealth -= dmgValue;
    if (target.currentHealth <= 0) target.currentHealth = 0;
    await waitFor(.75);
    console.log(`${target.name} is crushed under their own weight, taking ${dmgValue} damage!`);
    await waitFor(.4);
    console.log(`${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`);
    //Exhaustion type of effect, the users loses some health do to the strain. More recoil at lower health
    const missingHealthRatio = (attacker.maxHealth - attacker.currentHealth) / attacker.maxHealth;
    const recoilDmg = Math.round(attacker.currentHealth * (.1 + missingHealthRatio));
    attacker.currentHealth -= recoilDmg;
    if (attacker.currentHealth <= 0) attacker.currentHealth = 1;
    await waitFor(.75);
    console.log(`The overwhelming spell takes it's toll on ${attacker.name}...`)
    await waitFor(.4);
    console.log(`${attacker.name} takes ${recoilDmg} damage as recoil and has ${attacker.currentHealth}/${attacker.maxHealth} health left...`);
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
    if (Array.isArray(party)) {
        party.forEach(member => {
            member.atkPow += Math.round(member.atkPow * .15);
            console.log(`${member.name}\'s attack power has increased to ${member.atkPow}!`);
        })
    } else {
        attacker.atkPow += Math.round(attacker.atkPow * .15);
        console.log(`${attacker.name}\'s attack power has increased to ${attacker.atkPow}!`);
    }
}
const useGrit = async (dmgCalc, attacker, target, party) => {
    //missing health scaling defensive buff
    console.log(`${attacker.name} shows their Grit in the face of adversity, stealing their resolve to stay in the fight`);
    const missingHealthRatio = (attacker.maxHealth - attacker.currentHealth) / attacker.maxHealth;
    //Self attack buff, increasing strength of buff with lower health, max is ~304% scaling down to ~3%
    const buffRate = (3.1 / (3 - (2 * missingHealthRatio)));
    attacker.pDef *= buffRate;
    attacker.pDef = Math.round(attacker.pDef);
    await waitFor(.75);
    console.log(`${attacker.name}\'s defense has increased to ${attacker.pDef}!`);
}
const useStandoff = async (dmgCalc, attacker, target, party) => {
    //1v1 Duel type of skill, takes an extra attack without defense calc from the enemy to unleash an immensely powerful attack
    console.log(`${attacker.name} discards their shield and has a Stand Off with the target!`);
    await waitFor(.75);
    //Attacker damage taken
    console.log('The combatants rush each other!')
    dmgTaken = Math.round((target.buffness / attacker.buffness) * target.atkPow);
    attacker.currentHealth -= dmgTaken;
    if (attacker.currentHealth <= 0) attacker.currentHealth = 1;
    await waitFor(.75);
    console.log(`The enemy lands a blow on ${attacker.name}!`)
    await waitFor(.5);
    console.log(`${attacker.name} took ${dmgTaken} damage and has ${attacker.currentHealth}/${attacker.maxHealth} health left...`);
    //Enemy damage taken
    const dmgValue = Math.round(dmgCalc * 2.5)
    target.currentHealth -= dmgValue;
    if (target.currentHealth <= 0) target.currentHealth = 0;
    await waitFor(.75);
    console.log(`${attacker.name} absorbs the blow and lands an immense, full power strike of their own!`);
    await waitFor(.5);
    console.log(`${target.name} took ${dmgValue} damage and has ${target.currentHealth}/${target.maxHealth} health left...`);
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
    console.log(`${attacker.name} exploits the weakened enemy and lands a Mortal Blow!`);
    //Enemy Damage Taken Calc, Execution Style Ability, execute guaranteed at 20% health, but deals reduced dmg vs High health targets
    missingHealth = target.maxHealth - target.currentHealth
    const dmgValue = Math.round((dmgCalc * 0.4) + (missingHealth * .25));
    target.currentHealth -= dmgValue;
    if (target.currentHealth <= 0) target.currentHealth = 0;
    await waitFor(.75);
    console.log(`${target.name} took ${dmgValue} damage and has ${target.currentHealth}/${target.maxHealth} health left...`)
}
const useApplyToxin = async (dmgCalc, attacker, target, party) => {
    //Will raise effectiveness of own attacks, while lowering the target's resistance, maybe have a status effect in the future
    console.log(`${attacker.name} Applies a special Toxin to their blade, increasing the severity of their attacks!`);
    await waitFor(.75);
    //increase attack and recalc dmgValue
    attacker.atkPow += Math.round(attacker.atkPow * .2);
    const dmgValue = Math.round((attacker.buffness / target.buffness) * attacker.atkPow * (200 / (200 + target.pDef)));
    //Enemy Damage Taken
    target.currentHealth -= dmgValue;
    if (target.currentHealth <= 0) target.currentHealth = 0;
    console.log(`${attacker.name} slashes the opponent with the tainted blade!`)
    await waitFor(.75);
    console.log(`${target.name} took ${dmgValue} damage and has ${target.currentHealth}/${target.maxHealth} health left...`);
    //Enemy Defense Debuff
    target.pDef -= Math.round(target.pDef * .4);
    await waitFor(.75)
    console.log(`${target.name} feels the toxin's effects and becomes disoriented...`);
    await waitFor(.5);
    console.log(`${target.name}\'s defense has dropped to ${target.pDef}!`);
}
const useMachSlash = async (dmgCalc, attacker, target, party) => {
    //Debuff own defense to unleash a powerful attack with an aftershock that ignore defense
    console.log(`${attacker.name} removes unnecessary weight and attacks the target at the speed of sound!`);
    await waitFor(.75);
    //Self Defense Debuff
    attacker.pDef = 0;
    await waitFor(.75)
    console.log(`${attacker.name}\'s defense has dropped to ${attacker.pDef}!`);
    //Enemy Initial damage
    slashDmg = Math.round(dmgCalc * 1.5);
    await waitFor(.75)
    console.log(`${target.name} took ${slashDmg} damage from the slash!`);
    //Enemy Shockwave damage
    shockwaveDmg = Math.round((attacker.buffness / target.buffness) * attacker.atkPow * 1.5);
    target.currentHealth -= (slashDmg + shockwaveDmg);
    if (target.currentHealth <= 0) target.currentHealth = 0;
    await waitFor(.75)
    console.log(`The speed of the attack creates a sonic boom in its wake, dealing ${shockwaveDmg} damage!`);
    await waitFor(.5)
    console.log(`${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`)
}
//Hunter Skills
const useCriticalShot = async (dmgCalc, attacker, target, party) => {
    //Will do the equivalent of a guaranteed critical hit, maybe with armor piercing effect
    console.log(`${attacker.name} identifies the enemy's weakness and lands a Critical Shot!`);
    //Enemy Damage Taken Calc, ignores 50% defense
    reducedTargDef = (target.pDef * .5);
    dmgCalc = Math.round((attacker.buffness / target.buffness) * attacker.atkPow * (200 / (200 + reducedTargDef)));
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
const useAmbush = async (dmgCalc, attacker, target, party) => {
    //This skill will work similarly to the move Beat Up in Pokemon, allowing each member to hit the target during the hunter's turn
    console.log(`${attacker.name} baits the target in as their party waits to ambush...`);
    await waitFor(.75);
    console.log(`${target.name} takes the bait and the party attacks!!`)
    //Enemy damage taken
    if (Array.isArray(party)) {
        //Loops through party Array to let each member attack
        for (i = 0; i < party.length; i++) {
            await party[i].attack(target);
        };
    } else {
        await attacker.attack(target);
    };
    await waitFor(.3);
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
const useHolyWater = async (dmgCalc, attacker, target, party) => {
    //currentHealth damage ability and attack debuff
    console.log(`${attacker.name} throws Holy Water on the enemy and weakens them!`)
    //Enemy Damage
    const dmgValue = Math.round((dmgCalc * .4) + (target.currentHealth * .15));
    target.currentHealth -= dmgValue;
    if (target.currentHealth <= 0) target.currentHealth = 0;
    await waitFor(.75);
    console.log(`${target.name} took ${dmgValue} damage and has ${target.currentHealth}/${target.maxHealth} health left...`);
    //Enemy Attack Debuff
    target.atkPow -= Math.round(target.atkPow * .2);
    await waitFor(.75);
    console.log(`${target.name}\'s attack power has dropped to ${target.atkPow}!`);
}
const useDivineIntervention = async (dmgCalc, attacker, target, party) => {
    //Random outcome type ability, will use random role to generate action
    console.log(`${attacker.name} prays for Divine Intervention`);
    //Generates a random outcome: Big Damage Attack, Full Recovery for party, or Large Buff and Heal for the Priest
    const prayerAnswer = generateRandInt(1, 3);
    await waitFor(.75)
    console.log(`${attacker.name}\'s prayer has been answered!`)
    switch (prayerAnswer) {
        //Damaging Attack
        case 1:
            dmgCalc = Math.round((attacker.buffness / target.buffness) * attacker.atkPow);
            dmgValue = Math.round(dmgCalc * 2.5);
            target.currentHealth -= dmgValue;
            await waitFor(.75);
            console.log(`A intense beam of light descends from the sky, dealing ${dmgValue} damage to the target!`)
            if (target.currentHealth <= 0) target.currentHealth = 0;
            await waitFor(.75);
            console.log(`${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`)
            break;
        //Party Recover
        case 2:
            await waitFor(.75)
            console.log(`A divine rain shower washes over the party, healing away the wear of the battle!`)
            if (Array.isArray(party)) {
                for (i = 0; i < party.length; i++) {
                    party[i].currentHealth = party[i].maxHealth;
                    party[i].currentSP = party[i].maxSP;
                    await waitFor(.6);
                    console.log(`${party[i].name} has ${party[i].currentHealth}/${party[i].maxHealth} health left...`)
                    console.log(`${party[i].name} has ${party[i].currentSP}/${party[i].maxSP} health left...`)
                };
            } else {
                attacker.currentHealth = attacker.maxHealth;
                await waitFor(.6);
                console.log(`${attacker.name} has ${attacker.currentHealth}/${attacker.maxHealth} health left...`);
            }
            break;
        //Priest Power-up
        case 3:
            await waitFor(.75)
            console.log(`A divine wind envelopes ${attacker.name}, healing their wounds and empowering offensive ability!`);
            attacker.currentHealth = attacker.maxHealth;
            await waitFor(.6);
            console.log(`${attacker.name} has ${attacker.currentHealth}/${attacker.maxHealth} health left...`);
            attacker.atkPow *= 2.25;
            attacker.atkPow = Math.round(attacker.atkPow);
            await waitFor(.6);
            console.log(`${attacker.name} attack increased to ${attacker.atkPow}!`)
            break;

    }
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
const useAdrenalineRush = async (dmgCalc, attacker, target, party) => {
    //Powers up based on missing health, then attacks with that increased attack power
    console.log(`${attacker.name} is fighting for survival and gets an Adrenaline rush!`);
    const missingHealthRatio = (attacker.maxHealth - attacker.currentHealth) / attacker.maxHealth;
    //Self attack buff, increasing strength of buff with lower health, max is ~50% scaling down to 16%, use
    attacker.atkPow += Math.round(attacker.atkPow / (3 / (1.5 - missingHealthRatio)));
    await waitFor(.75);
    console.log(`${attacker.name}\'s attack power has increased to ${attacker.atkPow}!`);
    //recalculate damage with new attack value
    dmgCalc = Math.round((attacker.buffness / target.buffness) * attacker.atkPow * (200 / (200 + target.pDef)));
    //Enemy Damage Taken Calc, increases damage based on own accumulated damage
    const dmgValue = Math.round(dmgCalc * (.75 + missingHealthRatio));
    target.currentHealth -= dmgValue;
    if (target.currentHealth <= 0) target.currentHealth = 0;
    await waitFor(.75);
    console.log(`${target.name} took ${dmgValue} damage and has ${target.currentHealth}/${target.maxHealth} health left...`);
}
const useThroatChomp = async (dmgCalc, attacker, target, party) => {
    console.log(`${attacker.name} goes in for the kill, Chomping at their target's Throat!`);
    //Enemy Damage Taken Calc, Execution Style Ability, execute guaranteed at 30% health, but deals massively reduced dmg vs High health targets
    missingHealth = target.maxHealth - target.currentHealth
    const dmgValue = Math.round((dmgCalc * 0.1) + (missingHealth * .42));
    target.currentHealth -= dmgValue;
    if (target.currentHealth <= 0) target.currentHealth = 0;
    await waitFor(.75);
    console.log(`${target.name} took ${dmgValue} damage and has ${target.currentHealth}/${target.maxHealth} health left...`)
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
const useSyphonMana = async (dmgCalc, attacker, target, party) => {
    //Non damaging skill. Heal party and Buff their attack
    console.log(`${attacker.name} Syphons Mana from the environment to empower their allies, healing their allies and increasing their strength!`);
    dmgCalc = Math.round(attacker.atkPow);
    //Ally Attack Buff
    await waitFor(.75);
    if (Array.isArray(party)) {
        party.forEach(member => {
            member.atkPow += Math.round(member.atkPow * .25);
            console.log(`${member.name}\'s attack has increase to ${member.atkPow}!`)
        });
    } else {
        attacker.atkPow += Math.round(attacker.atkPow * .25);
        console.log(`${attacker.name}\'s attack has increased to ${attacker.atkPow}!`)
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
const useEnergyConversion = async (dmgCalc, attacker, target, party) => {
    //Attack will convert a small portion of damage to skill point resource
    console.log(`${attacker.name} channels the power of element and emits a blast of Energy!`);
    //Magic damage will ignore opponents physical defense calculation
    dmgCalc = Math.round((attacker.buffness / target.buffness) * attacker.atkPow);
    //Enemy Damage Taken Calc
    const dmgValue = Math.round(dmgCalc * 1.05);
    target.currentHealth -= dmgValue;
    if (target.currentHealth <= 0) target.currentHealth = 0;
    await waitFor(0.75);
    console.log(`${target.name} takes ${dmgValue} and has ${target.currentHealth}/${target.maxHealth} health left...`);
    //SP conversion amount, small element of randomness
    const gainedSP = Math.round(generateRandInt(0, 2) + 1 + (dmgValue / attacker.atkPow));
    attacker.currentSP += gainedSP;
    await waitFor(.5);
    console.log(`${attacker.name} retains some of the gathered Energy and Converts it to SP!`)
    await waitFor(.5)
    console.log(`${attacker.name} recovers ${gainedSP} SP...`);
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
const useWither = async (dmgCalc, attacker, target, party) => {
    //Does damage based on target's current health, stronger vs healthier target, also attack debuff
    console.log(`${attacker.name} channels evil energy on their target, causing their strength to Wither away!`);
    //Enemy Damage Taken Calc, stronger vs healthier target
    const currentHealthRatio = (target.currentHealth / target.maxHealth);
    // In the dmgValue: 1.3333 - currentHealthRatio makes this do Triple dmg vs full health target scaling down to ~75%
    const dmgValue = Math.round(dmgCalc / (1.3333 - currentHealthRatio));
    target.currentHealth -= dmgValue;
    if (target.currentHealth <= 0) target.currentHealth = 0;
    await waitFor(.75);
    console.log(`${target.name} took ${dmgValue} damage and has ${target.currentHealth}/${target.maxHealth} health left...`);
    //Debuff attack calc, more powerful if target is healthier as well, this debuff starts at 33% and decreases exponentially
    target.atkPow -= Math.round(target.atkPow / 3 * Math.pow(currentHealthRatio, 3));
    console.log(`${target.name}\'s attack power has dropped to ${target.atkPow}!`);
}
const useEssenceDrain = async (dmgCalc, attacker, target, party) => {
    //Non-damaging ability, steals stats
    console.log(`${attacker.name} uses forbidden magic and Drains the Essence of their target, stealing their strength!`);
    //Steal Attack
    const stolenAtk = Math.round(target.atkPow * .15);
    target.atkPow -= stolenAtk;
    await waitFor(.5);
    console.log(`${target.name} had ${stolenAtk} attack stolen!`);
    await waitFor(.5);
    console.log(`${target.name}\'s attack power has dropped to ${target.atkPow}!`);
    attacker.atkPow += stolenAtk;
    await waitFor(.5);
    console.log(`${attacker.name}\'s attack power has increased to ${attacker.atkPow}!`);
    //Steal Defense
    const stolenDef = Math.round(target.pDef * .15);
    target.pDef -= stolenDef;
    await waitFor(.5);
    console.log(`${target.name} had ${stolenDef} defense stolen!`);
    await waitFor(.5);
    console.log(`${target.name}\'s defense has dropped to ${target.pDef}!`);
    attacker.pDef += stolenDef;
    await waitFor(.5);
    console.log(`${attacker.name}\'s defense has increased to ${attacker.pDef}!`);
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
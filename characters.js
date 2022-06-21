const{
    generateRandInt,
    readStats
  } = require('./util.js')
//Create Original Character constructor function
function Character(name, role, health, atkPow, pDef, buffness) {
    this.name = name;
    this.role = roleMap.get(role);
    this.maxHealth = health + this.role.health;
    this.currentHealth = health + this.role.health;
    this.atkPow = atkPow + this.role.atkPow;
    this.pDef = pDef + this.role.pDef;
    this.skillCost = this.role.skillCost;
    this.buffness = buffness;
    this.checkHealth = () => {
        console.log(`${this.name} has ${this.currentHealth}/${this.maxHealth} health remaining...`);
    };
    this.getStats = () => {
        const statList = [this.name, this.role.name, this.maxHealth, this.atkPow, this.pDef, this.buffness, this.skillCost];
        return statList;
    };
    this.increaseLvl = () => {
        console.log(`${this.name}\'s strength has grown!`)
        this.maxHealth += this.role.health;
        this.currentHealth += this.role.health;
        this.atkPow += this.role.atkPow;
        this.pDef += this.role.pDef;
        this.buffness += Math.round(this.buffness * .15);
        readStats(this);
    }
};
//Constructor for the character while in combat
function Fighter(name, role, health, atkPow, pDef, buffness, skillCost) {
    this.name = name;
    this.role = role;
    this.maxHealth = health;
    this.currentHealth = health;
    this.atkPow = atkPow;
    this.pDef = pDef;
    this.buffness = buffness;
    this.skillCost = skillCost;
    this.maxSP = 12;
    this.currentSP = this.maxSP;
    this.action = '';
    this.attack = (target) => {
        let dmgValue = Math.round((this.buffness / target.buffness) * (this.atkPow - target.pDef));
        if (dmgValue > 1) {
            target.currentHealth -= dmgValue;
        } else target.currentHealth -= 1;
        if (target.currentHealth <= 0) {
            target.currentHealth = 0;
        }
        console.log(`${this.name} attacked ${target.name}! ${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`);
    }
    this.recover = () => {
        if (this.currentHealth < this.maxHealth) {
            this.currentHealth += Math.round(this.currentHealth * 0.1);
            if (this.currentHealth > this.maxHealth) this.currentHealth = this.maxHealth;
            console.log(`${this.name} has rests and regains stamina. ${this.name} now has ${this.currentHealth}/${this.maxHealth} health...`);
        };
        if (this.currentSP < this.maxSP) {
            this.currentSP += this.skillCost
            if (this.currentSP > this.maxSP) this.currentSP = this.maxSP;
            console.log(`${this.name} has recovered some energy and now has ${this.currentSP}/${this.maxSP} skill points...`)
        };
    }
    this.roleSkill = (target, party) => {
        console.log(`${this.name} has prepared something special...`);
        specialSkill(this, target, party);
        console.log(`${this.name} has ${this.currentSP}/${this.maxSP} skill points remaining...`);
    }
    this.getStats = () => {
        const statList = [this.name, this.role, this.maxHealth, this.atkPow, this.pDef, this.buffness, this.skillCost];
        return statList;
    }
}
//Constructor for Base CharacterClasses
function Role(name, health, atkPow, pDef, skillCost) {
    this.name = name;
    this.health = health;
    this.atkPow = atkPow;
    this.pDef = pDef;
    this.skillCost = skillCost;
}
/** Create function for class specific ability 
 * Argument 1 is the attacker Character object,
 * Argument 2 is the target Character object,
 * Argument 3 is the party Array of the attacker's friendly Character objects.
 */
function specialSkill(attacker, target, party) {
    attacker.currentSP -= attacker.skillCost;
    let dmgCalc = Math.round((attacker.buffness / target.buffness) * (attacker.atkPow - target.pDef));
    switch (attacker.role) {
        case 'Wizard':
            //Wizard skill will ignore opponents physical defense
            console.log(`${attacker.name} gathers a huge Fireball and hurls it at the enemy!`);
            dmgCalc = Math.round((attacker.buffness / target.buffness) * attacker.atkPow);
            //Enemy Damage Taken Calc
            target.currentHealth -= Math.round(dmgCalc * 1.2);
            if (target.currentHealth <= 0) target.currentHealth = 0;
            console.log(`${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`);
            break;
        case 'Warrior':
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
            break;
        case 'Assassin':
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
            break;
        case 'Marksman':
            //Will do the equivalent of a guaranteed critical hit, maybe with armor piercing effect
            console.log(`${attacker.name} identifies the enemy's weakness and lands a Critical Shot!`);
            //Enemy Damage Taken Calc
            target.currentHealth -= Math.round(dmgCalc * 1.3);
            if (target.currentHealth <= 0) target.currentHealth = 0;
            console.log(`${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`)
            break;
        case 'Priest':
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
            })
                ;
            break;
        case 'Beast':
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
            break;
        case 'Testing':
            //The test dummy bonks you hard as hell
            target.currentHealth -= attacker.atkPow;
            if (target.currentHealth <= 0) target.currentHealth = 0;
            console.log(`${target.name} got bonked hard as hell! ${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`);
            break;
        case 'Elemental':
            console.log(`${attacker.name} invokes the Power of Nature, overwhelming their targets defense`);
            dmgCalc = Math.round((attacker.buffness / target.buffness) * (attacker.atkPow - (target.pDef * .25)))
            //Enemy Damage Taken Calc
            target.currentHealth -= Math.round(dmgCalc * 1.15);
            if (target.currentHealth <= 0) target.currentHealth = 0;
            console.log(`${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`);
            break;
        case 'Undead':
            //Attacks and Debuffs the target's defense stat, mulitplicatively for now
            console.log(`${attacker.name} is enveloped by Cursed Energy, damaging and weakening its target's resolve!`);
            //Debuff defense calc and announcements
            target.pDef -= Math.round(target.pDef * .15);
            console.log(`${target.name}\'s defense has dropped to ${target.pDef}!`);
            //Enemy Damage Taken Calc
            target.currentHealth -= Math.round(dmgCalc * .85);
            if (target.currentHealth <= 0) target.currentHealth = 0;
            console.log(`${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`);
            break;
    }
}
//Create base class related stats, also used as per level stats
const wizard = new Role('Wizard', 25, 100, 5, 4);
const warrior = new Role('Warrior', 150, 45, 30, 3);
const assassin = new Role('Assassin', 75, 50, 20, 6);
const marksman = new Role('Marksman', 50, 65, 10, 4);
const priest = new Role('Priest', 150, 40, 15, 4);
const testing = new Role('Testing', 0, 0, 0, 4);
const beast = new Role('Beast', 100, 60, 25, 4);
const elemental = new Role('Elemental', 50, 85, 15, 4);
const undead = new Role('Undead', 200, 50, 35, 4);
//Set Up Role Map and bind string name to role object
const roleMap = new Map();
roleMap.set('Wizard', wizard);
roleMap.set('Warrior', warrior);
roleMap.set('Assassin', assassin);
roleMap.set('Marksman', marksman);
roleMap.set('Priest', priest);
roleMap.set('Testing', testing);
roleMap.set('Beast', beast);
roleMap.set('Elemental', elemental);
roleMap.set('Undead', undead);
module.exports = {
    Character,
    Fighter,
    Role,
    specialSkill
}
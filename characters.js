const {
    generateRandInt,
    readStats,
    waitFor
} = require('./util.js');
const { skillsMap, classSkillMap } = require('./skills.js');
//Create Original Character constructor function
function Character(name, role, health, atkPow, pDef, buffness) {
    this.name = name;
    this.role = roleMap.get(role);
    this.maxHealth = health + this.role.health;
    this.currentHealth = health + this.role.health;
    this.atkPow = atkPow + this.role.atkPow;
    this.pDef = pDef + this.role.pDef;
    this.learnedSkills = [];
    this.buffness = buffness;
    this.checkHealth = () => {
        console.log(`${this.name} has ${this.currentHealth}/${this.maxHealth} health remaining...`);
    };
    this.getStats = () => {
        const statList = [this.name, this.role.name, this.maxHealth, this.atkPow, this.pDef, this.buffness, this.learnedSkills];
        return statList;
    };
    this.increaseLvl = async () => {
        console.log(`${this.name}\'s strength has grown!`)
        this.maxHealth += this.role.health;
        this.currentHealth += this.role.health;
        this.atkPow += this.role.atkPow;
        this.pDef += this.role.pDef;
        this.buffness += Math.round(this.buffness * .15);
        await waitFor(.5);
        readStats(this);
        if (this.role.skills.length > 0) {
            await waitFor(.75);
            const learnedSkill = this.role.skills.shift()
            this.learnedSkills.push(learnedSkill);
            console.log(`${this.name} learned a new skill: ${learnedSkill.name}!`);
        }
        await waitFor(1);
    }
};
//Constructor for the character while in combat
function Fighter(name, role, health, atkPow, pDef, buffness, learnedSkills) {
    this.name = name;
    this.role = role;
    this.maxHealth = health;
    this.currentHealth = health;
    this.atkPow = atkPow;
    this.pDef = pDef;
    this.buffness = buffness;
    this.learnedSkills = learnedSkills;
    this.maxSP = 12;
    this.currentSP = this.maxSP;
    this.action = '';
    this.attack = async(target) => {
        let dmgValue = Math.round((this.buffness / target.buffness) * this.atkPow * (200/(200+ target.pDef)));
        if (dmgValue > 1) target.currentHealth -= dmgValue
        else target.currentHealth -= 1;
        if (target.currentHealth <= 0) target.currentHealth = 0;
        console.log(`${this.name} attacked ${target.name} dealing ${dmgValue} damage!`);
        await waitFor(.75);
        console.log(`${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`)
    }
    this.recover = async() => {
        if (this.currentHealth < this.maxHealth) {
            this.currentHealth += Math.round(this.currentHealth * 0.15);
            if (this.currentHealth > this.maxHealth) this.currentHealth = this.maxHealth;
            await waitFor(.5);
            console.log(`${this.name} has rests and regains stamina. ${this.name} now has ${this.currentHealth}/${this.maxHealth} health...`);
        };
        if (this.currentSP < this.maxSP) {
            const learnedSkillCosts = this.learnedSkills.map(skill => skill.skillCost)
            this.currentSP += Math.max(...learnedSkillCosts);
            if (this.currentSP > this.maxSP) this.currentSP = this.maxSP;
            await waitFor(.5);
            console.log(`${this.name} has recovered some energy and now has ${this.currentSP}/${this.maxSP} skill points...`)
        };
    }
    this.roleSkill = async (target, party) => {
        console.log(`${this.name} has prepared something special...`);
        await waitFor(.75);
        await specialSkill(this, target, party);
        await waitFor(.75);
        console.log(`${this.name} has ${this.currentSP}/${this.maxSP} skill points remaining...`);
        await waitFor(.75);
    }
    this.getStats = () => {
        const statList = [this.name, this.role, this.maxHealth, this.atkPow, this.pDef, this.buffness, this.learnedSkills];
        return statList;
    }
}
//Constructor for Base CharacterClasses
function Role(name, health, atkPow, pDef) {
    this.name = name;
    this.health = health;
    this.atkPow = atkPow;
    this.pDef = pDef;
    this.skills = classSkillMap.get(name);
}
/** Create function for class specific ability 
 * Argument 1 is the attacker Character object,
 * Argument 2 is the target Character object,
 * Argument 3 is the party Array of the attacker's friendly Character objects.
 */
async function specialSkill(attacker, target, party) {
    let dmgCalc = Math.round((attacker.buffness / target.buffness) * attacker.atkPow * (200/(200 + target.pDef)));//physical dmgReduction
    const chosenSkill = skillsMap.get(attacker.action);
    await chosenSkill.use(dmgCalc, attacker, target, party);
    attacker.currentSP -= chosenSkill.skillCost;
}
//Create base class related stats, also used as per level stats (name,health,atk,def)
const wizard = new Role('Wizard', 25, 100, 5);
const warrior = new Role('Warrior', 150, 45, 30);
const assassin = new Role('Assassin', 75, 50, 20);
const marksman = new Role('Marksman', 50, 65, 10);
const priest = new Role('Priest', 150, 40, 15);
const testing = new Role('Testing', 0, 0, 0);
const beast = new Role('Beast', 100, 60, 25);
const elemental = new Role('Elemental', 50, 85, 15);
const undead = new Role('Undead', 200, 50, 35);
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
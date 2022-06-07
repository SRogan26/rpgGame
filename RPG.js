//Using Inquirer package for command line user interface
const inquirer = require('inquirer');
//Create Original Character constructor function
function Character(name, role, health, atkPow, pDef, buffness) {
  this.name = name;
  this.role = role;
  switch (role) {
    case 'Wizard':
      this.maxHealth = health + wizard.health;
      this.currentHealth = health + wizard.health;
      this.atkPow = atkPow + wizard.atkPow;
      this.pDef = pDef + wizard.pDef;
      break;
    case 'Warrior':
      this.maxHealth = health + warrior.health;
      this.currentHealth = health + warrior.health;
      this.atkPow = atkPow + warrior.atkPow;
      this.pDef = pDef + warrior.pDef;
      break;
    case 'Assassin':
      this.maxHealth = health + assassin.health;
      this.currentHealth = health + assassin.health;
      this.atkPow = atkPow + assassin.atkPow;
      this.pDef = pDef + assassin.pDef;
      break;
    case 'Marksman':
      this.maxHealth = health + marksman.health;
      this.currentHealth = health + marksman.health;
      this.atkPow = atkPow + marksman.atkPow;
      this.pDef = pDef + marksman.pDef;
      break;
    case 'Priest':
      this.maxHealth = health + priest.health;
      this.currentHealth = health + priest.health;
      this.atkPow = atkPow + priest.atkPow;
      this.pDef = pDef + priest.pDef;
      break;
    case 'Beast':
      this.maxHealth = health;
      this.currentHealth = health;
      this.atkPow = atkPow;
      this.pDef = pDef;
      break;
  }
  this.buffness = buffness;
  this.attack = (target) => {
    target.currentHealth -= Math.floor((this.buffness / target.buffness) * (this.atkPow - target.pDef));
    if (target.currentHealth <= 0) {
      target.currentHealth = 0;
    }
    console.log(`${this.name} attacked ${target.name}! ${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`);
  }
  this.checkHealth = () => {
    console.log(`${this.name} has ${this.currentHealth}/${this.maxHealth} health remaining...`)
  }
  this.roleSkill = (target) => {
    console.log('Oh Word?!')
    specialSkill(this.role);
  }
  this.getStats = () => {
    const statList = [this.name, this.role, this.maxHealth, this.atkPow, this.pDef, this.buffness];
    return statList;
  }
}
//Constructor for the character while in combat
function Fighter(name, role, health, atkPow, pDef, buffness) {
  this.name = name;
  this.role = role;
  this.maxHealth = health;
  this.currentHealth = health;
  this.atkPow = atkPow;
  this.pDef = pDef;
  this.buffness = buffness;
  this.attack = (target) => {
    target.currentHealth -= Math.floor((this.buffness / target.buffness) * (this.atkPow - target.pDef));
    if (target.currentHealth <= 0) {
      target.currentHealth = 0;
    }
    console.log(`${this.name} attacked ${target.name}! ${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`);
  }
  this.checkHealth = () => {
    console.log(`${this.name} has ${this.currentHealth}/${this.maxHealth} health remaining...`)
  }
  this.roleSkill = (target) => {
    console.log('Oh Word?!')
    specialSkill(this.role);
  }
  this.getStats = () => {
    const statList = [this.name, this.role, this.maxHealth, this.atkPow, this.pDef, this.buffness];
    return statList;
  }
}
//Constructor for Base CharacterClasses
function Role(name, health, atkPow, pDef) {
  this.name = name;
  this.health = health;
  this.atkPow = atkPow;
  this.pDef = pDef;
}
//Create function for class specific ability 
function specialSkill(role) {
  switch (role) {
    case 'Wizard':
      console.log('You used a Wizard skill');
      break;
    case 'Warrior':
      console.log('You used a Warrior skill');
      break;
    case 'Assassin':
      console.log('You used a Assassin skill');
      break;
    case 'Marksman':
      console.log('You used a Marksman skill');
      break;
    case 'Priest':
      console.log('You used a Priest skill');
      break;
    case 'Beast':
      console.log('You used a Beast skill');
      break;
  }
}
//Create base class related stats
const wizard = new Role('Wizard', 10, 20, -10)
const warrior = new Role('Warrior', 40, 10, 10)
const assassin = new Role('Assassin', 20, 25, 5)
const marksman = new Role('Marksman', 10, 35, -10)
const priest = new Role('Priest', 40, -5, 5)
//Create first enemies
const bigRat = new Character('Big Rat', 'Beast', 150, 40, 15, 20);
const blackBear = new Character('Black Bear', 'Beast', 150, 40, 15, 20);
const hungryWolf = new Character('Hungry Wolf', 'Beast', 150, 40, 15, 20);
//main function to run game
const main = async () => {
  greeting();
  const answers = await initialPrompt();
  const charName = answers.name;
  const charRole = answers.role;
  welcomeChar(charName, charRole);
  const isRolling = await isRollingStats();
  if (!isRolling) {
    console.log('You\'re gonna need stats...');
  }
  const charStats = rollStats();
  const mainCharacter = new Character(charName, charRole, charStats.health, charStats.atkPow, charStats.pDef, charStats.buffness);
  console.log(`Your Stats Are:  ${mainCharacter.maxHealth} health, ${mainCharacter.atkPow} attack, ${mainCharacter.pDef} defense, ${mainCharacter.buffness} buffness`);
  const firstPath = await firstChoice();
  const pathOne = firstPath.route;
  const firstFight = firstEncounter(pathOne);
  const firstResult = await firstBattle(mainCharacter, firstFight);
  if (firstResult.player.currentHealth <= 0) console.log('You Died....');
  else console.log(`The enemy has ${firstResult.enemy.currentHealth} health remaining! You\'ve slain the beast!`);
}
//Initial grreting function on game start
const greeting = () => {
  console.log('Welcome to RPG Game');
}
//function for initial prompt for name and class
const initialPrompt = async () => {
  const answers = await inquirer
    .prompt([
      {
        name: 'name',
        message: 'What is your name?'
      },
      {
        name: 'role',
        type: 'list',
        message: 'What class is your character',
        choices: ['Wizard', 'Warrior', 'Assassin', 'Marksman', 'Priest']
      }
    ]);
  return answers;
}
//Function for responding to initial user input
const welcomeChar = (charName, charRole) => {
  console.log(`------------------------------------------------------------------------------
Hello, ${charName} the ${charRole.toLowerCase()}. 
------------------------------------------------------------------------------`);
}
//Function to determine whether user wants to roll their stat value
const isRollingStats = async () => {
  const isRolling = await inquirer.prompt([
    {
      name: 'isRollingStats',
      message: 'Do you want to roll your stats?',
      type: 'list',
      choices: ['yes', 'no']
    }
  ]);
  //? is a ternary operator that works similar to an if statement (ex ? true : false)
  return isRolling.isRollingStats === 'yes';
}
//Create Utility to generate random integer value using a minimum and maximum possible value as arguments
const generateRandInt = (baseInt, maxInt) => {
  if (maxInt > baseInt && typeof maxInt === 'number' && typeof baseInt === 'number') {
    const value = baseInt + Math.floor(Math.random() * (maxInt - baseInt + 1));
    return value;
  } else {
    throw 'In generateRandInt, maxInt has to be larger than baseInt and they both have to be numbers';
  }
}
//function for actually rolling random stats
const rollStats = () => {
  const charStats = new Object();
  //Health between 100 and 200, 100 < Math.random < 200
  charStats.health = generateRandInt(100, 200);
  charStats.atkPow = generateRandInt(30, 65);
  charStats.pDef = generateRandInt(10, 25);
  charStats.buffness = generateRandInt(15, 25);
  return charStats;
}
//Prompt for first choice after character creation
const firstChoice = async () => {
  const firstPath = await inquirer
    .prompt([
      {
        name: 'route',
        type: 'list',
        message: 'Which path will you follow?',
        choices: ['Sewer', 'Cave', 'Forest']
      }
    ]);
  return firstPath;
}
//function to determine first encounter
const firstEncounter = (path) => {
  let firstFight
  switch(path){
    case 'Sewer':
    console.log('You Encounter a Big Rat!');
    firstFight = bigRat;
    break;
  case 'Cave':
    console.log('You encounter a Black Bear!');
    firstFight = blackBear;
    break;
  case 'Forest':
    console.log('You encounter a Hungry Wolf!')
    firstFight = hungryWolf;
    break;
  }
  return firstFight;
}
/**Function that handles the battle prompts for the first encounter
 * First Argument is the player character object
 * Second Argument is the enemy character object
*/
const firstBattle = async (player, enemy) => {
  //Clone both the character and enemy so as not to overwrite their original records
  const pStat = player.getStats();
  const eStat = enemy.getStats();
  const combatPlayer = new Fighter(...pStat);
  const combatEnemy = new Fighter(...eStat);
  //Use While loop to continuously run through the battle while both player and enemy still have health
  while (combatPlayer.currentHealth > 0 && combatEnemy.currentHealth > 0) {
    const turn = await inCombatMenu();
    switch(turn.action){
      case 'Check Health':
      combatPlayer.checkHealth();
      break;
    case 'Attack':
      combatPlayer.attack(combatEnemy);
      combatEnemy.attack(combatPlayer);
      break;
    case 'Skill':
      combatPlayer.roleSkill(combatEnemy);
      combatEnemy.roleSkill(combatPlayer);
      break;
    }
  };
  let battleResult = { 'player': combatPlayer, 'enemy': combatEnemy };
  return battleResult;
}
//The function for the actual battle prompts
const inCombatMenu = async () => {
  const turn = await inquirer
    .prompt([
      {
        name: 'action',
        type: 'list',
        message: 'What will you do?',
        choices: ['Attack', 'Skill', 'Check Health']
      }
    ]);
  return turn;
}
//Call the game function
main();

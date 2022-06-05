//Using Inquirer package for command line user interface
const inquirer = require('inquirer');
//Create Character constructor function
function Character(name, role, health, atkPow, pDef, buffness) {
  this.name = name;
  this.role = role;
  if (role === 'Wizard') {
    this.maxHealth = health + wizard.health;
    this.currentHealth = health + wizard.health;
    this.atkPow = atkPow + wizard.atkPow;
    this.pDef = pDef + wizard.pDef;
  } else if (role === 'Warrior') {
    this.maxHealth = health + warrior.health;
    this.currentHealth = health + warrior.health;
    this.atkPow = atkPow + warrior.atkPow;
    this.pDef = pDef + warrior.pDef;
  } else if (role === 'Assassin') {
    this.maxHealth = health + assassin.health;
    this.currentHealth = health + assassin.health;
    this.atkPow = atkPow + assassin.atkPow;
    this.pDef = pDef + assassin.pDef;
  } else if (role === 'Marksman') {
    this.maxHealth = health + marksman.health;
    this.currentHealth = health + marksman.health;
    this.atkPow = atkPow + marksman.atkPow;
    this.pDef = pDef + marksman.pDef;
  } else if (role === 'Priest') {
    this.maxHealth = health + priest.health;
    this.currentHealth = health + priest.health;
    this.atkPow = atkPow + priest.atkPow;
    this.pDef = pDef + priest.pDef;
  } else if (role === 'Beast') {
    this.maxHealth = health;
    this.currentHealth = health;
    this.atkPow = atkPow;
    this.pDef = pDef;
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
//Constructor for Base CharacterClasses
function Role(name, health, atkPow, pDef) {
  this.name = name;
  this.health = health;
  this.atkPow = atkPow;
  this.pDef = pDef;
}
//Create function for class specific ability 
function specialSkill(role) {
  if (role === 'Wizard') {
    console.log('You used a Wizard skill')
  } else if (role === 'Warrior') {
    console.log('You used a Warrior skill')
  } else if (role === 'Assassin') {
    console.log('You used a Assassin skill')
  } else if (role === 'Marksman') {
    console.log('You used a Marksman skill')
  } else if (role === 'Priest') {
    console.log('You used a Priest skill')
  } else if (role === 'Beast') {
    console.log('You used a Beast skill')
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
  const mainStats = mainCharacter.getStats();
  console.log(mainStats);
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
//function for actually rolling random stats
const rollStats = () => {
  //Health between 100 and 200, 100 < Math.random < 200
  const health = 100 + Math.floor(Math.random() * 100);
  console.log(`Your health is ${health}`);
  const atkPow = 30 + Math.floor(Math.random() * 35);
  console.log(`Your attack is ${atkPow}`);
  const pDef = 10 + Math.floor(Math.random() * 15);
  console.log(`Your defense is ${pDef}`);
  const buffness = 15 + Math.floor(Math.random() * 10);
  console.log(`Your buffness is ${buffness}`);
  const charStats = {
    'health': health,
    'atkPow': atkPow,
    'pDef': pDef,
    'buffness': buffness
  }
  return charStats
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
  if (path === 'Sewer') {
    console.log('You Encounter a Big Rat!');
    firstFight = bigRat;
  } else if (path === 'Cave') {
    console.log('You encounter a Black Bear!');
    firstFight = blackBear;
  } else if (path === 'Forest') {
    console.log('You encounter a Hungry Wolf!')
    firstFight = hungryWolf;
  }
  return firstFight;
}
//Function that handles the battle prompts for the first encounter
const firstBattle = async (player, enemy) => {
  //Clone both the character and enemy so as not to overwrite their original records
  const pStat = player.getStats();
  const eStat = enemy.getStats();
  const combatPlayer = new Character(pStat[0], pStat[1], pStat[2], pStat[3], pStat[4], pStat[5]);
  const combatEnemy = new Character(eStat[0], eStat[1], eStat[2], eStat[3], eStat[4], eStat[5]);
  //Use While loop to continuously run through the battle while both player and enemy still have health
  while (combatPlayer.currentHealth > 0 && combatEnemy.currentHealth > 0) {
    const turn = await inCombatMenu();
    console.log(turn);
    if (turn.action === 'Check Health') {
      combatPlayer.checkHealth();
    } else if (turn.action === 'Attack') {
      combatPlayer.attack(combatEnemy);
      combatEnemy.attack(combatPlayer);
    } else if (turn.action === 'Skill') {
      combatPlayer.roleSkill(combatEnemy);
      combatEnemy.roleSkill(combatPlayer);
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

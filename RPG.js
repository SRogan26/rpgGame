//Using Inquirer package for command line user interface
const inquirer = require('inquirer');
//Create Character constructor function
function Character(name, role, health, atkPow, pDef, buffness) {
  this.name = name;
  this.role = role;
  if(role === 'Wizard'){
    this.health =  health + wizard.health;
    this.atkPow =  atkPow + wizard.atkPow;
    this.pDef = pDef + wizard.pDef;
  }else if(role === 'Warrior'){
    this.health =  health + warrior.health;
    this.atkPow =  atkPow + warrior.atkPow;
    this.pDef = pDef + warrior.pDef;
  }else if(role === 'Assassin'){
    this.health =  health + assassin.health;
    this.atkPow =  atkPow + assassin.atkPow;
    this.pDef = pDef + assassin.pDef;
  }else if(role === 'Marksman'){
    this.health =  health + marksman.health;
    this.atkPow =  atkPow + marksman.atkPow;
    this.pDef = pDef + marksman.pDef;
  }else if(role === 'Priest'){
    this.health =  health + priest.health;
    this.atkPow =  atkPow + priest.atkPow;
    this.pDef = pDef + priest.pDef;
  }
  this.buffness = buffness;
  this.attack = (target) => {
    target.health -= (this.buffness / target.buffness) * (this.atkPow - target.pDef);
    console.log(`${this.name} attacked ${target.name}! ${target.name} has ${target.health} left`);
  }
  this.checkHealth = () => {
    console.log(`${this.name} has ${this.health} health`)   
  }
  this.roleSkill = () =>{
    console.log('Oh Word?!')
    specialSkill(this.role);
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
const specialSkill = (role)=>{
  if(role === 'Wizard'){
    console.log('You used a Wizard skill')
  }else if(role === 'Warrior'){
    console.log('You used a Warrior skill')
  }else if(role === 'Assassin'){
    console.log('You used a Assassin skill')
  }else if(role === 'Marksman'){
    console.log('You used a Marksman skill')
  }else if(role === 'Priest'){
    console.log('You used a Priest skill')
  }
}
//Create base class related stats
const wizard = new Role('Wizard', 10, 20, -10)
const warrior = new Role('Warrior', 40, 10, 10)
const assassin = new Role('Assassin', 20, 25, 5)
const marksman = new Role('Marksman', 10, 35, -10)
const priest = new Role('Priest', 40, -5, 5)
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
  console.log(mainCharacter);
  // mainCharacter.roleSkill();
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
    ])
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
  const buffness = 10 + Math.floor(Math.random() * 20);
  console.log(`Your buffness is ${buffness}`);
  const charStats = {
    'health': health,
    'atkPow': atkPow,
    'pDef': pDef,
    'buffness': buffness
  }
  return charStats
}
//Call the game function
main();

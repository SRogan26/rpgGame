//Using Inquirer package for command line user interface
const inquirer = require('inquirer');
//Create Character constructor function
function Character(name, health, atkPow, pDef, buffness) {
  this.name = name;
  this.health = health + buffness;
  this.atkPow = atkPow + buffness;
  this.pDef = pDef;
  this.attack = (target) => {
    target.health -= (this.atkPow - target.pDef);
    console.log(`${this.name} attacked ${target.name}! ${target.name} has ${target.health} left`);
  }
  this.checkHealth = () => {
    console.log(`${this.name} has ${this.health} health`)
  }
}
//main function to run game
const main = async () => {
  greeting();
  const answers = await initialPrompt();
  const charName = answers.name;
  const charClass = answers.class;
  welcomeChar(charName, charClass);
  const isRolling = await isRollingStats();
  if (!isRolling) {
    console.log('You\'re gonna need stats...');
  }
  rollStats();

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
        name: 'class',
        type: 'list',
        message: 'What class is your character',
        choices: ['Wizard', 'Warrior', 'Assassin', 'Marksman', 'Priest']
      }
    ])
  return answers;
}
//Function for responding to initial user input
const welcomeChar = (charName, charClass) => {
  console.log(`------------------------------------------------------------------------------
Hello, ${charName} the ${charClass.toLowerCase()}. 
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
//function for actually rolling stats
const rollStats = () => {
  console.log('you rolled stats');
}
//Call the game function
main();

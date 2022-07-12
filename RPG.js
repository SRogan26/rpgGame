//Using Inquirer package for command line user interface
const inquirer = require('inquirer');
//import character js
const {
  Character,
  Fighter,
  specialSkill
} = require('./characters.js');
//import Util js
const {
  generateRandInt,
  readStats,
  waitFor
} = require('./util.js')
const {
  pathEnemyMap
} = require('./enemies.js');
const {
  partyBattle
} = require('./battle.js');
//Generate the set of conditional path choices Map object for the second path select
const choiceMap = new Map();
choiceMap.set('Sewer', ['Seaside', 'Tombs']);
choiceMap.set('Cave', ['Ghost Town', 'Tombs']);
choiceMap.set('Forest', ['Ghost Town', 'Seaside']);
choiceMap.set('Ghost Town', ['Volcanic', 'Secluded Mansion']);
choiceMap.set('Seaside', ['Mountainous', 'Secluded Mansion']);
choiceMap.set('Tombs', ['Mountainous', 'Volcanic']);
//Pre-generate an Array to store the characters in our party
const partyMembers = new Array();
//Function to Read out your current party members, Takes in your party members Array
const partyReadOut = (party) => {
  console.log('Your Party Members Are:')
  party.forEach(member => {
    console.log(`${member.name} the ${member.role.name}`);
  });
}
//main function to run game
const main = async () => {
  greeting();
  const answers = await initialPrompt();
  const charName = answers.name;
  const charRole = answers.role;
  welcomeChar(charName, charRole);
  const isRolling = await isRollingStats();
  if (!isRolling) console.log('You\'re gonna need stats...');
  await waitFor(1.25);
  const charStats = rollStats();
  const partyLeader = new Character(charName, charRole, charStats.health, charStats.atkPow, charStats.pDef, charStats.buffness);
  readStats(partyLeader);
  //Teach character first class skill and remove it from skills queue
  partyLeader.addStartingSkills(1);
  //console.log(mainCharacter.learnedSkills)
  partyMembers.push(partyLeader);
  const firstPath = await firstChoice();
  const pathOne = firstPath.route;
  const firstEnemy = await generateEncounter(pathOne);
  //Moves initial enemy skill to learned Array
  firstEnemy.addStartingSkills(1);
  //Handles initiating combat and determing victory, ends programs if you lose
  let isPartyLeaderDead = await inCombat(partyMembers, firstEnemy);
  if (isPartyLeaderDead) return;//Ends game if Dead
  await victoryLevelUp(partyMembers);
  recruitMember(partyMembers, firstEnemy);//Adds defeated enemy to party
  const secondPath = await conditionalPath(pathOne);
  const pathTwo = secondPath.route
  const secondEnemy = await generateEncounter(pathTwo);
  //Second Enemy learns its first two skills by default
  secondEnemy.addStartingSkills(2);
  isPartyLeaderDead = await inCombat(partyMembers, secondEnemy);
  if (isPartyLeaderDead) return;//Ends game if Dead
  await victoryLevelUp(partyMembers);
  recruitMember(partyMembers, secondEnemy);//Adds defeated enemy to party
  const thirdPath = await conditionalPath(pathTwo);
  const pathThree = thirdPath.route
  const thirdEnemy = await generateEncounter(pathThree);
  //Third Enemy learns three skills by default
  thirdEnemy.addStartingSkills(3);
  isPartyLeaderDead = await inCombat(partyMembers, thirdEnemy);
  if (isPartyLeaderDead) return;//Ends game if Dead
  await victoryLevelUp(partyMembers);
  recruitMember(partyMembers, thirdEnemy);//Adds defeated enemy to party
  console.log(partyMembers[0].learnedSkills);
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
        choices: ['Wizard', 'Warrior', 'Assassin', 'Hunter', 'Priest']
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
  const charStats = new Object();
  //Health between 100 and 200, 100 < Math.random < 200
  charStats.health = generateRandInt(1400, 1800);
  charStats.atkPow = generateRandInt(375, 500);
  charStats.pDef = generateRandInt(100, 200);
  charStats.buffness = generateRandInt(18, 22);
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
//Context text depending on previous path choice
const pathSelectText = (prevPath) => {
  switch (prevPath) {
    case 'Sewer':
      console.log('Left is the sea. Right is an open tomb.')
      break;
    case 'Cave':
      console.log('Left is a ghost town. Right is an open tomb.')
      break;
    case 'Forest':
      console.log('Left is the sea. Right is a ghost town.')
      break;
    case 'Ghost Town':
      console.log('Left is a Volcanic area. Right is a Secluded Mansion.')
      break;
    case 'Seaside':
      console.log('Left is a Mountainous area. Right is a Secluded Mansion.')
      break;
    case 'Tombs':
      console.log('Left is a Mountainous area. Right is a Volcanic area.')
      break;
  }
}
//Conditional Prompt based on First path selected
const conditionalPath = async (prevPath) => {
  pathSelectText(prevPath);
  const pathChoices = choiceMap.get(prevPath)
  const nextPath = await inquirer
    .prompt([
      {
        name: 'route',
        type: 'list',
        message: 'Which path will you follow?',
        choices: pathChoices
      }
    ]);
  return nextPath;
}
//function to determine first encounter
const generateEncounter = async (path) => {
  const pathEnemy = pathEnemyMap.get(path);
  await waitFor(.5);
  console.log(`You encountered ${pathEnemy.name}!`)
  await waitFor(1);
  return pathEnemy;
}
//function to initiate battle and check for Victory or defeat
const inCombat = async (partyMembers, firstEnemy) => {
  const battleResult = await partyBattle(partyMembers, firstEnemy);
  if (battleResult.party[0].currentHealth <= 0) {
    console.log('You Died....');
    return battleResult.party[0].currentHealth <= 0;
  } else {
    console.log(`The enemy has ${battleResult.enemy.currentHealth} health remaining! You\'ve subdued the ${battleResult.enemy.role}!`);

  }
}
//Party Levels up after winning
const victoryLevelUp = async(party)=>{
  for (i =0; i<party.length; i++)
  await party[i].increaseLvl();
}
//Adds Member to party when victorious in battle, Arg 1 is party Array Arg 2 is enemy character
const recruitMember = (partyMembers, enemy) => {
  partyMembers.push(enemy);//Adds the enemy to your party if victorious
  partyReadOut(partyMembers);
}
//Call the game function
// main();

//TEST PARTY FOR BATTLE AND TEST ENEMY
const testParty = new Array();
testParty.push(pathEnemyMap.get('Testing 1'));
testParty.push(pathEnemyMap.get('Cave'));
const testEnemy = pathEnemyMap.get('Testing 2');
//TEST BATTLE
const testBattle = async (testParty, testEnemy) => {
  testParty.forEach(member => {
    member.learnedSkills = member.role.skills
  });
  testEnemy.learnedSkills = testEnemy.role.skills;
  let isPartyLeaderDead = await inCombat(testParty, testEnemy);
  if (isPartyLeaderDead) return;//Ends game if Dead
  console.log(`${testParty[0].name} is victorious. Test battle over.`)
}
testBattle(testParty, testEnemy);

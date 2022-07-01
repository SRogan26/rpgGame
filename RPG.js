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
  if (!isRolling) {
    console.log('You\'re gonna need stats...');
  }
  const charStats = rollStats();
  const partyLeader = new Character(charName, charRole, charStats.health, charStats.atkPow, charStats.pDef, charStats.buffness);
  readStats(partyLeader);
  partyMembers.push(partyLeader);
  partyReadOut(partyMembers);
  const firstPath = await firstChoice();
  const pathOne = firstPath.route;
  const firstEnemy = generateEncounter(pathOne);
  //Handles initiating combat and determing victory, ends programs if you lose
  let isPartyLeaderDead = await inCombat(partyMembers, firstEnemy);
  if (isPartyLeaderDead) return;//Ends game if Dead
  partyMembers.forEach(member => member.increaseLvl());
  recruitMember(partyMembers, firstEnemy);//Adds defeated enemy to party
  const secondPath = await conditionalPath(pathOne);
  const pathTwo = secondPath.route
  const secondEnemy = generateEncounter(pathTwo);
  isPartyLeaderDead = await inCombat(partyMembers, secondEnemy);
  if (isPartyLeaderDead) return;//Ends game if Dead
  partyMembers.forEach(member => member.increaseLvl());
  recruitMember(partyMembers, secondEnemy);//Adds defeated enemy to party
  const thirdPath = await conditionalPath(pathTwo);
  const pathThree = thirdPath.route
  const thirdEnemy = generateEncounter(pathThree);
  isPartyLeaderDead = await inCombat(partyMembers, thirdEnemy);
  if (isPartyLeaderDead) return;//Ends game if Dead
  partyMembers.forEach(member => member.increaseLvl());
  recruitMember(partyMembers, thirdEnemy);//Adds defeated enemy to party
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
//Skill Sub-Menu for specific skill selection
const skillSubMenu = async (fighter) => {
  const usableSkills = fighter.learnedSkills.filter(skill => {
    return skill.skillCost <= fighter.currentSP;
  })
  const skillChoices = usableSkills.map(skill => skill.name);
  const chosenSkill = await inquirer
    .prompt([
      {
        name: 'action',
        type: 'list',
        message: `Which skill will ${fighter.name} use?`,
        choices: skillChoices
      }
    ]);
  return chosenSkill;
}
/**The function for the actual battle prompts, 
 * takes in a player object argument to check status of character and determine what actions are relevent to their status
*/
const combatMenu = async (fighter) => {
  const statusBasedChoices = new Array();
  statusBasedChoices.push('Attack');
  console.log(
    `${fighter.name} has:
  HP: ${fighter.currentHealth}/${fighter.maxHealth} 
  SP: ${fighter.currentSP}/${fighter.maxSP}`);
  //Add Skill action to possible choices in case where the player has enough SP to use skill
  const skillCosts = fighter.learnedSkills.map(skill => skill.skillCost);
  if (fighter.currentSP >= Math.min(...skillCosts)) {
    console.log(`${fighter.name} has enough SP to use a skill!!!`);
    statusBasedChoices.push('Skill');
  };
  //Check for case where either resource isn't full and add recover action to possible choices
  if (fighter.currentHealth !== fighter.maxHealth || fighter.currentSP !== fighter.maxSP) {
    statusBasedChoices.push('Rest and Recover');
  };
  const turn = await inquirer
    .prompt([
      {
        name: 'action',
        type: 'list',
        message: `What will ${fighter.name} do?`,
        choices: statusBasedChoices
      }
    ]);
  return turn;
}
/**Player Action Selection, handles the battle menu selection and execution of the selected action(s)
 * Argument 1 is party Array of Character Objects,
 * Argument 2 is the enemy Character object,
 */
const playerAction = async (combatParty, combatEnemy) => {
  for (let i = 0; i < combatParty.length; i++) {
    //checks to make sure party member is alive before letting them choose an action
    if (combatParty[i].currentHealth > 0) {
      let turn = await combatMenu(combatParty[i]);
      if (turn.action === 'Skill') {
        turn = await skillSubMenu(combatParty[i]);
      }
      combatParty[i].action = turn.action;
      console.log(`${combatParty[i].name} will use ${combatParty[i].action}`);
    } else combatParty[i].action = 'incap'; //sets action to flag character as currently incapacitated
  };
  //Uses list of actions that were chosen in combat menu
  for (i = 0; i < combatParty.length; i++) {
    if (combatEnemy.currentHealth > 0) {
      switch (combatParty[i].action) {
        case 'Rest and Recover':
          await combatParty[i].recover();
          break;
        case 'Attack':
          await combatParty[i].attack(combatEnemy);
          break;
        case 'incap':
          await waitFor(.5);
          console.log(`${combatParty[i].name} has ${combatParty[i].currentHealth} health left and could not act...`)
          break;
        default:
          await combatParty[i].roleSkill(combatEnemy, combatParty);
          break;
      }
    }
  };
}
/**Enemy Action Generator, generates the action and target of the enemy's actions
 * Argument 1 is the enemy Character object,
 * Argument 2 is the party Array of Character Objects,
 */
const enemyActionRoll = async (combatEnemy, combatParty) => {
  if (combatEnemy.currentHealth > 0) {
    const enemyAction = generateRandInt(1, 100);
    //define the "percent" chance that a skill will be used
    const skillChance = 30;
    //Generates a skill that would be used if the skill roll hits
    const skills = combatEnemy.learnedSkills;
    const skillIndex = generateRandInt(0, skills.length - 1);
    const skillChoice = skills[skillIndex];
    switch (combatParty.length) {
      //Handle target selection for case of only 1 friendly party member
      case 1:
        if (enemyAction <= skillChance) {
          combatEnemy.action = skillChoice.name;
          await combatEnemy.roleSkill(combatParty[0]);
        } else await combatEnemy.attack(combatParty[0]);
        break;
      //Handle target selection for multiple friendly party members
      default:
        let targetIndex = generateRandInt(0, combatParty.length - 1);
        //testing to make sure enemy attacks a target that is still alive  
        if (combatParty[targetIndex].currentHealth > 0) {
          if (enemyAction <= skillChance) {
            combatEnemy.action = skillChoice.name;
            await combatEnemy.roleSkill(combatParty[targetIndex]);
          } else await combatEnemy.attack(combatParty[targetIndex]);
          //If target is already at 0 health
        } else {
          if (enemyAction <= skillChance) {
            combatEnemy.action = skillChoice.name;
            await combatEnemy.roleSkill(combatParty[0]);
          } else await combatEnemy.attack(combatParty[0]);
        }
        break;
    };
  };
};
/**Function that handles the battle logic for combat
 * First Argument is the Array of party members which are character objects,
 * Second Argument is the enemy character object,
*/
const partyBattle = async (party, enemy) => {
  //Clone the party characters and enemy so as not to overwrite their original records
  const combatParty = party.map(member => {
    const pStat = member.getStats();
    const combatPlayer = new Fighter(...pStat);
    //adding party tag to name for clarity
    combatPlayer.name += '(party)'
    return combatPlayer;
  });
  const eStat = enemy.getStats();
  const combatEnemy = new Fighter(...eStat);
  //declare a turn counter to increment in the battle loop
  let turnCount = 1
  //Use While loop to continuously run through the battle while both player and enemy still have health
  while (combatParty[0].currentHealth > 0 && combatEnemy.currentHealth > 0) {
    console.log(`Turn ${turnCount} BEGIN!`);
    await waitFor(.5);  
    //Prompt each party member (if alive) for their action and execute those actions
    await playerAction(combatParty, combatEnemy);
    //Enemy Action Selection if Enemy is alive
    await enemyActionRoll(combatEnemy, combatParty);
    console.log(`Turn ${turnCount} ends...`);
    turnCount++;
    await waitFor(.5);
  };
  const battleResult = { 'party': combatParty, 'enemy': combatEnemy };
  return battleResult;
};
//Call the game function
// main();
//CURRENTLY TESTING NEW SKILL SYSTEM
const testMain = async () => {
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
  partyLeader.learnedSkills.push(partyLeader.role.skills.shift());
  //console.log(mainCharacter.learnedSkills)
  partyMembers.push(partyLeader);
  const firstPath = await firstChoice();
  const pathOne = firstPath.route;
  const firstEnemy = await generateEncounter(pathOne);
  //Moves initial enemy skill to learned Array
  firstEnemy.learnedSkills.push(firstEnemy.role.skills.shift());
  //Handles initiating combat and determing victory, ends programs if you lose
  let isPartyLeaderDead = await inCombat(partyMembers, firstEnemy);
  if (isPartyLeaderDead) return;//Ends game if Dead
  await victoryLevelUp(partyMembers);
  recruitMember(partyMembers, firstEnemy);//Adds defeated enemy to party
  const secondPath = await conditionalPath(pathOne);
  const pathTwo = secondPath.route
  const secondEnemy = await generateEncounter(pathTwo);
  //Second Enemy learns its first two skills by default
  secondEnemy.learnedSkills.push(secondEnemy.role.skills.shift());
  secondEnemy.learnedSkills.push(secondEnemy.role.skills.shift());
  isPartyLeaderDead = await inCombat(partyMembers, secondEnemy);
  if (isPartyLeaderDead) return;//Ends game if Dead
  await victoryLevelUp(partyMembers);
  recruitMember(partyMembers, secondEnemy);//Adds defeated enemy to party
  console.log(partyMembers[0].learnedSkills);
}
testMain();
//TEST PARTY FOR BATTLE AND TEST ENEMY
const testParty = [pathEnemyMap.get('Testing 1')];
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
// testBattle(testParty, testEnemy);
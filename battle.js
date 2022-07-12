const inquirer = require('inquirer');
const {
  Fighter,
} = require('./characters.js');
//import Util js
const {
  generateRandInt,
  waitFor
} = require('./util.js')
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
const playerAction = async (combatParty, combatEnemy, currentTurn) => {
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
          await combatParty[i].roleSkill(currentTurn, combatEnemy, combatParty);
          break;
      }
      await applyStatusDamage(combatParty[i]);
    }
  };
}
/**Enemy Action Generator, generates the action and target of the enemy's actions
 * Argument 1 is the enemy Character object,
 * Argument 2 is the party Array of Character Objects,
 */
const enemyActionRoll = async (combatEnemy, combatParty, currentTurn) => {
  if (combatEnemy.currentHealth > 0) {
    const enemyAction = generateRandInt(1, 100);
    //define the "percent" chance that a skill will be used
    const skillChance = 30;
    //Generates a skill that would be used if the skill roll hits
    const skills = combatEnemy.learnedSkills;
    const skillIndex = generateRandInt(0, skills.length - 1);
    const skillChoice = skills[skillIndex];
    const requiredSP = skillChoice.skillCost;
    switch (combatParty.length) {
      //Handle target selection for case of only 1 friendly party member
      case 1:
        if (enemyAction <= skillChance) {
          if (requiredSP > combatEnemy.currentSP) {
            await combatEnemy.recover();
            return;
          };
          combatEnemy.action = skillChoice.name;
          await combatEnemy.roleSkill(currentTurn, combatParty[0]);
        } else await combatEnemy.attack(combatParty[0]);
        break;
      //Handle target selection for multiple friendly party members
      default:
        let targetIndex = generateRandInt(0, combatParty.length - 1);
        //testing to make sure enemy attacks a target that is still alive  
        if (combatParty[targetIndex].currentHealth > 0) {
          if (enemyAction <= skillChance) {
            if (requiredSP > combatEnemy.currentSP) {
              await combatEnemy.recover();
              return;
            };
            combatEnemy.action = skillChoice.name;
            await combatEnemy.roleSkill(currentTurn, combatParty[targetIndex]);
          } else await combatEnemy.attack(combatParty[targetIndex]);
          //If target is already at 0 health
        } else {
          if (enemyAction <= skillChance) {
            if (requiredSP > combatEnemy.currentSP) {
              await combatEnemy.recover();
              return;
            };
            combatEnemy.action = skillChoice.name;
            await combatEnemy.roleSkill(currentTurn, combatParty[0]);
          } else await combatEnemy.attack(combatParty[0]);
        }
        break;
    };
    await applyStatusDamage(combatEnemy);
  };
};
//Add function to increment down duration of status if character is inflicted by a status at the beginning of turn
const handleStatusDuration = async (combatParty, combatEnemy, currentTurn) => {
  //check if each character in battle is inflicted
  for (i = 0; i < combatParty.length; i++) {
    switch (combatParty[i].status.name) {
      case 'normal':
        await waitFor(.75);
        console.log(`${combatParty[i].name} Status: ${combatParty[i].status.name}`);
        break;
      default:
        const statusTurnsElapsed = currentTurn - combatParty[i].status.turnApplied;
        const duration = combatParty[i].status.duration;
        await waitFor(.75);
        if (statusTurnsElapsed === duration) {
          combatParty[i].clearStatus();
          console.log(`${combatParty[i].name}\'s status returns to ${combatParty[i].status.name}`);
        } else console.log(`${combatParty[i].name} Status: ${combatParty[i].status.name} has ${duration - statusTurnsElapsed} turns remaining`);
        break;
    }
  }
  switch (combatEnemy.status.name) {
    case 'normal':
      await waitFor(.75);
      console.log(`${combatEnemy.name} Status: ${combatEnemy.status.name}`);
      break;
    default:
      const statusTurnsElapsed = currentTurn - combatEnemy.status.turnApplied;
      const duration = combatEnemy.status.duration;
      await waitFor(.75);
      if (statusTurnsElapsed === duration) {
        combatEnemy.clearStatus();
        console.log(`${combatEnemy.name}\'s status returns to ${combatEnemy.status.name}`);
      } else console.log(`${combatEnemy.name} Status: ${combatEnemy.status.name} has ${duration - statusTurnsElapsed} turns remaining`);
      break;
  }
}
//Add a function to check for damaging status and use the method to calculate that damage
const applyStatusDamage = async (fighter) => {
  switch (fighter.status.name) {
    case 'test':
      await fighter.status.effect(fighter)
      break;
    default:
      break;
  }
}
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
    await handleStatusDuration(combatParty, combatEnemy, turnCount);
    await waitFor(.5);
    //Prompt each party member (if alive) for their action and execute those actions
    await playerAction(combatParty, combatEnemy, turnCount);
    //Enemy Action Selection if Enemy is alive
    await enemyActionRoll(combatEnemy, combatParty, turnCount);
    console.log(`Turn ${turnCount} ends...`);
    turnCount++;
    await waitFor(.5);
  };
  const battleResult = { 'party': combatParty, 'enemy': combatEnemy };
  return battleResult;
};

module.exports = {
  skillSubMenu,
  combatMenu,
  playerAction,
  enemyActionRoll,
  partyBattle
}
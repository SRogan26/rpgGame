const inquirer = require('inquirer');
const {
  Fighter,
} = require('./characters.js');
//import Util js
const {
  generateRandInt,
  waitFor,
  gameConsole
} = require('./util.js')
//Skill Sub-Menu for specific skill selection
const skillSubMenu = async (fighter) => {
  const usableSkills = fighter.learnedSkills.filter(skill => skill.skillCost <= fighter.currentSP);
  const skillChoices = usableSkills.map(skill => skill.name);
  skillChoices.push('Cancel');
  let turn = await inquirer
    .prompt([
      {
        name: 'action',
        type: 'list',
        message: `Which skill will ${fighter.name} use?`,
        choices: skillChoices
      }
    ]);
  //Handling for the Cancel Option to "go back" (not really) to Main combat menu
  if (turn.action === 'Cancel') turn = await combatMenu(fighter);
  return turn;
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
  let turn = await inquirer
    .prompt([
      {
        name: 'action',
        type: 'list',
        message: `What will ${fighter.name} do?`,
        choices: statusBasedChoices
      }
    ]);
  //Sub Menu Handling
  if (turn.action === 'Skill') turn = await skillSubMenu(fighter);
  return turn;
}
//Function to handle for buff and debuff duration
const handleStatModifierDuration = async (combatParty, combatEnemy, currentTurn) => {
  //checking player buff and debuff duration
  for (i = 0; i < combatParty.length; i++) {
    //attack buff checking
    if (combatParty[i].buffs.atk.ratio > 1) {
      const atkBuffTurnsElapsed = currentTurn - combatParty[i].buffs.atk.turnApplied;
      const atkBuffDuration = combatParty[i].buffs.atk.duration;
      if (atkBuffTurnsElapsed === atkBuffDuration) {
        combatParty[i].buffs.atk.resetStatModifier();
        await gameConsole(.75, `${combatParty[i].name}\'s attack buff wears off!`);
      } else await gameConsole(.75, `${combatParty[i].name}\'s attack buff turns remaining: ${atkBuffDuration - atkBuffTurnsElapsed}`);
    };
    //defense buff checking
    if (combatParty[i].buffs.def.ratio > 1) {
      const defBuffTurnsElapsed = currentTurn - combatParty[i].buffs.def.turnApplied;
      const defBuffDuration = combatParty[i].buffs.def.duration;
      if (defBuffTurnsElapsed === defBuffDuration) {
        combatParty[i].buffs.def.resetStatModifier();
        await gameConsole(.75, `${combatParty[i].name}\'s defense buff wears off!`);
      } else await gameConsole(.75, `${combatParty[i].name}\'s defense buff turns remaining: ${defBuffDuration - defBuffTurnsElapsed}`);
    };
    //attack debuff checking
    if (combatParty[i].debuffs.atk.ratio < 1) {
      const atkDebuffTurnsElapsed = currentTurn - combatParty[i].debuffs.atk.turnApplied;
      const atkDebuffDuration = combatParty[i].debuffs.atk.duration;
      if (atkDebuffTurnsElapsed === atkDebuffDuration) {
        combatParty[i].debuffs.atk.resetStatModifier();
        await gameConsole(.75, `${combatParty[i].name}\'s attack debuff wears off!`);
      } else await gameConsole(.75, `${combatParty[i].name}\'s attack debuff turns remaining: ${atkDebuffDuration - atkDebuffTurnsElapsed}`);
    };
    //defense debuff checking
    if (combatParty[i].debuffs.def.ratio < 1) {
      const defDebuffTurnsElapsed = currentTurn - combatParty[i].debuffs.def.turnApplied;
      const defDebuffDuration = combatParty[i].debuffs.def.duration;
      if (defDebuffTurnsElapsed === defDebuffDuration) {
        combatParty[i].debuffs.def.resetStatModifier();
        await gameConsole(.75, `${combatParty[i].name}\'s defense debuff wears off!`);
      } else await gameConsole(.75, `${combatParty[i].name}\'s defense debuff turns remaining: ${defDebuffDuration - defDebuffTurnsElapsed}`);
    };
  }
  //Enemy Buff and Debuff checking
  //attack buff checking
  if (combatEnemy.buffs.atk.ratio > 1) {
    const atkBuffTurnsElapsed = currentTurn - combatEnemy.buffs.atk.turnApplied;
    const atkBuffDuration = combatEnemy.buffs.atk.duration;
    if (atkBuffTurnsElapsed === atkBuffDuration) {
      combatEnemy.buffs.atk.resetStatModifier();
      await gameConsole(.75, `${combatEnemy.name}\'s attack buff wears off!`);
    } else await gameConsole(.75, `${combatEnemy.name}\'s attack buff turns remaining: ${atkBuffDuration - atkBuffTurnsElapsed}`);
  };
  //defense buff checking
  if (combatEnemy.buffs.def.ratio > 1) {
    const defBuffTurnsElapsed = currentTurn - combatEnemy.buffs.def.turnApplied;
    const defBuffDuration = combatEnemy.buffs.def.duration;
    if (defBuffTurnsElapsed === defBuffDuration) {
      combatEnemy.buffs.def.resetStatModifier();
      await gameConsole(.75, `${combatEnemy.name}\'s defense buff wears off!`);
    } else await gameConsole(.75, `${combatEnemy.name}\'s defense buff turns remaining: ${defBuffDuration - defBuffTurnsElapsed}`);
  };
  //attack debuff checking
  if (combatEnemy.debuffs.atk.ratio < 1) {
    const atkDebuffTurnsElapsed = currentTurn - combatEnemy.debuffs.atk.turnApplied;
    const atkDebuffDuration = combatEnemy.debuffs.atk.duration;
    if (atkDebuffTurnsElapsed === atkDebuffDuration) {
      combatEnemy.debuffs.atk.resetStatModifier();
      await gameConsole(.75, `${combatEnemy.name}\'s attack debuff wears off!`);
    } else await gameConsole(.75, `${combatEnemy.name}\'s attack debuff turns remaining: ${atkDebuffDuration - atkDebuffTurnsElapsed}`);
  };
  //defense debuff checking
  if (combatEnemy.debuffs.def.ratio < 1) {
    const defDebuffTurnsElapsed = currentTurn - combatEnemy.debuffs.def.turnApplied;
    const defDebuffDuration = combatEnemy.debuffs.def.duration;
    if (defDebuffTurnsElapsed === defDebuffDuration) {
      combatEnemy.debuffs.def.resetStatModifier();
      await gameConsole(.75, `${combatEnemy.name}\'s defense debuff wears off!`);
    } else await gameConsole(.75, `${combatEnemy.name}\'s defense debuff turns remaining: ${defDebuffDuration - defDebuffTurnsElapsed}`);
  };
}
//Add function to increment down duration of status if character is inflicted by a status at the beginning of turn
const handleStatusDuration = async (combatParty, combatEnemy, currentTurn) => {
  //check if each character in battle is inflicted
  for (i = 0; i < combatParty.length; i++) {
    switch (combatParty[i].status.name) {
      case 'normal':
        await gameConsole(.75, `${combatParty[i].name} Status: ${combatParty[i].status.name}`);
        break;
      default:
        const statusTurnsElapsed = currentTurn - combatParty[i].status.turnApplied;
        const duration = combatParty[i].status.duration;
        if (statusTurnsElapsed === duration) {
          combatParty[i].clearStatus();
          await gameConsole(.75, `${combatParty[i].name}\'s status returns to ${combatParty[i].status.name}`);
        } else await gameConsole(.75, `${combatParty[i].name}\'s ${combatParty[i].status.name} turns remaining: ${duration - statusTurnsElapsed}`);
        break;
    }
  }
  switch (combatEnemy.status.name) {
    case 'normal':
      await gameConsole(.75, `${combatEnemy.name} Status: ${combatEnemy.status.name}`);
      break;
    default:
      const statusTurnsElapsed = currentTurn - combatEnemy.status.turnApplied;
      const duration = combatEnemy.status.duration;
      if (statusTurnsElapsed === duration) {
        combatEnemy.clearStatus();
        await gameConsole(.75, `${combatEnemy.name}\'s status returns to ${combatEnemy.status.name}`);
      } else await gameConsole(.75, `${combatEnemy.name}\'s ${combatEnemy.status.name} turns remaining: ${duration - statusTurnsElapsed}`);
      break;
  }
}
//Add a function to check for damaging status and use the method to calculate that damage
const applyStatusDamage = async (fighter) => {
  if (fighter.status.effectType === 'dmg') await fighter.status.effect(fighter);
}
/**Player Action Selection, handles the battle menu selection and execution of the selected action(s)
 * Argument 1 is party Array of Character Objects,
 * Argument 2 is the enemy Character object,
 */
const playerAction = async (combatParty, combatEnemy, currentTurn) => {
  for (let i = 0; i < combatParty.length; i++) {
    //checks to make sure party member is alive before letting them choose an action
    if (combatParty[i].currentHealth > 0) {
      const turn = await combatMenu(combatParty[i]);
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
          await gameConsole(.5, `${combatParty[i].name} has ${combatParty[i].currentHealth} health left and could not act...`);
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
    await handleStatModifierDuration(combatParty, combatEnemy, turnCount);
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
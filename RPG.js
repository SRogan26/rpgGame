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
      this.skillCost = wizard.skillCost;
      break;
    case 'Warrior':
      this.maxHealth = health + warrior.health;
      this.currentHealth = health + warrior.health;
      this.atkPow = atkPow + warrior.atkPow;
      this.pDef = pDef + warrior.pDef;
      this.skillCost = warrior.skillCost;
      break;
    case 'Assassin':
      this.maxHealth = health + assassin.health;
      this.currentHealth = health + assassin.health;
      this.atkPow = atkPow + assassin.atkPow;
      this.pDef = pDef + assassin.pDef;
      this.skillCost = assassin.skillCost;
      break;
    case 'Marksman':
      this.maxHealth = health + marksman.health;
      this.currentHealth = health + marksman.health;
      this.atkPow = atkPow + marksman.atkPow;
      this.pDef = pDef + marksman.pDef;
      this.skillCost = marksman.skillCost;
      break;
    case 'Priest':
      this.maxHealth = health + priest.health;
      this.currentHealth = health + priest.health;
      this.atkPow = atkPow + priest.atkPow;
      this.pDef = pDef + priest.pDef;
      this.skillCost = priest.skillCost;
      break;
    default:
      this.maxHealth = health;
      this.currentHealth = health;
      this.atkPow = atkPow;
      this.pDef = pDef;
      this.skillCost = 3;
      break;
  }
  this.buffness = buffness;
  this.checkHealth = () => {
    console.log(`${this.name} has ${this.currentHealth}/${this.maxHealth} health remaining...`);
  };
  this.getStats = () => {
    const statList = [this.name, this.role, this.maxHealth, this.atkPow, this.pDef, this.buffness, this.skillCost];
    return statList;
  };
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
//
//NEED TO REBALANCE SKILL EFFECTS WHEN IMPLEMENTING SKILL POINT RESOURCE
//
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
      target.currentHealth -= dmgCalc;
      if (target.currentHealth <= 0) target.currentHealth = 0;
      console.log(`${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`);
      break;
    case 'Warrior':
      //Strikes opponent for reduced damage and raise the attack stat of party members, inspire style of ability
      console.log(`${attacker.name} leads the Charge and headbutts the enemy! The allied party is inspired by the bravery!`);
      //Enemy Damage Taken Calc
      target.currentHealth -= Math.round(dmgCalc * .5);
      if (target.currentHealth <= 0) target.currentHealth = 0;
      console.log(`${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`);
      //Ally Attack Buff Calc and Application, multiplicative bonus currently
      party.forEach(member => {
        member.atkPow += Math.round(member.atkPow * .1);
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
      const hitDmg = Math.round(dmgCalc * 0.55);
      //generate a random amount of hits
      let totalHits = generateRandInt(minHits, maxHits);
      //Loop through damage application to apply hits equal to the amount generated above
      let i = 1;
      for (i; i <= totalHits; i++) {
        console.log(`${attacker.name}\'s flurry connects with its target dealing ${hitDmg} damage!`)
        target.currentHealth -= hitDmg;
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
      target.currentHealth -= Math.round(dmgCalc * 1.60);
      if (target.currentHealth <= 0) target.currentHealth = 0;
      console.log(`${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`)
      break;
    case 'Priest':
      //Low damage attack that also heals the party for some ratio of the damage dealt (very low damage but will ignore physical defense)
      console.log(`${attacker.name} summons Holy Light, burning their enemy and healing their allies!`);
      dmgCalc = Math.round((attacker.buffness / target.buffness) * attacker.atkPow);
      //Enemy Damage Taken Calc
      target.currentHealth -= Math.round(dmgCalc * 0.4);
      if (target.currentHealth <= 0) target.currentHealth = 0;
      console.log(`${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`)
      //Ally Healing Calc
      party.forEach(member => {
        member.currentHealth += Math.round(dmgCalc * 0.4);
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
      attacker.currentHealth += Math.round(dmgCalc * 0.6);
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
      target.currentHealth -= dmgCalc;
      if (target.currentHealth <= 0) target.currentHealth = 0;
      console.log(`${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`);
      break;
    case 'Undead':
      //Attacks and Debuffs the target's defense stat, mulitplicatively for now
      console.log(`${attacker.name} is enveloped by Cursed Energy, damaging and weakening its target's resolve!`);
      //Debuff defense calc and announcements
      target.pDef -= Math.round(target.pDef * .1);
      console.log(`${target.name}\'s defense has dropped to ${target.pDef}!`);
      //Enemy Damage Taken Calc
      target.currentHealth -= Math.round(dmgCalc * .75);
      if (target.currentHealth <= 0) target.currentHealth = 0;
      console.log(`${target.name} has ${target.currentHealth}/${target.maxHealth} health left...`);
      break;
  }
}
//Create base class related stats
const wizard = new Role('Wizard', 10, 20, -10, 4)
const warrior = new Role('Warrior', 40, 10, 10, 3)
const assassin = new Role('Assassin', 20, 25, 5, 6)
const marksman = new Role('Marksman', 10, 35, -10, 4)
const priest = new Role('Priest', 40, -5, 5, 4)
//Testing Dummy Enemy for testing of course
const testDummy = new Character('Test Dummy', 'Testing', 1000, 1, 1, 10);
//Beast Class Enemies
const bigRat = new Character('Big Rat', 'Beast', 150, 40, 15, 20);//Sewer Path
const hungryWolf = new Character('Hungry Wolf', 'Beast', 150, 40, 15, 20);//Ghost Town Path
const blackBear = new Character('Black Bear', 'Beast', 150, 40, 15, 20);//Mountainous Path
//Create Elemental Class Enemies
const clayGolem = new Character('Clay Golem', 'Elemental', 150, 40, 15, 20);//Cave Path
const undine = new Character('Undine', 'Elemental', 150, 40, 15, 20);//Seaside Path
const salamander = new Character('Salamander', 'Elemental', 150, 40, 15, 20);//Volcanic Path
//Created Undead class Enemies
const zombie = new Character('Zombie', 'Undead', 150, 40, 15, 20);//Forest Path
const mummy = new Character('Mummy', 'Undead', 150, 40, 15, 20);//Tombs Path
const vampire = new Character('Vampire', 'Undead', 150, 40, 15, 20);//Secluded Mansion Path
//Generate a Path:Enemy Map object for reference when determining encounters
const pathEnemyMap = new Map();
//First Path:Enemy Set
pathEnemyMap.set('Sewer', bigRat);
pathEnemyMap.set('Cave', clayGolem);
pathEnemyMap.set('Forest', zombie);
//Second Path:Enemy Set
pathEnemyMap.set('Ghost Town', hungryWolf);
pathEnemyMap.set('Seaside', undine);
pathEnemyMap.set('Tombs', mummy);
//Third Path:Enemy Set
pathEnemyMap.set('Mountainous', blackBear);
pathEnemyMap.set('Volcanic', salamander);
pathEnemyMap.set('Secluded Mansion', vampire);
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
    console.log(`${member.name} the ${member.role}`);
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
  const mainCharacter = new Character(charName, charRole, charStats.health, charStats.atkPow, charStats.pDef, charStats.buffness);
  console.log(`Your Stats Are:  ${mainCharacter.maxHealth} health, ${mainCharacter.atkPow} attack, ${mainCharacter.pDef} defense, ${mainCharacter.buffness} buffness`);
  partyMembers.push(mainCharacter);
  partyReadOut(partyMembers);
  const firstPath = await firstChoice();
  const pathOne = firstPath.route;
  const firstEnemy = generateEncounter(pathOne);
  //Handles initiating combat and determing victory, ends programs if you lose
  let isDead = await initiateCombat(partyMembers, firstEnemy);
  if (isDead) return;//Ends game if Dead
  recruitMember(partyMembers, firstEnemy);//Adds defeated enemy to party
  const secondPath = await conditionalPath(pathOne);
  const pathTwo = secondPath.route
  const secondEnemy = generateEncounter(pathTwo);
  isDead = await initiateCombat(partyMembers, secondEnemy);
  if (isDead) return;//Ends game if Dead
  recruitMember(partyMembers, secondEnemy);//Adds defeated enemy to party
  const thirdPath = await conditionalPath(pathTwo);
  const pathThree = thirdPath.route
  const thirdEnemy = generateEncounter(pathThree);
  isDead = await initiateCombat(partyMembers, thirdEnemy);
  if (isDead) return;//Ends game if Dead
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
//Create Utility to generate random integer value using a minimum and maximum possible value as arguments, 
const generateRandInt = (baseInt, maxInt) => {
  if (maxInt > baseInt && typeof maxInt === 'number' && typeof baseInt === 'number') {
    //smoothing out chance for all possible values to be returned, increases amount of value that will round to the minimum and maximum values
    const chanceSmoothedBase = baseInt - 0.49;
    //added an an extra round to be able to use negative decimals, smoothing out chance for all possible values to be returned even with a zero baseInt
    const value = Math.round(chanceSmoothedBase + Math.round(Math.random() * (maxInt - chanceSmoothedBase)));
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
const generateEncounter = (path) => {
  let pathEnemy = pathEnemyMap.get(path);
  return pathEnemy;
}
//function to initiate battle and check for Victory or defeat
const initiateCombat = async (partyMembers, firstEnemy) => {
  const battleResult = await partyBattle(partyMembers, firstEnemy);
  if (battleResult.party[0].currentHealth <= 0) {
    console.log('You Died....');
    let isDead = true
    return isDead;
  } else console.log(`The enemy has ${battleResult.enemy.currentHealth} health remaining! You\'ve subdued the ${battleResult.enemy.role}!`);
}
//Adds Member to party when victorious in battle, Arg 1 is party Array Arg 2 is enemy character
const recruitMember = (partyMembers, enemy) => {
  partyMembers.push(enemy);//Adds the enemy to your party if victorious
  partyReadOut(partyMembers);
}
/**The function for the actual battle prompts, 
 * takes in a player object argument to check status of character and determine what actions are relevent to their status
*/
const inCombatMenu = async (fighter) => {
  let turn
  const statusBasedChoices = new Array();
  statusBasedChoices.push('Attack');
  console.log(
    `${fighter.name} has:
  HP: ${fighter.currentHealth}/${fighter.maxHealth} 
  SP: ${fighter.currentSP}/${fighter.maxSP}`);
  //Add Skill action to possible choices in case where the player has enough SP to use skill
  if (fighter.currentSP >= fighter.skillCost) {
    console.log(`${fighter.name} has enough SP to use their skill!!!`);
    statusBasedChoices.push('Skill');
  };
  //Check for case where either resource isn't full and add recover action to possible choices
  if (fighter.currentHealth !== fighter.maxHealth || fighter.currentSP !== fighter.maxSP) {
    statusBasedChoices.push('Rest and Recover');
  };
  turn = await inquirer
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
      const turn = await inCombatMenu(combatParty[i]);
      combatParty[i].action = turn.action;
    } else combatParty[i].action = 'incap'; //sets action to flag character as currently incapacitated
    console.log(combatParty[i].name, combatParty[i].action);
  };
  //Uses list of actions that were chosen in combat menu
  combatParty.forEach(member => {
    if (combatEnemy.currentHealth > 0) {
      switch (member.action) {
        case 'Rest and Recover':
          member.recover();
          break;
        case 'Attack':
          member.attack(combatEnemy);
          break;
        case 'Skill':
          member.roleSkill(combatEnemy, combatParty);
          break;
        case 'incap':
          console.log(`${member.name} has ${member.currentHealth} health left and could not act...`)
          break;
      }
    }
  });
}
/**Enemy Action Generator, generates the action and target of the enemy's actions
 * Argument 1 is the enemy Character object,
 * Argument 2 is the party Array of Character Objects,
 */
const enemyActionRoll = (combatEnemy, combatParty) => {
  if (combatEnemy.currentHealth > 0) {
    let enemyAction = generateRandInt(1, 100);
    switch (combatParty.length) {
      //Handle target selection for case of only 1 friendly party member
      case 1:
        if (enemyAction <= 30) {
          combatEnemy.roleSkill(combatParty[0]);
        } else {
          combatEnemy.attack(combatParty[0]);
        };
        break;
      //Handle target selection for multiple friendly party members
      default:
        let targetIndex = generateRandInt(0, combatParty.length - 1);
        //testing to make sure enemy attacks a target that is still alive  
        if (combatParty[targetIndex].currentHealth > 0) {
          if (enemyAction <= 30) {
            combatEnemy.roleSkill(combatParty[targetIndex]);
          } else {
            combatEnemy.attack(combatParty[targetIndex]);
          };
        } else {
          if (enemyAction <= 30) {
            combatEnemy.roleSkill(combatParty[0]);
          } else {
            combatEnemy.attack(combatParty[0]);
          };
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
  //Use While loop to continuously run through the battle while both player and enemy still have health
  while (combatParty[0].currentHealth > 0 && combatEnemy.currentHealth > 0) {
    //Prompt each party member (if alive) for their action and execute those actions
    await playerAction(combatParty, combatEnemy);
    //Enemy Action Selection if Enemy is alive
    enemyActionRoll(combatEnemy, combatParty);
  };
  const battleResult = { 'party': combatParty, 'enemy': combatEnemy };
  return battleResult;
};
//Call the game function
main();
/**OBSOLETED BUT HERE FOR REFERENCE: 1 versus 1 battle loop
 * Function that handles the battle prompts for the first encounter
 * First Argument is the Array of party members which are character objects
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
    const turn = await inCombatMenu(combatPlayer);
    switch (turn.action) {
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
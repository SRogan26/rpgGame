//Using Inquirer package for command line user interface
const inquirer = require('inquirer');

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
//Party Menu - w/ Status,Inventory,Skills etc.
const partyMenu = async (party) => {
    const menuOptions = ['Character Status', 'Inventory', 'Close'];
    const choice = await inquirer
        .prompt([
            {
                name: 'option',
                type: 'list',
                message: `Party Menu:`,
                choices: menuOptions
            }
        ]);
    return choice;
}
//Post Combat Menu

module.exports = { combatMenu };
//Create Utility to generate random integer value using a minimum and maximum possible value as arguments, 
const generateRandInt = (baseInt, maxInt) => {
  if (maxInt >= baseInt && typeof maxInt === 'number' && typeof baseInt === 'number') {
    //smoothing out chance for all possible values to be returned, increases amount of value that will round to the minimum and maximum values
    const chanceSmoothedBase = baseInt - 0.49;
    const chanceSmoothMax = maxInt + 0.49;
    //added an an extra round to be able to use negative decimals, smoothing out chance for all possible values to be returned even with a zero baseInt
    const value = Math.round(chanceSmoothedBase + (Math.random() * (chanceSmoothMax - chanceSmoothedBase)));
    return value;
  } else {
    throw 'In generateRandInt, maxInt has to be larger than baseInt and they both have to be numbers';
  }
}
//Function to read out stats
const readStats = (character) => {
  console.log(
    `Your Stats Are:  
  Health:   ${character.currentHealth}/${character.maxHealth} 
  Attack:   ${character.atkPow} 
  Defense:  ${character.pDef}
  Buffness: ${character.buffness}`);
}
//Asynchronous code execution delay
const waitFor = (timeInSeconds) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeInSeconds * 1000);
  })
}
//Delayed text printing
const gameConsole = async (timeInSeconds, stringToPrint) => {
  await waitFor(timeInSeconds);
  console.log(stringToPrint);
}
/**Create Formula for calculating damage
 * will call this function in a method on a Fighter character so it shouldn't need to be exported to other sheets
 * this should be used to handle for damage modifying statuses and buffs in the future
 * also, should handle physical and magic damage typing in the future
 * returns an integer that represents the base damage calculation of an action 
 */
 function damageCalculation(attacker, target, dmgType, pDefReduction = 0) {
  //"Armor Penetration"
  const defenseIgnoreRatio = 1 - pDefReduction;
  //Defense Damage reduction ratio, magic ignores defense
  let targetDefReductionRatio = (200 / (200 + (target.pDef * defenseIgnoreRatio)));
  if (dmgType === 'magic') targetDefReductionRatio = 1
  console.log(attacker.role.dmgType, targetDefReductionRatio);
  //base damage calculation
  let dmgValue = Math.round((attacker.buffness / target.buffness) * attacker.atkPow * targetDefReductionRatio);
  return dmgValue
}
module.exports = {
  generateRandInt,
  readStats,
  waitFor,
  gameConsole,
  damageCalculation
}
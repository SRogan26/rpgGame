//Create Utility to generate random integer value using a minimum and maximum possible value as arguments, 
const generateRandInt = (baseInt, maxInt) => {
    if (maxInt > baseInt && typeof maxInt === 'number' && typeof baseInt === 'number') {
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
  module.exports = {
    generateRandInt,
    readStats
  }
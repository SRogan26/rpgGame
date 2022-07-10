const {
    Character,
  } = require('./characters.js');
//Testing Dummy Enemy for testing of course
const testDummyOne = new Character('Test Dummy #1', 'Testing', 10000, 400, 1, 25);
const testDummyTwo = new Character('Test Dummy #2', 'Testing', 10000, 100, 10, 25);
//Beast Class Enemies
const bigRat = new Character('Big Rat', 'Beast', 1500, 400, 150, 20);//Sewer Path
const hungryWolf = new Character('Hungry Wolf', 'Beast', 2000, 500, 200, 28);//Ghost Town Path
const blackBear = new Character('Black Bear', 'Beast', 2500, 600, 250, 36);//Mountainous Path
//Create Elemental Class Enemies
const clayGolem = new Character('Clay Golem', 'Elemental', 1500, 400, 150, 20);//Cave Path
const undine = new Character('Undine', 'Elemental', 2000, 500, 200, 28);//Seaside Path
const salamander = new Character('Salamander', 'Elemental', 2500, 600, 250, 36);//Volcanic Path
//Created Undead class Enemies
const zombie = new Character('Zombie', 'Undead', 1500, 400, 150, 20);//Forest Path
const mummy = new Character('Mummy', 'Undead', 2000, 500, 200, 28);//Tombs Path
const vampire = new Character('Vampire', 'Undead', 2500, 600, 250, 36);//Secluded Mansion Path
//Generate a Path:Enemy Map object for reference when determining encounters
const pathEnemyMap = new Map();
//testing
pathEnemyMap.set('Testing 1', testDummyOne);
pathEnemyMap.set('Testing 2', testDummyTwo);
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

module.exports = {
    pathEnemyMap
}
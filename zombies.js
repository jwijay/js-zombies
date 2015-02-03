/**
 * Class => Item(name)
 * -----------------------------
 * Creates an item.
 *
 * @name Item
 * @param {string} name     The item's name.
 * @property {string} name
 */

function Item (name) {
  this.name = name;
}

/**
 * Class => Weapon(name, damage)
 * -----------------------------
 * Creates a weapon item.
 * Weapon items can be equipped for use in battle.
 *
 * The Weapon class constructor will call 
 *   the super class (Item) constructor
 *   while passing in the 1 Item constructor param
 *
 * @name Weapon
 * @param {string} name     The weapon's name.
 * @param {number} damage   The weapon's damage.
 * @property {number} damage
 */

function Weapon(name, damage) {
  this.damage = damage;
  Item.call(this, name);
}

/**
 * Weapon Extends Item Class
 * -----------------------------
 */
Weapon.prototype = Object.create(Item.prototype, {
  constructor: {
    value: Item
  }
});

/**
 * Class => Food(name, energy)
 * -----------------------------
 * Creates a food item.
 * Food items give energy, restoring health to the player.
 *
 * The Food class constructor will call 
 *   the super class (Item) constructor
 *   while passing in the 1 Item constructor param
 *
 * @name Food
 * @param {string} name       The food's name.
 * @param {number} energy     The energy the food provides.
 * @property {number} energy
 */

function Food (name, energy) {
  this.energy = energy;
  Item.call(this, name);
}

/**
 * Food Extends Item Class
 * -----------------------------
 */

Food.prototype = Object.create(Item.prototype, {
  constructor: {
    value: Item
  }
});

/**
 * Class => Player(name, health, strength, speed)
 * -----------------------------
 * Creates a player in a zombie-infested world.
 *
 * @name Player
 * @param {string} name                    The player's name.
 * @param {number} health                  The player's health.
 * @param {number} strength                The player's strength.
 * @param {number} speed                   The player's speed.
 * @private {array} pack                   Default value should be empty.
 * @private {number} maxHealth             Default value should be set to `health`.
 * @property {string} name
 * @property {number} health
 * @property {number} strength
 * @property {number} speed
 * @property {boolean} isAlive             Default value should be `true`.
 * @property {Weapon/boolean} equipped     Default value should be `false`.
 * @property {method} getPack              Returns private variable `pack`.
 * @property {method} getMaxHealth         Returns private variable `maxHealth`.
 */

function Player (name, health, strength, speed) {
  var pack = [];
  var maxHealth = health;
  
  this.name = name;
  this.health = health;
  this.strength = strength;
  this.speed = speed;
  this.isAlive = true;
  this.equipped = false;

  this.getPack = function() {
    return pack;
  };

  this.getMaxHealth = function() {
    return maxHealth;
  };

  this.addItem = function(item) {
    pack.push(item);
  };

  this.dropItem = function(item) {
    if (pack.indexOf(item) !== -1) {
      pack.pop(item);
    }
  };
}

/**
 * Player Class Method => checkPack()
 * -----------------------------
 * Player checks the contents of their pack.
 *
 * Nicely format and print the items in the player's pack.
 * To access the pack, be sure to use Player's getPack method.
 * You should be able to invoke this function on a Player instance.
 *
 * @name checkPack
 */

Player.prototype.checkPack = function () {
    var result = "";
    var pack = this.getPack();
    //TODO: figure out how to do this without a LOOP O___O
    for (var i = 0; i < pack.length; i++) {
      result += pack[i] + ", ";
    }
    console.log(result.slice(0,-2));
};

/**
 * Player Class Method => takeItem(item)
 * -----------------------------
 * Player takes an item from the world and places it into their pack.
 *
 * Player's pack can only hold a maximum of 3 items, so if they try to add more
 *   than that to the pack, return false.
 * Before returning true or false, print a message containing the player's
 *   name and item's name if successful.  Otherwise, print a message saying
 *   that the pack is full so the item could not be stored.
 * Note: The player is allowed to store similar items (items with the same name).
 * You should be able to invoke this function on a Player instance.
 *
 * @name takeItem
 * @param {Item/Weapon/Food} item   The item to take.
 * @return {boolean} true/false     Whether player was able to store item in pack.
 */

Player.prototype.takeItem = function (item) {
  if (this.getPack().length === 3) {
    console.log("Dawg, yo' pack be too full to add dem itemz.");
    return false;
  } else {
    //holy poops. mutable private data types (arrays and objects) can be edited when you return them through public methods.
    this.getPack().push(item);
    console.log("Coolio! " + this.name + ", you've added " + item.name + " to your sack successfully.");
    return true;
  }
};

/**
 * Player Class Method => discardItem(item)
 * -----------------------------
 * Player discards an item from their pack.
 *
 * Use Array's indexOf method to check if the pack contains the item.
 * If an item is not found in the pack, indexOf returns -1.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
 *
 * If the item is in the pack, remove it from the pack using Array's splice method.
 * Print the player and item names and a message saying the item was discarded.
 * Return true for the successful discard.
 * Note: The splice method can also be used for array element replacement.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
 *
 * If the item is not in the pack, return a message with the item name saying
 *   nothing was discarded since the item could not be found.
 * Return false in this case.
 *
 * You should be able to invoke this function on a Player instance.
 *
 * @name discardItem
 * @param {Item/Weapon/Food} item   The item to discard.
 * @return {boolean} true/false     Whether player was able to remove item from pack.
 */

Player.prototype.discardItem = function (item) {
  var itemIndex = this.getPack().indexOf(item);
  if (itemIndex === -1) {
    console.log("Y U TRYING 2 DELETE ITEMZ NOT IN UR PACK. Your pack was left untouched.");
    return false;
  } else {
    this.getPack().splice(itemIndex, 1);
    console.log("Excelsior! " + this.name + ", you've dropped dat " + item.name + " on the ground.");
    return true;
  }
};

/**
 * Player Class Method => equip(itemToEquip)
 * -----------------------------
 * Player equips a weapon item.
 *
 * Player can only equip Weapon instances.
 * Player can only equip weapon items from their pack.
 *
 * If the player already has a weapon equipped (the equipped property
 *   is set to an Item), find the itemToEquip in the pack and replace
 *   it with the currently equipped item.  Then set the equipped property
 *   to the itemToEquip.
 * However, if the player doesn't already have a weapon equipped, simply
 *   equip that item and remove it from the pack.
 * You should be able to invoke this function on a Player instance.
 *
 * @name equip
 * @param {Weapon} itemToEquip  The weapon item to equip.
 */

Player.prototype.equip = function (itemToEquip) {
  //check if item is indeed a weapon, and if equipped is false
  var itemIndex = this.getPack().indexOf(itemToEquip);
  if (itemToEquip instanceof Weapon && (itemIndex !== -1)) {
    if (this.equipped !== false) {
      this.getPack().push(this.equipped);
    } 
    this.equipped = itemToEquip;
    console.log('itemToEquip', itemToEquip);
    console.log('this.equipped', this.equipped);
    this.getPack().splice(itemIndex, 1);
  }
};

/**
 * Player Class Method => eat(itemToEat)
 * -----------------------------
 * Player eats a food item, restoring their health.
 *
 * Player can only eat Food instances.
 * Player can only eat food items from their pack.
 *
 * Remove itemToEat from the pack.
 * Increase the player's health by the food's energy amount, but do not
 *   exceed the player's max health.  If exceeded, simply set player's health
 *   to max health instead.
 * To access the player's max health, be sure to use Player's getMaxHealth method.
 * You should be able to invoke this function on a Player instance.
 *
 * @name eat
 * @param {Food} itemToEat  The food item to eat.
 */

Player.prototype.eat = function (itemToEat) {
  var itemIndex = this.getPack().indexOf(itemToEat);
  if (itemToEat instanceof Food && (itemIndex !== -1)) {
    this.health = Math.min(this.getMaxHealth(), this.health + itemToEat.energy);
    this.getPack().splice(itemIndex,1);
  }
};


/**
 * Player Class Method => useItem(item)
 * -----------------------------
 * Player uses an item from the pack.
 *
 * If the item is a weapon, the player should equip the item.
 * If the item is food, the player should eat the item.
 * You should be able to invoke this function on a Player instance.
 *
 * @name useItem
 * @param {Item/Weapon/Food} item   The item to use.
 */

Player.prototype.useItem = function (item) {
  if (item instanceof Weapon) {
    this.equip(item);
  }
  if (item instanceof Food) {
    this.eat(item);
  }
};

/**
 * Player Class Method => equippedWith()
 * -----------------------------
 * Player checks their equipment.
 *
 * Prints the player's name and equipped weapon's name.
 * If nothing is equipped, prints a message saying so.
 * Also returns the equipped weapon's name or false if nothing is equipped.
 * You should be able to invoke this function on a Player instance.
 *
 * @name equippedWith
 * @return {string/boolean}   Weapon name or false if nothing is equipped.
 */

Player.prototype.equippedWith = function () {
  if (this.equipped === false) {
    return false;
  } else {
    console.log(this.name + " has " + this.equipped + " equipped!");
    return this.equipped.name;
  }
};

/**
 * Class => Zombie(health, strength, speed)
 * -----------------------------
 * Creates a normal zombie.
 *
 * @name Zombie
 * @param {number} health           The zombie's health.
 * @param {number} strength         The zombie's strength.
 * @param {number} speed            The zombie's speed.
 * @private {number} maxHealth      Default value should be set to `health`.
 * @property {number} health
 * @property {number} strength
 * @property {number} speed
 * @property {boolean} isAlive      Default value should be `true`.
 */

function Zombie (health, strength, speed) {
  var maxHealth = health;

  this.health = health;
  this.strength = strength;
  this.speed = speed;
  this.isAlive = true;
}

/**
 * Class => FastZombie(health, strength, speed)
 * -----------------------------
 * Creates a fast zombie.
 *
 * The FastZombie class constructor will call 
 *   the super class (Zombie) constructor
 *   while passing in the 3 Zombie constructor params
 *
 * @name FastZombie
 * @param {number} health           The zombie's health.
 * @param {number} strength         The zombie's strength.
 * @param {number} speed            The zombie's speed.
 */

function FastZombie (health, strength, speed) {
  Zombie.call(this, health, strength, speed);
}

/**
 * FastZombie Extends Zombie Class
 * -----------------------------
 */

FastZombie.prototype = Object.create(Zombie.prototype, {
  constructor : {
    value: Zombie
  }
});

/**
 * Class => StrongZombie(health, strength, speed)
 * -----------------------------
 * Creates a strong zombie.
 *
 * The StrongZombie class constructor will call 
 *   the super class (Zombie) constructor
 *   while passing in the 3 Zombie constructor params
 *
 * @name StrongZombie
 * @param {number} health           The zombie's health.
 * @param {number} strength         The zombie's strength.
 * @param {number} speed            The zombie's speed.
 */

function StrongZombie (health, strength, speed) {
  Zombie.call(this, health, strength, speed);
}

/**
 * StrongZombie Extends Zombie Class
 * -----------------------------
 */

StrongZombie.prototype = Object.create(Zombie.prototype, {
  constructor : {
    value: Zombie
  }
});

/**
 * Class => RangedZombie(health, strength, speed)
 * -----------------------------
 * Creates a ranged zombie.
 *
 * The RangedZombie class constructor will call 
 *   the super class (Zombie) constructor
 *   while passing in the 3 Zombie constructor params
 *
 * @name RangedZombie
 * @param {number} health           The zombie's health.
 * @param {number} strength         The zombie's strength.
 * @param {number} speed            The zombie's speed.
 */

function RangedZombie (health, strength, speed) {
  Zombie.call(this, health, strength, speed);
}

/**
 * RangedZombie Extends Zombie Class
 * -----------------------------
 */

RangedZombie.prototype = Object.create(Zombie.prototype, {
  constructor : {
    value : Zombie
  }
});

/**
 * Class => ExplodingZombie(health, strength, speed)
 * -----------------------------
 * Creates an exploding zombie.
 *
 * The ExplodingZombie class constructor will call 
 *   the super class (Zombie) constructor
 *   while passing in the 3 Zombie constructor params
 *
 * @name ExplodingZombie
 * @param {number} health           The zombie's health.
 * @param {number} strength         The zombie's strength.
 * @param {number} speed            The zombie's speed.
 */

function ExplodingZombie(health, strength, speed) {
  Zombie.call(this, health, strength, speed);
}

/**
 * ExplodingZombie Extends Zombie Class
 * -----------------------------
 */

ExplodingZombie.prototype = Object.create(Zombie.prototype, {
  constructor : {
    value : Zombie
  }
});


/**
 * Sample run.
 * Feel free to edit this and check your game logic.
 */
function runGame() {
  // var player = new Player("Joan", 500, 30, 70);
  // var zombie = new Zombie(40, 50, 20);
  // var charger = new FastZombie(175, 25, 60);
  // var tank = new StrongZombie(250, 100, 15);
  // var spitter = new RangedZombie(150, 20, 20);
  // var boomer = new ExplodingZombie(50, 15, 10);

  // var shovel = new Weapon("shovel", 15);
  // var sandwich = new Food("sandwich", 30);
  // var chainsaw = new Weapon("chainsaw", 25);

  // player.takeItem(shovel);
  // player.takeItem(sandwich);
  // player.takeItem(chainsaw);
  // player.discardItem(new Weapon("scythe", 21));
  // player.discardItem(shovel);
  // player.checkPack();
  // player.takeItem(shovel);
  // player.checkPack();

  // player.equippedWith();
  // player.useItem(chainsaw);
  // player.equippedWith();
  // player.checkPack();

  // player.useItem(shovel);
  // player.equippedWith();
  // player.checkPack();

  // player.health = 487;
  // console.log("Before health: " + player.health);
  // player.useItem(sandwich);
  // console.log("After health: " + player.health);
  // player.checkPack();
}

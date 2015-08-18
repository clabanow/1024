var Gameboard = {
  SIZE: 4,
  STARTING_TILES: 2,

  tiles: [],
  score: 0,
  tilesCreated: 0,

  startNewGame: function() {
    if (this.tiles.length > 0) {
      this.resetGameboard();
    }

    var startingTiles = this.getStartingTiles();
    UI.buildGameboard(startingTiles);
  },

  resetGameboard: function() {
    this.tiles = [];
    this.score = 0;
    this.tilesCreated = 0;
  },

  getStartingTiles: function() {
    var result = [],
        tile;

    for (var i = 0; i < this.STARTING_TILES; i++) {
      tile = this.generateNewRandomTile();
      result.push(tile);
    }

    return result;
  },

  generateNewRandomTile: function() {
    var freeTileSpaces = this.getFreeTileSpaces(),
        location = freeTileSpaces[Math.floor(Math.random() * freeTileSpaces.length)],
        tileToAdd = new Tile(location, this.generateNewTileId());
    
    this.tiles.push(tileToAdd);
    return tileToAdd;
  },

  generateNewTileId: function() {
    return "_" + this.tilesCreated++;
  },

  //returns an array of ints, each of which
  //represent a free tile location (in which to
  //place a new random tile)
  getFreeTileSpaces: function() {
    var allFreeSpaces = this.getAllSpacesArray(),
        len = this.tiles.length;

    for (var i = 0; i < len; i++) {
      var index = allFreeSpaces.indexOf(this.tiles[i].locationNumber);
      allFreeSpaces.splice(index, 1);
    }
    return allFreeSpaces;
  },

  getAllSpacesArray: function() {
    var result = [],
      totalSpaces = this.SIZE * this.SIZE;

    for (var i = 0; i < totalSpaces; i++) {
      result.push(i);
    }
    return result;
  },

  move: function(direction) {
    this.sortTileArray(direction);
    this.initializeNewTurnForEachTile();
    this.moveEachTile(direction);
    this.removeTilesFromArray();
    UI.updateScoreboard(this.score);
  },

  //sorts the array of tiles so that tiles farthest in the
  //direction of the move will be analyzed/moved first
  //i.e. on 'down', the bottom row of tiles moved to the front
  //of the array, the second bottom row after that, etc.
  //in a 4x4 array, positions 0-3 are group1, 4-7 are group2, etc.
  sortTileArray: function(direction) {
    var sortedArray = new Array(this.SIZE * this.SIZE),
        unsortedArrayLength = this.tiles.length,
        sortedArrayLength = sortedArray.length,
        groupNumber,  //corresponds to row (up/down) or column (right/left) number
        numberOfTilesAlreadyInGroup,
        index,
        result = [];

    for (var i = 0; i < unsortedArrayLength; i++) {
      groupNumber = this.getGroupNumber(this.tiles[i].locationNumber, direction);
      numberOfTilesAlreadyInGroup = this.getNumberOfTilesAlreadyInGroup(sortedArray, groupNumber);
      index = this.SIZE * groupNumber + numberOfTilesAlreadyInGroup;
      sortedArray[index] = this.tiles[i];
    }

    for (var i = 0; i < sortedArrayLength; i++) {
      if (sortedArray[i] != undefined) {
        result.push(sortedArray[i]);
      }
    }

    this.tiles = result;
  },

  getGroupNumber: function(locationNumber, direction) {
    var result;

    switch (direction) {
      case 'up':
        result = Math.floor(locationNumber / this.SIZE);
        break;
      case 'down':
        result = this.SIZE - 1 - Math.floor(locationNumber / this.SIZE);
        break;
      case 'left':
        result = locationNumber % this.SIZE;
        break;
      case 'right':
        result = this.SIZE - 1 - (locationNumber % this.SIZE);
        break;
    }

    return result;
  },

  getNumberOfTilesAlreadyInGroup: function(sortedArray, groupNumber) {
    var counter = 0,
        startIndex = groupNumber * this.SIZE,

        //takes the group number subarray from the sortedArray
        groupArray = sortedArray.slice(startIndex, startIndex + this.SIZE),
        len = groupArray.length;

    for (var i = 0; i < len; i++) {
      if (groupArray[i] != null) {
        counter++;
      } else {
        return counter;
      }
    }
  },

  initializeNewTurnForEachTile: function() {
    var len = this.tiles.length;

    for (var i = 0; i < len; i++) {
      this.tiles[i].currentTurn = new Turn();
    }
  },

  moveEachTile: function(direction) {
    var len = this.tiles.length;

    this.getTurnInfoBeforeMove(direction);

    for (var i = 0; i < len; i++) {
      this.tiles[i].move(direction);
    }
  },

  getTurnInfoBeforeMove: function(direction) {
    var len = this.tiles.length;

    for (var i = 0; i < len; i++) {
      this.tiles[i].getTurnInfo(direction);
    }
  },

  removeTilesFromArray: function() {
    var result = [],
        len = this.tiles.length;
    for (var i = 0; i < len; i++) {
      if (!this.tiles[i].currentTurn.willDisappear) {
        result.push(this.tiles[i]);
      }
    }

    this.tiles = result;
  },

  checkForEndOfGame: function() {
    var len = this.tiles.length;

    for (var i = 0; i < len; i++) {
      if (this.tiles[i].value >= 1024) {
        this.winGame();
        return true;
      } else if (this.tiles.length == (this.SIZE * this.SIZE)) {
        this.loseGame();
        return true;
      }

      return false;
    }
  },

  winGame: function() {
    UI.showWinGameScreen();
  },

  loseGame: function() {
    UI.showLoseGameScreen();
  }
};
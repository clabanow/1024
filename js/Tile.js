function Tile(locationNumber, id) {
  this.locationNumber = locationNumber;
  this.id = id;
  this.value = 2;
  this.currentTurn = new Turn();
}

Tile.prototype = {
  getTurnInfo: function(direction) {
    this.locationNumber = this.getEndingLocation(direction);
    this.findCollisions(direction);
  },

  move: function(direction) {
    UI.moveTile({
      value: this.value,
      spacesToMove: this.currentTurn.spacesToMove,
      direction: direction,
      willDouble: this.currentTurn.willDouble,
      willDisappear: this.currentTurn.willDisappear,
      id: this.id
    });
  },

  findCollisions: function(direction) {
    var numberTilesToScan = Gameboard.tiles.indexOf(this),
        tileToCompare;

    for (var i = 0; i < numberTilesToScan; i++) {
      tileToCompare = Gameboard.tiles[i];

      if (this.collidesWithNextTile(tileToCompare, direction)) {
        this.currentTurn.willDisappear = true;

        tileToCompare.value *= 2;
        tileToCompare.currentTurn.willDouble = true;
        Gameboard.score += tileToCompare.value;
      }
    }
  },

  collidesWithNextTile: function(nextTile, direction) {
    var hasSameValue = this.value === nextTile.value;
    var isNotDisappearing = !nextTile.currentTurn.willDisappear;
    var areTouchingOnCorrectSide = this.areTouchingOnCorrectSide(nextTile.locationNumber, direction);

    return hasSameValue && isNotDisappearing && areTouchingOnCorrectSide;
  },

  areTouchingOnCorrectSide: function(otherTileLocationNumber, direction) {
    var areTouching;

    switch (direction) {
      case 'up':
        areTouching = this.locationNumber - otherTileLocationNumber == Gameboard.SIZE;
        break;
      case 'down':
        areTouching = otherTileLocationNumber - this.locationNumber == Gameboard.SIZE;
        break;
      case 'right':
        areTouching = otherTileLocationNumber - this.locationNumber == 1;
        break;
      case 'left':
        areTouching = otherTileLocationNumber - this.locationNumber == -1;
        break;
    }
    return areTouching;
  },

  getStartingValue: function() {
    return this.currentTurn.hasMoved && this.currentTurn.willDouble ? this.value / 2 : this.value;
  },

  getEndingLocation: function(direction) {
    var spacesToMove = this.getNumberSpacesToMove(direction),
        tileLocationAfterMove;

    this.currentTurn.spacesToMove = spacesToMove;

    switch (direction) {
      case 'up':
        tileLocationAfterMove = this.locationNumber - (Gameboard.SIZE * spacesToMove);
        break;
      case 'down':
        tileLocationAfterMove = this.locationNumber + (Gameboard.SIZE * spacesToMove);
        break;
      case 'right':
        tileLocationAfterMove = this.locationNumber + spacesToMove;
        break;
      case 'left':
        tileLocationAfterMove = this.locationNumber - spacesToMove;
        break;
    }

    return tileLocationAfterMove;
  },

  getNumberSpacesToMove: function(direction) {
    var spacesToMove = this.getMaxSpacesToMove(direction),
        len = Gameboard.tiles.length,
        tileToCompare;

    for (var i = 0; i < len; i++) {
      tileToCompare = Gameboard.tiles[i];
      if (this.tileIsInTheWay(tileToCompare, direction)) {
        spacesToMove--;
      }
    }
    return spacesToMove;
  },

  getMaxSpacesToMove: function(direction) {
    var result;

    switch (direction) {
      case 'up':
        result = Math.floor(this.locationNumber / Gameboard.SIZE);
        break;
      case 'down':
        result = Gameboard.SIZE - 1 - Math.floor(this.locationNumber / Gameboard.SIZE);
        break;
      case 'left':
        result = this.locationNumber % Gameboard.SIZE;
        break; 
      case 'right':
        result = Gameboard.SIZE - 1 - this.locationNumber % Gameboard.SIZE;
        break;
    }
    return result;
  },

  tileIsInTheWay: function(nextTile, direction) {
    return !nextTile.currentTurn.willDisappear && this.isInTilePath(direction, nextTile.locationNumber);
  },

  isInTilePath: function(direction, tempTileLocation) {
    var isInCorrectDirection,
        isOnStraightLinePath;

    switch (direction) {
      case 'up':
        isInCorrectDirection = tempTileLocation < this.locationNumber;
        isOnStraightLinePath = (tempTileLocation % Gameboard.SIZE) == (this.locationNumber % Gameboard.SIZE);
        break;
      case 'down':
        isInCorrectDirection = tempTileLocation > this.locationNumber;
        isOnStraightLinePath = (tempTileLocation % Gameboard.SIZE) == (this.locationNumber % Gameboard.SIZE);
        break;
      case 'left': 
        isInCorrectDirection = tempTileLocation < this.locationNumber;
        isOnStraightLinePath = Math.floor(tempTileLocation / Gameboard.SIZE) == Math.floor(this.locationNumber / Gameboard.SIZE)
        break;
      case 'right': 
        isInCorrectDirection = tempTileLocation > this.locationNumber;
        isOnStraightLinePath = Math.floor(tempTileLocation / Gameboard.SIZE) == Math.floor(this.locationNumber / Gameboard.SIZE)
        break;
    }

    return isInCorrectDirection && isOnStraightLinePath;
  }
};

var TileFactory = {
  createNewTile: function(tile) {
    var pos = UI.getTilePosition(tile.locationNumber);
    var tileElement = document.createElement("div");

    tileElement.id = tile.id;
    tileElement.className = "tile value2";
    tileElement.innerHTML = 2;

    tileElement.style.width = UI.getCellSideLength() + "px";
    tileElement.style.height = UI.getCellSideLength() + "px";
    tileElement.style.left = pos.left + "px";
    tileElement.style.bottom = pos.bottom + "px";

    return tileElement;
  }
};
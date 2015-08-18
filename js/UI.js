var UI = {
  SPEED: 5,
  movedTiles: 0,
  tilesToMove: 0,

  buildGameboard: function(startingTiles) {
    this.tilesToMove = startingTiles.length;
    this.movedTiles = 0;

    //if board already exists, remove the tiles from last game
    //otherwise, build the board
    var rows = document.querySelectorAll(".row");
    if (rows.length > 0) {
      this.removeTiles();
      document.getElementById('score').innerHTML = 0;
    } else {
      for (var i = 0; i < Gameboard.SIZE; i++) {
        this.addRow();
      }
    }
    
    this.addStartingTiles(startingTiles);
  },

  removeTiles: function() {
    var tiles = document.querySelectorAll(".tile"),
        len = tiles.length,
        gameboard = document.getElementById("gameboard");

    for (var i = 0; i < len; i++) {
      gameboard.removeChild(tiles[i]);
    }
  },

  addRow: function() {
    var row = document.createElement("div");
    row.className = "row";

    for (var i = 0; i < Gameboard.SIZE; i++) {
      var cell = document.createElement("div");
      cell.className = "cell";
      row.appendChild(cell);
    }

    document.querySelector("#gameboard").appendChild(row);
  },

  addStartingTiles: function(startingTiles) {
    var len = startingTiles.length;

    for (var i = 0; i < len; i++) {
      this.addNewTile(startingTiles[i]);
    }
  },

  updateScoreboard: function(score) {
    document.getElementById('score').innerHTML = score;
  },

  getCellSideLength: function() {
    return document.querySelector(".cell").offsetWidth;
  },

  getTilePosition: function(locationNumber) {
    var gameboard = document.getElementById("gameboard");

    var rowNumber = Math.floor(locationNumber / Gameboard.SIZE);
    var columnNumber = locationNumber % Gameboard.SIZE;

    var cellDimensions = this.getCellDimensions();
    var totalPxPerCell = cellDimensions.sideLength + 2 * cellDimensions.margin;

    var gameboardPaddingStr = getComputedStyle(gameboard).getPropertyValue('padding');
    var gameboardPadding = StringParser.convertPxToInt(gameboardPaddingStr);
    var startingPositionBuffer = gameboardPadding + cellDimensions.margin;

    var bottom = ((Gameboard.SIZE - 1) - rowNumber) * totalPxPerCell + startingPositionBuffer;   
    var left = columnNumber * totalPxPerCell + startingPositionBuffer;

    return {
      left: left,
      bottom: bottom
    };
  },

  getCellDimensions: function() {
    var cell = document.querySelectorAll(".cell")[0];

    var sideLength = cell.offsetWidth;

    var marginStr = getComputedStyle(cell).getPropertyValue('margin');
    var margin = StringParser.convertPxToInt(marginStr);
    return {
      margin: margin,
      sideLength: sideLength
    }; 
  },

  getTileElement: function(id) {
    return document.getElementById(id);
  },

  addNewTile: function(tile) {
    var gameboard = document.getElementById("gameboard"),
      tileToAdd = TileFactory.createNewTile(tile);

    gameboard.appendChild(tileToAdd);
  },

  moveTile: function(tile) {
    var tileToMove = document.getElementById(tile.id),
        positionStart = this.getStartPosition(tile.id, tile.direction),
        positionEnd = this.getEndPosition(tile.direction, positionStart, tile.spacesToMove);

    this.animateTileMovement({
      element: tileToMove,
      value: tile.value,
      direction: tile.direction,
      positionStart: positionStart,
      positionEnd: positionEnd,
      willDouble: tile.willDouble,
      willDisappear: tile.willDisappear
    });
  },

  animateTileMovement: function(tile) {
    var isDoneMoving = this.isDoneMoving(tile),
        styleAttr = this.getStyleAttrToBeChanged(tile.element, tile.direction),
        incrementedStartPos = this.incrementStartPosition(tile.positionStart, tile.direction),
        self = this,
        styleValue;

    if (isDoneMoving) {
      this.updateGameboardUI(tile);
      return;
    } else {
      styleValue = tile.positionStart + 'px';
      this.updateTilePosition(tile.element, tile.direction, styleValue);
      setTimeout(function() {
        self.animateTileMovement({
          element: tile.element,
          value: tile.value,
          direction: tile.direction,
          positionStart: incrementedStartPos,
          positionEnd: tile.positionEnd,
          willDouble: tile.willDouble,
          willDisappear: tile.willDisappear
        });
      }, 1);
    }
  },

  isDoneMoving: function(tile) {
    var result;

    if (tile.direction == 'up' || tile.direction == 'right') {
      result = tile.positionStart > tile.positionEnd;
    } else {
      result = tile.positionEnd > tile.positionStart;
    }

    return result;
  },

  getStyleAttrToBeChanged: function(element, direction) {
    var result;

    if (direction == 'up' || direction == 'down') {
      result = element.style.bottom;
    } else {
      result = element.style.left;
    }

    return result;
  },

  incrementStartPosition: function(positionStart, direction) {
    var result;

    if (direction == 'up' || direction == 'right') {
      result = positionStart + this.SPEED;
    } else {
      result = positionStart - this.SPEED;
    }

    return result;
  },

  updateTilePosition: function(element, direction, styleValue) {
    if (direction == 'up' || direction == 'down') {
      element.style.bottom = styleValue;
    } else {  
      element.style.left = styleValue;
    }
  },

  updateGameboardUI: function(tile) {
    self = this;

    this.movedTiles++;

    if (tile.willDouble) {
      tile.element.className = "tile value" + tile.value;
      tile.element.innerHTML = tile.value;
    } else if (tile.willDisappear) {
      document.getElementById('gameboard').removeChild(tile.element);
    }

    this.checkForEndOfTurn();
  },

  checkForEndOfTurn: function() {
    if (this.allTilesHaveBeenMoved()) {
      if (this.gameIsNotOver()) {
        setTimeout(function() {
          self.addNewTile(Gameboard.generateNewRandomTile());
        }, 200)
        this.resetTileMovementCounters();
      }
    }
  },

  allTilesHaveBeenMoved: function() {
    return this.movedTiles === this.tilesToMove;
  },

  gameIsNotOver: function() {
    return !Gameboard.checkForEndOfGame();
  },

  resetTileMovementCounters: function() {
    this.movedTiles = 0;
    this.tilesToMove = document.querySelectorAll(".tile").length + 1;
  },

  getStartPosition: function(id, direction) {
    var styleAttr = direction == 'up' || direction == 'down' ? 'bottom' : 'left',
        tile = document.getElementById(id),
        attrValue = getComputedStyle(tile).getPropertyValue(styleAttr);

    return StringParser.convertPxToInt(attrValue);
  },

  getEndPosition: function(direction, startPos, spacesToMove) {
    var isIncreasing = direction === 'up' || direction == 'right' ? true : false,
        cellDimensions = this.getCellDimensions(),
        pxPerSpace = cellDimensions.sideLength + 2 * cellDimensions.margin,
        pxToMove = pxPerSpace * spacesToMove,
        result;
    
    if (isIncreasing) {
      result = startPos + pxToMove;
    } else {
      result = startPos - pxToMove;
    }
    return result;
  },

  showWinGameScreen: function() {
    document.body.removeEventListener("keydown", clickHandler);
    document.getElementById('game-result').innerHTML = "You win!";
    document.getElementById('end-of-game').style.display = 'block';
  },

  showLoseGameScreen: function() {
    document.body.removeEventListener("keydown", Handlers.keydownHandler);
    document.getElementById('game-result').innerHTML = "You lose!";
    document.getElementById('end-of-game').style.display = 'block';
  }
};

var StringParser = {
  convertPxToInt: function(str) {
    var indexOfPxString = str.indexOf('px');
    return parseInt(str.substring(0, indexOfPxString));
  }
}
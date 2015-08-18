describe("Gameboard", function() {
  
  beforeEach(function() {
    Gameboard.SIZE = 4;
    Gameboard.STARTING_TILES = 2;
    Gameboard.tiles = [
      new Tile(0, '_0'),
      new Tile(5, '_1'),
      new Tile(10, '_2'),
      new Tile(15, '_3')
    ];
    Gameboard.score = 4;
    Gameboard.tilesCreated = 4;

    var html = "<div id='score-new-game-container'> \
        <div class='score-container'> \
          <div class='score-header'>score</div> \
          <div id='score'>0</div> \
        </div> \
        <div class='new-game-btn' id='new-game'>New Game</div> \
      </div> \
    <div id='gameboard'> \
      <div id='end-of-game'> \
        <div id='game-result'></div> \
        <div class='new-game-btn'>Play again?</div> \
      </div> \
    </div>"; 
    var div = document.createElement('div');
    div.innerHTML = html;
    div.id = 'test-div';
    div.style.display = 'none';
    document.body.appendChild(div);

    UI.buildGameboard(Gameboard.tiles);
  });

  afterEach(function() {
    var div = document.querySelector("#test-div");
    document.body.removeChild(div);
  })

  describe('Properties should always be defined', function() {
    it('should store tiles at all times', function() {
      expect(Gameboard.tiles).toBeDefined();
    })

    it('should store score at all times', function() {
      expect(Gameboard.tiles).toBeDefined();
    })

    it('should store the amount of tiles create at all times', function() {
      expect(Gameboard.tilesCreated).toBeDefined();
    })
  });

  describe('When starting a new game', function() {
    it('should reset to an empty tile array', function() {
      expect(Gameboard.tiles.length).toEqual(4);
      Gameboard.resetGameboard();
      expect(Gameboard.tiles.length).toEqual(0);
      Gameboard.tiles[1] = new Tile(3, '_7');
      Gameboard.resetGameboard();
      expect(Gameboard.tiles.length).toEqual(0);
    });

    it('resetGameboard() should be called if there are any tiles', function() {
      spyOn(Gameboard, 'resetGameboard');
      Gameboard.startNewGame();
      expect(Gameboard.resetGameboard).toHaveBeenCalled();
    })

    it ('should get an arry new tiles with unique IDs starting from 0', function() {
      Gameboard.resetGameboard();
      var startingTiles = Gameboard.getStartingTiles();
      expect(startingTiles.length).toEqual(Gameboard.STARTING_TILES);
      expect(startingTiles[0].id).toEqual("_0");
      expect(startingTiles[1].id).toEqual("_1");
    })

    it("should end up with two new tile divs", function() {
      Gameboard.startNewGame();
      var numTiles = document.querySelectorAll('.tile').length;
      expect(numTiles).toEqual(2);
    });
  });

  describe("When generating a new tile", function() {
    var len = Gameboard.tiles.length,
        allTileIds,
        allTileLocations,
        currentTile;

    for (var i = 0; i < len; i++) {
      var currentTile = Gameboard.tiles[i];

      allTileLocations.push(currentTile.locationNumber);
      allTileIds.push(currentTile.id);
    }
    
    it('should generate a unique ID and locationNumber', function() {
      for (var i = 0; i < 100; i++) {
        var tileToAdd = Gameboard.generateNewRandomTile();
        expect(allTileIds).not.toContain(tileToAdd.id);
        expect(allTileLocations).not.toContain(tileToAdd.locationNumber);
        Gameboard.tiles.pop();
      }
    })
  });

  describe("Before the tiles are moved", function() {
    describe("When sorting the tile array prior to moving tiles", function() {
      it('should still have same amount of tiles after sort', function() {
        expect(Gameboard.tiles.length).toEqual(4);
        Gameboard.sortTileArray('up');
        expect(Gameboard.tiles.length).toEqual(4);
      })

      it("should sort properly on 'up'", function() {
        Gameboard.sortTileArray('up');
        expect(Gameboard.tiles[0].locationNumber).toEqual(0);
        expect(Gameboard.tiles[1].locationNumber).toEqual(5);
        expect(Gameboard.tiles[2].locationNumber).toEqual(10);
        expect(Gameboard.tiles[3].locationNumber).toEqual(15);
      });

      it("should sort properly on 'down'", function() {
        Gameboard.sortTileArray('down');
        expect(Gameboard.tiles[0].locationNumber).toEqual(15);
        expect(Gameboard.tiles[1].locationNumber).toEqual(10);
        expect(Gameboard.tiles[2].locationNumber).toEqual(5);
        expect(Gameboard.tiles[3].locationNumber).toEqual(0);
      });

      it("should sort properly on 'right'", function() {
        Gameboard.sortTileArray('up');
        Gameboard.sortTileArray('right');
        expect(Gameboard.tiles[0].locationNumber).toEqual(15);
        expect(Gameboard.tiles[1].locationNumber).toEqual(10);
        expect(Gameboard.tiles[2].locationNumber).toEqual(5);
        expect(Gameboard.tiles[3].locationNumber).toEqual(0);
      });

      it("should sort properly on 'left'", function() {
        Gameboard.sortTileArray('left');
        expect(Gameboard.tiles[0].locationNumber).toEqual(0);
        expect(Gameboard.tiles[1].locationNumber).toEqual(5);
        expect(Gameboard.tiles[2].locationNumber).toEqual(10);
        expect(Gameboard.tiles[3].locationNumber).toEqual(15);
      });

      it("should get correct group number", function() {
        expect(Gameboard.getGroupNumber(7, 'up')).toEqual(1);
        expect(Gameboard.getGroupNumber(7, 'down')).toEqual(2);
        expect(Gameboard.getGroupNumber(7, 'right')).toEqual(0);
        expect(Gameboard.getGroupNumber(7, 'left')).toEqual(3);

        expect(Gameboard.getGroupNumber(9, 'up')).toEqual(2);
        expect(Gameboard.getGroupNumber(9, 'down')).toEqual(1);
        expect(Gameboard.getGroupNumber(9, 'right')).toEqual(2);
        expect(Gameboard.getGroupNumber(9, 'left')).toEqual(1);
      });

      it("should get amount of tiles already in group", function() {
        var sortedArray = new Array(16);
        sortedArray[0] = new Tile();
        sortedArray[1] = new Tile();
        sortedArray[4] = new Tile();
        sortedArray[12] = new Tile();
        sortedArray[13] = new Tile();
        sortedArray[14] = new Tile();

        expect(Gameboard.getNumberOfTilesAlreadyInGroup(sortedArray, 0)).toEqual(2);
        expect(Gameboard.getNumberOfTilesAlreadyInGroup(sortedArray, 1)).toEqual(1);
        expect(Gameboard.getNumberOfTilesAlreadyInGroup(sortedArray, 2)).toEqual(0);
        expect(Gameboard.getNumberOfTilesAlreadyInGroup(sortedArray, 3)).toEqual(3);
      });
    });

    it("each tile should have current turn become a new Turn()", function() {
      var len = Gameboard.tiles.length;
      Gameboard.initializeNewTurnForEachTile();

      for (var i = 0; i < len; i++) {
        expect(Gameboard.tiles[i].currentTurn).toEqual(new Turn());
      }
    });

    // describe("Tiles should be analyzed before they are moved", function() {
    //   var newTile1 = new Tile(4, '_4');
    //   var newTile2 = new Tile(3, '_5');

    //   Gameboard.tiles = Gameboard.tiles.concat([newTile1, newTile2]);
    //   UI.buildGameboard(Gameboard.tiles);

    //   Gameboard.getTurnInfoBeforeMove('up');

    //   it("should correctly double certain tiles", function() {
    //     var tilesToDouble = [];
    //     for (var i = 0; i < Gameboard.tiles.length; i++) {
    //       if (Gameboard.tiles[i].value > 2) {
    //         tilesToDouble.push(Gameboard.tiles[i].id);
    //       }
    //     }

    //     expect(tilesToDouble).toContain('_0', '_5');
    //     expect(tilesToDouble).not.tocontain('_1', '_2', '_3', '_4');
    //   });

    //   it("should correctly disappear certain tiles", function() {

    //   })

    // });
  });

  // describe("When the gameboard is done being moved", function() {
  //   beforeEach(function() {
  //     UI.removeTiles();
  //     Gameboard.tiles = [
  //       new Tile(0, '_0'),
  //       new Tile(5, '_1'),
  //       new Tile(10, '_2'),
  //       new Tile(15, '_3'),
  //       new Tile(1, '_4'), 
  //       new Tile(8, '_5'), 
  //       new Tile(11, '_6')];

  //     for (var i = 0; i < Gameboard.tiles.length; i++) {
  //       UI.addNewTile(Gameboard.tiles[i]);
  //     }
  //   })

  //   it("should have moved tiles to correct places on 'up'", function() {
  //     var len = Gameboard.tiles.length;
  //     Gameboard.sortTileArray('up');
  //     Gameboard.initializeNewTurnForEachTile();
  //     Gameboard.moveEachTile('up');

  //     for (var i = 0; i < len; i++) {
  //       var tile = Gameboard.tiles[i];

  //       switch (tile.id) {
  //         case '_0':
  //           expect(tile.locationNumber).toEqual(0);
  //           break;
  //         case '_1':
  //           expect(tile.locationNumber).toEqual(1);
  //           break;
  //         case '_2':
  //           expect(tile.locationNumber).toEqual(2);
  //           break;
  //         case '_3':
  //           expect(tile.locationNumber).toEqual(3);
  //           break;
  //         case '_4':
  //           expect(tile.locationNumber).toEqual(1);
  //           break;
  //         case '_5':
  //           expect(tile.locationNumber).toEqual(0);
  //           break;
  //         case '_6':
  //           expect(tile.locationNumber).toEqual(3);
  //           break;
  //       }
  //     }
  //   });
  // });

});
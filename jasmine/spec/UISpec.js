describe("UI", function() {
  beforeEach(function() {
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
  });

  afterEach(function() {
    var divToRemove = document.getElementById('test-div');
    document.body.removeChild(divToRemove);
  })

  describe('When the gameboard is built', function() {
    var startingTiles = [new Tile(1, '_0'), new Tile(5, '_1')];
    Gameboard.tiles = startingTiles;
    Gameboard.tilesCreated = 2;
    UI.buildGameboard(startingTiles);

    var rows = document.querySelectorAll('.row');
    var cells = document.querySelectorAll('.cell');

    it("should ", function() {
      
    });
  })
});
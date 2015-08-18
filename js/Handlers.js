var Handlers = {
  keydownHandler: function(event) {
    var direction;

    switch (event.keyCode) {
      case 38:
        direction = 'up';
        break;
      case 40: 
        direction = 'down';
        break;
      case 37:
        direction = 'left';
        break;
      case 39:
        direction = 'right';
        break;
    }
    if (direction) {
      Gameboard.move(direction);
    }
  }
}
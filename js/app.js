window.onload = function() {

	document.querySelectorAll('.new-game-btn')[0].addEventListener('click', function() {
		playNewGame();
	});

  document.querySelectorAll('.new-game-btn')[1].addEventListener('click', function() {
    playNewGame();
  });

	function playNewGame() {
		document.getElementById('end-of-game').style.display = "none";
		document.body.addEventListener("keydown", Handlers.keydownHandler);
		Gameboard.startNewGame();
	}

	playNewGame();
};
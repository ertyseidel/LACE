// in server file

var collisionEngine = new collisions({
	stepSize: 50,
	//collisionFunction(playerOneData, playerTwoData); 
	collisionFunction: function(player1, player2){
		var check1 = player1.x > player2.x && player1.x < player2.x + 5 && player1.y > player2.y && player1.y < player2.y + 5;
		var check2 = player2.x > player1.x && player2.x < player1.x + 5 && player2.y > player1.y && player2.y < player1.y + 5;
		return check1 || check2; //do more here!
	},
});
collisionEngine.setInitialPositions({});
collisionEngine.numPlayers = 0;

// when we get an update from the user
var collisions = collisionEngine.handleUpdate(getServerTime(), {
	'playerId': givenID,
	'x': parseFloat(player.x),
	'y': parseFloat(player.y)
});
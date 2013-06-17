/** ---- testing stuff ---- **/

var fakePackets = [
	{
		playerId: 0,
		x: 1,
		y: 1,
		ping: 10
	},
	{
		playerId: 1,
		x: 4,
		y: 1,
		ping: 10
	},
	{
		playerId: 1,
		x: 4,
		y: 3,
		ping: 10
	},
	{
		playerId: 0,
		x: 4,
		y: 5,
		ping: 10
	}
];

var fakePacketsIndex = 0;

var collider = new Collider({
	stepSize: 50,
	//movementFunction(oldData, newData, newDataTime, startDataTime, interpolationDataTime);
	movementFunction: function(oldData, newData, oldDataTime, newDataTime, interpolationDataTime){

	},
	//collisionFunction(playerOneData, playerTwoData); 
	collisionFunction: function(player1, player2){

	},
});
collider.setInitialPositions({
	0: {
		x: 0,
		y: 0,
	},
	1: {
		x: 4,
		y: 0
	}
});

var DELAY = 250;

setTimeout(function(){var fakePacketsInterval = setInterval(function(){
	if(fakePacketsIndex < fakePackets.length){
		console.log("Sending packet: Player " + fakePackets[fakePacketsIndex].playerId + " at (" + fakePackets[fakePacketsIndex].x + "," + fakePackets[fakePacketsIndex].y + ")");
		collider.handleUpdate(100 + (DELAY * fakePacketsIndex) - (fakePackets[fakePacketsIndex].ping / 2), fakePackets[fakePacketsIndex]);
	} else{
		clearInterval(fakePacketsInterval);
	}
	fakePacketsIndex ++;
}, DELAY)}, 50);
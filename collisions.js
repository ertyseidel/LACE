function Collider(options){
	this._stepSize = typeof(options.stepSize == 'number') ? parseInt(options.stepSize) : 5;
	this.numPlayers = 0; //this will need to be kept up to date
	if(typeof(options.movementFunction != 'function')) console.log("ERROR: No movement function defined for Collider!");
	if(typeof(options.collisionFunction != 'function')) console.log("ERROR: No collision function defined for Collider!");
	this._updateTable = {};

	/*
		Takes the initial user postions in the form
		{<player0 id>: {
			x: <player 0 x>
			y: <player 0 y>
		 },
		 <player 1 id>: {
			x: <player 1 x>
			y: <player 1 y>
		 },
		 ...
		}
	*/
	this.setInitialPositions = function(playerData){
		this._updateTable[0] = {num: Object.keys(playerData).length, data: playerData};
	}

	/*
		takes the user update data in the form
		{playerId: <playerID>, x: <player x coord>, y: <player y coord>}
		the time should be the time that the server received the packet, minus half of the ping time to the client
		(good luck figuring that out!)
	*/
	this.handleUpdate = function(time, updateData){
		//figure out which step we're on		
		var currStep = time - (time % this._stepSize);
		//create the steps up and including this one if they don't exist
		var checkStep = currStep;
		while(typeof(this._updateTable[checkStep]) == 'undefined' && checkStep >= - this._stepSize){
			console.log("Creating row at " + checkStep);
			this._updateTable[checkStep] = {num: 0, data: {}};
			checkStep -= this._stepSize;
		}
		//put the new data into the table at the correct step
		this._updateTable[currStep].data[updateData.playerId] = {
			'x': updateData.x,
			'y': updateData.y
		}
		this._updateTable[currStep].num ++;
		//find the next previous row containing data from the current player
		var startStep = currStep - this._stepSize;
		while(this._updateTable[checkStep].data[updateData.playerId] == 'undefined'){
			startStep -= this._stepSize;
		}
		//step forward and fill all intermediate rows with interpolated data
		//as soon as we add each datum, check for collisions at that time
		//
		var collisions = [];
		while(interpolationStep < currStep){
			this._updateTable[interpolationStep].data[updateData.playerId] = movementFunction(this._updateTable[interpolationStep - this._stepSize], updateData, startStep, currStep, interpolationStep);
			//do collision detection against all other existing players at that row
			for(var otherPlayer in this._updateTable[interpolationStep].data){ //for each player in the row
				if(otherPlayer != updateData.playerId){ //don't check the player against itself
					var otherPlayerData = this._updateTable[interpolationStep].data[otherPlayer]; //create a temp variable
					otherPlayerData.playerId = otherPlayer; //so that we can append the player's id datum
					var collision = collisionFunction(updateData, otherPlayerData); //check for a collision. Collision data if there was, false otherwise
					if(collision != false){ //if there is a collison
						collisions.push({ 
							'step' : interpolationStep,
							'collision': collision
						}); //push that collision data, including the time when the collision happened, onto an array
					}
				}
			}
			this._updateTable[interpolationStep].num ++; //we have added some data to a row
			//remove rows that are no longer necessary
			if(this._updateTable[startStep].num == numPlayers && this._updateTable[startStep - this._stepSize] == numPlayers){
				delete this._updateTable[startStep - this._stepSize];
			}
			startStep += this._stepSize; //go to the next row
		}
	}
}
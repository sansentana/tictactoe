Boxes = new Mongo.Collection('boxes');

if(Meteor.isClient) {
  Session.set('player', 'X');
  Session.set('winner', null);

  Template.gameboard.helpers({
    boxes: function(){
      return Boxes.find({});
    },
    winner: function(){
      return Session.get('winner');
    }
  });
  Template.gameboard.events({
    'click .reset-game': function() {
      resetGame();
    }
  });
  var resetGame = function () {
    var boxes = Boxes.find().fetch();
    for(var i = 0; i < boxes.length; i++){
      Boxes.update(boxes[i]._id, { $set: { player:  null } });
    }
    Session.set('player', 'X');
    Session.set('winner', null);
  };
  var hasWon = function() {
    var boxes = Boxes.find().fetch(); //make a plain Array of our Collection
    var player = Session.get('player');
    if(Boxes.find({}).count() > 0 && Boxes.findOne({'player': {$exists: true} })) {
      if (boxes[0].player == player && boxes[1].player == player && boxes[2].player == player) {
        return true; //we have a winner
      }
      if (boxes[3].player == player && boxes[4].player == player && boxes[5].player == player) {
        return true; //we have a winner
      }
      if (boxes[6].player == player && boxes[7].player == player && boxes[8].player == player) {
        return true; //we have a winner
      }
      if (boxes[0].player == player && boxes[3].player == player && boxes[6].player == player) {
        return true; //we have a winner
      }
      if (boxes[1].player == player && boxes[4].player == player && boxes[7].player == player) {
        return true; //we have a winner
      }
      if (boxes[2].player == player && boxes[5].player == player && boxes[8].player == player) {
        return true; //we have a winner
      }
      if (boxes[0].player == player && boxes[4].player == player && boxes[8].player == player) {
        return true; //we have a winner
      }
      if (boxes[2].player == player && boxes[4].player == player && boxes[6].player == player) {
        return true; //we have a winner
      }
      return false; //otherwise, there is no winner
    }
  }

  var setNextPlayer = function(){
    if(Session.get('player') === 'X') {
      Session.set('player', 'O');
    } else {
      Session.set('player', 'X');
    }
    return Session.get('player');
  }

  var getCurrentPlayer = function(){
    return Session.get('player');
  };

  Template.box.events({
  click: function(event){
    //do something here
    if(this.player) {
      return; //do nothing
    }

    Boxes.update(this._id, { $set: { player:  setNextPlayer() } });
    if(hasWon()) {
      console.log("Player", setNextPlayer(), "has won");
      Session.set('winner', Session.get('player'));
      setNextPlayer();
      //react to the winning state
    } else {
      setNextPlayer(); //update the player
    }
  }
});

Template.box.helpers({
  'disabled': function(){
    return this.player;
  }
});
}

if(Meteor.isServer){
  Meteor.startup(function(){
    Boxes.remove({});
    //fill 9 cells
    if(Boxes.find({}).count() === 0) {
      for(var i = 0; i < 9; i++){
        Boxes.insert({});
        console.log('inserted box with index', i);
      }
    }
  });
}

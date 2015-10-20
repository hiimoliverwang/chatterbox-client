// YOUR CODE HERE:
var app = {
  currentRoom : undefined,
  init: function(){
    this.fetch();
  },
  send: function(message){
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },
  fetch: function(){
    // should we get rooms when we fetch as well?
      // if so, then call getRooms(data) here for the success callback
    var context = this;
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'GET',
      context: context,
      data: {username:window.location.search.substr(10)},
      contentType: 'application/json',  
      success: function (data) {
          // console.log(data);
          // console.log(this);
        this.clearMessages();

        this.addMessage(data.results);
        
        this.getRooms(data.results);
        
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },
  server: 'https://api.parse.com/1/classes/chatterbox',
  clearMessages: function() {
    $('#chats').children().remove();
  },
  addMessage: function(message) {
    if ( this.currentRoom !== undefined){
      message = _.filter(message, function(item){
        return item.room === this.currentRoom;
      }.bind(this))
    }
    for (var i = 0; i < message.length; i++) {
      var newMessage = $('<div class="chat"></div>');
      var username = $('<span class = "username"></span>');
      username.text(message[i].username);
      var mes = $('<span class = "message"></span>');
      mes.text(' : ' + message[i].text);

      newMessage.append(username);
      newMessage.append(mes);

      $('#chats').append(newMessage);
    }
  },
  addRoom: function(room) {
    // room = $('<option>' + room + '</option>');
    // $('#roomSelect').append(room);
  },
  addFriend: function() {
  
  },
  handleSubmit: function() {
    var obj = {
      username : window.location.search.substr(10),
      text: $('#message').val(),
      room:'lobby'
    };
    this.addMessage(obj);
    this.send(obj);
    this.fetch();
  
  },
  getRooms: function (results) {
    // remove existing rooms
    $('#rooms').children().remove();
    // get unique rooms from all of the messages
    var roomsList = _.uniq(_.pluck(results, 'room'));

    // for each unique room, set this as an option for the select dropdown
    for ( var i = 0; i < roomsList.length; i ++ ) {
      //console.log(roomsList)
      var room = $('<option></option>');
      room.val(roomsList[i]);
      room.text(roomsList[i]);
      //console.log(room.text());
      $('#rooms').append(room);
    }


  },
  enterRoom: function(room) {
    console.log(room.val());

    this.currentRoom = room.val();
    this.fetch();
  },
  createRoom: function() {
    // 
  }

};

$(document).ready(function() {
  $('#main').on('click','.username', function(event) {
    // console.log('hello!!');
    app.addFriend();
  });

  $('#send').on('submit',function(event){

    event.preventDefault();
    app.handleSubmit();
  });

  $('#rooms').on('change', function(){
    app.enterRoom($(this));
  })


  setInterval(app.fetch.bind(app), 5000);
});
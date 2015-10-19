// YOUR CODE HERE:
var app = {
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
    var context = this;
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'GET',
      context: context,
      // data: JSON.stringify(message),
      contentType: 'application/json',  
      success: function (data) {
          // console.log(data);
          // console.log(this);
        for (var i = 0; i < data.results.length; i++) {
          console.log(data.results[i]);
          this.addMessage(data.results[i]);
        }
        
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
    message = $('<div class="chat">' + '<span class = "username">'+ message.username + '</span>' +
               '<span class = "message"> : '+ JSON.stringify(message.text) + '</span>' + '</div>');
    $('#chats').append(message);
  },
  addRoom: function(room) {
    room = $('<div>' + room + '</div>');
    $('#roomSelect').append(room);
  },
  addFriend: function() {

  },
  handleSubmit: function() {
    var obj = {
      username : window.location.search.substr(10),
      text: $('#message').val() ,
      room:'lobby'
    };
    console.log($('#message'));
    this.addMessage(obj);
    this.send(obj);
  
  }

};

$(document).ready(function() {
  $('#main').on('click','.username', function(event) {
    // console.log('hello!!');
    app.addFriend();
  });

  $('#send').on('submit',function(){
    app.handleSubmit();
  });

  

});
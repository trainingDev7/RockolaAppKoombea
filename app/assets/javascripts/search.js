var app = app || {};
app.Rockola = app.Rockola || {};

function onClientLoad() {
  gapi.client.load('youtube', 'v3', app.Rockola.onYouTubeApiLoad);
  $('#onSearchButton').on('click', app.Rockola.search);
  $('#navbarTogglerDemo01 > form').on('submit', function(e){ e.preventDefault(); });
}

app.Rockola.onYouTubeApiLoad = function() {
  gapi.client.setApiKey('AIzaSyAWhX3xLCfnJ-U0HEPo7R0Zc-5J9jCJoXc');
}

app.Rockola.search = function() {
  var query = $('#query').val();
  var request = gapi.client.youtube.search.list({
    part: 'snippet',
    type: 'video',
    maxResults: '10',
    q:query
  });
  request.execute(app.Rockola.onSearchResponse);
}

app.Rockola.onSearchResponse = function(response) {
  $("#response").html('');
  response.items.forEach(function(e){
    $("#response").append('<img width="'+ e.snippet.thumbnails.medium.width +
                          '"src="'+ e.snippet.thumbnails.medium.url +
                          '" height="'+ e.snippet.thumbnails.medium.height +
                          '" value="' + e.snippet.title +
                          '">' + e.snippet.title +
                          '<br></br>');
  });
}

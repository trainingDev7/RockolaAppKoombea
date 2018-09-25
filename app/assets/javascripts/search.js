function onClientLoad() {
    gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
  }

  function onYouTubeApiLoad() {
    gapi.client.setApiKey('AIzaSyAWhX3xLCfnJ-U0HEPo7R0Zc-5J9jCJoXc');
  }

  function search() {
    $('#navbarTogglerDemo01 > form').on('submit', function(e){ e.preventDefault(); });
    var query = document.getElementById('query').value;
    var request = gapi.client.youtube.search.list({
      part: 'snippet',
      type: 'video',
      maxResults: '10',
      q:query
    });
    request.execute(onSearchResponse);
  }

  function onSearchResponse(response) {
      $("#response").html('');
      response.items.forEach(function(e){
          $("#response").append('<img width="'+ e.snippet.thumbnails.medium.width + '"src="'+ e.snippet.thumbnails.medium.url +'" height="'+
               e.snippet.thumbnails.medium.height +'" value="' + e.snippet.title + '">' + e.snippet.title + '<br></br>');
      });
  }

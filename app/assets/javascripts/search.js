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
          $("#response").append('<img data-toggle="modal" data-target="#videoModal" class="video" rel="https://www.youtube.com/embed/'+ e.id.videoId
          +'"src="'+ e.snippet.thumbnails.medium.url +'" value="' + e.snippet.title + '"><br></br>');
      });
  }

  $(function(){
    $('#videoModal').on('shown.bs.modal', function (e) {
      var videoSRC = $(e.relatedTarget).attr("rel")
      $('#videoModal iframe').attr('src', videoSRC + "?rel=0&autoplay=1&showinfo=0&controls=0");
      var valVideo = $(e.relatedTarget).attr("value");
      $('.modal-title').append('<h4>' + valVideo + '</h4>');
    })
  
    $('#videoModal').on('hidden.bs.modal',function(e) {
      $('#videoModal iframe').attr('src', "");
      $('.modal-title').empty('value');
      $("#message_result_modal").hide();
    })
  }) 

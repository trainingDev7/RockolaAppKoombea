var app = app || {};
app.Rockola = app.Rockola || {};

function onClientLoad() {
  gapi.client.load('youtube', 'v3', app.Rockola.onYouTubeApiLoad);
  $('#onSearchButton').on('click', app.Rockola.search);
  $('#navbarTogglerDemo01 > form').on('submit', function(e){ e.preventDefault(); });
  $('#next').on('click', function(e) {
    e.preventDefault();
    app.Rockola.search(app.Rockola.tokenNextPage);
  });
  app.Rockola.Player.onYouTubeIframeAPIReady();

  $(document).on('click', '#js-playlist-content li[data-video]', function(){
    app.Rockola.Player.player.loadVideoById($(this).data('video'), "large");
  })
}

app.Rockola.tokenNextPage = '';

app.Rockola.onYouTubeApiLoad = function() {
  gapi.client.setApiKey('AIzaSyAWhX3xLCfnJ-U0HEPo7R0Zc-5J9jCJoXc');
};

app.Rockola.search = function(token) {
  var query = $('#query').val();
  var optionsQuery = {
    part: 'snippet, id',
    type: 'video',
    maxResults: '10',
    q: query
  };

  var request = gapi.client.youtube.search.list( token.length > 0 ? $.extend(optionsQuery, {pageToken: token}) : optionsQuery);
  request.execute(app.Rockola.onSearchResponse);
};

app.Rockola.onSearchResponse = function(response) {
  app.Rockola.tokenNextPage = response.nextPageToken;

  $("#response").html('');

  response.items.forEach(function(e){
    $("#response").append('<img data-toggle="modal" data-target="#videoModal" class="video" rel="https://www.youtube.com/embed/'+ e.id.videoId +
                      '"src="'+ e.snippet.thumbnails.medium.url +
                      '" value="' + e.snippet.title +
                      '"><br></br>');
  });

  $("#next").show();
};

$(function(){
  $("#next").hide();

  $('#videoModal').on('shown.bs.modal', function (e) {
    var videoSRC = $(e.relatedTarget).attr("rel")
    var valVideo = $(e.relatedTarget).attr("value");
    var songId = videoSRC.split("https://www.youtube.com/embed/")

    $('#videoModal iframe').attr('src', videoSRC + "?autoplay=1&showinfo=0");
    $('.modal-title').append('<h4>' + valVideo + '</h4>');
    $("#song_title").val(valVideo);
    $("#song_videoId").val(songId[1])
  });

  $('#videoModal').on('hidden.bs.modal',function(e) {
    $('#videoModal iframe').attr('src', "");
    $('.modal-title').empty('value');
    $("#message_result_modal").hide();
    $("#song_title, #song_videoId").val("");
  });

  $('.playlist_created').on('change', function(){
    $.ajax({
      url: 'playlists/' + $(this).val(),
      type: 'GET',
      success: function(result){ $("#js-playlist-content").html(result) }
    })
  });

  $('#song_playlist_id').on('change', function(){
    var currentPlaylistId = $(this).val();
    if( currentPlaylistId.length > 0) {
      $('#add_song_to_playlist_form').attr('action', '/playlists/' + $(this).val() + '/songs');
      $('#add_song_to_playlist_form input[type=submit]').fadeIn('fast');
    } else {
      $('#add_song_to_playlist_form input[type=submit]').fadeOut('fast');
    }
  });
});

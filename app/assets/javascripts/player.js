var app = app || {};
app.Rockola = app.Rockola || {};
app.Rockola.Player = app.Rockola.Player || {};

app.Rockola.Player.player = '';

app.Rockola.Player.onPlayerStateChange = function(event) {
  if (event.data == YT.PlayerState.ENDED){
    app.Rockola.Player.player.current_video++;
    app.Rockola.Player.playVideo()
  }
}

app.Rockola.Player.playVideo = function() {
  var videoId = $('#js-playlist-content li[data-video]').eq(app.Rockola.Player.player.current_video).attr('data-video');
  app.Rockola.Player.player.loadVideoById(videoId, "large");
}

app.Rockola.Player.onYouTubeIframeAPIReady = function() {
  app.Rockola.Player.player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: '',
    events: {
      'onStateChange': app.Rockola.Player.onPlayerStateChange
    }
  });
  app.Rockola.Player.player.current_video = 0;
}

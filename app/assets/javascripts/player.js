function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED){
      // your code to run after video has ended
      player.current_video++;
      playVideo()
    }
  }
  
  var player = document.querySelector('iframe');
  function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      height: '390',
      width: '640',
      videoId: '',
      events: {
        'onStateChange': onPlayerStateChange
      }
    });
    
    // Create a property on the player object to keep track of the current video index
    player.current_video = 0;
  }
  
  $(document).on('click', '[data-video]', function(){
    player.current_video = $(this).index();
    playVideo();
  })
  
  function playVideo(){
    var video_id = $('[data-video]').eq(player.current_video).attr('data-video');
    player.loadVideoById(video_id, "large")
  }
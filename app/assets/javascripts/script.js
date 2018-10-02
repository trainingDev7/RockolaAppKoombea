function search() {
    var query = $('#query').val();
    var request = gapi.client.youtube.search.list({
      part: 'snippet, id',
      type: 'video',
      maxResults: '10',
      q:query
    });
    request.execute(onSearchResponse);
  }
  
  function onSearchResponse(response) {
    var nextToken = response.nextPageToken;
    $("#response").html('');
      nextButton(nextToken);
    response.items.forEach(function(e){
      $("#response").append('<img data-toggle="modal" data-target="#videoModal" class="video" rel="https://www.youtube.com/embed/'+ e.id.videoId +
                            '"src="'+ e.snippet.thumbnails.medium.url +
                            '" value="' + e.snippet.title +
                            '"><br></br>');
    });
  }
  
   function nextButton(token) {
     $('#next').off('click').on('click', function(e) {
        e.preventDefault();
        nextPage(token);
     });
   };
  
   function nextPage(token) {
    var query = $('#query').val();
    var request = gapi.client.youtube.search.list({
      part: 'snippet, id',
      type: 'video',
      maxResults: '10',
      q:query,
      pageToken: token
    });
    request.execute(onSearchResponse);
  }
  
  function onSearchResponse(response) {
    var nextToken = response.nextPageToken;
    $("#response").html('');
        nextButton(nextToken);
        console.log(nextToken);
    response.items.forEach(function(e){
      $("#response").append('<img data-toggle="modal" data-target="#videoModal" class="video" rel="https://www.youtube.com/embed/'+ e.id.videoId +
                            '"src="'+ e.snippet.thumbnails.medium.url +
                            '" value="' + e.snippet.title +
                            '"><br></br>');
    });
    $("#next").show();
  }
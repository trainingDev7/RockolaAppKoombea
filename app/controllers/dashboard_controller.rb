class DashboardController < ApplicationController
  def index
    @playlists = Playlist.all
    @songs = Song.all
  end
end

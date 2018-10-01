class DashboardController < ApplicationController
  def index
    @playlists = Playlist.all
  end
end

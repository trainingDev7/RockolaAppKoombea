class DashboardController < ApplicationController
  skip_before_action :authenticate_request
  def index
    @playlists = Playlist.all
  end
end

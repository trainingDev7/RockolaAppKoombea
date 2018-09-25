class PlaylistsController < ApplicationController
  before_action :set_playlist, only: [:show, :edit, :update, :destroy]
  layout false, only: :show

  def index
    @playlists = Playlist.all
  end

  def show
    @songs_from_playlist = Song.where(playlist: params[:id])
  end

  def new
    @playlist = Playlist.new
  end

  def create
    @playlist = Playlist.new(playlists_params)
    @playlist.user = current_user
    if @playlist.save
      respond_to do |format|
        format.js
      end
    end
  end

  private

  def set_playlist
    @playlist = Playlist.find(params[:id])
  end

  def playlists_params
    params.require(:playlist).permit(
      :name
    )
  end
end

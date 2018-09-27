class PlaylistsController < ApplicationController
  before_action :set_playlist, only: [:show, :edit, :update, :destroy]
  layout false, only: :show

  def index
    @playlists = Playlist.all
  end

  def show
  end

  def new
    @playlist = Playlist.new
  end

  def update
    respond_to do |format|
      if @playlist.update(playlists_params)
        format.html { redirect_to @playlist, notice: 'Playlist was successfully updated.' }
        format.json { render :show, status: :ok, location: @playlist }
      else
        format.html { render :edit }
      end
    end
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

class SongsController < ApplicationController
  before_action :set_songs, only: [:show, :edit, :update, :destroy]

  def index
    @songs = Song.all
  end

  def new
    @song = Song.new
  end

  def create
    @song = Song.new(song_params)
    @song.user = current_user
    if @song.save
      respond_to do |format|
        format.js
      end
    end
  end

  private

  def set_songs
    @song = Song.find(params[:id])
  end

  def song_params
    params.require(:song).permit(
      :playlist_id,
      :title,
      :videoId
    )
  end
end

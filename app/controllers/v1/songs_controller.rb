module V1
  class SongsController < ApplicationController
    before_action :authenticate_request, only: [:create, :destroy]
    before_action :set_playlist
    before_action :set_playlist_song, only: [:show, :update, :destroy]

    # GET /playlists/:playlist_id/songs
    def index
      json_response(@playlist.songs)
    end

    # POST /playlists/:playlist_id/songs
    def create
      @song = @playlist.songs.new(song_params)
      if @song.save
        flash[:notice] = "Success!"
        json_response(@song, :created)
      else
        flash[:alert] = "Error"
        json_response(@song.errors, :unprocessable_entity)
      end
    end

    # DELETE /playlists/:playlist_id/songs/:id
    def destroy
      if @song.destroy
        head :no_content
      else
        json_response(@song.errors, :unprocessable_entity)
      end
    end

    private

    def song_params
      params.require(:song).permit(:title, :video_id)
    end

    def set_playlist
      @playlist = Playlist.find(params[:playlist_id])
    end

    def set_playlist_song
      @song = @playlist.songs.find_by!(id: params[:id]) if @playlist
    end
  end
end

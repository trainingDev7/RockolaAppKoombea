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
      count = 0
      @songs = song_params[:songs]
      @songs.each do |object|
        @song = @playlist.songs.new(object)
        if @song.save
          count += 1
        end
      end
      response_success = { songs: "the songs were saved correctly", playlist: @playlist.id, quantity: count }
      response_warning = { warning: "some songs were not saved correctly", playlist: @playlist.id, quantity: count }
      response_error = { error: "the songs already exist in the playlist" }
      if @songs.length == count
        json_response(response_success, :created)
      elsif count < @songs.length && count > 0
        json_response(response_warning, :multi_status)
      else
        json_response(response_error, :unprocessable_entity)
      end
    end

    # DELETE /playlists/:playlist_id/songs/:id
    def destroy
      if (@song.user_id == current_user.id) || (@song.playlist.user_id == current_user.id)
        if @song.destroy
          head :no_content
        else
          json_response(@song.errors, :unprocessable_entity)
        end
      else
        response = { message: "You don't have permission for this action!" }
        json_response(response, :unauthorized)
      end
    end

    private

    def song_params
      params.require(:song).permit({ songs: [
        :title, 
        :video_id,
        :user_id
      ] })
    end

    def set_playlist
      @playlist = Playlist.find(params[:playlist_id])
    end

    def set_playlist_song
      @song = @playlist.songs.find_by!(id: params[:id]) if @playlist
    end
  end
end

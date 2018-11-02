module V1
  class PlaylistsController < ApplicationController
    before_action :authenticate_request, only: [:update, :destroy]
    before_action :set_playlist, only: [:show, :update, :destroy]

    # GET /playlists
    def index
      @playlists = Playlist.all
      json_response(@playlists)
    end

    # POST /playlists
    def create
      @playlist = Playlist.new(playlist_params)
      if @playlist.save
        json_response(@playlist, :created)
      else
        json_response(@playlist.errors, :unprocessable_entity)
      end  
    end

    # GET /playlists/:id
    def show
      json_response(@playlist)
    end

    # PUT /playlists/:id
    def update
      @playlist.update(playlist_params)
      if @playlist.persisted?
        json_response(@playlist, :ok)
      else
        json_response(@playlist.errors, :unprocessable_entity)
      end
    end

    # DELETE /playlists/:id
    def destroy
      if @playlist.destroy
        head :no_content
      else
        json_response(@playlist.errors, :unprocessable_entity)
      end
    end

    private
    def playlist_params
      # whitelist params
      params.require(:playlist).permit(:name)
    end

    def set_playlist
      @playlist = Playlist.find(params[:id])
    end
  end
end

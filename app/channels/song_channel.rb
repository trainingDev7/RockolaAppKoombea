class SongChannel < ApplicationCable::Channel
    
  def subscribed
    stream_from "song"
  end

  def send_song(data)
    ActionCable.server.broadcast "song", { 
      songs: data['songs'],
      playlist_id: data['playlist_id'], 
      user_name: data['user_name']
    }
  end
end

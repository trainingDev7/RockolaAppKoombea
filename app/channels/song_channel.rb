class SongChannel < ApplicationCable::Channel
    
  def subscribed
    stream_from "song"
  end

  def send_song(data)
    ActionCable.server.broadcast "song", { title: data['title'], video_id: data['video_id'], playlist_id: data['playlist_id'] }
  end
end

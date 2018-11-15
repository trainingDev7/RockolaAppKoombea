class SongChannel < ApplicationCable::Channel
    
  def subscribed
    stream_from "song"
  end

  def send_song(data)
    ActionCable.server.broadcast "song", { id: data['id'], title: data['title'], video_id: data['video_id'], playlist_id: data['playlist_id'], user_id: data['user_id'] }
  end
end

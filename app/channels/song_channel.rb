class SongChannel < ApplicationCable::Channel
    
  def subscribed
    stream_from "song"
  end

  def send_song(data)
    ActionCable.server.broadcast "song", {
      action: 'add',
      id: data['id'], 
      title: data['title'], 
      video_id: data['video_id'], 
      playlist_id: data['playlist_id'], 
      user_id: data['user_id'],
      user_name: data['user_name']
    }
  end

  def remove_song(data)
    ActionCable.server.broadcast "song", { 
      action: 'remove',
      title: data['title'],
      video_id: data['video_id'],
    }
  end
end

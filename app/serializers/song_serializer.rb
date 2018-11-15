class SongSerializer < ActiveModel::Serializer
  attributes :id, :title, :video_id, :user_id
end

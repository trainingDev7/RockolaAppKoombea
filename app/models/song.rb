class Song < ApplicationRecord
  belongs_to :playlist
  validates :title, presence: true
  validates :video_id, presence: true ,uniqueness: { scope: :playlist_id }
end

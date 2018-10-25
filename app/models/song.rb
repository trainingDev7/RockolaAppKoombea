class Song < ApplicationRecord
  belongs_to :playlist
  validates :videoId, uniqueness: true
end

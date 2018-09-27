class Song < ApplicationRecord
  belongs_to :playlist
  belongs_to :user
  validates :videoId, uniqueness: true
end

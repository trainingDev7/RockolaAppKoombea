class User < ApplicationRecord
  validates_presence_of :name
  validates :email, uniqueness: true
  has_many :playlists, dependent: :destroy
  has_many :songs, dependent: :destroy
end

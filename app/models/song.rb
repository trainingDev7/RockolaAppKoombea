class Song < ApplicationRecord
  belongs_to :playlist
  belongs_to :user
end

class AddRelationUserToPlaylists < ActiveRecord::Migration[5.2]
  def change
    add_reference :playlists, :user, foreign_key: true
    add_reference :songs, :user, foreign_key: true
  end
end

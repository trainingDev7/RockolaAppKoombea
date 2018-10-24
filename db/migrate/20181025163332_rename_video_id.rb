class RenameVideoId < ActiveRecord::Migration[5.2]
  def change
    rename_column :songs, :videoId, :video_id
  end
end

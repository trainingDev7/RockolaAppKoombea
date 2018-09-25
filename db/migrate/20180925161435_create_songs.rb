class CreateSongs < ActiveRecord::Migration[5.2]
  def change
    create_table :songs do |t|
      t.references :playlist, foreign_key: true
      t.references :user, foreign_key: true
      t.string :title
      t.string :videoId

      t.timestamps
    end
  end
end

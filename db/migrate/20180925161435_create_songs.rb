class CreateSongs < ActiveRecord::Migration[5.2]
  def change
    create_table :songs do |t|
      t.references :playlist, foreign_key: true
      t.references :user, foreign_key: true
      t.string :title, :null => false
      t.string :videoId, :null => false
      t.index :videoId, unique: true
      t.timestamps
    end
  end
end

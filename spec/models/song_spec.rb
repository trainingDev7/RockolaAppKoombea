require 'rails_helper'

RSpec.describe Song, type: :model do
  it { should belong_to(:playlist) }
  it { should validate_presence_of(:title) }
  it { should validate_presence_of(:video_id) }
  it { should validate_uniqueness_of(:video_id).scoped_to(:playlist_id) }
end

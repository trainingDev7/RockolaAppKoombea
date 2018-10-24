FactoryBot.define do
  factory :song do
    title { "My Song" }
    video_id { "videoID#{rand(10000000000)}" }
    association :playlist, factory: :playlist
  end
end

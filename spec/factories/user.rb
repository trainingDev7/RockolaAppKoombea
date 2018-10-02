FactoryBot.define do
  factory :user do
    name { "Bill Gates" }
    sequence(:email) { |n| "user#{n}@koombea.com" }
    password { "password" }
  end
end

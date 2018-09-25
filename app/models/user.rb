class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :omniauthable, omniauth_providers: [:google_oauth2]

  def self.find_from_google_oauth2(auth_data)
    where(email: auth_data.email).first_or_create!({
      password: Devise.friendly_token[0, 20],
      name: "#{auth_data.first_name} #{auth_data.last_name}"
    })
  end
end

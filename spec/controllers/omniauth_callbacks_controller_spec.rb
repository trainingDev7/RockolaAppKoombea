require 'rails_helper'

RSpec.describe OmniauthCallbacksController, type: :controller do
  describe "GET google_oauth2" do
    subject { get :google_oauth2 }

    before do
      OmniAuth.config.mock_auth[:google] = OmniAuth::AuthHash.new({
        provider: "google",
        info: {
          email: "billgates@myapp.com",
          first_name: "Bill",
          last_name: "Gates",
        }
      })
      request.env["devise.mapping"] = Devise.mappings[:user]
      request.env["omniauth.auth"] = OmniAuth.config.mock_auth[:google]
    end

    it "signs in and redirects the user to the dashboard" do
      expect(subject).to redirect_to(root_path)
    end
  end
end
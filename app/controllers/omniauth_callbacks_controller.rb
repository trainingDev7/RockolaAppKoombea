class OmniauthCallbacksController < ::Devise::OmniauthCallbacksController
  def google_oauth2
    @user = User.find_from_google_oauth2(request.env["omniauth.auth"].info)
    @user.remember_me = true
    sign_in(:user, @user)

    redirect_to root_path, notice: "Signed in succesfully"
  end

  def failure
    redirect_to root_path, alert: "Only for koombea users."
  end
end

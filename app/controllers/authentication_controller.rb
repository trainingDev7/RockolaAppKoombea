class AuthenticationController < ApplicationController
 skip_before_action :authenticate_request, only: :authenticate

  def authenticate
    auth = AuthenticateUser.call(user_params[:name], user_params[:email])

    if auth.success?
      render json: { auth_token: auth.result }
    else
      render json: { error: auth.errors }, status: :unauthorized
    end
  end

  def user_params
    params.require(:user).permit(
      :name,
      :email
    )
  end
end

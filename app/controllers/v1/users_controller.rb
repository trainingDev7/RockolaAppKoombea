module V1
  class UsersController < ApplicationController
    skip_before_action :authenticate_request
    # POST /signup
    # return authenticated token upon signup
    def create
      user = User.new(user_params)
      if user.save
        auth_token = AuthenticateUser.new(user.email, user.password).call
        response = { name: user.name, message: Message.account_created, auth_token: auth_token.result }
        json_response(response, :created)
      else
        json_response(user.errors, :unprocessable_entity)  
      end
    end

    private

    def user_params
      params.permit(
        :name,
        :email,
        :password
      )
    end
  end
end

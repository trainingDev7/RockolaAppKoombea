class AuthenticationController < ApplicationController
 skip_before_action :authenticate_request, only: :authenticate

 def authenticate
   auth = AuthenticateUser.call(params[:email], params[:password])

   if auth.success?
     render json: { auth_token: auth.result }
   else
     render json: { error: auth.errors }, status: :unauthorized
   end
 end
end

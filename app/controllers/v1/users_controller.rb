module V1
  class UsersController < ApplicationController
    skip_before_action :authenticate_request

    def index
      @user = User.all
      json_response(@user)
    end
    
  end
end

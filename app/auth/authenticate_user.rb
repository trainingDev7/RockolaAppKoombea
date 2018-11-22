class AuthenticateUser
  prepend SimpleCommand

  def initialize(name, email)
    @name = name
    @email = email
  end

  def call
    JsonWebToken.encode(user: { id: @user.id, name: @user.name}) if user
  end

  private

  attr_accessor :email, :user

  def user
    @user = User.create_with(name: @name).find_or_create_by(email: @email)
    return @user if @user

    errors.add :user_authentication, 'invalid credentials'
    nil
  end
end

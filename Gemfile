source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.4.1'
gem 'rails', '~> 5.2.1'
gem 'pg', '>= 0.18', '< 2.0'
gem 'puma', '~> 3.11'
gem 'sass-rails', '~> 5.0'
gem 'uglifier', '>= 1.3.0'
gem 'coffee-rails', '~> 4.2'
gem 'jbuilder', '~> 2.5'
gem 'devise', '~> 4.5'
gem 'jquery-rails'
gem 'bootstrap', '~> 4.1.3'
gem 'bootstrap-glyphicons'
gem 'omniauth-google-oauth2', '~> 0.5.3'
gem 'webpacker', '~> 3.5', '>= 3.5.5'
gem 'foreman', '~> 0.85.0'
gem 'bootsnap', '>= 1.1.0', require: false
gem 'rack-cors', '~> 0.4.0', :require => 'rack/cors'
gem 'jwt', '~> 2.1'
gem 'bcrypt', '~> 3.1', '>= 3.1.12'
gem 'simple_command', '~> 0.0.9'
gem 'active_model_serializers', '~> 0.10.7'
gem 'redis-rails'

group :development, :test do
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  gem 'dotenv-rails', '~> 2.5'
  gem 'rspec-rails', '~> 3.8'
  gem 'capybara', '~> 3.10'
end

group :development do
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '>= 3.0.5', '< 3.2'
end

group :test do
  gem 'selenium-webdriver'
  gem 'chromedriver-helper'
  gem 'factory_bot_rails', '~> 4.11', '>= 4.11.1'
  gem 'shoulda-matchers', '~> 3.1', '>= 3.1.2'
  gem 'database_cleaner', '~> 1.7'
end

gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]

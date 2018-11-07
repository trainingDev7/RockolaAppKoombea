Rails.application.routes.draw do
  scope module: :v1, constraints: ApiVersion.new('v1', true) do
    resources :users, only: :index
    resources :playlists do
      resources :songs
    end
  end
  mount ActionCable.server => "/cable"
  post 'authenticate', to: 'authentication#authenticate'
  post 'signup', to: 'v1/users#create'
  root 'dashboard#index'
end
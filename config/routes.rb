Rails.application.routes.draw do
  resources :playlists do
    resources :songs, only: [:index, :create, :destroy]
  end
  root 'dashboard#index'
end

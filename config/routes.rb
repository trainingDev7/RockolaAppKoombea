Rails.application.routes.draw do
  resources :playlists do
    resources :songs, only: [:index, :create, :destroy]
  end
  devise_for :users, controllers: { omniauth_callbacks: 'omniauth_callbacks' }
  root 'dashboard#index'
end

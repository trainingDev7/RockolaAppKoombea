require 'rails_helper'

RSpec.describe 'Playlists API', type: :request do
  # initialize test data
  let(:user) { create(:user) }
  let(:headers) { valid_headers }
  let!(:playlists) { create_list(:playlist, 10) }
  let(:playlist_id) { playlists.first.id }
  # Test suite for GET /playlists
  describe 'GET /playlists' do
    # make HTTP get request before each example
    before { get '/playlists', headers: headers }

    it 'returns playlists' do
      # Note `json` is a custom helper to parse JSON responses
      expect(json).not_to be_empty
      expect(json.size).to eq(10)
    end

    it 'returns status code 200' do
      expect(response).to have_http_status(200)
    end
  end

  # Test suite for GET /playlists/:id
  describe 'GET /playlists/:id' do
    before { get "/playlists/#{playlist_id}", headers: headers }

    context 'when the record exists' do
      it 'returns the playlist' do
        expect(json).not_to be_empty
        expect(json['id']).to eq(playlist_id)
      end

      it 'returns status code 200' do
        expect(response).to have_http_status(200)
      end
    end

    context 'when the record does not exist' do
      let(:playlist_id) { 100 }

      it 'returns status code 404' do
        expect(response).to have_http_status(404)
      end

      it 'returns a not found message' do
        expect(response.body).to match(/Couldn't find Playlist/)
      end
    end
  end

  # Test suite for POST /playlists
  describe 'POST /playlists' do
    # valid payload
    let(:valid_attributes) { { name: 'My Playlist' } }

    context 'when the request is valid' do
      before { post '/playlists', params: valid_attributes.to_json, headers: headers }

      it 'creates a playlist' do
        expect(json['name']).to eq('My Playlist')
      end

      it 'returns status code 201' do
        expect(response).to have_http_status(201)
      end
    end

    context 'when the request is invalid' do
      before { post '/playlists', params: { name: '' }.to_json, headers: headers }

      it 'returns status code 422' do
        expect(response).to have_http_status(422)
      end

      it 'returns a validation failure message' do
        expect(response.body)
          .to match(/Validation failed: Name can't be blank/)
      end
    end
  end

  # Test suite for PUT /playlists/:id
  describe 'PUT /playlists/:id' do
    let(:valid_attributes) { { name: 'Random Music' } }

    context 'when the record exists' do
      before { put "/playlists/#{playlist_id}", params: valid_attributes.to_json, headers: headers }

      it 'updates the record' do
        expect(response.body).to be_empty
      end

      it 'returns status code 204' do
        expect(response).to have_http_status(204)
      end
    end
  end

  # Test suite for DELETE /playlists/:id
  describe 'DELETE /playlists/:id' do
    before { delete "/playlists/#{playlist_id}", headers: headers }

    it 'returns status code 204' do
      expect(response).to have_http_status(204)
    end
  end
end

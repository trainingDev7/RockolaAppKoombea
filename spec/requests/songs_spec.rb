require 'rails_helper'

RSpec.describe 'Songs API' do
  let(:user) { create(:user) }
  let(:headers) { valid_headers }
  before do
    create_list(:song, 20, playlist_id: playlist.id)
  end
  let(:playlist) { create(:playlist) }
  let(:playlist_id) { playlist.id }
  let(:id) { playlist.songs.first.id }

  describe 'GET /playlists/:playlist_id/songs' do
    before { get "/playlists/#{playlist_id}/songs", headers: headers }

    context 'when playlist exists' do
      it 'returns status code 200' do
        expect(response).to have_http_status(200)
      end

      it 'returns all playlist songs' do
        expect(json.size).to eq(20)
      end
    end

    context 'when playlist does not exist' do
      let(:playlist_id) { 0 }

      it 'returns status code 404' do
        expect(response).to have_http_status(404)
      end

      it 'returns a not found message' do
        expect(response.body).to match(/Couldn't find Playlist/)
      end
    end
  end

  describe 'DELETE /playlists/:id' do
    before { delete "/playlists/#{playlist_id}/songs/#{id}", headers: headers }

    it 'returns status code 204' do
      expect(response).to have_http_status(204)
    end
  end
end

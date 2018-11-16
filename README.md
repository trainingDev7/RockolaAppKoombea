# RockolaApp

This is a friendly interface to listen to music, thanks to the YouTube API.

 

**How does it work?**

As a first step we need a playlist to which we can add our songs, for this we go to the search engine that we have at the top of the application and write the name of the desired song, then a column with all possible matches will be displayed according to the search.

When clicking on any of the search items a modal will be displayed in which we will find a preview of the song, we will also find a button to create playlists that when clicked, another modal will be displayed to write the name of the desired list.

After creating the playlist we can proceed to add songs; which we can do from the modal that is on the screen, by using the tool to select playlists and click on the add button, we can repeat this process for all the desired songs.

Then to listen to the complete list, we went to select it in the upper right part of the application, by double clicking on one of its songs we can start enjoying the playback queue while it is always active.

 

**Are there restrictions?**

Of course, we handle permissions for the control of playlists and these are:

* When creating a playlist this makes you own all actions on it (Update your name, Delete your songs)

* You can not delete a playlist that you did not create.

In addition to this, we have to highlight that any user of the application can add songs to your playlist and has the right to delete only those that he adds.

 
**But how do I know what my playlists are?**

By using the playlist selection tool you can notice that at the top of each set of lists is a name, these are the users of the application and their playlists; if you are registered you can see yours.

---

You can visit the [RockolaAppKoombea](https://rockolapp.herokuapp.com/) site in Heroku

---
###### Rails 5.2.1
###### Ruby 2.4.1p111
###### VueJS 2.9.6
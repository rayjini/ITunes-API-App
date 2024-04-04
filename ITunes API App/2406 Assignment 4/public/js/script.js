
// Fetches songs based on the entered title and processes the response
function getSong() {
  let songTitle = document.getElementById('songTitleTextField').value.trim();
  if (songTitle === '') {
    alert('Please enter a Song Title');
    return;
  }
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let response = JSON.parse(xhr.responseText);
      addSongsToSearchResults(response, songTitle);
    }
  };
  xhr.open('GET', `/songs?title=${encodeURIComponent(songTitle)}`, true);
  xhr.send();
}

// Initializes event listeners once the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('submit_button').addEventListener('click', getSong);
  document.getElementById('songTitleTextField').addEventListener('keyup', handleKeyUp);
  loadPlaylist(); 
});

// Handles keyup event on the song title text field to trigger song search on pressing Enter
const ENTER=13
function handleKeyUp(event) {
event.preventDefault()
   if (event.keyCode === ENTER) {
      document.getElementById("submit_button").click()
  }
}

// Displays the songs that match the search in the search results section
function addSongsToSearchResults(songsData, songTitle) {
  let songsDiv = document.getElementById('songs_div');
  songsDiv.innerHTML = `<h2>Songs matching: ${songTitle}</h2>`;
  let table = document.createElement('table');
  songsData.results.forEach((song) => {
    let tr = document.createElement('tr');
    tr.innerHTML = `
      <td><button class="add-button">+</button></td>
      <td>${song.trackName}</td>
      <td>${song.artistName}</td>
      <td><img src="${song.artworkUrl100}" alt="Artwork"></td>
    `;
    table.appendChild(tr);
    tr.querySelector('.add-button').addEventListener('click', function() {
      addSongToPlaylist(song);
    });
  });
  songsDiv.appendChild(table);
}

// Adds a selected song to the playlist
function addSongToPlaylist(song) {
  let playlistTable = document.getElementById('playlist_table').getElementsByTagName('tbody')[0];
  let row = playlistTable.insertRow();
  let html = `
    <td><button class="move-up-button">&#9650;</button></td>
    <td><button class="move-down-button">&#9660;</button></td>
    <td><button class="remove-button">-</button></td>
    <td>${song.trackName}</td>
    <td>${song.artistName}</td>
    <td><img src="${song.artworkUrl100}" alt="Artwork"></td>
  `;
  row.innerHTML = html;
  row.querySelector('.move-up-button').addEventListener('click', moveSongUp);
  row.querySelector('.move-down-button').addEventListener('click', moveSongDown);
  row.querySelector('.remove-button').addEventListener('click', removeSongFromPlaylist);
  savePlaylist();
}

// Moves a song up in the playlist
function moveSongUp(event) {
  let row = event.target.closest('tr');
  let prevRow = row.previousElementSibling;
  if (prevRow) {
    row.parentNode.insertBefore(row, prevRow);
    savePlaylist();
  }
}

// Moves a song down in the playlist
function moveSongDown(event) {
  let row = event.target.closest('tr');
  let nextRow = row.nextElementSibling;
  if (nextRow) {
    row.parentNode.insertBefore(nextRow.nextSibling, row);
    savePlaylist();
  }
}

// Removes a song from the playlist
function removeSongFromPlaylist(event) {
  let row = event.target.closest('tr');
  row.remove();
  savePlaylist();
}

// Saves the current playlist to local storage
function savePlaylist() {
  let playlist = [];
  let rows = document.querySelectorAll('#playlist_table tbody tr');
  rows.forEach((row) => {
    let song = {
      trackName: row.cells[3].textContent,
      artistName: row.cells[4].textContent,
      artworkUrl100: row.cells[5].querySelector('img').src
    };
    playlist.push(song);
  });
  localStorage.setItem('playlist', JSON.stringify(playlist));
}

// Loads the playlist from local storage upon initialization
function loadPlaylist() {
  let playlist = JSON.parse(localStorage.getItem('playlist'));
  if (playlist) {
    playlist.forEach(addSongToPlaylist);
  }
}


const express = require('express') //express framework
const http = require('http')
const PORT = process.env.PORT || 3000 //allow environment variable to possible set PORT

const app = express()
//Middleware
app.use(express.static(__dirname + '/public')) 

//Routes
app.get('/', (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})

app.get('/songs', (request, response) => {
  console.log(request.path)
  let songTitle = request.query.title
  let titleWithPlusSigns = songTitle.trim().replace(/\s/g, '+')
  console.log('titleWithPlusSigns: ' + titleWithPlusSigns)

  console.log('query: ' + JSON.stringify(request.query))
  if(!songTitle) {
    //Entering your song title
    response.json({message: 'Please enter Song Title'})
    return
  }
//http://itunes.apple.com/search?term=Body+And+Soul&&entity=musicTrack&limit=3
const options = {
  "method": "GET",
  "hostname": "itunes.apple.com",
  "port": null,
  "path": `/search?term=${titleWithPlusSigns}&entity=musicTrack&limit=20`, 
  "headers": {
    "useQueryString": true
    }
  }

  http.request(options, function(apiResponse) {
    let songData = ''
    apiResponse.on('data', function(chunk) {
      songData += chunk
    })
    apiResponse.on('end', function() {
      response.contentType('application/json').json(JSON.parse(songData))
    })
  }).end() 
           
})

//Starting the server
app.listen(PORT, err => {
  if(err) console.log(err)
  else {
    console.log(`Server listening on port: ${PORT}`)
    console.log(`To Test:`)
    console.log(`http://localhost:3000/songs?title=Body+And+Soul`)
    console.log(`http://localhost:3000`)
  }
})
const path = require('path')

exports.youTube = {
  apiKey: 'YOUTUBE_API_KEY',
  cacheUri: `sqlite://${path.join(__dirname, '../tmp/youtube-api.sqlite')}`,
}

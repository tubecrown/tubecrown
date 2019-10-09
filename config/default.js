const path = require('path')

exports.youTube = {
  apiKey: 'YOUTUBE_API_KEY',
  cacheUri: `sqlite://${path.join(__dirname, '../tmp/youtube-api.sqlite')}`,
}

exports.postgres = {
  host: 'localhost',
  port: 5432,
  database: 'tubecrown',
  username: 'tubecrown_postgres',
  password: 'tubecrown_secret',
}

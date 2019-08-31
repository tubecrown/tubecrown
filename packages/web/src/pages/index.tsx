import { VideoDto } from '@tubecrown/core/lib/video'
import axios from 'axios'
import { Component, Vue } from 'nuxt-property-decorator'
import { MetaInfo } from 'vue-meta'
import { VideoCard } from '../components/video'

@Component<HomePage>({
  components: {
    VideoCard,
  },
  async asyncData () {
    const videos = (await axios.get<VideoDto>('http://localhost:4000/api/videos')).data
    return {
      videos,
    }
  },
})
export default class HomePage extends Vue {
  readonly videos!: VideoDto[]

  head (): MetaInfo {
    return {
      title: 'Home',
    }
  }

  render () {
    return (
      <v-container>
        <v-row>
          {this.videos.map((video) => (
            <v-col key={video.id} cols={12} sm={6} md={4} lg={3}>
              <video-card video={video}/>
            </v-col>
          ))}
        </v-row>
      </v-container>
    )
  }
}

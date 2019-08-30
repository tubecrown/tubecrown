import { VideoDto } from '@tubecrown/core/lib/video'
import axios from 'axios'
import { Component, Vue } from 'nuxt-property-decorator'
import { MetaInfo } from 'vue-meta'

@Component<HomePage>({
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
        <ul>
          {this.videos.map((video) => (
            <li key={video.id} domProps={{ innerHTML: video.title }}/>
          ))}
        </ul>
      </v-container>
    )
  }
}

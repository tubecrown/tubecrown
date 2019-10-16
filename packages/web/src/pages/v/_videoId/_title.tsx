import { Context } from '@nuxt/types'
import slugify from '@sindresorhus/slugify'
import { VideoDto } from '@tubecrown/core/lib/video'
import axios from 'axios'
import { htmlUnescape } from 'escape-goat'
import { Component, Vue } from 'nuxt-property-decorator'
import { MetaInfo } from 'vue-meta'
import { VideoPlayer } from '../../../components/video'

@Component<WatchPage>({
  components: {
    VideoPlayer,
  },
  async asyncData (context: Context) {
    const { params } = context
    const video = (await axios.get<VideoDto>(`http://localhost:4000/api/videos/${params.videoId}`)).data
    return {
      video,
    }
  },
})
export default class WatchPage extends Vue {
  readonly video!: VideoDto

  async middleware (context: Context) {
    const { params } = context
    const video = (await axios.get<VideoDto>(`http://localhost:4000/api/videos/${params.videoId}`)).data
    const slugTitle = slugify(video.titleHtml)
    if (slugTitle !== params.title) {
      context.redirect(`/v/${params.videoId}/${slugTitle}`)
    }
  }

  head (): MetaInfo {
    return {
      title: htmlUnescape(this.video.titleHtml),
    }
  }

  render () {
    return (
      <v-container>
        <video-player video={this.video}/>
      </v-container>
    )
  }
}

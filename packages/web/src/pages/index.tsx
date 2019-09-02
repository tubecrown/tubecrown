import { VideoDto } from '@tubecrown/core/lib/video'
import axios from 'axios'
import { Component, Vue } from 'nuxt-property-decorator'
import { MetaInfo } from 'vue-meta'
import { VideoCard, VideoClickEvent, VideoDialog } from '../components/video'
import { isPureClickEvent } from '../utils/events'

@Component<HomePage>({
  components: {
    VideoDialog,
    VideoCard,
  },
  async asyncData () {
    const videos = (await axios.get<VideoDto[]>('http://localhost:4000/api/videos')).data
    return {
      videos,
    }
  },
})
export default class HomePage extends Vue {
  readonly videos!: VideoDto[]
  selectedVideo?: VideoDto

  head (): MetaInfo {
    return {
      title: 'Home',
    }
  }

  data () {
    return {
      selectedVideo: undefined,
    }
  }

  handleVideoClick (videoClickEvent: VideoClickEvent) {
    const { video, event } = videoClickEvent
    if (!isPureClickEvent(event)) {
      return
    }
    history.pushState({}, '', `/v/${video.id}`)
    this.selectedVideo = video
    event.stopPropagation()
  }

  handleVideoDialogUpdate (value: boolean) {
    if (!value) {
      history.pushState({}, '', this.$route.fullPath)
      this.selectedVideo = undefined
    }
  }

  mounted () {
    window.onpopstate = () => {
      this.selectedVideo = undefined
    }
  }

  beforeDestroy () {
    window.onpopstate = () => {}
  }

  render () {
    return (
      <v-container>
        <video-dialog video={this.selectedVideo} on={{ 'video-dialog-update': this.handleVideoDialogUpdate }}/>
        <v-row>
          {this.videos.map((video) => (
            <v-col key={video.id} cols={12} sm={6} md={4} lg={3}>
              <video-card video={video} on={{ 'video-click': this.handleVideoClick }}/>
            </v-col>
          ))}
        </v-row>
      </v-container>
    )
  }
}

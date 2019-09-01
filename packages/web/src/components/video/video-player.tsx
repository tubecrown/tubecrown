import { VideoDto } from '@tubecrown/core/lib/video'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Player, withYouTube } from '../../utils/youtube-player'

const playerPlaceholder = 'playerPlaceholder'

@Component<VideoPlayer>({})
export class VideoPlayer extends Vue {
  @Prop(Object)
  readonly video!: VideoDto
  private player!: Player

  mounted () {
    withYouTube((PlayerContructor) => {
      this.player = new PlayerContructor(playerPlaceholder, {
        videoId: this.video.id,
        playerVars: {
          autoplay: 1,
          modestbranding: 1,
          rel: 0,
          origin: window.location.origin,
        },
      })
    })
  }

  beforeDestroy () {
    if (this.player) {
      this.player.destroy()
    }
  }

  render () {
    const { titleHtml } = this.video
    return (
      <div>
        <div class='video-player__background'>
          <div class='video-player__container'>
            <div id={playerPlaceholder}/>
          </div>
        </div>
        <div domProps={{ innerHTML: titleHtml }}/>
      </div>
    )
  }
}
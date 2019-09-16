import { VideoDto } from '@tubecrown/core/lib/video'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { formatFromNow } from '../../utils/datetimes'
import { formatShortNumber } from '../../utils/numbers'
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
    const { titleHtml, channelTitle, publishedAt, viewCount } = this.video
    return (
      <div>
        <div class='video-player__background'>
          <div class='video-player__container'>
            <div id={playerPlaceholder}/>
          </div>
        </div>
        <div class='pa-4'>
          <div domProps={{ innerHTML: titleHtml }} class='title'/>
          <div class='subtitle-1'>
            {channelTitle}
            {' '}&middot;{' '}
            {formatShortNumber(viewCount)} views
            <client-only>
              <time datetime={publishedAt}>
                {' '}&middot;{' '}
                {formatFromNow(publishedAt)}
              </time>
            </client-only>
          </div>
        </div>
      </div>
    )
  }
}

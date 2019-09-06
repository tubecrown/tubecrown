import { VideoDto } from '@tubecrown/core/lib/video'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { formatShortNumber } from '../../utils/numbers'

export interface VideoClickEvent {
  video: VideoDto
  event: MouseEvent
}

@Component<VideoCard>({})
export class VideoCard extends Vue {
  @Prop(Object)
  readonly video!: VideoDto

  handleClick (event: MouseEvent) {
    const videoClickEvent: VideoClickEvent = { video: this.video, event }
    this.$emit('video-click', videoClickEvent)
  }

  render () {
    const { id, titleHtml, publishedAt, thumbnail, channelTitle, viewCount } = this.video
    return (
      <nuxt-link to={`/v/${id}`} event='' nativeOn={{ click: this.handleClick }} class='video-card'>
        <v-img src={thumbnail} aspect-ratio={1.5}/>
        <div class='video-card__title text__two-lines font-weight-medium mt-2' domProps={{ innerHTML: titleHtml }}/>
        <div class='video-card__subtitle text__two-lines mt-1'>
          {channelTitle}
          {' '}&middot;{' '}
          {formatShortNumber(viewCount)} views
          <client-only>
            {' '}&middot;{' '}
            {publishedAt}
          </client-only>
        </div>
      </nuxt-link>
    )
  }
}

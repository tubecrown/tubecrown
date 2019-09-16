import { VideoDto } from '@tubecrown/core/lib/video'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { formatDuration, formatFromNow } from '../../utils/datetimes'
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
    const { id, titleHtml, publishedAt, thumbnail, channelTitle, viewCount, duration } = this.video
    return (
      <nuxt-link to={`/v/${id}`} event='' nativeOn={{ click: this.handleClick }} class='video-card'>
        <v-img src={thumbnail} aspect-ratio={1.5}>
          <v-row align='end' class='pa-1 fill-height'>
            <v-col align='right'>
              <v-chip label color='rgb(0, 0, 0, 0.8)' text-color='white'>{formatDuration(duration)}</v-chip>
            </v-col>
          </v-row>
        </v-img>
        <div class='video-card__title text__two-lines font-weight-medium mt-2' domProps={{ innerHTML: titleHtml }}/>
        <div class='video-card__subtitle text__two-lines mt-1'>
          {channelTitle}
          {' '}&middot;{' '}
          {formatShortNumber(viewCount)} views
          <client-only>
            {' '}&middot;{' '}
            <time datetime={publishedAt}>{formatFromNow(publishedAt)}</time>
          </client-only>
        </div>
      </nuxt-link>
    )
  }
}

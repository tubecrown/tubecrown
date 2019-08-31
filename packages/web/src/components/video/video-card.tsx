import { VideoDto } from '@tubecrown/core/lib/video'
import { Component, Prop, Vue } from 'vue-property-decorator'
import './video-card.scss'

@Component<VideoCard>({})
export class VideoCard extends Vue {
  @Prop(Object)
  readonly video!: VideoDto

  render () {
    const { titleHtml, publishedAt, thumbnail, channelTitle } = this.video
    return (
      <div>
        <v-img src={thumbnail} aspect-ratio={1.5}/>
        <div class='video-card__title text__two-lines font-weight-medium mt-2' domProps={{ innerHTML: titleHtml }}/>
        <div class='video-card__subtitle text__two-lines mt-1'>
          {channelTitle}
          <client-only>
            {' '}&middot;{' '}
            {publishedAt}
          </client-only>
        </div>
      </div>
    )
  }
}

import { VideoDto } from '@tubecrown/core/lib/video'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { VideoPlayer } from './video-player'

@Component<VideoDialog>({
  components: {
    VideoPlayer,
  },
})
export class VideoDialog extends Vue {
  @Prop(Object)
  readonly video!: VideoDto

  handleDialogUpdate (value: boolean) {
    this.$emit('video-dialog-update', value)
  }

  render () {
    return (
      <v-dialog
        value={!!this.video}
        on={{ input: this.handleDialogUpdate }}
      >
        {this.video && <div class='white'>
          <video-player video={this.video}/>
        </div>}
      </v-dialog>
    )
  }
}

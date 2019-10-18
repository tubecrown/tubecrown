import { Context } from '@nuxt/types'
import { DateTime } from 'luxon'
import { Component, Vue } from 'nuxt-property-decorator'
import { MetaInfo } from 'vue-meta'

@Component<SearchByYearPage>({
  async asyncData (context: Context) {
    const { params } = context
    const dateTime = DateTime.utc(Number(params.year))
    const startDate = dateTime.toFormat('yyyy/MM/dd')
    const endDate = dateTime.plus({ years: 1 }).toFormat('yyyy/MM/dd')
    const title = `Best videos of ${dateTime.toFormat('yyyy')}`
    return {
      title,
      startDate,
      endDate,
    }
  },
})
export default class SearchByYearPage extends Vue {
  readonly title!: string
  readonly startDate!: string
  readonly endDate!: string

  async middleware (context: Context) {
    const { params } = context
    const year = Number(params.year)
    if (isNaN(year) || year < 0) {
      context.redirect(`/1990`)
    }
  }

  head (): MetaInfo {
    return {
      title: this.title,
    }
  }

  render () {
    return (
      <v-container>
        <h1>{this.title}, {this.startDate} to {this.endDate}</h1>
      </v-container>
    )
  }
}

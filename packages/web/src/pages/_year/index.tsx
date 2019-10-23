import { Context } from '@nuxt/types'
import isNaturalNumber from 'is-natural-number'
import { DateTime } from 'luxon'
import { Component, Vue } from 'nuxt-property-decorator'
import { MetaInfo } from 'vue-meta'

@Component<SearchByYearPage>({
  async asyncData (context: Context) {
    const { params } = context
    const dateTime = DateTime.utc(+params.year)
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
    const year = +params.year
    if (!isNaturalNumber(year)) {
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

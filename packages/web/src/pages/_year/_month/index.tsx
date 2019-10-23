import { Context } from '@nuxt/types'
import isNaturalNumber from 'is-natural-number'
import { DateTime } from 'luxon'
import { Component, Vue } from 'nuxt-property-decorator'
import { MetaInfo } from 'vue-meta'

@Component<SearchByMonthPage>({
  async asyncData (context: Context) {
    const { params } = context
    const dateTime = DateTime.utc(+params.year, +params.month)
    const startDate = dateTime.toFormat('yyyy/MM/dd')
    const endDate = dateTime.plus({ months: 1 }).toFormat('yyyy/MM/dd')
    const title = `Best videos of ${dateTime.toFormat('MMM yyyy')}`
    return {
      title,
      startDate,
      endDate,
    }
  },
})
export default class SearchByMonthPage extends Vue {
  readonly title!: string
  readonly startDate!: string
  readonly endDate!: string

  async middleware (context: Context) {
    const { params } = context
    const year = +params.year
    const month = +params.month
    if (!isNaturalNumber(year)) {
      context.redirect(`/1990`)
    } else if (!isNaturalNumber(month) || month > 12) {
      context.redirect(`/${year}/01`)
    } else if (month < 10 && params.month.length === 1) {
      context.redirect(`/${year}/0${month}`)
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

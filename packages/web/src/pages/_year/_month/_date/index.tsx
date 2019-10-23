import { Context } from '@nuxt/types'
import isNaturalNumber from 'is-natural-number'
import { DateTime } from 'luxon'
import { Component, Vue } from 'nuxt-property-decorator'
import { MetaInfo } from 'vue-meta'

@Component<SearchByDatePage>({
  async asyncData (context: Context) {
    const { params } = context
    const date = DateTime.utc(+params.year, +params.month, +params.date)
    const startDate = date.toFormat('yyyy/MM/dd')
    const endDate = date.plus({ days: 1 }).toFormat('yyyy/MM/dd')
    const title = `Best videos of ${date.toFormat('dd MMM yyyy')}`
    return {
      title,
      startDate,
      endDate,
    }
  },
})
export default class SearchByDatePage extends Vue {
  readonly title!: string
  readonly startDate!: string
  readonly endDate!: string

  async middleware (context: Context) {
    const { params } = context
    const year = +params.year
    const month = +params.month
    const date = +params.date
    if (!isNaturalNumber(year)) {
      context.redirect(`/1990`)
    } else if (!isNaturalNumber(month) || month > 12) {
      context.redirect(`/${year}/01`)
    } else if (!isNaturalNumber(date) || date > 31) {
      context.redirect(`/${year}/${('0' + month).slice(-2)}/01`)
    } else {
      const dateTime = DateTime.utc(year, month, date)
      if (!dateTime.isValid) {
        context.redirect(`/${year}/${('0' + month).slice(-2)}/01`)
      } else if ((month < 10 && params.month.length === 1) || (date < 10 && params.date.length === 1)) {
        context.redirect(`/${year}/${('0' + month).slice(-2)}/${('0' + date).slice(-2)}`)
      }
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

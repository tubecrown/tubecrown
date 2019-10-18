import { Context } from '@nuxt/types'
import { DateTime } from 'luxon'
import { Component, Vue } from 'nuxt-property-decorator'
import { MetaInfo } from 'vue-meta'

@Component<SearchByDatePage>({
  async asyncData (context: Context) {
    const { params } = context
    const date = DateTime.utc(Number(params.year), Number(params.month), Number(params.date))
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
    const year = Number(params.year)
    const month = Number(params.month)
    const date = Number(params.date)
    if (isNaN(year) || year < 0) {
      context.redirect(`/1990`)
    } else if (isNaN(month) || month > 12 || month < 0) {
      context.redirect(`/${year}/01`)
    } else if (isNaN(date) || date > 31 || date < 0) {
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

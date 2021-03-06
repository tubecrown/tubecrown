import { Context } from '@nuxt/types'
import isNaturalNumber from 'is-natural-number'
import { DateTime } from 'luxon'
import { Component, Vue } from 'nuxt-property-decorator'
import { MetaInfo } from 'vue-meta'
import { DateSelector, SimpleDate } from '../../../../components/filter'
import { routeBySimpleDateEvent } from '../../../../utils/events'

@Component<SearchByDatePage>({
  components: {
    DateSelector,
  },
  async asyncData (context: Context) {
    const { params } = context
    const date = DateTime.utc(+params.year, +params.month, +params.day)
    const startDate = date.toFormat('yyyy/MM/dd')
    const endDate = date.plus({ days: 1 }).toFormat('yyyy/MM/dd')
    const title = `Best videos of ${date.toFormat('dd MMM yyyy')}`
    return {
      title,
      year: +params.year,
      month: +params.month,
      day: +params.day,
      startDate,
      endDate,
    }
  },
})
export default class SearchByDatePage extends Vue {
  readonly year!: number
  readonly month!: number
  readonly day!: number
  readonly title!: string
  readonly startDate!: string
  readonly endDate!: string

  async middleware (context: Context) {
    const { params } = context
    const year = +params.year
    const month = +params.month
    const day = +params.day
    if (!isNaturalNumber(year) || year > DateTime.utc().year) {
      context.redirect(`/2005`)
    } else if (!isNaturalNumber(month) || month > 12) {
      context.redirect(`/${year}/01`)
    } else if (!isNaturalNumber(day) || day > 31) {
      context.redirect(`/${year}/${('0' + month).slice(-2)}/01`)
    } else {
      const dateTime = DateTime.utc(year, month, day)
      if (!dateTime.isValid) {
        context.redirect(`/${year}/${('0' + month).slice(-2)}/01`)
      } else if ((month < 10 && params.month.length === 1) || (day < 10 && params.day.length === 1)) {
        context.redirect(`/${year}/${('0' + month).slice(-2)}/${('0' + day).slice(-2)}`)
      }
    }
  }

  handleDateUpdate (simpleDate: SimpleDate) {
    routeBySimpleDateEvent(simpleDate, this.$router)
  }

  head (): MetaInfo {
    return {
      title: this.title,
    }
  }

  render () {
    const initDate: SimpleDate = { year: `${this.year}`, month: `${this.month}`, day: `${this.day}` }
    return (
      <v-container>
        <date-selector initDate={initDate} on={{ 'date-update': this.handleDateUpdate }} />
        <h1>Best videos from {this.startDate} to {this.endDate}</h1>
      </v-container>
    )
  }
}

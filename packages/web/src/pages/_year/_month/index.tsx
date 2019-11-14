import { Context } from '@nuxt/types'
import isNaturalNumber from 'is-natural-number'
import { DateTime } from 'luxon'
import { Component, Vue } from 'nuxt-property-decorator'
import { MetaInfo } from 'vue-meta'
import { DateSelector, DateUpdateEvent } from '../../../components/date-selector'

@Component<SearchByMonthPage>({
  components: {
    DateSelector,
  },
  async asyncData (context: Context) {
    const { params } = context
    const dateTime = DateTime.utc(+params.year, +params.month)
    const startDate = dateTime.toFormat('yyyy/MM/dd')
    const endDate = dateTime.plus({ months: 1 }).toFormat('yyyy/MM/dd')
    const title = `Best videos of ${dateTime.toFormat('MMM yyyy')}`
    return {
      title,
      year: +params.year,
      month: +params.month,
      startDate,
      endDate,
    }
  },
})
export default class SearchByMonthPage extends Vue {
  readonly year!: number
  readonly month!: number
  readonly title!: string
  readonly startDate!: string
  readonly endDate!: string

  async middleware (context: Context) {
    const { params } = context
    const year = +params.year
    const month = +params.month
    if (!isNaturalNumber(year) || year > (new Date()).getFullYear()) {
      context.redirect(`/2005`)
    } else if (!isNaturalNumber(month) || month > 12) {
      context.redirect(`/${year}/01`)
    } else if (month < 10 && params.month.length === 1) {
      context.redirect(`/${year}/0${month}`)
    }
  }

  handleDateUpdate (dateUpdateEvent: DateUpdateEvent) {
    if (dateUpdateEvent.month === 'any') {
      this.$router.push(`/${dateUpdateEvent.year}`)
    } else if (dateUpdateEvent.day === 'any') {
      this.$router.push(`/${dateUpdateEvent.year}/${dateUpdateEvent.month}`)
    } else {
      this.$router.push(`/${dateUpdateEvent.year}/${dateUpdateEvent.month}/${dateUpdateEvent.day}`)
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
        <date-selector year={this.year} month={this.month} on={{ 'date-update': this.handleDateUpdate }} />
        <h1>Best videos from {this.startDate} to {this.endDate}</h1>
      </v-container>
    )
  }
}

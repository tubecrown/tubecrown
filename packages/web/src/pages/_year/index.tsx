import { Context } from '@nuxt/types'
import isNaturalNumber from 'is-natural-number'
import { DateTime } from 'luxon'
import { Component, Vue } from 'nuxt-property-decorator'
import { MetaInfo } from 'vue-meta'
import { DateSelector, DateUpdateEvent } from '../../components/filter'

@Component<SearchByYearPage>({
  components: {
    DateSelector,
  },
  async asyncData (context: Context) {
    const { params } = context
    const dateTime = DateTime.utc(+params.year)
    const startDate = dateTime.toFormat('yyyy/MM/dd')
    const endDate = dateTime.plus({ years: 1 }).toFormat('yyyy/MM/dd')
    const title = `Best videos of ${dateTime.toFormat('yyyy')}`
    return {
      title,
      year: +params.year,
      startDate,
      endDate,
    }
  },
})
export default class SearchByYearPage extends Vue {
  readonly year!: number
  readonly title!: string
  readonly startDate!: string
  readonly endDate!: string

  async middleware (context: Context) {
    const { params } = context
    const year = +params.year
    if (!isNaturalNumber(year) || year > (new Date()).getFullYear()) {
      context.redirect(`/2005`)
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
        <date-selector year={this.year} on={{ 'date-update': this.handleDateUpdate }} />
        <h1>Best videos from {this.startDate} to {this.endDate}</h1>
      </v-container>
    )
  }
}

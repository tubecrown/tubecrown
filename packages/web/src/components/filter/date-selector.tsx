import { DateTime } from 'luxon'
import { Component, Prop, Vue } from 'vue-property-decorator'

export interface SimpleDate {
  year: string
  month: string
  day: string
}

const getLastDate = (year: number, month: number): DateTime => {
  return DateTime.utc(year, month, 1).plus({ months: 1 }).minus({ days: 1 })
}

const getDays = (lastDay: number): string[] => {
  return [...Array.from({ length: lastDay }, (v, k) => `${k + 1}`), 'any']
}

@Component<DateSelector>({})
export class DateSelector extends Vue {
  @Prop(Object)
  readonly initDate!: SimpleDate

  currentDate!: SimpleDate
  years!: string[]
  months!: string[]
  days!: string[]

  data () {
    const lastDate = getLastDate(+this.initDate.year, +this.initDate.month)
    const years = Array.from({ length: (DateTime.utc().year - 2004) }, (v, k) => `${k + 2005}`)
    const months = [...Array.from({ length: 12 }, (v, k) => `${k + 1}`), 'any']
    const days = this.initDate.month === 'any' ? ['any'] : getDays(lastDate.day)
    const day = this.initDate.day !== 'any' && +this.initDate.day > lastDate.day ? `${lastDate.day}` : this.initDate.day
    const currentDate: SimpleDate = { year: this.initDate.year, month: this.initDate.month, day }
    return { currentDate, years, months, days }
  }

  handleClick () {
    this.$emit('date-update', this.currentDate)
  }

  handleDateChange () {
    if (this.currentDate.month === 'any') {
      this.days = ['any']
      this.currentDate.day = 'any'
    } else {
      const lastDate = getLastDate(+this.currentDate.year, +this.currentDate.month)
      this.days = getDays(lastDate.day)
      if (this.currentDate.day !== 'any' && +this.currentDate.day > lastDate.day) {
        this.currentDate.day = `${lastDate.day}`
      }
    }
  }

  render () {
    return (
      <v-container fluid>
        <v-row align='center'>
          <v-col class='d-flex' cols='8' sm='2'>
            <v-select items={this.years} v-model={this.currentDate.year} on={{ change: this.handleDateChange }} label='Year' />
          </v-col>
          <v-col class='d-flex' cols='8' sm='2'>
            <v-select items={this.months} v-model={this.currentDate.month} on={{ change: this.handleDateChange }} label='Month' />
          </v-col>
          <v-col class='d-flex' cols='8' sm='2'>
            <v-select items={this.days} v-model={this.currentDate.day} label='Day' />
          </v-col>
          <v-col class='d-flex' cols='8' sm='2'>
            <v-btn on={{ click: this.handleClick }}>Update</v-btn>
          </v-col>
        </v-row>
      </v-container>
    )
  }
}

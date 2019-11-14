import { Component, Prop, Vue } from 'vue-property-decorator'
import { DateTime } from 'luxon'

export interface DateUpdateEvent {
  year: string
  month: string
  day: string
}

@Component<DateSelector>({
  data () {
    const years = Array.from({ length: 15 }, (v, k) => `${k + 2005}`)
    const months = [...Array.from({ length: 12 }, (v, k) => `${k + 1}`), 'any']
    const selectedYear = `${this.year}`
    const selectedMonth = `${this.month || 'any'}`
    const lastDate = DateTime.utc(+selectedYear,  +selectedMonth, 1).plus({ months: 1 }).minus({ days: 1 })
    const days = selectedMonth === 'any' ? ['any'] : [...Array.from({ length: lastDate.day }, (v, k) => `${k + 1}`), 'any']
    const selectedDay = !this.day || this.day > lastDate.day ? 'any' : `${this.day}`
    return { selectedYear, selectedMonth, selectedDay, years, months, days }
  }
})
export class DateSelector extends Vue {
  @Prop(Number)
  readonly year!: number
  @Prop(Number)
  readonly month!: number
  @Prop(Number)
  readonly day!: number

  selectedYear!: string
  selectedMonth!: string
  selectedDay!: string

  years!: string[]
  months!: string[]
  days!: string[]

  handleClick () {
    const dateUpdateEvent: DateUpdateEvent = { year: this.selectedYear, month: this.selectedMonth, day: this.selectedDay }
    this.$emit('date-update', dateUpdateEvent)
  }

  handleDateChange () {
    if (this.selectedMonth === 'any') {
      this.days = ['any']
      this.selectedDay = 'any'
    } else {
      const lastDate = DateTime.utc(+this.selectedYear,  +this.selectedMonth, 1).plus({ months: 1 }).minus({ days: 1 })
      this.days = [...Array.from({ length: lastDate.day }, (v, k) => `${k + 1}`), 'any']
      if (this.selectedDay !== 'any' && +this.selectedDay > lastDate.day) {
        this.selectedDay = `${lastDate.day}`
      }
    }
  }

  render () {
    return (
      <v-container fluid>
        <v-row align='center'>
          <v-col class='d-flex' cols='8' sm='2'>
            <v-select items={this.years} v-model={this.selectedYear} on={{ change: this.handleDateChange }} label='Year' />
          </v-col>
          <v-col class='d-flex' cols='8' sm='2'>
            <v-select items={this.months} v-model={this.selectedMonth} on={{ change: this.handleDateChange }} label='Month' />
          </v-col>
          <v-col class='d-flex' cols='8' sm='2'>
            <v-select items={this.days} v-model={this.selectedDay} label='Day' />
          </v-col>
          <v-col class='d-flex' cols='8' sm='2'>
            <v-btn on={{ click: this.handleClick }}>Update</v-btn>
          </v-col>
        </v-row>
      </v-container>
    )
  }
}

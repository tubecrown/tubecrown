import { Component, Prop, Vue } from 'vue-property-decorator'

export interface DateUpdateEvent {
  year: string
  month: string
  day: string
}

@Component<DateSelector>({})
export class DateSelector extends Vue {
  @Prop(Number)
  readonly year!: number
  @Prop(Number)
  readonly month!: number
  @Prop(Number)
  readonly day!: number

  private selectedYear!: string
  private selectedMonth!: string
  private selectedDay!: string

  private years!: string[]
  private months!: string[]
  private days!: string[]

  data () {
    this.selectedYear = `${this.year}`
    this.selectedMonth = `${this.month || 'any'}`
    this.selectedDay = `${this.day || 'any'}`
    this.years = Array.from({ length: 15 }, (v, k) => `${k + 2005}`)
    this.months = [...Array.from({ length: 12 }, (v, k) => `${k + 1}`), 'any']
    this.days = [...Array.from({ length: 30 }, (v, k) => `${k + 1}`), 'any']
    return {}
  }

  handleClick () {
    const dateUpdateEvent: DateUpdateEvent = { year: this.selectedYear, month: this.selectedMonth, day: this.selectedDay }
    this.$emit('date-update', dateUpdateEvent)
  }

  handleDateChange () {
    if (this.selectedMonth === 'any') {
      this.selectedDay = 'any'
      this.days = ['any']
    } else {
      const date = new Date(+this.selectedYear, +this.selectedMonth, 0)
      if (this.selectedDay !== 'any' && +this.selectedDay > date.getDate()) {
        this.selectedDay = `${date.getDate()}`
      }
      this.days = [...Array.from({ length: date.getDate() }, (v, k) => `${k + 1}`), 'any']
    }
  }

  render () {
    return (
      <v-container fluid>
        <v-row align='center'>
          <h1>Best videos of </h1>
          <v-col class='d-flex' cols='8' sm='2'>
            <v-select items={this.years} v-model={this.selectedYear} on={{ change: this.handleDateChange }} label='Year' />
          </v-col>
          <v-col class='d-flex' cols='8' sm='2'>
            <v-select items={this.months} v-model={this.selectedMonth} on={{ change: this.handleDateChange }} label='Month' />
          </v-col>
          <v-col class='d-flex' cols='8' sm='2'>
            <v-select items={this.days} v-model={this.selectedDay} on={{ change: this.handleDateChange }} label='Day' />
          </v-col>
          <v-col class='d-flex' cols='8' sm='2'>
            <v-btn on={{ click: this.handleClick }}>Update</v-btn>
          </v-col>
        </v-row>
      </v-container>
    )
  }
}

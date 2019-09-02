import { Component, Vue } from 'nuxt-property-decorator'

@Component<DefaultLayout>({})
export default class DefaultLayout extends Vue {
  render () {
    return (
      <v-app class='white'>
        <nuxt/>
      </v-app>
    )
  }
}

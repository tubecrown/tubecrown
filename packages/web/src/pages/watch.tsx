import { Context } from '@nuxt/types'

export default {
  middleware (context: Context) {
    // Redirect /watch?v={id} (YouTube url) to /v/{id}
    const { redirect, query } = context
    redirect(`/v/${query.v}`)
  },
}

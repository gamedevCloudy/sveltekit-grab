<script lang="ts">
  import type { GrabOptions } from './types.js'
  import { init } from './core.js'
  import { onMount } from 'svelte'

  let { options = {} }: { options?: GrabOptions } = $props()

  onMount(() => {
    const cleanup = init(options)
    return cleanup
  })
</script>

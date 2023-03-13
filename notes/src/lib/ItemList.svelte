<script lang="ts">
  export let items: any[];
</script>

<ul>
  {#each items as item}
    <li>{item.text}</li>
  {/each}
</ul>

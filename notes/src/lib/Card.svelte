<script lang="ts">
  export let newCard: boolean = false;
  export let text: string = "";
  export let tags: string[] = [];
  export let expanded: boolean = false;
</script>

{#if newCard}
  <div class="card newCard"><i class="fa-solid fa-plus" /></div>
{:else}
  <div class="card">
    {text} ({tags})
  </div>
{/if}

<style>
  .card {
    width: 200px;
    height: 200px;
    border: 1px solid rgba(255, 255, 255, 0.87);
    border-radius: 10px;
    text-align: left;
    padding: 5px;
    margin: 10px;
    transition: width 0.5s, height 0.5s;
    cursor: pointer;
  }

  .card:hover {
    width: 205px;
    height: 205px;
  }

  .newCard {
    display: grid;
    place-items: center;
    font-size: 32px;
  }
</style>

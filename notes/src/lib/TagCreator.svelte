<script lang="ts">
  import type { Tag } from "./data-model";

  export let newTag: Tag;
  export let hide: () => void;
</script>

<div class="tagCreator">
  <input type="text" placeholder="New tag name" bind:value={newTag.tag} />
</div>

<style>
  .tagCreator {
    position: absolute;
    top: 0;
    left: 0;
    padding: 0.5rem;
    border: 1px solid #fff;
    border-radius: 5px;
    background-color: #242424;
  }
</style>

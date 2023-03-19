<script lang="ts">
  export let selectedTags: { tag: string; color: string }[];
</script>

<div class="tagSelector">
  {#each selectedTags as t}
    <span class="selectedTag" style="background-color: {t.color}">
      {t.tag}
      {#if t.tag !== "card"}<i class="fa-solid fa-x removeTagButton" />{/if}
    </span>
  {/each}
  <span class="addTagButton"><i class="fa-solid fa-plus" /></span>
</div>

<style>
  .tagSelector {
    display: flex;
  }

  .selectedTag {
    display: table-cell;
    vertical-align: middle;
    height: 1.5em;
    color: black;
    border-radius: 8px;
    padding: 0 10px;
    margin-right: 10px;
  }

  .removeTagButton {
    font-size: 11px;
    padding-left: 8px;
  }
</style>

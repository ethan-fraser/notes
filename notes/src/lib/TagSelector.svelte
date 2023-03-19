<script lang="ts">
  import TagCreator from "./TagCreator.svelte";

  export let selectedTags: { tag: string; color: string }[];

  let showTagCreator = false;
</script>

<div class="tagSelector">
  {#each selectedTags as t}
    <span class="selectedTag" style="background-color: {t.color}">
      {t.tag}
      {#if t.tag !== "card"}<i class="fa-solid fa-x removeTagButton" />{/if}
    </span>
  {/each}
  <div
    class="addTagButton"
    on:click={() => (showTagCreator = true)}
    on:keypress={(e) => {
      if (e.code === "Space") showTagCreator = true;
    }}
  >
    {#if showTagCreator}
      <TagCreator
        newTag={{ id: "", tag: "", color: "" }}
        hide={() => (showTagCreator = false)}
      />
    {:else}
      <i class="fa-solid fa-plus" />
    {/if}
  </div>
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

  .addTagButton {
    position: relative;
  }
</style>

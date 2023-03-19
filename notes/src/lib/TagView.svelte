<script lang="ts">
  import type { Tag } from "./data-model";
  import { pb } from "./pocketbase";
  import TagSelector from "./TagSelector.svelte";

  export let selectedTags: Tag[];

  function getAllTags() {
    pb.collection("tags")
      .getFullList()
      .then((tags) => {
        allTags = tags.map((t) => {
          return {
            id: t.id,
            tag: t.tag,
            color: t.color,
          };
        });
      })
      .catch((err) => console.error(err));
  }

  let showTagCreator = false;
  let allTags: Tag[] = [];

  getAllTags();
</script>

<div class="tagSelector">
  {#each selectedTags as t}
    <span class="selectedTag" style="background-color: {t.color}">
      {t.tag}
      <!-- {#if t.tag !== "card"}<i class="fa-solid fa-x removeTagButton" />{/if} -->
    </span>
  {/each}
  <div class="editTags">
    {#if showTagCreator}
      <TagSelector
        newTag={{ id: "", tag: "", color: "" }}
        {allTags}
        {selectedTags}
        hide={() => (showTagCreator = false)}
      />
    {:else}
      <i
        class="fa-solid fa-plus"
        on:click={() => (showTagCreator = true)}
        on:keypress={(e) => {
          if (e.code === "Space") showTagCreator = true;
        }}
      />
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

  .editTags {
    position: relative;
  }

  .editTags i {
    cursor: pointer;
  }
</style>

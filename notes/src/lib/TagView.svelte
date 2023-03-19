<script lang="ts">
  import type { Tag } from "./data-model";
  import { currentUser, pb } from "./pocketbase";
  import TagSelector from "./TagSelector.svelte";

  export let selectedTags: Tag[];
  export let requiredTag: string;

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

  async function createTag() {
    await pb
      .collection("tags")
      .create({
        user: $currentUser.id,
        tag: newTag.tag,
        color: newTag.color,
      })
      .then((t) => {
        const tag: Tag = {
          id: t.id,
          tag: t.tag,
          color: t.color,
        };
        allTags = [...allTags, tag];
      })
      .catch((err) => console.error(err));
  }

  let showTagCreator = false;
  let allTags: Tag[] = [];
  let newTag: Tag = {
    id: "",
    tag: "",
    color: "",
  };

  getAllTags();
</script>

<div class="tagSelector">
  {#each selectedTags as t}
    <span class="selectedTag" style="background-color: {t.color}">
      {t.tag}
    </span>
  {/each}
  <div class="editTags">
    {#if showTagCreator}
      <TagSelector
        bind:newTag
        {allTags}
        bind:selectedTags
        {requiredTag}
        {createTag}
        hide={() => (showTagCreator = false)}
      />
    {:else}
      <i
        class="fa-solid fa-plus"
        on:click={() => (showTagCreator = true)}
        on:keydown={() => (showTagCreator = true)}
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

  .editTags {
    position: relative;
  }

  .editTags i {
    cursor: pointer;
  }
</style>

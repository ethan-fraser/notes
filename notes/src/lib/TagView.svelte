<script lang="ts">
  import { noop } from "lodash";
  import type { Tag } from "./data-model";
  import { currentUser, pb } from "./pocketbase";
  import TagSelector from "./TagSelector.svelte";

  export let selectedTags: Tag[];
  export let requiredTag: string;
  export let deleteTagFromAll: (tag: Tag) => void;

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

  function deleteConfirm(tag: Tag) {
    showDeleteConfirm = true;
    tagToDelete = tag;
  }

  async function deleteTag(tag: Tag) {
    await pb
      .collection("tags")
      .delete(tag.id)
      .then(() => {
        allTags = allTags.filter((t) => t.id !== tag.id);
        selectedTags = selectedTags.filter((t) => t.id !== tag.id);
        deleteTagFromAll(tag);
      })
      .catch((err) => console.error(err));
  }

  let showTagCreator = false;
  let showDeleteConfirm = false;
  let tagToDelete: Tag;
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
        {deleteConfirm}
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
{#if showDeleteConfirm}
  <div class="deleteConfirmModal">
    <span style="font-weight: 700;">Are you sure?</span>
    <span
      >Deleting this tag will mean all other cards with this tag assigned lose
      it as well.</span
    >
    <div class="deleteConfirmButtonDiv">
      <button
        class="deleteCancelButton"
        on:click={() => (showDeleteConfirm = false)}>Cancel</button
      >
      <button
        class="deleteConfirmButton"
        on:click={() => {
          deleteTag(tagToDelete);
          showDeleteConfirm = false;
        }}>Delete</button
      >
    </div>
  </div>
{/if}

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

  .deleteConfirmModal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 400px;
    background-color: #242424;
    border: 1px solid white;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1em;
  }

  .deleteConfirmModal span {
    text-align: center;
  }

  .deleteConfirmButtonDiv {
    margin-top: 1em;
  }

  .deleteCancelButton {
    background-color: transparent;
    border: none;
    outline: none;
    text-decoration: underline;
  }

  .deleteConfirmButton {
    background-color: red;
  }
</style>

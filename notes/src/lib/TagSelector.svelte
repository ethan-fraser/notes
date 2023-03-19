<script lang="ts">
  import _ from "lodash";
  import type { Tag } from "./data-model";

  export let newTag: Tag;
  export let allTags: Tag[];
  export let selectedTags: Tag[];
  export let hide: () => void;

  let createNewTag = false;
</script>

<div class="tagSelector">
  {#if createNewTag}
    <input type="text" placeholder="New tag name" bind:value={newTag.tag} />
  {:else}
    <span>Select tags:</span>
    {#each allTags as t}
      <div class="tagCheckbox">
        <input
          type="checkbox"
          id={t.id}
          name={t.tag}
          value={t.tag}
          checked={_.some(selectedTags, t)}
        />
        <label for={t.id} style="background-color: {t.color}">{t.tag}</label><br
        />
      </div>
    {/each}
  {/if}
  <div class="buttonDiv">
    <button class="cancelButton" on:click={hide}>Cancel</button>
    <button class="saveButton">Save</button>
  </div>
</div>

<style>
  .tagSelector {
    position: absolute;
    top: 0;
    left: 0;
    padding: 0.5rem;
    border: 1px solid #fff;
    border-radius: 5px;
    background-color: #242424;
    font-size: 0.8em;
  }

  .tagCheckbox {
    display: flex;
    margin-top: 0.5em;
  }

  .tagCheckbox label {
    margin-left: 0.5em;
    padding: 0.1em 0.3em;
    border-radius: 3px;
    width: 80px;
  }

  .buttonDiv {
    display: flex;
    margin-top: 1em;
  }

  .cancelButton {
    background-color: #242424;
    text-decoration: underline;
    border: none !important;
    outline: none;
  }

  .saveButton {
    background-color: limegreen;
  }
</style>

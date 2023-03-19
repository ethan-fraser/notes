<script lang="ts">
  import _, { create } from "lodash";
  import type { Tag } from "./data-model";

  export let newTag: Tag;
  export let allTags: Tag[];
  export let selectedTags: Tag[];
  export let requiredTag: string;
  export let hide: () => void;
  export let createTag: () => Promise<void>;

  let createNewTag = false;

  let colors = [
    "#FC4B4B",
    "#FFD23F",
    "#00BFFF",
    "#FF7A33",
    "#32CD32",
    "#8B00FF",
    "#4BFCC4",
    "#CD32A5",
    "#CCFF33",
    "#00FF7F",
    "#FF33F2",
    "#BFFF00",
    "#FFCC00",
    "#7F00FF",
    "#00CCCC",
    "#FA8072",
  ];
</script>

<div class="tagSelector">
  {#if createNewTag}
    <input type="text" placeholder="New tag name" bind:value={newTag.tag} />
    <div class="colorSelector">
      {#each colors as color}
        <div
          class="color"
          style="background-color: {color}; border: {newTag.color === color
            ? '3px solid white'
            : 'none'}"
          on:click={() => (newTag.color = color)}
          on:keypress={(e) => {
            if (e.code === "Space") newTag.color = color;
          }}
        />
      {/each}
    </div>
  {:else}
    {#each allTags as t}
      <div class="tagCheckbox">
        <input
          type="checkbox"
          id={t.id}
          name={t.tag}
          value={t.tag}
          checked={_.some(selectedTags, t)}
          disabled={t.tag === requiredTag}
        />
        <label for={t.id} style="background-color: {t.color}">{t.tag}</label><br
        />
      </div>
    {/each}
    <button class="newTagButton" on:click={() => (createNewTag = true)}
      ><i class="fa-solid fa-plus" /> New tag</button
    >
  {/if}
  <div class="buttonDiv">
    <button
      class="cancelButton"
      on:click={createNewTag
        ? () => {
            createNewTag = false;
            newTag = {
              id: "",
              tag: "",
              color: "",
            };
          }
        : hide}>Cancel</button
    >
    <button
      class="saveButton"
      on:click={() => {
        createTag().then(() => hide());
      }}>{createNewTag ? "Create" : "Save"}</button
    >
  </div>
</div>

<style>
  .tagSelector {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    border: 1px solid #fff;
    border-radius: 5px;
    background-color: #242424;
    font-size: 0.8em;
    cursor: default;
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

  .newTagButton {
    width: 80%;
    background-color: #777777;
    margin: 0.8em auto 0 auto;
    padding: 0.3em;
  }

  .buttonDiv {
    display: flex;
    margin-top: 0.8em;
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

  .colorSelector {
    display: grid;
    grid-template-columns: 30px 30px 30px 30px;
    gap: 5px;
    margin: 1em auto 0 auto;
  }

  .color {
    width: 30px;
    height: 30px;
    border-radius: 4px;
    cursor: pointer;
    box-sizing: border-box;
  }
</style>

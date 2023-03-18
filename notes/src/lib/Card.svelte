<script lang="ts">
  import TagSelector from "./TagSelector.svelte";
  import TagPreview from "./TagPreview.svelte";
  import type { Tag } from "./data-model";

  export let key: number;
  export let newCard: boolean = false;
  export let text: string = "";
  export let tags: Tag[] = [];
  export let expanded: boolean = false;
  export let setSelected: (key: number | null) => void;
</script>

{#if expanded}
  <div class="card expanded">
    <span
      on:click={() => setSelected(key)}
      on:keypress={(e) => {
        if (e.code === "Space") setSelected(key);
      }}
      class="closeButton"
    >
      <i class="fa-solid fa-x" />
    </span>
    <div class="tagSelector">
      <TagSelector selectedTags={tags} />
    </div>
    <div class="textAreaWrapper">
      <textarea bind:value={text} />
    </div>
  </div>
{:else if newCard}
  <div
    on:click={() => setSelected(key)}
    on:keypress={(e) => {
      if (e.code === "Space") setSelected(key);
    }}
    class="card newCard"
  >
    <i class="fa-solid fa-plus" />
  </div>
{:else}
  <div
    on:click={() => setSelected(key)}
    on:keypress={(e) => {
      if (e.code === "Space") setSelected(key);
    }}
    class="card"
  >
    <TagPreview {tags} />
    <div class="cardText">{text}</div>
  </div>
{/if}

<style>
  .card {
    width: 200px;
    height: 200px;
    border: 1px solid rgba(255, 255, 255, 0.87);
    border-radius: 10px;
    text-align: left;
    padding: 10px;
    margin: 10px;
    cursor: pointer;
    flex-grow: 1;
  }

  .newCard {
    display: grid;
    place-items: center;
    font-size: 32px;
  }

  .expanded {
    position: relative;
    height: 100% !important;
    width: 90vw !important;
    margin-bottom: 0;
    background-color: #242424;
    cursor: text;
    padding: 15px 20px 20px 20px !important;
  }

  @media (prefers-color-scheme: light) {
    .card {
      border: 1px solid black;
    }
    .expanded {
      color: #213547;
      background-color: #ffffff;
    }
  }

  .closeButton {
    position: absolute;
    top: 15px;
    right: 20px;
    cursor: pointer;
  }

  .textAreaWrapper {
    height: 95%;
    display: flex;
  }

  textarea {
    align-self: sretch;
    width: 100%;
    outline: none;
    border: none;
    background-color: inherit;
    resize: none;
    margin-top: 10px;
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    padding-bottom: 40px;
  }

  .cardText {
    margin-top: 5px;
    width: 95%;
    height: 95%;
    white-space: pre-wrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>

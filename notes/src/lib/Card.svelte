<script lang="ts">
  import TagView from "./TagView.svelte";
  import TagPreview from "./TagPreview.svelte";
  import type { Item, Tag } from "./data-model";

  export let key: number;
  export let card: Item;
  export let isNewCard: boolean = false;
  export let expanded: boolean = false;
  export let expand: (key: number | null) => void;
  export let deleteTagFromAll: (tag: Tag) => void = () => {};
</script>

{#if expanded}
  <div class="card expanded">
    <span
      on:click={() => expand(key)}
      on:keydown={() => expand(key)}
      class="closeButton"
    >
      <i class="fa-solid fa-x" />
    </span>
    <div class="tagSelector">
      <TagView
        bind:selectedTags={card.tags}
        requiredTag="card"
        {deleteTagFromAll}
      />
    </div>
    <input
      type="text"
      placeholder="Title"
      class="titleInput"
      bind:value={card.title}
    />
    <div class="textAreaWrapper">
      <textarea bind:value={card.text} placeholder="Take a note..." />
    </div>
  </div>
{:else if isNewCard}
  <div
    on:click={() => expand(key)}
    on:keydown={() => expand(key)}
    class="card newCard"
  >
    <i class="fa-solid fa-plus" />
  </div>
{:else}
  <div on:click={() => expand(key)} on:keydown={() => expand(key)} class="card">
    <TagPreview tags={card.tags} />
    <div class="cardTitle">{card.title}</div>
    <div class="cardText">{card.text}</div>
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
    font-size: 2em;
  }

  .expanded {
    position: relative;
    height: 100% !important;
    width: 90vw !important;
    margin-bottom: 0;
    background-color: #242424;
    cursor: text;
    padding: 1rem !important;
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
    top: 1rem;
    right: 1rem;
    cursor: pointer;
  }

  .titleInput {
    font-size: 1.8em;
    font-weight: 700;
    width: 100%;
    height: 1.5em;
    margin-top: 1rem;
    outline: none;
    border: none;
    background-color: transparent;
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
    margin-top: 0.2rem;
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    font-size: 1em;
    line-height: 1.5;
    padding-bottom: 3rem;
  }

  .cardTitle {
    margin-top: 0.5em;
    font-weight: 700;
    font-size: 1.1em;
  }

  .cardText {
    width: 95%;
    height: 85%;
    white-space: pre-wrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>

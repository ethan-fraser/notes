<script lang="ts">
  export let key: number;
  export let newCard: boolean = false;
  export let text: string = "";
  export let tags: string[] = [];
  export let expanded: boolean = false;
  export let setSelected: (key: number | null) => void;

  function expand() {
    expanded = true;
  }
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
    <textarea bind:value={text} />
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
    {text} ({tags})
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
    transition: width 0.5s, height 0.5s;
    cursor: pointer;
    flex-grow: 1;
  }

  .card:hover {
    width: 205px;
    height: 205px;
  }

  .newCard {
    display: grid;
    place-items: center;
    font-size: 32px;
  }

  .expanded {
    position: relative;
    height: 100% !important;
    width: 100% !important;
    margin-bottom: 0;
    background-color: #242424;
    cursor: text;
    padding: 35px 20px 20px 20px !important;
  }

  @media (prefers-color-scheme: light) {
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

  textarea {
    height: 100%;
    width: 100%;
    outline: none;
    border: none;
    background-color: inherit;
    resize: none;
  }
</style>

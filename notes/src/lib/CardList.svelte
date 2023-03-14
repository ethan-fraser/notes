<script lang="ts">
  import { pb } from "./pocketbase";
  import Card from "./Card.svelte";

  let newCardKey: number = 0;
  let allCards: any[] = [];
  $: newCardKey = allCards.length;
  let selectedCardKey: number | null = null;

  async function getCards() {
    return await pb
      .collection("items")
      .getFullList({
        sort: "created",
        expand: "tags",
      })
      .then((data) =>
        data.filter((record) => {
          return record.expand.tags.filter((t) => t.tag === "card").length > 0;
        })
      )
      .then((filtered) => (allCards = filtered));
  }

  function setSelected(key: number | null) {
    selectedCardKey = key;
  }

  getCards();

  $: console.log(selectedCardKey);
</script>

<section class="cardSection">
  {#if selectedCardKey !== null}
    <Card
      key={null}
      text={allCards[selectedCardKey].text}
      tags={allCards[selectedCardKey].expand.tags.map((t) => t.tag)}
      expanded={true}
      {setSelected}
    />
  {:else}
    {#each allCards as card, index}
      <Card
        key={index}
        text={card.text}
        tags={card.expand.tags.map((t) => t.tag)}
        {setSelected}
      />
    {/each}
    <Card key={newCardKey} newCard={true} {setSelected} />
  {/if}
</section>

<style>
  .cardSection {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: 100%;
    margin-top: 10px;
  }
</style>

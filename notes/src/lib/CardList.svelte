<script lang="ts">
  import { pb } from "./pocketbase";
  import Card from "./Card.svelte";

  let newCardKey: number = 0;
  let allCards: any[] = [];
  $: newCardKey = allCards.length;
  let selectedCardKey: number | null = null;
  let prevSelectedCardKey: number | null = 0;

  let updatedCard = {
    text: "",
    tags: [],
  };
  $: if (selectedCardKey != prevSelectedCardKey) {
    prevSelectedCardKey = selectedCardKey;
    if (selectedCardKey !== null && selectedCardKey !== newCardKey) {
      updatedCard.text = allCards[selectedCardKey].text;
      updatedCard.tags = allCards[selectedCardKey].expand.tags.map(
        (t) => t.tag
      );
    } else if (selectedCardKey === null) {
      updatedCard.text = "";
      updatedCard.tags = [];
    }
  }

  $: {
    console.log(updatedCard);
  }

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
</script>

<section class="cardSection">
  {#if selectedCardKey !== null}
    <Card
      key={null}
      bind:text={updatedCard.text}
      bind:tags={updatedCard.tags}
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
    height: 80%;
    margin-top: 10px;
  }
</style>

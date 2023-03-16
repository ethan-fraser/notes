<script lang="ts">
  import { currentUser, pb } from "./pocketbase";
  import Card from "./Card.svelte";
  import lodash from "lodash";

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
      .then((filtered) => (allCards = filtered))
      .catch((err) => console.error(err));
  }

  function updateCardText(cardKey: number | null) {
    if (cardKey == null) return;
    if (cardKey < allCards.length) {
      console.log("updating card " + allCards[cardKey].id);
      pb.collection("items")
        .update(allCards[cardKey].id, {
          text: updatedCard.text,
        })
        .then((record) => {
          console.log(record.text);
          allCards[cardKey] = { ...allCards[cardKey], text: record.text };
        })
        .catch((err) => console.error(err));
    } else {
      pb.collection("tags")
        .getFirstListItem('tag="card"')
        .then((newCardTag) => {
          console.log(updatedCard.text);
          pb.collection("items")
            .create({
              user: $currentUser.id,
              text: updatedCard.text,
              tags: newCardTag.id,
            })
            .then((record) => {
              console.log("created card " + record.id);
              allCards = [
                ...allCards,
                { ...record, expand: { tags: [newCardTag] } },
              ];
            })
            .catch((err) => {
              console.error(err);
              return null;
            });
        })
        .catch((err) => {
          console.error(err);
          return null;
        });
    }
  }

  function setSelected(key: number | null) {
    selectedCardKey = key;
  }

  let newCardKey: number = 0;
  let allCards: any[] = [];
  $: newCardKey = allCards.length;
  let selectedCardKey: number | null = null;
  let prevSelectedCardKey: number | null = 0;
  let updatedCard: {
    text: string;
    prevText: string | null;
    tags: string[];
    prevTags: string[] | null;
  } = {
    text: "",
    prevText: null,
    tags: [],
    prevTags: null,
  };

  $: if (selectedCardKey !== prevSelectedCardKey) {
    if (prevSelectedCardKey !== null && prevSelectedCardKey !== newCardKey) {
      updatedCard.text = allCards[prevSelectedCardKey].text;
      updatedCard.tags = allCards[prevSelectedCardKey].expand.tags.map(
        (t) => t.tag
      );
    } else if (prevSelectedCardKey === null) {
      updatedCard.text = "";
      updatedCard.tags = [];
    }
    if (
      selectedCardKey == null &&
      prevSelectedCardKey !== null &&
      updatedCard.text
    ) {
      console.log("hi");
      updateCardText(prevSelectedCardKey);
    }
    prevSelectedCardKey = selectedCardKey;
  }

  $: if (!lodash.isEqual(updatedCard.tags, updatedCard.prevTags)) {
    updatedCard.prevTags = updatedCard.tags;
    // TODO: update tags
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

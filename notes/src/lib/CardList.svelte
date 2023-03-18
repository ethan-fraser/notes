<script lang="ts">
  import { currentUser, pb } from "./pocketbase";
  import Card from "./Card.svelte";
  import lodash from "lodash";
  import type { Item, Tag } from "./data-model";

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
      .then(
        (filtered) =>
          (allCards = filtered.map((item) => {
            return {
              id: item.id,
              text: item.text,
              tags: item.expand.tags.map((t: { tag: any; color: any }) => {
                return {
                  tag: t.tag,
                  color: t.color,
                };
              }),
            };
          }))
      )
      .catch((err) => console.error(err));
  }

  function updateCardText(cardKey: number | null) {
    if (cardKey == null) return;
    if (cardKey < allCards.length) {
      console.log("updating card " + allCards[cardKey].id);
      pb.collection("items")
        .update(allCards[cardKey].id, {
          text: allCards[cardKey].text,
        })
        .then((record) => {
          console.log(record.text);
          allCards[cardKey] = { ...allCards[cardKey], text: record.text };
        })
        .catch((err) => console.error(err));
    } else {
      pb.collection("items")
        .create({
          user: $currentUser.id,
          text: newCard.text,
          tags: newCardTag.id,
        })
        .then((record) => {
          console.log("created card " + record.id);
          allCards = [
            ...allCards,
            { id: record.id, text: record.text, tags: [newCardTag] },
          ];
        })
        .catch((err) => {
          console.error(err);
          return null;
        });
    }
  }

  function createNewCard() {
    pb.collection("tags")
      .getFirstListItem('tag="card"')
      .then((record) => {
        newCardTag = { id: record.id, tag: record.tag, color: record.color };
        newCard = {
          id: "",
          text: "",
          tags: [newCardTag],
        };
      })
      .catch((err) => {
        console.error(err);
        return null;
      });
  }

  function setSelected(key: number | null) {
    selectedCardKey = key;
  }

  let newCardTag: Tag = null;
  let newCardKey: number = 0;
  let allCards: Item[] = [];
  $: newCardKey = allCards.length;
  let selectedCard: any;
  let selectedCardKey: number = null;
  let prevSelectedCardKey: number = null;
  let newCard: Item = null;

  $: if (selectedCardKey !== prevSelectedCardKey) {
    if (selectedCardKey === null && prevSelectedCardKey !== null) {
      if (!(prevSelectedCardKey === newCardKey && !newCard.text))
        updateCardText(prevSelectedCardKey);
    }
    prevSelectedCardKey = selectedCardKey;
  }

  $: {
    if (selectedCardKey < allCards.length) {
      selectedCard = allCards[selectedCardKey];
    } else if (selectedCardKey === newCardKey) {
      selectedCard = newCard;
    } else {
      selectedCard = null;
    }
  }

  // $: if (!lodash.isEqual(updatedCard.tags, updatedCard.prevTags)) {
  //   updatedCard.prevTags = updatedCard.tags;
  //   // TODO: update tags
  // }

  createNewCard();
  getCards();
</script>

<section class={selectedCardKey === null ? "cardSection" : "cardWrapper"}>
  {#if selectedCardKey !== null}
    <Card key={null} bind:card={selectedCard} expanded={true} {setSelected} />
  {:else}
    {#each allCards as card, index}
      <Card key={index} {card} {setSelected} />
    {/each}
    <Card
      key={newCardKey}
      card={{ id: null, text: "", tags: [newCardTag] }}
      isNewCard={true}
      {setSelected}
    />
  {/if}
</section>

<style>
  .cardSection {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 10px;
  }

  .cardWrapper {
    display: flex;
    height: 80%;
  }
</style>

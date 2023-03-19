<script lang="ts">
  import { currentUser, pb } from "./pocketbase";
  import Card from "./Card.svelte";
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
              tags: item.expand.tags.map(
                (t: { id: string; tag: string; color: string }) => {
                  return {
                    id: t.id,
                    tag: t.tag,
                    color: t.color,
                  };
                }
              ),
            };
          }))
      )
      .catch((err) => console.error(err));
  }

  function createCardFromNewCard() {
    pb.collection("items")
      .create(
        {
          user: $currentUser.id,
          text: newCard.text,
          tags: newCard.tags.map((t) => t.id),
        },
        {
          expand: "tags",
        }
      )
      .then((record) => {
        console.log("created card " + record.id);
        allCards = [
          ...allCards,
          {
            id: record.id,
            text: record.text,
            tags: record.expand.tags.map(
              (t: { id: string; tag: string; color: string }) => {
                return { id: t.id, tag: t.tag, color: t.color };
              }
            ),
          },
        ];
      })
      .catch((err) => {
        console.error(err);
        return null;
      });
  }

  function updateCard(cardKey: number | null) {
    console.log("updating card " + allCards[cardKey].id ?? "(new card)");
    pb.collection("items")
      .update(allCards[cardKey].id, {
        text: allCards[cardKey].text,
        tags: allCards[cardKey].tags.map((t) => t.id),
      })
      .then((record) => {
        console.log(record.text);
        console.log(record.tags);
      })
      .catch((err) => console.error(err));
  }

  function getCardTag() {
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

  function expand(key: number | null) {
    expandedCardKey = key;
  }

  let newCardTag: Tag = null;
  let newCardKey: number = 0;
  let allCards: Item[] = [];
  $: newCardKey = allCards.length;
  let expandedCard: any;
  let expandedCardKey: number = null;
  let prevExpandedCardKey: number = null;
  let newCard: Item = {
    id: "",
    text: "",
    tags: [newCardTag],
  };

  $: if (expandedCardKey !== prevExpandedCardKey) {
    if (expandedCardKey === null && prevExpandedCardKey !== null) {
      if (prevExpandedCardKey === newCardKey && newCard.text) {
        createCardFromNewCard();
        newCard = {
          id: "",
          text: "",
          tags: [newCardTag],
        };
      } else if (prevExpandedCardKey === newCardKey) {
        newCard = { id: "", text: "", tags: [newCardTag] };
      } else if (prevExpandedCardKey < allCards.length) {
        updateCard(prevExpandedCardKey);
      }
    }
    prevExpandedCardKey = expandedCardKey;
  }

  $: {
    if (expandedCardKey < allCards.length) {
      expandedCard = allCards[expandedCardKey];
    } else if (expandedCardKey === newCardKey) {
      expandedCard = newCard;
    } else {
      expandedCard = null;
    }
  }

  getCardTag();
  getCards();
</script>

<section class={expandedCardKey === null ? "cardSection" : "cardWrapper"}>
  {#if expandedCardKey !== null}
    <Card key={null} bind:card={expandedCard} expanded={true} {expand} />
  {:else}
    {#each allCards as card, index}
      <Card key={index} {card} {expand} />
    {/each}
    <Card key={newCardKey} card={newCard} isNewCard={true} {expand} />
  {/if}
</section>

<style>
  .cardSection {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 1rem;
  }

  .cardWrapper {
    display: flex;
    height: 80%;
  }
</style>

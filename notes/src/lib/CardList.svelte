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
          text: allCards[cardKey].text,
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
          console.log(newCard.text);
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
  let selectedCard: any;
  let selectedCardKey: number | null = null;
  let prevSelectedCardKey: number | null = null;
  let newCard: {
    text: string;
    tags: string[];
  } = {
    text: "",
    tags: [],
  };

  $: if (selectedCardKey !== prevSelectedCardKey) {
    if (selectedCardKey === null && prevSelectedCardKey !== null) {
      console.log("hi");
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

  getCards();
</script>

<section class="cardSection">
  {#if selectedCardKey !== null}
    <Card
      key={null}
      bind:text={selectedCard.text}
      bind:tags={selectedCard.tags}
      tagValues={selectedCard.expand.tags.map((t) => {
        return { tag: t.tag, color: t.color };
      })}
      expanded={true}
      {setSelected}
    />
  {:else}
    {#each allCards as card, index}
      <Card
        key={index}
        text={card.text}
        tags={card.expand.tags.map((t) => t.tag)}
        tagValues={card.expand.tags.map((t) => {
          return { tag: t.tag, color: t.color };
        })}
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
    margin-top: 10px;
  }
</style>

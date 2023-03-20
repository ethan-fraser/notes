<script lang="ts">
  import _ from "lodash";
  import { currentUser, pb } from "./pocketbase";
  import Card from "./Card.svelte";
  import type { Item, Tag } from "./data-model";
  import FilterSortSearch from "./FilterSortSearch.svelte";

  async function getCards(filter?: string, sort?: string, search?: string) {
    let filterExpression = "";
    if (filter && search) {
      filterExpression = filterExpression + " && " + search;
    } else if (filter) {
      filterExpression = filter;
    } else if (search) {
      filterExpression = search;
    }
    return await pb
      .collection("items")
      .getFullList({
        sort: sort ?? "created",
        expand: "tags",
        filter: filterExpression,
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
              title: item.title,
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
          title: newCard.title,
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
            title: record.title,
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
        title: allCards[cardKey].title,
        text: allCards[cardKey].text,
        tags: allCards[cardKey].tags.map((t) => t.id),
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
          title: "",
          text: "",
          tags: [newCardTag],
        };
      })
      .catch((err) => {
        console.error(err);
        return null;
      });
  }

  function deleteTagFromAll(tag: Tag) {
    allCards = allCards.map((card) => {
      return {
        ...card,
        tags: card.tags.filter((t) => t.id !== tag.id),
      };
    });
  }

  function deleteSelected() {
    selectedCards.forEach((card) => {
      pb.collection("items")
        .delete(card.id)
        .then(() => {
          selectedCards = selectedCards.filter((c) => c.id != card.id);
          allCards = allCards.filter((c) => c.id != card.id);
        })
        .catch((err) => console.error(err));
    });
  }

  function expand(key: number | null) {
    expandedCardKey = key;
  }

  function selectCard(card: Item) {
    if (_.includes(selectedCards, card)) {
      selectedCards = selectedCards.filter((c) => c.id != card.id);
    } else {
      selectedCards = [...selectedCards, card];
    }
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
    title: "",
    text: "",
    tags: [newCardTag],
  };
  let selectedCards: Item[] = [];

  $: if (expandedCardKey !== prevExpandedCardKey) {
    if (expandedCardKey === null && prevExpandedCardKey !== null) {
      if (prevExpandedCardKey === newCardKey && newCard.text) {
        createCardFromNewCard();
        newCard = {
          id: "",
          title: "",
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

{#if expandedCardKey === null}
  <FilterSortSearch
    getItems={getCards}
    allItems={allCards}
    requiredTag={"card"}
  />
{/if}
<section
  class={expandedCardKey === null ? "cardSection" : "expandedCardWrapper"}
>
  {#if expandedCardKey !== null}
    <Card
      key={null}
      bind:card={expandedCard}
      expanded={true}
      {expand}
      {deleteTagFromAll}
    />
  {:else}
    {#each allCards as card, index}
      <div class="cardWrapper">
        <Card key={index} {card} {expand} />
        <div
          class={_.includes(selectedCards, card)
            ? "selectedIcon"
            : "selectIcon"}
          on:click={() => selectCard(card)}
          on:keydown={() => selectCard(card)}
        >
          <i class="fa-solid fa-check" />
        </div>
      </div>
    {/each}
    <Card key={newCardKey} card={newCard} isNewCard={true} {expand} />
  {/if}
</section>
{#if selectedCards.length}
  <div class="deleteBanner">
    <span
      class="cancelDelete"
      on:click={() => (selectedCards = [])}
      on:keydown={() => (selectedCards = [])}><i class="fa-solid fa-x" /></span
    >
    <span>Delete selected?</span>
    <button on:click={deleteSelected} class="deleteButton">Confirm</button>
  </div>
{/if}

<style>
  .cardSection {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 1rem;
  }

  .expandedCardWrapper {
    display: flex;
    height: 80%;
  }

  .cardWrapper {
    position: relative;
    display: flex;
    flex-grow: 1;
  }

  .selectIcon,
  .selectedIcon {
    position: absolute;
    top: 1.2em;
    right: 1.2em;
    font-size: 14px;
    height: 17px;
    width: 17px;
    display: none;
    place-items: center;
    border: 1px solid white;
    border-radius: 100%;
    cursor: pointer;
  }

  .selectedIcon {
    color: #242424;
    background-color: #fff;
  }

  .cardWrapper:hover .selectIcon,
  .selectedIcon {
    display: grid;
  }

  .deleteBanner {
    position: absolute;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    bottom: 3rem;
    border: 1px solid #fff;
    width: 400px;
    height: 50px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 30px;
  }

  .deleteButton {
    color: red;
    background-color: #00000000;
    border: none;
    outline: none;
  }

  .deleteButton:hover {
    text-decoration: underline;
  }

  .cancelDelete {
    cursor: pointer;
  }

  @media (prefers-color-scheme: light) {
    .selectIcon,
    .selectedIcon {
      border: 1px solid black;
    }

    .selectedIcon {
      color: #fff;
      background-color: #242424;
    }

    .deleteBanner {
      background-color: #ddd;
      border: 1px solid #242424;
    }
  }
</style>

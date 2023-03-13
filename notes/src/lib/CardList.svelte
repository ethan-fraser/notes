<script lang="ts">
  import { pb } from "./pocketbase";
  import Card from "./Card.svelte";

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
      );
  }
</script>

<section class="cardSection">
  {#await getCards() then cards}
    {#each cards as card}
      <Card text={card.text} tags={card.expand.tags.map((t) => t.tag)} />
    {/each}
  {:catch err}
    <p>Error: {err.message}</p>
  {/await}
</section>

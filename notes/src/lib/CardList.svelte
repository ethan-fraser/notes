<script lang="ts">
  import { pb } from "./pocketbase";

  type ICard = {
    text: string;
    tags: string[];
  };

  async function getCards() {
    return await pb
      .collection("items")
      .getFullList({ sort: "created", filter: "tags?~'card'" });
  }
</script>

<section class="cardSection">
  {:await getCards() then cards}
    {:each cards as card}
      <Card text={card.text} tags={card.tags} />
    {/each}
  {:catch err}
    <p>Error: {err.message}</p>
  {/await}
</section>
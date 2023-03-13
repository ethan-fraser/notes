<script lang="ts">
  import { currentUser, pb } from "./lib/pocketbase";
  import Login from "./lib/Login.svelte";
  import ItemList from "./lib/ItemList.svelte";
  import NewItemButton from "./lib/NewItemButton.svelte";

  async function getItems() {
    return await pb.collection("items").getFullList({ sort: "created" });
  }
</script>

{#if $currentUser}
  <header>
    <h1>Notes</h1>
    <Login />
  </header>
  <section>
    {#await getItems() then items}
      <ItemList {items} />
    {:catch error}
      <p>Error: {error.message}</p>
    {/await}
  </section>
  <NewItemButton />
{:else}
  <div class="login">
    <h1>Notes</h1>
    <Login />
  </div>
{/if}

<style>
  header {
    width: 90vw;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .login {
    margin: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 90vh;
  }
</style>

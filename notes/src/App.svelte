<script lang="ts">
  import { currentUser } from "./lib/pocketbase";
  import Login from "./lib/Login.svelte";
  import ItemList from "./lib/ItemList.svelte";
</script>

{#if $currentUser}
  <header>
    <h1>Notes</h1>
    <Login />
  </header>
  <section>
    <ItemList />
  </section>
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

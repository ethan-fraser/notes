<script lang="ts">
  export let tags: { tag: string; color: string }[];
</script>

<div class="tagView">
  {#each tags as t}
    <span class="tag" style="background-color: {t.color}" />
  {/each}
</div>

<style>
  .tagView {
    display: flex;
  }

  .tag {
    height: 5px;
    width: 20px;
    color: black;
    border-radius: 8px;
    margin-right: 8px;
  }
</style>

<script lang="ts">
  import { pb } from "./pocketbase";
  import type { Item, Tag } from "./data-model";

  // order: true = newest/A first
  // order: false = oldest/Z first
  type SortOption = {
    by: string;
    type: "numeric" | "alphabetic";
    order: boolean;
  };

  export let allItems: Item[];
  export let getItems: (
    search?: string,
    sort?: string,
    filter?: string
  ) => void;
  export let requiredTag: string;

  function getAllTags() {
    pb.collection("tags")
      .getFullList()
      .then((tags) => {
        allTags = tags.map((t) => {
          return {
            id: t.id,
            tag: t.tag,
            color: t.color,
          };
        });
        checkedTags = [allTags.find((tag) => tag.tag === requiredTag).id];
      })
      .catch((err) => console.error(err));
  }

  function handleSortButtonClicked(sortOption: SortOption) {
    if (selectedSortOption.by === sortOption.by) {
      selectedSortOption.order = !selectedSortOption.order;
    } else {
      selectedSortOption = sortOption;
    }
    sortExp = "";
    switch (selectedSortOption.by) {
      case "Edited":
        sortExp = "updated";
        break;
      case "Title":
        sortExp = "title";
        break;
      case "Text":
        sortExp = "text";
        break;
      case "Created":
      default:
        sortExp = "created";
    }
    if (!selectedSortOption.order) {
      sortExp = "-" + sortExp;
    }
    getItems(searchExp, sortExp, filterExp);
  }

  let allTags: Tag[] = [];

  let showFilter: boolean;
  let showSort: boolean;
  let showSearch: boolean;

  let searchExp: string;
  let filterExp: string;
  let sortExp: string;

  let checkedTags: string[] = [];
  $: {
    filterExp = "";
    for (const tagID of checkedTags) {
      if (filterExp) {
        filterExp += " && ";
      }
      filterExp += `tags~'${tagID}'`;
    }
  }
  getAllTags();

  let sortOptions: SortOption[] = [
    {
      by: "Edited",
      type: "numeric",
      order: true,
    },
    {
      by: "Created",
      type: "numeric",
      order: true,
    },
    {
      by: "Title",
      type: "alphabetic",
      order: true,
    },
    {
      by: "Text",
      type: "alphabetic",
      order: true,
    },
  ];
  let selectedSortOption: SortOption = {
    by: "Edited",
    type: "numeric",
    order: false,
  };
</script>

<div class="filterSortSearchDiv">
  <div class="filter">
    <button
      on:click={() => {
        showFilter = !showFilter;
        showSort = false;
        showSearch = false;
      }}><i class="fa-solid fa-filter" /> Filter</button
    >
    {#if showFilter}
      <div class="filterSelector">
        {#each allTags as t}
          <div class="tagCheckbox">
            <input
              type="checkbox"
              id={t.id}
              name={t.tag}
              value={t.id}
              bind:group={checkedTags}
              disabled={t.tag === requiredTag}
            />
            <label for={t.id} style="background-color: {t.color}">{t.tag}</label
            >
          </div>
        {/each}
        <button
          style="applyButton"
          on:click={() => getItems(searchExp, sortExp, filterExp)}>Apply</button
        >
      </div>
    {/if}
  </div>
  <div class="sort">
    <button
      on:click={() => {
        showFilter = false;
        showSort = !showSort;
        showSearch = false;
      }}><i class="fa-solid fa-sort" /> Sort</button
    >
    {#if showSort}
      <div class="sortSelector">
        {#each sortOptions as sortOption}
          <div
            class="sortOption"
            on:click={() => handleSortButtonClicked(sortOption)}
            on:keydown={() => handleSortButtonClicked(sortOption)}
          >
            {#if selectedSortOption.by === sortOption.by}
              {#if selectedSortOption.order}
                <i
                  class={`fa-solid ${
                    sortOption.type === "numeric"
                      ? "fa-sort-down"
                      : "fa-arrow-down-a-z"
                  }`}
                />
              {:else}
                <i
                  class={`fa-solid ${
                    sortOption.type === "numeric"
                      ? "fa-sort-up"
                      : "fa-arrow-up-a-z"
                  }`}
                />
              {/if}
            {/if}
            <span
              class={selectedSortOption.by === sortOption.by
                ? "selectedOptionLabel"
                : "optionLabel"}>{sortOption.by}</span
            >
          </div>
        {/each}
      </div>
    {/if}
  </div>
  <div class="search">
    <button><i class="fa-solid fa-search" /> Search</button>
  </div>
</div>

<style>
  .filterSortSearchDiv {
    display: flex;
    justify-content: center;
    gap: 1em;
    margin-top: 1em;
  }

  .filter,
  .sort,
  .search {
    position: relative;
  }

  .filterSelector,
  .sortSelector {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: start;
    background-color: #242424;
    border: 1px solid #fff;
    border-radius: 5px;
    padding: 1em;
    z-index: 1;
  }

  .sortSelector {
    width: 100px;
    transform: translateX(-25px);
  }

  .tagCheckbox {
    display: flex;
    margin-top: 0.5em;
  }

  .tagCheckbox label {
    text-align: left;
    margin-left: 0.5em;
    padding: 0.1em 0.3em;
    border-radius: 3px;
    width: 17ex;
    white-space: nowrap;
    color: #242424;
    margin-right: 0.5em;
  }

  .sortOption {
    cursor: pointer;
    user-select: none;
    display: flex;
  }

  .optionLabel {
    padding-left: 1em;
  }

  .selectedOptionLabel {
    padding-left: 0;
    margin-left: 0.1em;
  }

  .fa-sort-up {
    margin-top: 0.5em;
  }
</style>

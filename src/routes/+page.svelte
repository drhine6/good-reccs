<script>
    export let data;
  </script>
  {#if data.books.length === 0}
    <p>No books found.</p>
  {:else}
    <div class="grid grid-cols-2 md:grid-cols-8 gap-4 lg:px-40 xl:px-80">
      {#each data.books as book}
        <div class="p-4">
          {#if book.image}
            <img src={book.image.url} alt={book.title} class="w-full rounded-md mb-2 shadow" />
          {:else}
            <p>{book.title}</p>                        
          {/if}        
        </div>
      {/each}
    </div>
  {/if}
  
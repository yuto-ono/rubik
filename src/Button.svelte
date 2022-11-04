<button type="button" class="btn" on:click>
  <slot />
</button>

<style lang="scss">
  .btn {
    display: inline-block;
    border: none;
    outline: none;
    padding: 5px 20px;
    border-radius: 4px;
    background-color: #69c;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    user-select: none;
    &:hover {
      opacity: 0.8;
    }
  }
</style>

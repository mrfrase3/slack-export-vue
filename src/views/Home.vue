<script lang="ts" setup>

const store = useStore();

const onDonate = () => {
  store.coffeeMenu = true;
};

</script>

<template>
  <div class="home-wrap">
    <h1>Welcome to Slax Pro</h1>
    <p>A <i>Free &amp; Professional</i> viewer for slack-like export content.</p>
    <p>Click a channel on the left to start viewing!</p>
    <p>
      Found this useful? Maybe you'd like to:
      <br>
      <button class="btn btn-primary btn-bmc" @click="onDonate">
        <img
          src="https://cdn.buymeacoffee.com/widget/assets/coffee%20cup.svg"
          alt="Buy me a coffee"
          style="height: 20px; margin-right: 8px"
        >
        Buy me a coffee
      </button>
    </p>
    <p>
      <small>
        This project is in <b>no</b> way affiliated with nor endorsed by Slack.
        <br>
        This is Slax, which is very different from Slack. (and more pro)
      </small>
    </p>
  </div>
</template>

<style scoped>

h1 {
  margin: 0;
}

.home-wrap {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.btn-bmc {
  margin-top: 1rem;
  background: #5F7FFF;
  display: inline-block;
}

</style>

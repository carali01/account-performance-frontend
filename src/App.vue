<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
// import { onMounted, ref } from 'vue';

</script>

<template>
  <header>

    <div class="wrapper">

      <!-- <nav>
        <RouterLink to="/">主页</RouterLink>
        <RouterLink to="/pop-sector">热门行业</RouterLink>
        <RouterLink to="/pop-stock">热门股票</RouterLink>
      </nav> -->

      <nav class="nav nav-pills bg-dark justify-content-center">
        <li class="nav-item fs-6 me-2">
          <RouterLink to="/">主页</RouterLink>
        </li>
        <li class="nav-item fs-6 me-2">
           <RouterLink to="/pop-sector">热门行业</RouterLink>
        </li>
        <li class="nav-item fs-6">
           <RouterLink to="/pop-stock">热门股票</RouterLink>
        </li>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 16px;
  text-align: center;
  /* margin-top: 1rem; */
  padding: 15px;
}

nav a {
  text-decoration: none;
  padding: 15px;
  border-radius: 0.5rem;
}

nav .nav-link {
  transition: color 0.1s ease;
  transition: background-color 0.1s ease;
}

nav a:not(.router-link-exact-active):hover {
  background: #ffffffd2;
  color: #000000 !important;
}

nav a:not(.router-link-exact-active) {
  color: #ffffff;
}

nav a.router-link-exact-active {
  background-color: #ffffff;
  color: #000000 !important;
}

/* nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
} */

/* @media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
} */
</style>

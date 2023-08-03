<script>
  import dayjs from 'dayjs';

  export default {
    data() {
      return {
        currentTime: dayjs().format('YYYY 年 MM 月 DD 日 dddd HH:mm:ss'),
        timeTimer: 0,
      };
    },
    computed: {
      dashboradRoutes() {
        const routesOfDashboard = this.$router
          .getRoutes()
          .filter((route) => /\/dashboard\//.test(route.path));
        routesOfDashboard.forEach((route) => {
          route.meta.active = route.path === this.$route.path;
        });
        return routesOfDashboard;
      },
    },
    mounted() {
      this.timeTimer = setInterval(() => {
        this.currentTime = dayjs().format('YYYY 年 MM 月 DD 日 dddd HH:mm:ss');
      }, 1000);
    },
    beforeDestroy() {
      clearInterval(this.timeTimer);
    },
  };
</script>
<template>
  <div h="100vh" overflow="hidden" flex="~ col">
    <header class="dashboard-header" h="25" p="x-4" flex="~" items="center" text="xl">
      <p flex="1/5">{{ currentTime }}</p>
      <h1 text="4xl center" select="none">在线监测</h1>
      <p flex="1/5" text="right">
        <i class="icon i-material-symbols:home-rounded p-l-10"></i>
        <i class="icon i-material-symbols:account-circle-outline"></i>
      </p>
    </header>
    <div m="4 b-10" rounded="2" flex="1 ~ col" overflow="hidden" bg="primary/15">
      <nav h="25">
        <RouterLink
          class="dashboard-nav-item"
          v-for="navItem in dashboradRoutes"
          :key="navItem.path"
          :to="navItem"
          :class="{ active: navItem.meta?.active }"
        >
          <span class="dashboard-nav-item--icon">
            <i class="icon" :class="navItem.meta?.iconClass"></i>
          </span>
          <span class="dashboard-nav-item--text">{{ navItem.meta?.text }}</span>
        </RouterLink>
      </nav>
      <main flex="1" overflow="hidden">
        <RouterView></RouterView>
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .icon {
    @apply text-3xl;
  }
  .dashboard {
    &-header {
      background-image: url('@/assets/images/theme-header.png');
      background-size: 100%;
      @apply bg-center bg-no-repeat;
      .icon {
        @apply cursor-pointer transition hover:(transform scale-150 text-primary);
      }
    }
    &-nav {
      &-item {
        @apply inline-flex items-center m-5 w-24 overflow-hidden relative cursor-pointer transition-all duration-500;
        &--icon {
          background-image: url('@/assets/images/nav-item--icon.png');
          @apply p-y-3 p-x-8 bg-contain bg-center bg-no-repeat;
        }
        &--text {
          line-height: 3rem;
          background-image: url('@/assets/images/nav-item--text.png');
          @apply absolute right-40 -z-1 w-0 text-center bg-contain bg-center bg-no-repeat transition-all duration-500;
        }
        &.active,
        &:hover {
          @apply w-40;
        }
        &.active &--text,
        &:hover &--text {
          @apply right-0 w-25;
        }
      }
    }
  }
</style>

<script>
  import { mapActions } from 'pinia';
  import { useUserStore } from '../stores/user';
  export default {
    data() {
      return {
        from: {},
      };
    },
    mounted() {
      this.handleRoutingLogin();
    },
    methods: {
      ...mapActions(useUserStore, {
        loginValidate: 'validate',
        loginInfoRefresh: 'refresh',
      }),
      handleRoutingLogin() {
        const logined = this.loginValidate();
        if (logined) {
          this.$router.push('/');
        } else {
          this.listeningBroadcast();
        }
      },
      listeningBroadcast() {
        console.log('Broadcast start');
        /**
         * @param {MessageEvent<any>} ev
         */
        const handleBroadcastResponse = (ev) => {
          console.log('Broadcast receive');
          if (
            [
              'http://localhost:9528',
              'http://192.168.1.173:9528',
              'http://iot.cqset.com',
              'https://iot.cqset.com',
            ].includes(ev.origin)
          ) {
            const { data = {} } = ev;
            if (data?.userInfo?.token) {
              this.loginInfoRefresh(data.userInfo);
            }
            if (data?.from) {
              this.from = data.from;
            }
            this.handleRoutingLogin();
            handleBroadcastStop(ev);
          }
        };
        window.addEventListener('message', handleBroadcastResponse);

        const handleBroadcastStop = (ev) => {
          window.removeEventListener('message', handleBroadcastResponse);
          if (ev) {
            ev.source.postMessage('done', ev.origin);
          } else if (window.opener) {
            window.opener.postMessage('done', '*');
          }
          console.log('Broadcast end');
        };
        setTimeout(handleBroadcastStop, 10000);
      },
      handleRoutingBack() {
        if (this.from?.href) {
          if (this.from?.name) {
            window.open(this.from.href, this.from.name);
          } else {
            location.href = this.from.href;
          }
        } else {
          window.open('https://iot.cqset.com/view/#/login', '智慧电网数据分析平台');
          window.close();
        }
      },
    },
  };
</script>

<template>
  <div class="login">
    <p>权限认证中....</p>
    <p>
      如果长时间未认证通过点击 <span class="back-link" @click="handleRoutingBack">这里返回</span>
    </p>
  </div>
</template>

<style lang="scss" scoped>
  .login {
    height: 100vh;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
  }
  .back-link {
    color: blue;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
</style>

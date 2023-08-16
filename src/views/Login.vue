<script>
  import { mapState, mapActions } from 'pinia';
  import { useUserStore } from '../stores/user';
  export default {
    data() {
      return {
        message: '',
      };
    },
    computed: {
      ...mapState(useUserStore, ['from']),
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
        console.log('logined', logined);
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
          console.log('Broadcast receive', ev);
          if (
            [
              'http://localhost:9528',
              'http://192.168.1.173:9528',
              'http://iot.cqset.com',
              'https://iot.cqset.com',
              'http://ndiot.cqset.com',
              'https://ndiot.cqset.com',
            ].includes(ev.origin)
          ) {
            const { data = {} } = ev;
            if (data?.userInfo?.token) {
              this.loginInfoRefresh(data.userInfo, data.from);
              this.message = '认证通过';
              handleBroadcastStop(ev);
            }
            setTimeout(() => {
              this.handleRoutingLogin();
            }, 1000);
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
          window.open('http://iot.cqset.com/view/#/login', '智慧电网数据分析平台');
          window.close();
        }
      },
    },
  };
</script>

<template>
  <div h="100vh" flex="~" justify="center" items="center">
    <div
      rounded="4"
      w="1/2"
      h="1/2"
      shadow="~ blue-200"
      text="2xl center"
      flex="~ col"
      justify="center"
    >
      <p>{{ message || '用户权限认证中....' }}</p>
      <p m="t-10" v-show="!message">
        如果长时间未认证通过点击
        <span
          text="blue-500"
          class="hover:(underline underline-blue-500)"
          cursor="pointer"
          @click="handleRoutingBack"
        >
          这里
        </span>
        返回或关闭
      </p>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'pinia';
  import { useUserStore } from '../stores/user';
  import { APIUser } from '../apis/user';
  import { validateResponseCode, getResponseMessage } from '@shihongxins/jsutils';

  export default {
    data() {
      return {
        message: '',
        manual: false,
        loginInfo: {
          username: '',
          password: '',
          code: '',
        },
        verifyCodeImg: null,
        showPwd: false,
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
        login: 'login',
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
          const validOrigin =
            /^https?:\/\/((.*iot\.cqset\.com)|(localhost|(192\.168\.1)))|/gim.test(ev.origin);
          console.log('Broadcast receive', ev, validOrigin);
          if (
            validOrigin ||
            [
              'http://localhost:8800',
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
          this.manual = true;
          this.getVerifyCodeImage();
        }
      },
      async getVerifyCodeImage() {
        this.loginInfo.code = '';
        if (this.verifyCodeImg) {
          URL.revokeObjectURL(this.verifyCodeImg);
        }
        this.verifyCodeImg = '';
        const res = await APIUser.getVerifyCode();
        const { error, data } = res;
        if (!error && validateResponseCode(data) && data.data instanceof Blob) {
          this.verifyCodeImg = URL.createObjectURL(data.data);
        }
      },
      async submit() {
        const res = await this.login(this.loginInfo);
        const { error, data } = res;
        if (!error && validateResponseCode(data)) {
          this.$router.push('/');
        } else {
          this.$message.error('登录失败：' + getResponseMessage(error || data || res));
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
      <template v-if="!manual">
        <p>{{ message || '用户权限自动认证中....' }}</p>
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
          返回或手动登录
        </p>
      </template>
      <template v-else>
        <form class="login-form">
          <h1 text="4xl primary">在线监测</h1>
          <div class="form-item">
            <label>
              <i class="i-material-symbols:account-circle icon uno-icon-fix"></i>
              <input type="text" placeholder="账号" v-model="loginInfo.username" />
            </label>
            <p class="verify-message"></p>
          </div>
          <div class="form-item">
            <label>
              <i class="i-material-symbols:password icon uno-icon-fix"></i>
              <input
                :type="showPwd ? 'text' : 'password'"
                placeholder="密码"
                autocomplete="new-password"
                v-model="loginInfo.password"
              />
              <i
                class="i-material-symbols:visibility-rounded icon uno-icon-fix"
                cursor-pointer
                @click="showPwd = !showPwd"
              ></i>
            </label>
            <p class="verify-message"></p>
          </div>
          <div class="form-item">
            <label>
              <input type="text" placeholder="验证码" v-model="loginInfo.code" />
              <div bg="content/80" cursor-pointer @click="getVerifyCodeImage">
                <img :src="verifyCodeImg" alt="验证码图片" />
              </div>
            </label>
          </div>
          <button type="submit" rounded p-2 bg="primary/80" @click="submit">登 录</button>
        </form>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .login-form {
    @apply m-auto p-4 w-2/3 flex flex-col space-y-4;
    .form-item {
      @apply flex flex-col mb-6 ring rounded;
      label {
        > * {
          @apply h-full;
        }
        @apply flex items-center;
        .icon {
          @apply mx-4 color-info;
        }
      }
      input {
        outline: none;
        height: 3rem;
        line-height: 3rem;
        @apply flex-1 px-4 bg-transparent text-content;
      }
    }
  }
</style>

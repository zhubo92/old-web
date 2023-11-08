<script setup lang="ts">
import { Overlay as VanOverlay, showToast } from "vant";
import { computed, onUnmounted, reactive, ref, watch } from "vue";
import { getSMSByPhoneRequest } from "@/api/user";

const closeBtn = "https://app-resources-luojigou.luojigou.vip/FsYUqsiyptxoNjMXbkS9owmT6TNm";

const emit = defineEmits<{
  (e: "close"): void;
  (e: "login", phone: string, code: string): void;
}>();

const props = withDefaults(
  defineProps<{
    show: boolean;
  }>(),
  {
    show: false,
  },
);

const phone = ref("");
const code = ref("");
const state = reactive<{
  smsTime: number;
  codeDisabled: boolean;
  codeMsg: string;
  timer: NodeJS.Timeout | null;
}>({
  smsTime: 60, // 短信倒计时时间
  codeDisabled: false, // 短信是否禁用
  codeMsg: "获取验证码", // 短信按钮上的文字
  timer: null, // 短信上的定时器
});

const show = computed(() => props.show);

watch(show, () => {
  if (show.value) {
    phone.value = "";
    code.value = "";
  }
});

function clearTimer() {
  if (state.timer) {
    clearInterval(state.timer);
    state.timer = null;
  }
}

function getCodeStr() {
  state.codeDisabled = true;
  // 验证码60秒倒计时
  if (!state.timer) {
    state.timer = setInterval(() => {
      if (state.smsTime > 0 && state.smsTime <= 60) {
        state.smsTime--;
        if (state.smsTime !== 0) {
          state.codeMsg = "重新发送(" + state.smsTime + ")";
        } else {
          clearTimer();
          state.codeMsg = "获取验证码";
          state.smsTime = 60;
          state.codeDisabled = false;
        }
      }
    }, 1000);
  }
}
async function getCode() {
  if (!verifyPhone() || state.codeDisabled) return;
  const { status, msg } = await getSMSByPhoneRequest(phone.value);
  if (status === 200) {
    showToast("获取验证码成功");
    getCodeStr();
  } else {
    msg && showToast(msg);
  }
}
function verifyPhone() {
  const REG = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
  if (!phone.value || !phone.value.toString().trim()) {
    showToast("手机号不能为空");
    return false;
  } else if (!REG.test(phone.value)) {
    showToast("手机号格式不对");
    return false;
  }
  return true;
}
function verifyCode() {
  if (!code.value || !code.value?.toString().trim()) {
    showToast("验证码不能为空");
    return false;
  }
  return true;
}
function login() {
  if (!verifyPhone()) return;
  if (!verifyCode()) return;
  if (phone.value && code.value) emit("login", phone.value, code.value);
}

onUnmounted(() => {
  clearTimer();
});
</script>

<template>
  <VanOverlay :show="show" :z-index="20" @click="emit('close')">
    <div class="login-model" @click.stop>
      <img :src="closeBtn" alt="" class="login-model-close" @click="emit('close')" />
      <div class="login-model-title">输入并验证手机号，同步学习信息</div>
      <input
        v-model="phone"
        type="tel"
        :maxlength="11"
        class="login-model-phone"
        placeholder="请输入手机号"
      />
      <div class="login-model-code">
        <input
          v-model="code"
          type="tel"
          :maxlength="6"
          placeholder="短信验证码"
          class="login-model-code-input"
        />
        <div
          :class="['login-model-code-btn', state.codeDisabled && 'disabled']"
          @click.stop="getCode"
        >
          {{ state.codeMsg }}
        </div>
      </div>
      <div class="login-model-btn" @click="login">登录</div>
    </div>
  </VanOverlay>
</template>

<style scoped lang="scss">
.login-model {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 45%;
  left: 50%;
  width: 343px;
  height: 296px;
  background: #ffffff;
  border-radius: 12px;
  transform: translate(-50%, -50%);
  overflow: hidden;

  &-close {
    display: block;
    position: absolute;
    top: 20px;
    right: 20px;
    width: 13px;
    height: 13px;
  }

  &-title {
    margin-top: 43px;
    height: 25px;
    font-size: 18px;
    font-family:
      PingFangSC-Medium,
      PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 25px;
  }

  &-phone {
    margin-top: 20px;
    padding-left: 20px;
    width: 295px;
    height: 44px;
    font-size: 15px;
    font-family:
      PingFangSC-Regular,
      PingFang SC;
    font-weight: 400;
    color: #333;
    background: #f4f4f4;
    border-radius: 22px;
    border: none;
    box-sizing: border-box;
  }

  input::-webkit-input-placeholder {
    /* 使用webkit内核的浏览器 */
    color: #b0b0b0;
  }

  input:-moz-placeholder {
    /* Firefox版本4-18 */
    color: #b0b0b0;
  }

  input::-moz-placeholder {
    /* Firefox版本19+ */
    color: #b0b0b0;
  }

  input:-ms-input-placeholder {
    /* IE浏览器 */
    color: #b0b0b0;
  }

  &-code {
    position: relative;
    margin-top: 20px;

    &-input {
      padding-left: 20px;
      width: 295px;
      height: 44px;
      background: #f4f4f4;
      border-radius: 22px;
      box-sizing: border-box;
      border: none;
    }

    &-btn {
      position: absolute;
      right: 0;
      top: 50%;
      padding-right: 22px;
      padding-left: 10px;
      height: 44px;
      font-size: 15px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #0b57c7;
      line-height: 44px;
      transform: translateY(-50%);
    }

    .disabled {
      opacity: 0.5;
    }
  }

  &-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 24px;
    width: 295px;
    height: 42px;
    font-size: 16px;
    font-family:
      PingFangSC-Medium,
      PingFang SC;
    font-weight: 500;
    color: #ffffff;
    background: #f96c23;
    border-radius: 42px;
  }
}
</style>

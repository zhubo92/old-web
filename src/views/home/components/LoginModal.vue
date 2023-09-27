<script setup lang="ts">
import { getSMSByPhoneRequest } from "@/api/user";
import { showToast, Overlay as VanOverlay } from "vant";
import { onUnmounted, ref, watch } from "vue";

const closeBtn = "https://app-resources-luojigou.luojigou.vip/FsYUqsiyptxoNjMXbkS9owmT6TNm";
const emit = defineEmits<{
  (e: "close"): void;
  (e: "login", phone: string, code: string): void;
}>();

const show = ref(false);
const phone = ref<undefined | string>(undefined);
const code = ref<undefined | string>(undefined);
const smsTime = ref(60);
const codeDisabled = ref(false);
const timer = ref<ReturnType<typeof setInterval> | null>(null);
const codeMsg = ref("获取验证码");

function getCodeStr() {
  codeDisabled.value = true;
  // 验证码60秒倒计时
  if (!timer.value) {
    timer.value = setInterval(() => {
      if (smsTime.value > 0 && smsTime.value <= 60) {
        smsTime.value--;
        if (smsTime.value !== 0) {
          codeMsg.value = "重新发送(" + smsTime.value + ")";
        } else {
          if (timer.value) clearInterval(timer.value);
          codeMsg.value = "获取验证码";
          smsTime.value = 60;
          timer.value = null;
          codeDisabled.value = false;
        }
      }
    }, 1000);
  }
}
async function getCode() {
  if (!verifyPhone() || codeDisabled.value) return;
  await getSMSByPhoneRequest(phone.value as string);
  getCodeStr();
}
function verifyPhone() {
  const REG = /^1[3,4,5,6,7,8,9][0-9]{9}$/;
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
  if (!code.value || !code.value.toString().trim()) {
    showToast("验证码不能为空");
    return false;
  }
  return true;
}
function login() {
  if (!verifyPhone()) return;
  if (!verifyCode()) return;
  emit("login", phone.value as string, code.value as string);
}

watch(show, (val) => {
  if (!val) {
    phone.value = undefined;
    code.value = undefined;
  }
});

onUnmounted(() => {
  if (timer.value) clearTimeout(timer.value);
  timer.value = null;
});
</script>

<template>
  <VanOverlay :show="show" @close="emit('close')">
    <div class="login-model" @click.stop>
      <img :src="closeBtn" alt="" class="login-model-close" @click="$emit('close')" />
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
        <div :class="['login-model-code-btn', codeDisabled && 'disabled']" @click.stop="getCode">
          {{ codeMsg }}
        </div>
      </div>
      <div class="login-model-btn" @click="login">登录</div>
    </div>
  </VanOverlay>
</template>

<style scoped lang="scss"></style>

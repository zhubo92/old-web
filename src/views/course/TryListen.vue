<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { Slider as VanSlider } from "vant";

const playBtn = "https://img.luojigou.vip/FnS2xvC5AGe_9hmB610gPkdLqnHa";
const pauseBtn = "https://img.luojigou.vip/FjgSvFLP9rztnTvmx66YJpTEddEY";

const info = reactive({
  imgCover: "https://img.luojigou.vip/FpixnqLehLVU-6gUk1ZRBii7ire4?imageView2/0/q/50|imageslim",
  title: undefined,
  url: "https://media.luojigou.vip/loiGaRdKHzPdLWOTm50avSugQR8r",
  name: undefined,
});
const isPlay = ref(false);
const duration = ref(0);
const currentTime = ref(0);
const timer = ref<NodeJS.Timeout | null>(null);
const value = ref(0);
const audioRef = ref<null | HTMLElement>(null);

const playImg = computed(() => {
  return isPlay.value ? pauseBtn : playBtn;
});

watch(currentTime, (val) => {
  value.value = (val / Number(duration.value)) * 100;
});

function filterTime(time: number) {
  let s = String(Math.floor(time % 60));
  s = Number(s) < 10 ? "0" + s : s + "";
  let m = String(Math.floor(time / 60));
  m = Number(m) < 10 ? "0" + m : m + "";

  return m ? `${m}:${s}` : s;
}

function handleChange(num: number) {
  console.log(num, "num");
  const _currentTime = (num / 100) * duration.value;
  console.log(currentTime, "currentTime");

  currentTime.value = _currentTime;
  if (audioRef.value) (audioRef.value as any).currentTime = _currentTime;
}
function handleEnd() {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
}
function handleStart() {
  if (timer.value) clearInterval(timer.value);
  timer.value = setInterval(() => {
    if (currentTime.value + 1 < duration.value) {
      currentTime.value++;
    } else {
      isPlay.value = false;
      handleEnd();
    }
  }, 1000);
}
function init() {
  duration.value = (audioRef.value as any).duration;
  console.log(audioRef.value, "$refs.audio.duration");
}
function handleClick() {
  isPlay.value = (audioRef.value as any).paused;
  if (isPlay.value) {
    (audioRef.value as any).play();
    handleStart();
  } else {
    (audioRef.value as any).pause();
    handleEnd();
  }
  // console.dir(audio)
  currentTime.value = (audioRef.value as any).currentTime;
}

onMounted(() => {
  const a = window.sessionStorage.getItem("audio");
  if (a) Object.assign(info, JSON.parse(a));
  document.title = String(info.title);
  setTimeout(() => {
    if (audioRef.value) {
      duration.value = (audioRef.value as any).duration;
      currentTime.value = (audioRef.value as any).currentTime;
    }
  }, 1500);
});

onUnmounted(() => {
  handleEnd();
});
</script>

<template>
  <div class="tryPlay">
    <div class="tryPlay-img fc" @click="handleClick">
      <img :src="info.imgCover" alt="" />

      <img :src="playImg" alt="" class="play" />
    </div>

    <div class="player">
      <VanSlider
        v-model="value"
        bar-height="3px"
        button-size="13px"
        active-color="#0643A2"
        inactive-color="#EDEDED"
        @change="handleChange"
      >
        <template v-slot:button>
          <div class="player-total-btn"></div>
        </template>
      </VanSlider>
    </div>

    <div class="tryPlay-num" v-if="duration">
      <div>{{ filterTime(currentTime) }}</div>
      <div>{{ filterTime(duration) }}</div>
    </div>

    <div class="tryPlay-name">{{ info.name }}</div>

    <audio :src="info.url" class="tryPlay-audio" ref="audioRef" @canplay="init"></audio>
  </div>
</template>

<style scoped lang="scss">
.tryPlay {
  width: 100vw;
  min-height: 100vh;
  overflow: hidden;

  &-img {
    position: relative;
    margin: 20px auto;

    img {
      display: block;
      width: 335px;
      height: 287px;
      object-fit: cover;
      border-radius: 20px;
    }

    .play {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 62px;
      height: 62px;
    }
  }

  .player {
    margin: 0 auto;
    width: 310px;

    &-total {
      display: flex;
      align-items: center;
      position: relative;
      height: 3px;
      background-color: #ededed;

      &-num {
        width: 0;
        height: 3px;
        background-color: #0643a2;
      }

      &-btn {
        //position: absolute;
        //left: 0;
        //transform: translateX(-50%);
        width: 13px;
        height: 13px;
        background: #0643a2;
        border-radius: 50%;
      }
    }
  }

  &-num {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 13px auto 0;
    width: 310px;

    div {
      height: 18px;
      font-size: 13px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 18px;
    }
  }

  &-name {
    margin-top: 13px;
    height: 16px;
    font-size: 18px;
    font-family:
      PingFangSC-Semibold,
      PingFang SC;
    font-weight: 600;
    color: #333333;
    line-height: 16px;
    text-align: center;
  }

  &-audio {
    //width: 200px;
    //height: 100px;
  }
}
</style>

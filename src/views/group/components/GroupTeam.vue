<script setup lang="ts">
import { Swipe as VanSwipe, SwipeItem as VanSwipeItem } from "vant";
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";
import type { IGroupTeam } from "@/types/group";

const props = withDefaults(
  defineProps<{
    group: IGroupTeam[];
  }>(),
  {
    group: () => [],
  },
);
const group = computed(() => props.group);

const timeArr = ref<
  {
    hours: number | string;
    minutes: number | string;
    seconds: number | string;
    timer: null | NodeJS.Timeout;
  }[]
>([]);
const swipeHeight = ref(56);
const itemRef = ref<HTMLElement[] | null>(null);

const listLength = computed(() => {
  try {
    return Math.ceil(group.value.length / 2);
  } catch (err) {
    console.log(err, "listLength");
    return 0;
  }
});
async function startSwiper() {
  await nextTick();
  setTimeout(() => {
    try {
      let h = 0;
      if (itemRef.value && itemRef.value[0]) {
        h = itemRef.value[0].offsetHeight;
      }
      console.log(h, "height");

      if (group.value.length < 4) {
        swipeHeight.value = h;
      } else {
        swipeHeight.value = h * 2;
      }
    } catch (err) {
      console.log(err, "height");
    }
  }, 0);
}
function filterTime(t: string, index: number) {
  try {
    const time = new Date(t).valueOf();
    const now = new Date().valueOf();

    console.log(time, now);

    if (time > now) {
      timeArr.value[index].timer = setInterval(() => {
        const n = new Date().valueOf();
        const t = time - n;
        // const months = parseInt((t % (1000 * 60 * 60 * 24 * 30 * 12)) / (1000 * 60 * 60 * 24 * 30));
        // days = parseInt((t % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
        timeArr.value[index].hours = parseInt(String(t / (1000 * 60 * 60)));
        timeArr.value[index].minutes = parseInt(String((t % (1000 * 60 * 60)) / (1000 * 60)));
        timeArr.value[index].seconds = parseInt(String((t % (1000 * 60)) / 1000));
      }, 1000);
    }
  } catch (e) {
    console.log(e, "filterTime");
  }
}

onMounted(async () => {
  swipeHeight.value = group.value.length < 4 ? 56 : 128;
  // 计算拼团队伍结束倒计时定时器
  group.value.forEach((item, index) => {
    timeArr.value.push({
      hours: 0,
      minutes: 0,
      seconds: 0,
      timer: null,
    });

    filterTime(item.endTime, index);
  });

  await startSwiper();
});

onUnmounted(() => {});
</script>

<template>
  <div class="group-team">
    <div class="group-team-text">他们正在拼团，你可直接参与</div>
    <VanSwipe
      v-if="group.length !== 0"
      :style="{ height: `${swipeHeight}px` }"
      :show-indicators="false"
      :autoplay="10000"
      vertical
    >
      <div v-if="group.length < 4">
        <VanSwipeItem v-for="(item, index) in group" :key="index">
          <div class="group-team-item" ref="itemRef">
            <div class="group-team-item-left">
              <img :src="item.userAvatar" alt="" class="group-team-item-left-logo" />
              <div class="group-team-item-left-info">
                <div class="group-team-item-left-info-name">{{ item.userName }}的团</div>
                <div class="group-team-item-left-info-desc">
                  {{ item.population }}人团，还差
                  <span>{{ item.population - item.realPopulation }}</span
                  >人成团
                </div>
              </div>
            </div>

            <div class="group-team-item-right">
              <div class="group-team-item-right-time" v-if="timeArr.length !== 0">
                剩余
                {{ timeArr[index % group.length].hours }}:{{
                  timeArr[index % group.length].minutes
                }}:{{ timeArr[index % group.length].seconds }}
              </div>
              <div
                class="group-team-item-right-btn"
                @click="$emit('jumpPage', item.isMe ? 'goInvite' : 'makeUpOrder', item.id)"
              >
                {{ item.isMe ? "去邀请" : "去凑单" }}
              </div>
            </div>
          </div>
        </VanSwipeItem>
      </div>
      <div v-else>
        <VanSwipeItem v-for="num in listLength" :key="num">
          <div class="group-team-item" ref="itemRef">
            <div class="group-team-item-left">
              <img
                :src="group[(num - 1) * 2].userAvatar"
                alt=""
                class="group-team-item-left-logo"
              />
              <div class="group-team-item-left-info">
                <div class="group-team-item-left-info-name">
                  {{ group[(num - 1) * 2].userName }}的团
                </div>
                <div class="group-team-item-left-info-desc">
                  {{ group[(num - 1) * 2].population }}人团，还差
                  <span>{{
                    group[(num - 1) * 2].population - group[(num - 1) * 2].realPopulation
                  }}</span
                  >人成团
                </div>
              </div>
            </div>

            <div class="group-team-item-right">
              <div class="group-team-item-right-time" v-if="timeArr.length !== 0">
                剩余{{ timeArr[(num - 1) * 2].hours }}:{{ timeArr[(num - 1) * 2].minutes }}:{{
                  timeArr[(num - 1) * 2].seconds
                }}
              </div>
              <div
                class="group-team-item-right-btn"
                @click="
                  $emit(
                    'jumpPage',
                    group[(num - 1) * 2].isMe ? 'goInvite' : 'makeUpOrder',
                    group[(num - 1) * 2].id,
                  )
                "
              >
                {{ group[(num - 1) * 2].isMe ? "去邀请" : "去凑单" }}
              </div>
            </div>
          </div>
          <div v-if="group[num * 2 - 1]" class="group-team-item" ref="itemRef">
            <div class="group-team-item-left">
              <img :src="group[num * 2 - 1].userAvatar" alt="" class="group-team-item-left-logo" />
              <div class="group-team-item-left-info">
                <div class="group-team-item-left-info-name">
                  {{ group[num * 2 - 1].userName }}的团
                </div>
                <div class="group-team-item-left-info-desc">
                  {{ group[num * 2 - 1].population }}人团，还差
                  <span>{{
                    group[num * 2 - 1].population - group[num * 2 - 1].realPopulation
                  }}</span
                  >人成团
                </div>
              </div>
            </div>

            <div class="group-team-item-right">
              <div class="group-team-item-right-time" v-if="timeArr.length !== 0">
                剩余{{ timeArr[num * 2 - 1].hours }}:{{ timeArr[num * 2 - 1].minutes }}:{{
                  timeArr[num * 2 - 1].seconds
                }}
              </div>
              <div
                class="group-team-item-right-btn"
                @click="
                  $emit(
                    'jumpPage',
                    group[num * 2 - 1].isMe ? 'goInvite' : 'makeUpOrder',
                    group[num * 2 - 1].id,
                  )
                "
              >
                {{ group[num * 2 - 1].isMe ? "去邀请" : "去凑单" }}
              </div>
            </div>
          </div>
        </VanSwipeItem>
      </div>
    </VanSwipe>
  </div>
</template>

<style scoped lang="scss">
.group-team {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px 16px 8px;
  margin-bottom: 10px;
  width: 100vw;
  //height: 110px;
  background: #ffffff;
  box-shadow: 0px 0px 20px 4px rgba(231, 237, 241, 0.6);
  box-sizing: border-box;
  overflow: hidden;

  &-text {
    margin-bottom: 8px;
    height: 23px;
    font-size: 16px;
    font-family:
      PingFangSC-Medium,
      PingFang SC;
    font-weight: 550;
    color: #333333;
    line-height: 23px;
  }

  //.mySwiper {
  //  transform: translate3d(0, 0, 0);
  //  overflow: hidden;
  //}

  &-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    //max-height: 100%;
    //max-width: 100%;
    //transform: translate3d(0, 0, 0);

    &-left {
      display: flex;
      align-items: center;

      &-logo {
        margin-right: 7px;
        display: block;
        width: 40px;
        height: 40px;
        object-fit: cover;
        border-radius: 50%;
      }

      &-info {
        &-name {
          margin-bottom: 1px;
          width: 120px;
          height: 21px;
          font-size: 15px;
          font-family:
            PingFangSC-Medium,
            PingFang SC;
          font-weight: 550;
          color: #333333;
          line-height: 21px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        &-desc {
          height: 17px;
          font-size: 12px;
          font-family:
            PingFangSC-Regular,
            PingFang SC;
          font-weight: 400;
          color: #666666;
          line-height: 17px;

          span {
            color: #ff4e46;
          }
        }
      }
    }

    &-right {
      display: flex;
      align-items: center;

      &-time {
        margin-right: 12px;
        height: 16px;
        font-size: 11px;
        font-family:
          PingFangSC-Regular,
          PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 16px;
      }

      &-btn {
        width: 70px;
        height: 32px;
        line-height: 32px;
        background: #0b57c7;
        border-radius: 20px;
        text-align: center;
        font-size: 14px;
        font-family:
          PingFangSC-Medium,
          PingFang SC;
        font-weight: 500;
        color: #ffffff;
      }
    }
  }
}
</style>

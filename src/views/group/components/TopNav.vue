<script setup lang="ts">
import { Icon as VanIcon } from "vant";
import { callAppFc, isWeixinBrowser, shareToFriendForReward } from "@/utils";
import { computed, onMounted, ref } from "vue";
import type { IGroupCommodity, IGroupCourse } from "@/types/group";
import { useRoute } from "vue-router";

const returnLogo = "https://app-resources-luojigou.luojigou.vip/FvCDtkxA0BYEsp2wMOK4f1XYx9gd";
const shareLogo = "https://app-resources-luojigou.luojigou.vip/FqR6DcgFJAA15qCBt3568apbXinp";
const collectBtn = "https://app-resources-luojigou.luojigou.vip/FkUII0IQYMEuwGVcDuzAfD2Fw6zN";
const collectedBtn = "https://app-resources-luojigou.luojigou.vip/FrvXnKxq2HV7UV4GZLHMX2Rm3gwx";
const shareBtn = "https://app-resources-luojigou.luojigou.vip/FqDG4Kvlv9fdU4lGJmic2sTfEOq0";
const isApp = !isWeixinBrowser();

const { id } = useRoute().query;

const emit = defineEmits<{
  (e: "handleClick", type: string): void;
}>();

const props = defineProps<{
  title?: string;
  type?: number;
  courseInfo?: any;
  info?: IGroupCourse | IGroupCommodity;
}>();

const topHeight = ref(44);

const type = computed(() => props.type);
const title = computed(() => props.title);
const courseInfo = computed(() => props.courseInfo);
const info = computed(() => props.info);

// 分享
function shareCommodity() {
  if (info.value && (info.value as IGroupCommodity).goods) {
    const { activityPrice, population } = info.value.groupBuyActivity;

    const { imageUrl, markingPrice } = (info.value as IGroupCommodity).goods;

    const { origin, pathname } = window.location;

    shareToFriendForReward({
      teamLeader: 0, // 是否是团长 0-否 1-是
      productImage: imageUrl, // 课程封面
      activityPrice: activityPrice, // 拼团活动价
      originalPrice: markingPrice, // 原价
      population: population, // 成团人数
      inviteCode: `${origin}${pathname}#/group/GroupCommodity?id=${id}`,
    });
  }
}

// 分享课程
function shareCourse() {
  if (info.value) {
    const { markingPrice, imgCover } = info.value as IGroupCourse;
    const { activityPrice, population } = info.value.groupBuyActivity;
    const { origin, pathname } = window.location;

    shareToFriendForReward({
      teamLeader: 0, // 是否是团长 0-否 1-是
      productImage: imgCover, // 课程封面
      activityPrice: activityPrice, // 拼团活动价
      originalPrice: markingPrice, // 原价
      population: population, // 成团人数
      inviteCode: `${origin}${pathname}#/group/GroupCourse?id=${id}`,
    });
  }
}
function jumpPage(type: string) {
  console.log(type, "type");
  if (type === "returnPrev") {
    callAppFc("popPage");
  }
}

onMounted(async () => {
  try {
    (window as any)["topBarHeight"] = (data: any) => {
      topHeight.value = data;
    };
    console.log(topHeight.value, "topBarHeight");
  } catch (err) {
    console.log(err, "topBarHeight");
  }
});
</script>

<template>
  <div
    class="topContainer"
    :style="{
      paddingTop: `${type != 2 ? topHeight : 0}px`,
      backgroundColor: `${type != 2 ? '#fff' : 'transparent'}`,
    }"
    v-if="isApp"
  >
    <div
      class="top-nav"
      :style="{
        paddingTop: `${topHeight}px`,
        backgroundColor: `${type != 2 ? '#fff' : 'transparent'}`,
      }"
    >
      <!--普通样式-->
      <div v-if="type != 2" class="bgcf">
        <!--返回按钮-->
        <VanIcon class="left-btn" size="22" name="arrow-left" @click="jumpPage('returnPrev')" />

        <!--页面标题-->
        <div class="top-nav-title">{{ title }}</div>

        <!--右侧按钮-->
        <div v-if="type != 3" class="top-nav-btn">
          <img
            v-if="courseInfo.isCollect === 1"
            :src="collectedBtn"
            alt=""
            @click="emit('handleClick', 'collect')"
          />
          <img v-else :src="collectBtn" alt="" @click="emit('handleClick', 'collect')" />
          <img :src="shareBtn" alt="" @click="shareCourse" />
        </div>
      </div>
      <!--实心样式-->
      <div class="btns" v-else>
        <!--返回键-->
        <img :src="returnLogo" alt="" @click="jumpPage('returnPrev')" />
        <!--分享按钮-->
        <img :src="shareLogo" alt="" @click="shareCommodity" />
      </div>
    </div>
    <!--顶部占位置的盒子-->
    <div v-if="type != 2" class="boxCont"></div>
  </div>
</template>

<style scoped lang="scss">
.topContainer {
  box-sizing: content-box;
  background-color: #fff;
}

.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  width: 100vw;
  //height: 44px;
  overflow: hidden;
  box-sizing: content-box;

  .bgcf {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 44px;
    padding: 0 16px 0 20px;
    background-color: #fff;
  }

  &-title {
    position: absolute;
    bottom: 11px;
    left: 50%;
    transform: translateX(-50%);
    width: 252px;
    height: 25px;
    font-size: 18px;
    font-family:
      PingFangSC-Semibold,
      PingFang SC;
    font-weight: 600;
    color: #333333;
    line-height: 25px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &-btn {
    display: flex;
    align-items: center;

    img {
      display: block;
      width: 21px;
      height: 21px;
      object-fit: cover;
    }

    img + img {
      margin-left: 18px;
    }
  }

  .btns {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px;
    width: 100%;
    height: 100%;

    img {
      display: block;
      width: 44px;
      height: 44px;
    }
  }
}

.boxCont {
  width: 100vw;
  height: 44px;
}
</style>

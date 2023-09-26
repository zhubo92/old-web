<script setup lang="ts">
const img = 'https://app-resources-luojigou.luojigou.vip/FtIYa2qZT0215ykk3NYH2WDaj_x7'
</script>

<template>
  <div class="jump-app">
    <div class="jump-app-info">
      <img :src="img" alt="" class="jump-app-info-img" />
      <div class="jump-app-info-text">
        <div class="jump-app-info-text-one">逻辑狗·一起成长APP</div>
        <div class="jump-app-info-text-two">少儿思维教育就选逻辑狗</div>
      </div>
    </div>
    <OpenLaunchApp>
      <div
        style="
          margin-right: 16px;
          width: 79px;
          height: 34px;
          line-height: 34px;
          font-size: 14px;
          font-family:
            PingFangSC-Regular,
            PingFang SC,
            serif;
          font-weight: 400;
          color: #ffffff;
          background: #0b57c7;
          border-radius: 23px;
          text-align: center;
        "
      >
        进入
      </div>
    </OpenLaunchApp>
  </div>
</template>

<style scoped lang="scss">
.jump-app {
  position: fixed;
  bottom: 55px;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100vw;
  height: 60px;
  background: rgba(0, 0, 0, 0.3);

  &-info {
    display: flex;
    align-items: center;

    &-img {
      margin-left: 16px;
      margin-right: 6px;
      display: block;
      width: 40px;
      height: 40px;
      object-fit: cover;
    }

    &-text {
      &-one {
        height: 17px;
        font-size: 12px;
        font-family:
          PingFangSC-Semibold,
          PingFang SC,
          serif;
        font-weight: 600;
        color: #0b57c7;
        line-height: 17px;
      }

      &-two {
        margin-top: 2px;
        height: 14px;
        font-size: 10px;
        font-family:
          PingFangSC-Regular,
          PingFang SC,
          serif;
        font-weight: 400;
        color: #0b57c7;
        line-height: 14px;
      }
    }
  }

  &-btn {
    margin-right: 16px;
    width: 79px;
    height: 34px;
    line-height: 34px;
    font-size: 14px;
    font-family:
      PingFangSC-Regular,
      PingFang SC,
      serif;
    font-weight: 400;
    color: #ffffff;
    background: #0b57c7;
    border-radius: 23px;
    text-align: center;
  }
}
</style>

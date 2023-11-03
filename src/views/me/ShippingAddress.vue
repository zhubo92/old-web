<script setup lang="ts">
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores";
import { getToken } from "@/utils";
import { useRouter } from "vue-router";
import { getMobileAddressRequest } from "@/api/me";
import type { IShoppingAddress } from "@/types/me";
import TopNav from "@/views/group/components/TopNav.vue";

const staticImg = {
  defaultLabel: "https://app-resources-luojigou.luojigou.vip/FtqjzwttnqxYaF4KGn3917vO7ebG",
  editLogo: "https://app-resources-luojigou.luojigou.vip/Fg3IAB-QWr32mLAj9vcxlDInSlHT",
  emptyLogo: "https://img.luojigou.vip/FuqDXVCHD5XHZAFLRMCxRMZoAInt",
};
const router = useRouter();
const { loading } = storeToRefs(useAppStore());
const list = ref<IShoppingAddress[]>([]);

function returnAddress(id: string) {
  window.sessionStorage.setItem("addressId", id);
  router.go(-1);
}
async function getMobileAddress() {
  const { data, status } = await getMobileAddressRequest();
  if (status === 200) {
    list.value = data;
  }
}
function handleAddress(id: string) {
  router.push({
    path: "/me/AddAddress",
    query: { id },
  });
}

onMounted(async () => {
  loading.value = true;

  await getToken();
  await getMobileAddress();
  loading.value = false;
});
</script>

<template>
  <div class="address-list">
    <TopNav :type="3" :title="'收货地址'" />

    <div v-if="list.length !== 0">
      <div v-for="item in list" :key="item.id" class="address-item">
        <div class="address-item-left" @click="returnAddress(item.id)">
          <div class="address-item-left-top">
            <img
              v-if="item.default"
              :src="staticImg.defaultLabel"
              class="address-item-left-top-label"
              alt=""
            />
            <div class="address-item-left-top-name">{{ item.name }}</div>
            <div class="address-item-left-top-phone">{{ item.phone }}</div>
          </div>
          <div class="address-item-left-address">
            {{ item.province }}{{ item.city }}{{ item.county }}{{ item.detail }}
          </div>
        </div>

        <img
          :src="staticImg.editLogo"
          alt=""
          class="address-item-logo"
          @click="handleAddress(item.id)"
        />
      </div>
    </div>

    <div class="empty" v-else>
      <img :src="staticImg.emptyLogo" alt="" class="empty-logo" />

      <div class="empty-text">还没有添加收货地址哦～</div>
    </div>

    <div class="addAddressBtn" @click="handleAddress('')">添加地址</div>
  </div>
</template>

<style scoped lang="scss">
.address-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 100vw;
  min-height: 100vh;
  background: #fafafa;
  overflow: hidden;

  img {
    display: block;
    object-fit: cover;
  }

  .address-item {
    position: relative;
    margin-top: 20px;
    padding: 17px 14px;
    display: flex;
    align-items: center;
    width: 343px;
    background: #ffffff;
    box-shadow: 0px 2px 10px 0px #f4f4f4;
    border-radius: 10px;

    &-left {
      &-top {
        display: flex;
        align-items: center;

        &-label {
          margin-right: 4px;
          display: block;
          width: 38px;
          height: 20px;
          object-fit: cover;
        }

        &-name {
          margin-right: 7px;
          height: 22px;
          font-size: 16px;
          font-family:
            PingFangSC-Semibold,
            PingFang SC;
          font-weight: 600;
          color: #333333;
          line-height: 22px;
        }

        &-phone {
          height: 21px;
          font-size: 15px;
          font-family:
            PingFangSC-Regular,
            PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 21px;
        }
      }

      &-address {
        margin-top: 10px;
        width: 280px;
        font-size: 15px;
        font-family:
          PingFangSC-Regular,
          PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 21px;
      }
    }

    &-logo {
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      width: 22px;
      height: 22px;
    }
  }

  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;

    &-logo {
      margin-top: 40px;
      margin-bottom: 20px;
      display: block;
      width: 158px;
      height: 110px;
      object-fit: cover;
    }

    &-text {
      height: 22px;
      font-size: 16px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
    }
  }

  .addAddressBtn {
    position: fixed;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
    width: 320px;
    height: 48px;
    line-height: 48px;
    background: #0b57c7;
    border-radius: 24px;
    text-align: center;
    font-size: 17px;
    font-family:
      PingFangSC-Semibold,
      PingFang SC;
    font-weight: 600;
    color: #ffffff;
  }
}
</style>

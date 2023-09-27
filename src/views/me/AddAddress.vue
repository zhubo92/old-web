<script setup lang="ts">
import {
  Button as VanButton,
  Form as VanForm,
  Field as VanField,
  Popup as VanPopup,
  Area as VanArea,
  showToast,
} from "vant";
import { onMounted, reactive, ref } from "vue";
import { getToken } from "@/utils";
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores";
import { useRoute, useRouter } from "vue-router";
import {
  addMobileAddressRequest,
  getMobileAddressByIdRequest,
  updateMobileAddressRequest,
} from "@/api/me";
import areaList from "@/assets/js/area";
import type { IAddressForm } from "@/types/me";

const staticImg = {
  select: "https://img.luojigou.vip/FlRjyEjCnwURpW1oPyLt-lZ_hgdc",
  selected: "https://img.luojigou.vip/FjyiAjFBx_3-FtxF10abwrXIsB2r",
};
const { loading } = storeToRefs(useAppStore());
const { id } = useRoute().query;
const router = useRouter();

const address = ref("");
const showArea = ref<boolean>(false);
const form = reactive<IAddressForm>({
  name: "",
  phone: "",
  province: "",
  city: "",
  county: "",
  areaCode: "",
  detail: "",
  default: true,
  id: null,
});

function toggleSelectBtn() {
  form.default = !form.default;
}

async function handleMobileAddress() {
  const { status } = form.id
    ? await updateMobileAddressRequest(form)
    : await addMobileAddressRequest(form);
  if (status === 200) {
    showToast(form.id ? "修改成功" : "新增成功");
    router.go(-1);
  }
}
async function submit() {
  if (!form.name.trim()) {
    showToast("收货人不能为空");
    return;
  }
  if (!form.phone.trim()) {
    showToast("手机号不能为空");
    return;
  }
  if (!isPhone(form.phone)) {
    showToast("手机号格式不对");
    return;
  }
  if (!form.areaCode || !form.province || !form.city || !form.county) {
    showToast("请选择地区");
    return;
  }
  if (!form.areaCode.trim()) {
    showToast("请输入详细地址");
    return;
  }

  await handleMobileAddress();
}
// 选择地址
function onConfirm(values: {
  selectedValues: string[];
  selectedOptions: { text: string; children: any[]; value: string }[];
  selectedIndexes: number[];
}) {
  const { selectedValues, selectedOptions } = values;
  form.province = selectedOptions[0].text;
  form.city = selectedOptions[1].text;
  form.county = selectedOptions[2].text;
  form.areaCode = selectedValues[selectedValues.length - 1];

  address.value = selectedOptions
    .filter((item) => !!item)
    .map((item) => item.text)
    .join("/");

  showArea.value = false;
}
function onFailed(errorInfo: any) {
  console.log("failed", errorInfo);
}
function isPhone(phone: string): boolean {
  const myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
  return myreg.test(phone);
}

async function getMobileAddressById(id: string) {
  const { data, status } = await getMobileAddressByIdRequest(id);
  if (status === 200) {
    Object.assign(form, data);
    address.value = `${form.province}/${form.city}/${form.county}`;
    console.log(address.value, "address");
  }
}

onMounted(async () => {
  loading.value = true;
  await getToken();
  if (typeof id === "string" && id.length > 0) {
    document.title = "修改地址";
    await getMobileAddressById(id);
  }
  loading.value = false;
});
</script>

<template>
  <div class="add-address">
    <top-nav :type="3" :title="'新增地址'" />

    <VanForm validate-first @failed="onFailed" @submit="submit">
      <VanField v-model="form.name" name="name" label="收货人" placeholder="请输入收货人姓名" />
      <VanField v-model="form.phone" name="phone" label="手机号" placeholder="请输入手机号" />

      <VanField
        readonly
        clickable
        name="area"
        v-model="address"
        label="地区选择"
        placeholder="点击选择省市区"
        @click="showArea = true"
      />

      <VanPopup v-model:show="showArea" position="bottom">
        <VanArea :area-list="areaList" @confirm="onConfirm" @cancel="showArea = false" />
      </VanPopup>

      <VanField v-model="form.detail" name="detail" label="详细地址" placeholder="请输入详细地址" />

      <div class="add-address-item" @click="toggleSelectBtn">
        <div class="add-address-item-label">设为默认地址</div>

        <img v-if="form.default" :src="staticImg.selected" alt="" class="select" />
        <img v-else :src="staticImg.select" alt="" class="select" />
      </div>

      <div class="submit-btn">
        <VanButton round block native-type="submit">保存</VanButton>
      </div>
    </VanForm>
  </div>
</template>

<style scoped lang="scss">
.van-cell {
  padding: 15px 16px;
  height: 22px;
  font-size: 16px;
  font-family:
    PingFangSC-Regular,
    PingFang SC,
    serif;
  font-weight: 400;
  color: #666666;
  line-height: 22px;
  box-sizing: content-box;
  background-color: #fafafa;
}

.van-field__control {
  height: 22px;
  font-size: 16px;
  font-family:
    PingFangSC-Regular,
    PingFang SC,
    serif;
  font-weight: 400;
  color: #333333;
  line-height: 22px;
}

.van-form {
  width: 100vw;
  overflow: hidden;
}

.add-address {
  width: 100vw;
  min-height: 100vh;
  background-color: #fafafa;

  &-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 16px;

    &-label {
      height: 22px;
      font-size: 16px;
      font-family:
        PingFangSC-Regular,
        PingFang SC,
        serif;
      font-weight: 400;
      color: #666666;
      line-height: 22px;
    }

    .select {
      display: block;
      width: 36px;
      height: 22px;
      object-fit: cover;
    }
  }
}

.submit-btn {
  display: flex;
  justify-content: center;
  margin: 61px auto 0;

  button {
    width: 320px;
    height: 48px;
    background: #0b57c7;
    border-radius: 24px;
    color: #fff;
  }

  .van-button::before {
    height: 24px;
    font-size: 17px;
    font-family:
      PingFangSC-Semibold,
      PingFang SC,
      serif;
    font-weight: 600;
    color: #ffffff;
    line-height: 24px;
  }
}
</style>

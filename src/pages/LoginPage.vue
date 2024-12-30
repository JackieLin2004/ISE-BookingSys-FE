<template>
  <div class="h-100% w-100% flex justify-center items-center">
    <div class="h-60% w-20em bg-blue b-rd-5px flex flex-col justify-around items-center box-border pr-1em pl-1em">
      <h3 class="text-white text-2em h-30% flex justify-center items-center">登录</h3>
      <div class="h-30% w-full flex justify-center items-center flex-col">
        <el-input v-model="username"></el-input>
        <el-input type="password" v-model="password"></el-input>
      </div>
      <div class="h-40% w-full">
        <el-button class="w-full" @click="login">Login</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import axios from 'axios'
import { customer_url } from '@/utils/util';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
const username = ref('')
const password = ref('')
const router = useRouter()
const login = async()=>{
  const params = {
    username:username.value,
    password:password.value
  }
  await axios.post(customer_url+'/api/customers/login',params).then((resp)=>{
    if(resp.data!==-1){
      router.push({
        name:'home'
      })
      ElMessage({
        message: 'success',
        type: 'success'
      })
      console.log('id:',resp.data)
      sessionStorage.setItem('cid',resp.data);
    }else{
      ElMessage({
        message: 'fail',
        type: 'warning'
      })
    }
  })
}
</script>
<style scoped></style>

<template>
  <div class="h-100% box-border p-1em">
    <div class="flex w-50%">
      <el-input v-model="depart" placeholder="始发"></el-input>
      <el-input v-model="destination" placeholder="目的地"></el-input>
      <el-button type="primary" @click="generate_proposal">新建</el-button>
    </div>
    <el-tabs v-model="activeName" class="w-full">
      <el-tab-pane label="Waiting" name="first">
        <el-table :data="proposals" style="width: 90%">
          <el-table-column prop="id" label="ID" width="50"></el-table-column>
          <el-table-column prop="depart" label="始发"></el-table-column>
          <el-table-column prop="destination" label="目的地"></el-table-column>
          <el-table-column prop="totalPrice" label="总价"></el-table-column>
          <el-table-column prop="ticketPrice" label="票价"></el-table-column>
          <el-table-column prop="days" label="天数"></el-table-column>
          <el-table-column label="操作" width="180">
            <template #default="scope">
              <el-button type="success" size="small" @click="acceptProposal(scope.row)">同意</el-button>
              <el-button type="danger" size="small" @click="rejectProposal(scope.row)">拒绝</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="Withdrawed" name="third">
        <el-table :data="withdrawProposals" style="width: 90%">
          <el-table-column prop="id" label="ID" width="50"></el-table-column>
          <el-table-column prop="depart" label="始发"></el-table-column>
          <el-table-column prop="destination" label="目的地"></el-table-column>
          <el-table-column prop="totalPrice" label="总价"></el-table-column>
          <el-table-column prop="ticketPrice" label="票价"></el-table-column>
          <el-table-column prop="days" label="天数"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="Accepted" name="fourth">
        <el-table :data="acceptProposals" style="width: 90%">
          <el-table-column prop="id" label="ID" width="50"></el-table-column>
          <el-table-column prop="depart" label="始发"></el-table-column>
          <el-table-column prop="destination" label="目的地"></el-table-column>
          <el-table-column prop="totalPrice" label="总价"></el-table-column>
          <el-table-column prop="ticketPrice" label="票价"></el-table-column>
          <el-table-column prop="days" label="天数"></el-table-column>
          <el-table-column label="operation">
            <template #default="scope">
              <el-button type="success" size="small" @click="acceptProposal(scope.row)">付款</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="Paid" name="second">

      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { customer_url } from '@/utils/util';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';
const activeName = ref('first')
const depart = ref('')
const destination = ref('')
const proposals = ref([])
const withdrawProposals =ref([])
const acceptProposals = ref([])
onMounted(async () => {
  await getAllWaitingProposals()
  await getAllAcceptProposals()
  await getAllWithdrawProposals()
})
const generate_proposal = async () => {
  await axios.get(customer_url + '/api/customers/get_proposal', {
    params: {
      id: sessionStorage.getItem('cid'),
      depart: depart.value,
      destination: destination.value
    }
  }).then((resp) => {
    console.log(resp.data)
  })
}

const getAllWaitingProposals = async () => {
  const cid = sessionStorage.getItem('cid')
  await axios.get(customer_url + '/api/customers/all_waiting_proposal', {
    params: {
      id: cid
    }
  }).then((resp) => {
    console.log(resp.data)
  })
}

const getAllAcceptProposals = async () => {
  const cid = sessionStorage.getItem('cid')
  await axios.get(customer_url + '/api/customers/all_accepted_proposal', {
    params: {
      id: cid
    }
  }).then((resp) => {
    console.log(resp.data)
  })
}

const getAllWithdrawProposals = async () => {
  const cid = sessionStorage.getItem('cid')
  await axios.get(customer_url + '/api/customers/all_withdrawed_proposal', {
    params: {
      id: cid
    }
  }).then((resp) => {
    console.log(resp.data)
  })
}
const acceptProposal = (row)=>{
  axios.post(customer_url+'/api/customers/accept/'+row.id).then((resp)=>{
    console.log(resp.data)
  })
}

const rejectProposal = (row)=>{
  axios.post(customer_url+'/api/customers/withdraw/'+row.id).then((resp)=>{
    console.log(resp.data)
  })
}

const eventSource = new EventSource(customer_url + '/api/customers/subscribe/' + sessionStorage.getItem('cid'));
const eventSource1 = new EventSource(customer_url + '/api/customers/waiting_proposal_subscribe/' + sessionStorage.getItem('cid'));
const eventSource2 = new EventSource(customer_url + '/api/customers/refresh_proposal_subscribe/' + sessionStorage.getItem('cid'));
const eventSource_accept = new EventSource(customer_url + '/api/customers/accept_proposal_subscribe/' + sessionStorage.getItem('cid'));
const eventSource_withdraw = new EventSource(customer_url + '/api/customers/withdraw_proposal_subscribe/' + sessionStorage.getItem('cid'));

eventSource.onmessage = function (event) {
  console.log("Received SSE message:", event.data);
  proposals.value.push(JSON.parse(event.data))
  ElMessage({
    message: 'new Proposal',
    type: 'success'
  })
};

eventSource1.onmessage = function (event) {
  proposals.value = JSON.parse(event.data)
  console.log('hover', proposals.value)
  console.log("Received SSE message:", event.data);
  ElMessage({
    message: 'all waiting Proposal refreshed',
    type: 'success'
  })
};

eventSource2.onmessage =async function (event) {
  console.log("ok")
  console.log("Received SSE message:", event.data);
  await getAllWaitingProposals()
  await getAllAcceptProposals()
  await getAllWithdrawProposals()
};
eventSource_accept.onmessage =async function (event) {
  acceptProposals.value = JSON.parse(event.data)
  console.log("ok")
  console.log("Received SSE message:", event.data);
};
eventSource_withdraw.onmessage =async function (event) {
  withdrawProposals.value = JSON.parse(event.data)
  console.log("ok")
  console.log("Received SSE message:", event.data);
};
</script>
<style scoped></style>

<template>
  <div class="h-100% box-border p-1em">
    <div class="flex w-50%">
      <el-input v-model="depart" placeholder="始发"></el-input>
      <el-input v-model="destination" placeholder="目的地"></el-input>
      <el-button type="primary" @click="generate_proposal">新建</el-button>
    </div>
    <el-tabs v-model="activeName" class="w-full">
      <el-tab-pane label="Waiting" name="first">
        <el-table :data="proposals" style="width: 100%">
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
        <el-table :data="withdrawProposals" style="width: 100%">
          <el-table-column prop="id" label="ID" width="50"></el-table-column>
          <el-table-column prop="depart" label="始发"></el-table-column>
          <el-table-column prop="destination" label="目的地"></el-table-column>
          <el-table-column prop="totalPrice" label="总价"></el-table-column>
          <el-table-column prop="ticketPrice" label="票价"></el-table-column>
          <el-table-column prop="days" label="天数"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="Accepted" name="fourth">
        <el-table :data="acceptProposals" style="width: 100%">
          <el-table-column prop="id" label="ID" width="50"></el-table-column>
          <el-table-column prop="depart" label="始发"></el-table-column>
          <el-table-column prop="destination" label="目的地"></el-table-column>
          <el-table-column prop="totalPrice" label="总价"></el-table-column>
          <el-table-column prop="ticketPrice" label="票价"></el-table-column>
          <el-table-column prop="days" label="天数"></el-table-column>
          <el-table-column label="operation">
            <template #default="scope">
              <el-button v-if="scope.row.prepared === 0" size="small" disabled>等待创建订单</el-button>
              <el-button type="success" size="small" @click="openPaymentDialog(scope.row)" v-else>付款</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="Paid" name="all">
        <el-table :data="paidProposals" style="width: 100%">
          <el-table-column prop="id" label="ID" width="50"></el-table-column>
          <el-table-column prop="depart" label="始发"></el-table-column>
          <el-table-column prop="destination" label="目的地"></el-table-column>
          <el-table-column prop="totalPrice" label="总价"></el-table-column>
          <el-table-column prop="ticketPrice" label="票价"></el-table-column>
          <el-table-column prop="days" label="天数"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-dialog v-model="paymentDialogVisible" title="选择支付方式">
      <el-form>
        <el-form-item label="支付方式">
          <el-radio-group v-model="selectedPaymentMethod">
            <el-radio label="alipay">支付宝</el-radio>
            <el-radio label="wechatPay">微信支付</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span class="dialog-footer">
        <el-button type="primary" @click="payOrder">确认付款</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { bank_url, customer_url } from '@/utils/util';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';
const activeName = ref('first')
const depart = ref('')
const destination = ref('')
const proposals = ref([])
const withdrawProposals = ref([])
const acceptProposals = ref([])
const paidProposals = ref([])
const paymentDialogVisible = ref(false)
const currentpid = ref()
const selectedPaymentMethod = ref('')
const openPaymentDialog = (row) => {
  paymentDialogVisible.value = true
  currentpid.value = row.id
}
onMounted(async () => {
  await getAllWaitingProposals()
  await getAllAcceptProposals()
  await getAllWithdrawProposals()
  await getAllPaidProposals()
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

const getAllPaidProposals = async () => {
  const cid = sessionStorage.getItem('cid')
  await axios.get(customer_url + '/api/customers/all_paid_proposal', {
    params: {
      id: cid
    }
  }).then((resp) => {
    console.log(resp.data)
  })
}

const acceptProposal = async (row) => {
  await axios.post(customer_url + '/api/customers/accept/' + row.id).then((resp) => {
    console.log(resp.data)
  })
}

const rejectProposal = async (row) => {
  await axios.post(customer_url + '/api/customers/withdraw/' + row.id).then((resp) => {
    console.log(resp.data)
  })
}

const payOrder = async () => {
  console.log(currentpid.value)
  console.log(selectedPaymentMethod.value)
  const method = selectedPaymentMethod.value === 'wechatPay' ? 0 : 1
  await axios.post(bank_url + `/api/bank/pay/${currentpid.value}/${method}`).then((resp) => {
    console.log(resp.data)
  })
}

const eventSource1 = new EventSource(customer_url + '/api/customers/waiting_proposal_subscribe/' + sessionStorage.getItem('cid'));
const eventSource2 = new EventSource(customer_url + '/api/customers/refresh_proposal_subscribe/' + sessionStorage.getItem('cid'));
const eventSource_accept = new EventSource(customer_url + '/api/customers/accept_proposal_subscribe/' + sessionStorage.getItem('cid'));
const eventSource_withdraw = new EventSource(customer_url + '/api/customers/withdraw_proposal_subscribe/' + sessionStorage.getItem('cid'));
const eventSource_paid = new EventSource(customer_url + '/api/customers/paid_proposal_subscribe/' + sessionStorage.getItem('cid'));

eventSource1.onmessage = function (event) {
  proposals.value = JSON.parse(event.data)
  console.log('hover', proposals.value)
  console.log("Received SSE message:", event.data);
  ElMessage({
    message: 'all waiting Proposal refreshed',
    type: 'success'
  })
};

eventSource2.onmessage = async function (event) {
  console.log("ok")
  console.log("Received SSE message:", event.data);
  await getAllWaitingProposals()
  await getAllAcceptProposals()
  await getAllWithdrawProposals()
  await getAllPaidProposals()
};
eventSource_accept.onmessage = async function (event) {
  acceptProposals.value = JSON.parse(event.data)
  console.log("ok")
  console.log("Received SSE message:", event.data);
};
eventSource_withdraw.onmessage = async function (event) {
  withdrawProposals.value = JSON.parse(event.data)
  console.log("ok")
  console.log("Received SSE message:", event.data);
};

eventSource_paid.onmessage = async function (event) {
  paidProposals.value = JSON.parse(event.data)
  console.log("ok")
  console.log("Received SSE message:", event.data);
};
</script>
<style scoped></style>

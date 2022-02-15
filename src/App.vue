<template>
  <v-app>
    <header class="header">
      <Header
        :accountData="accountData"
      />
    </header>
    <main class="main">
      <div class="body">
        <router-view
          :parents="parents"
          :accountData="accountData"
        />
      </div>
    </main>
  </v-app>
</template>


<script>
import Header from "@/components/common/Header"
import account_data from "@/config/json/account.json"

export default {
  components: {
    Header,
  },
  data: () => ({
    parents: {
      accounts: {},
    },
    accountData: {},
  }),

  created() {
    this.init()
    this.parents.accounts = account_data.accounts
  },

  methods: {
    init() {
      this.authUserCheck()
    },
  }
}
</script>

<style scoped>
.main {
  display: flex;
  height: calc(100vh - 70px);
  box-sizing: border-box;
}
.body {
  width: 100%;
}
.header {
  border-bottom: 1px solid #ccc;
  height: 70px;
  line-height: 70px;
  padding: 0 16px;
}
</style>
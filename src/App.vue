<template>
  <v-app>
    <header class="header">
      <Header
        :accountData="accountData"
      />
    </header>
    <main class="main">
      <div class="body">
         <div v-if="loading">
            <v-progress-linear
                indeterminate
                color="primary"
            ></v-progress-linear>
        </div>
        <div v-else>
          <router-view
            :parents="parents"
            :accountData="accountData"
          />
        </div>
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
    loading: true,
    accountData: {},
  }),

  created() {
    this.authUserCheck()
    this.parents.accounts = account_data.accounts
  },

  mounted() {
    this.authUserCheck()
  },

  methods: {
    
  }
}
</script>

<style scoped>
.main {
  display: flex;
  height: calc(100vh - 70px);
  box-sizing: border-box;
  overflow: hidden;
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
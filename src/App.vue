<template>
  <v-app>
    <router-view/>
  </v-app>
</template>

<script>
export default {
  methods: {
    setMetaInfo (to) {
        if(to.meta.title){
            document.title = to.meta.title;
        }
        if(to.meta.desc){
            document.querySelector("meta[name='description']").setAttribute('content', to.meta.desc)
        }
    }
  },
  watch: {
    '$route': function (to) {
      this.setMetaInfo(to)
    }
  }
}
</script>

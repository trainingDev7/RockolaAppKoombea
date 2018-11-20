<template>
  <div class="card" style="width: 18rem;">
    <img :src="video.snippet.thumbnails.medium.url" 
    class="card-img-top" 
    @click="modalShow(video)">
    
    <div class="card-body">
      <h5 class="card-title">{{ video.snippet.title }}</h5>
    </div>
  </div>
</template>

<script>
import myModal from '../components/my-modal.vue'
export default {
  name: 'VideoList',
  props: ['video'],
  components: {
    myModal
  },
  methods: {
    modalShow(video){
      this.$root.showModal(video)
    }
  }
}
</script>


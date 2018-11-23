<template>
<div class="modal is-active">
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <slot name="header"></slot>
    </header>
   
    <div class="modal-card-body">
      <slot name="body"></slot>
    </div>
  </div>
  <button class="modal-close" @click="$emit('close')"></button>
</div>
</template>

<script>
export default {
  name: 'my-modal',
  props: ['reference']
}
</script>


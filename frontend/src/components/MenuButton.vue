<template>
  <div class="main-page-item">
    <div style="margin-bottom: 6px font-size: 100%">
      {{label}}
    </div>
    <div style="flex:1; display: flex; vertical-align: middle; justify-content: center; align-content: center;">
      <img v-bind:src="require('@/assets/'+icon+'.svg')" style="width: 50%; height: 100%">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    icon: String
  }
}
</script>

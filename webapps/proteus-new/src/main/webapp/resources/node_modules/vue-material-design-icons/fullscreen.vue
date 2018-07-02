<template>
  <span class="material-design-icon fullscreen-icon"
        :aria-hidden="decorative"
        role="img"
        :aria-label="title">
    <svg class="material-design-icon__svg"
         width="24"
         height="24"
         viewBox="0 0 24 24"
         :fill="fillColor">
      <title>{{title}}</title>
      <path d="M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z"></path>
    </svg>
  </span>
</template>

<script>
  export default {
    name: "fullscreen-icon",
    props: {
      title: {
        type: String,
        default: "Fullscreen icon"
      },
      decorative: {
        type: Boolean,
        default: false
      },
      fillColor: {
        type: String
      }
    }
  }
</script>

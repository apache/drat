<template>
  <span class="material-design-icon pause-icon"
        :aria-hidden="decorative"
        role="img"
        :aria-label="title">
    <svg class="material-design-icon__svg"
         width="24"
         height="24"
         viewBox="0 0 24 24"
         :fill="fillColor">
      <title>{{title}}</title>
      <path d="M14,19H18V5H14M6,19H10V5H6V19Z"></path>
    </svg>
  </span>
</template>

<script>
  export default {
    name: "pause-icon",
    props: {
      title: {
        type: String,
        default: "Pause icon"
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

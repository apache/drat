<template>
  <span class="material-design-icon arrow-right-bold-icon"
        :aria-hidden="decorative"
        role="img"
        :aria-label="title">
    <svg class="material-design-icon__svg"
         width="24"
         height="24"
         viewBox="0 0 24 24"
         :fill="fillColor">
      <title>{{title}}</title>
      <path d="M4,15V9H12V4.16L19.84,12L12,19.84V15H4Z"></path>
    </svg>
  </span>
</template>

<script>
  export default {
    name: "arrow-right-bold-icon",
    props: {
      title: {
        type: String,
        default: "Arrow right bold icon"
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

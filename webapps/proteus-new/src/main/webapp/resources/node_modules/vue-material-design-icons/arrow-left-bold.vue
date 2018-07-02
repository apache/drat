<template>
  <span class="material-design-icon arrow-left-bold-icon"
        :aria-hidden="decorative"
        role="img"
        :aria-label="title">
    <svg class="material-design-icon__svg"
         width="24"
         height="24"
         viewBox="0 0 24 24"
         :fill="fillColor">
      <title>{{title}}</title>
      <path d="M20,9V15H12V19.84L4.16,12L12,4.16V9H20Z"></path>
    </svg>
  </span>
</template>

<script>
  export default {
    name: "arrow-left-bold-icon",
    props: {
      title: {
        type: String,
        default: "Arrow left bold icon"
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

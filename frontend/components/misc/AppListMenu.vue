<template>
  <v-list class="pa-0">
    <v-list-item class="px-2"
      v-for="(item, i) in items"
      :key="i"
      :to="item.to"
      router
      exact
    >
      <v-list-item-action>
        <v-card class="pa-2">
          <v-icon>{{ item.icon }}</v-icon>
        </v-card>
      </v-list-item-action>
      
      <v-list-item-content class="justify-start">
        <v-list-item-title v-text="item.title" />
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
  export default {
    props: {
      items: { type: Array, default: () => [] },
    }
  }
</script>
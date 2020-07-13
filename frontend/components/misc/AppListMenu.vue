<template>
  <v-list class="pa-0">
    <v-list-item
      v-for="(item, i) in items"
      :key="i"
      :to="item.to"
      router
      exact
    >
      <v-list-item-action>
        <v-card v-if="!item.noCard">
          <v-icon>{{ item.icon }}</v-icon>
        </v-card>

        <v-icon v-else>{{ item.icon }}</v-icon>
      </v-list-item-action>
      
      <v-list-item-content>
        <v-list-item-title v-text="item.title" />
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
  export default {
    props: {
      items: { type: Object, default: () => {} },

    }
  }
</script>

<style>

</style>
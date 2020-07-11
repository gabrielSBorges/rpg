<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" fixed app>
      <v-list class="pa-0">
        <v-list-item>
          <v-btn icon @click.stop="miniVariant = !miniVariant">
            <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
          </v-btn>
        </v-list-item>
      </v-list>

      <v-list class="pa-0">
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar fixed app dense>
      <template v-if="$auth.loggedIn">
        <v-toolbar-title v-text="$auth.user.name" />
        <v-btn @click="$auth.logout()">Sair</v-btn>
      </template>

      <template v-else>
        <v-toolbar-title v-text="title" />
      </template>
    </v-app-bar>

    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        drawer: true,
        miniVariant: true,
        items: [
          {
            icon: 'mdi-apps',
            title: 'Welcome',
            to: '/'
          },
          {
            icon: 'mdi-chart-bubble',
            title: 'Inspire',
            to: '/inspire'
          }
        ],
        title: 'RPG SYSTEM'
      }
    }
  }
</script>

<style>
  .v-list-item__content{
    justify-content: right;
    display: grid;
  }
</style>
<template>
  <v-app dark>
    <!-- Barra título do sistema -->
    <v-app-bar flat fixed app clipped-left dense>
      <v-toolbar-title>RPG REMOTO</v-toolbar-title>
      
      <v-spacer></v-spacer>
      
      <v-btn icon small @click="logout()" class="mr-0">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Menu lateral esquerdo | lista das campanhas -->
    <v-navigation-drawer v-model="drawer" clipped :mini-variant="miniVariant"  fixed app>
      <!-- Informações do usuário -->
      <app-list-menu :items="userProfile" />
      
      <v-divider/>

      <!-- Campanhas como jogador -->
      <app-list-menu :items="campaignsAsPlayer"/>

      <v-divider/>

      <!-- Campanhas como mestre -->
      <app-list-menu :items="campaignsAsMaster"/>
    </v-navigation-drawer>

    <!-- Conteudo -->
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  import AppListMenu from '~/components/misc/AppListMenu.vue'

  export default {
    middleware: 'auth',
    components: {
      AppListMenu,
    },
    data () {
      return {
        drawer: true,
        miniVariant: true,
        title: 'RPG SYSTEM',

        // Contéúdo da lista do menu lateral esquerdo
        userProfile : [
          {
            icon: 'mdi-home',
            title: 'Início',
            to: '/'
          },
        ],

        campaignsAsPlayer : [
          {
            icon: 'mdi-elevation-decline',
            title: 'Nargol',
            to: '/campaigns?id=212'
          },
          {
            icon: 'mdi-elevation-decline',
            title: 'Lavent',
            to: '/campaigns?id=2121'
          },
          {
            icon: 'mdi-magnify',
            title: 'Procurar campanhas',
            to: '/campaigns/find',
            noCard: true,
          }
        ],

        campaignsAsMaster : [
          {
            icon: 'mdi-elevation-rise',
            title: 'Campanha Fictícia',
            to: '/campaigns?id=215'
          },
          {
            icon: 'mdi-plus',
            title: 'Nova campanha',
            to: '/campaigns/new',
            noCard: true,
          },
        ],
      }
    },
    methods: {
      logout() {
        this.$auth.logout()

        this.showSuccessMessage('Até a próxima!')

        this.$router.push('/login')
      }
    }
  }
</script>

<style>
  .v-list-item__content{
    justify-content: right;
    display: grid;
  }

  .app-separator {
    height: 20px;
  }
</style>
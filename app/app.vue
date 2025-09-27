<template>
  <v-app>
    <v-app-bar app color="primary" dark elevation="4">
      <!-- Hamburger Menu (Mobile) -->
      <v-app-bar-nav-icon @click="drawer = !drawer" class="hidden-md-and-up"></v-app-bar-nav-icon>
      
      <!-- Logo Farol -->
      <v-app-bar-title class="d-flex align-center">
        <NuxtLink to="/" class="text-white text-decoration-none d-flex align-center">
          <v-icon size="32" class="mr-2" color="white">mdi-lighthouse-on</v-icon>
          <span class="font-weight-bold">Farol Real Estate</span>
        </NuxtLink>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- Navigation Links (Desktop) -->
      <div class="hidden-sm-and-down">
        <v-btn
          prepend-icon="mdi-magnify"
          variant="text"
          class="mr-2"
          to="/smart/search"
        >
          Smart Search
        </v-btn>
        
        <v-btn
          prepend-icon="mdi-message-question"
          variant="text"
          class="mr-2"
          to="/smart/ask"
        >
          Smart Ask
        </v-btn>

        <v-btn
          prepend-icon="mdi-plus"
          class="mr-4"
          to="/properties/create"
        >
          Create Property
        </v-btn>
      </div>

      <!-- User Menu -->
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            class="ml-2"
            v-bind="props"
            variant="text"
          >
            <v-avatar size="32" class="mr-2">
              <v-img src="https://api.dicebear.com/7.x/initials/svg?seed=JD&backgroundColor=0D8ABC&color=fff" />
            </v-avatar>
            John Doe
            <v-icon icon="mdi-chevron-down" class="ml-2"></v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item to="/profile">
            <template v-slot:prepend>
              <v-icon icon="mdi-account"></v-icon>
            </template>
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>

          <v-list-item to="/settings">
            <template v-slot:prepend>
              <v-icon icon="mdi-cog"></v-icon>
            </template>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item @click="handleSignOut">
            <template v-slot:prepend>
              <v-icon icon="mdi-logout"></v-icon>
            </template>
            <v-list-item-title>Sign Out</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Navigation Drawer (Mobile) -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      location="left"
    >
      <v-list nav dense>
        <v-list-item to="/" @click="drawer = false">
          <template v-slot:prepend>
            <v-icon>mdi-home</v-icon>
          </template>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        
        <v-list-item to="/smart/search-property" @click="drawer = false">
          <template v-slot:prepend>
            <v-icon>mdi-magnify</v-icon>
          </template>
          <v-list-item-title>Smart Search Property</v-list-item-title>
        </v-list-item>

        <v-list-item to="/smart/ask" @click="drawer = false">
          <template v-slot:prepend>
            <v-icon>mdi-message-question</v-icon>
          </template>
          <v-list-item-title>Smart Ask</v-list-item-title>
        </v-list-item>
        
        <v-list-item to="/properties/create" @click="drawer = false">
          <template v-slot:prepend>
            <v-icon>mdi-plus</v-icon>
          </template>
          <v-list-item-title>Create Property</v-list-item-title>
        </v-list-item>
        
        <v-divider class="my-2"></v-divider>
        
        <v-list-item to="/profile" @click="drawer = false">
          <template v-slot:prepend>
            <v-icon>mdi-account</v-icon>
          </template>
          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item>
        
        <v-list-item to="/settings" @click="drawer = false">
          <template v-slot:prepend>
            <v-icon>mdi-cog</v-icon>
          </template>
          <v-list-item-title>Settings</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <NuxtPage />
    </v-main>

    <v-footer app color="primary" dark class="justify-center">
      <span>&copy; {{ new Date().getFullYear() }} - Farol Real Estate</span>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const drawer = ref(false)

const handleSignOut = () => {
  // TODO: Implement sign out logic
  console.log('Sign out clicked')
  drawer.value = false
}
</script>

<style scoped>
.hidden-sm-and-down {
  display: flex;
}

@media (max-width: 960px) {
  .hidden-sm-and-down {
    display: none;
  }
}

.hidden-md-and-up {
  display: none;
}

@media (max-width: 960px) {
  .hidden-md-and-up {
    display: block;
  }
}
</style>
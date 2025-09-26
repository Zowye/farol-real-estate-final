<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>
        <NuxtLink to="/" class="text-white text-decoration-none">
          Farol Real Estate
        </NuxtLink>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- Create Property Button -->
      <v-btn
        prepend-icon="mdi-plus"
        class="mr-4"
        to="/properties/create"
      >
        Create Property
      </v-btn>

      <!-- User Menu -->
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            class="mr-4"
            v-bind="props"
          >
            <v-avatar size="32" class="mr-2">
              <v-img src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
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

    <v-main>
      <NuxtPage />
    </v-main>

    <v-footer app color="primary" dark>
      <span>&copy; {{ new Date().getFullYear() }} - Real Estate BFF</span>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
const handleSignOut = () => {
  // TODO: Implement sign out logic
  console.log('Sign out clicked')
}
</script>

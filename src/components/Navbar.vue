<script setup>
import { RouterLink, useRouter } from "vue-router";
import logo from "../assets/img/logo.png";
import { ref } from "vue";

const showDropdown = ref(false);
const router = useRouter();
const handleLogout = () => {
  sessionStorage.removeItem("currentUser");
  router.push("/");
};

const currentUserString = sessionStorage.getItem("currentUser");
const currentUser = JSON.parse(currentUserString) ?? {};
</script>

<template>
  <nav class="bg-blue-300 border-b border-blue-100">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="flex h-20 items-center justify-between">
        <div
          class="flex flex-1 items-center justify-center md:items-stretch md:justify-start"
        >
          <!-- Logo -->
          <RouterLink class="flex flex-shrink-0 items-center mr-4" to="/">
            <img class="h-10 w-auto" :src="logo" alt="Vue Jobs" />
            <span
              class="hidden md:block text-white text-2xl font-bold ml-2"
            ></span>
          </RouterLink>
          <!-- User-->

          <div
            v-if="currentUser.isLoggedIn"
            @mouseenter="showDropdown = true"
            @mouseleave="showDropdown = false"
            class="md:ml-auto cursor-pointer relative"
          >
            <p class="text-pink-100 text-3xl font-semibold">
              {{ currentUser.isLoggedIn ? `${currentUser.username}` : "" }}
            </p>
            <div
              v-if="showDropdown"
              class="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-blue-300"
            >
              <div
                @click="handleLogout"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100"
              >
                Logout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

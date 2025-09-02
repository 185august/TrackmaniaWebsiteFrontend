<script setup>
import { RouterLink } from "vue-router";
import logo from "../assets/img/logo.png";

const currentUserString = localStorage.getItem("currentUser");
const currentUser = JSON.parse(currentUserString);
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
          <div class="md:ml-auto">
            <div class="flex space-x-2">
              {{
                currentUser.isLoggedIn ? `Welcome, ${currentUser.username}` : ""
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

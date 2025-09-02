<script setup>
import LoginForm from "@/components/LoginForm.vue";
import Navbar from "@/components/Navbar.vue";
</script>

<template>
  <Navbar />
  <LoginForm />
  <div class="text-center mt-4">
    <p>
      Don't have an account?
      <router-link to="/register" class="text-blue-500 hover:underline"
        >Register here</router-link
      >
    </p>
  </div>
</template>

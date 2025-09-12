<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { setErrorMessage } from "@/utils/utuil.js";

const username = ref("");
const password = ref("");

const router = useRouter();

const errorMessage = ref(null);

const handleLogin = async () => {
  try {
    const response = await axios.post("/api/Auth/login", {
      username: username.value,
      password: password.value,
    });
    console.log(`data: ${response.data}`);
    const currentUser = {
      username: response.data.username,
      ubisoftUserId: response.data.ubisoftUserId,
      ubisoftUsername: response.data.ubisoftUsername,
      isLoggedIn: true,
      comparisonNames: {},
    };
    sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
    router.push("/Maps");
  } catch (error) {
    setErrorMessage(
      "Login failed. Please check your credentials.",
      errorMessage
    );
  }
};
onMounted(() => {
  const currentUserJson = sessionStorage.getItem("currentUser");
  if (currentUserJson) {
    const currentUser = JSON.parse(currentUserJson);
    if (currentUser.isLoggedIn) {
      router.push("/Maps");
    }
  }
});
</script>

<template>
  <div
    class="login-form bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0"
  >
    <h2 class="text-3xl text-center font-semibold mb-6">Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2" for="username"
          >Username:</label
        >
        <input
          class="border rounded w-full py-2 px-3 mb-2"
          type="text"
          id="username"
          v-model="username"
        />
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2" for="password"
          >Password:</label
        >
        <input
          class="border rounded w-full py-2 px-3 mb-2"
          type="password"
          id="password"
          v-model="password"
        />
      </div>
      <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
      >
        Login
      </button>
      <p v-if="errorMessage" class="text-red-500 text-sm mt-4">
        {{ errorMessage }}
      </p>
    </form>
  </div>
</template>

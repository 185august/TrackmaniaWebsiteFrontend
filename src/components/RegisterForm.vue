<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const formState = reactive({
  username: "",
  password: "",
  passwordConfirm: "",
  ubisoftName: "",
  ubisoftUserId: null,
  isUbisoftNameValid: null,
  ubisoftErrorMessage: "",
  errorMessage: "",
});

const router = useRouter();

const validateUbisoftName = async () => {
  try {
    console.log("Validating Ubisoft name:", formState.ubisoftName);
    const response = await axios.get(
      `http://localhost:5190/api/OAuth2Account/GetAccountId?accountNames=${formState.ubisoftName}`
    );
    formState.ubisoftName = Object.keys(response.data)[0];
    formState.ubisoftUserId = response.data[formState.ubisoftName];
    console.log(
      `name: ${formState.ubisoftName}, id: ${formState.ubisoftUserId}`
    );
    if (
      formState.ubisoftUserId == undefined ||
      formState.ubisoftName == undefined
    ) {
      formState.isUbisoftNameValid = false;
      return (formState.ubisoftErrorMessage =
        "Ubisoft name is not valid. Please check and try again.");
    } else {
      formState.isUbisoftNameValid = true;
      return (formState.ubisoftErrorMessage = "Ubisoft name is valid");
    }
  } catch (error) {
    console.error("Error validating Ubisoft name:", error);
    formState.isUbisoftNameValid = false;
  }
};

const handleRegister = async () => {
  try {
    const response = await axios.post(
      "http://localhost:5190/api/Auth/register",
      {
        username: formState.username,
        password: formState.password,
        ubisoftUsername: formState.ubisoftName,
        ubisoftUserId: formState.ubisoftUserId,
      }
    );
    console.log(response.data);
    router.push("/");
  } catch (error) {
    console.error("Registration failed:", error);
  }
};
</script>

<template>
  <div
    class="login-form bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0"
  >
    <h2 class="text-3xl text-center font-semibold mb-6">Login</h2>
    <form @submit.prevent="handleRegister">
      <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2" for="username"
          >Enter a username</label
        >
        <input
          class="border rounded w-full py-2 px-3 mb-2"
          type="text"
          id="username"
          v-model="formState.username"
        />
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2" for="password"
          >Enter your new password</label
        >
        <input
          class="border rounded w-full py-2 px-3 mb-2"
          type="password"
          id="password"
          v-model="formState.password"
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2" for="password"
          >Enter your Ubisoft username</label
        >
        <input
          class="border rounded w-full py-2 px-3 mb-2"
          type="text"
          id="ubisoftName"
          v-model="formState.ubisoftName"
        />
        <div class="mb-4">
          <button
            type="button"
            @click="validateUbisoftName()"
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
          >
            Validate Ubisoft Name
          </button>
          <div
            v-if="formState.ubisoftErrorMessage != null"
            class="text-red-500 text-sm mt-2"
          >
            {{ formState.ubisoftErrorMessage }}
          </div>
        </div>
      </div>
      <div v-if="formState.isUbisoftNameValid === true">
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
        >
          Register
        </button>
      </div>
    </form>
  </div>
</template>

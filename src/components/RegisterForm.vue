<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { setErrorMessage } from "@/utils/utuil.js";

const errorMessage = ref(null);

const formState = reactive({
  username: "",
  password: "",
  passwordConfirm: "",
  playerProfile: {},
  isUbisoftNameValid: false,
});

const router = useRouter();

const validateUbisoftName = async () => {
  try {
    let requestName = formState.ubisoftName;
    const requestNameCleaned = requestName.replace(/\s+/g, "");
    const response = await axios.post(
      `/api/PlayerAccounts/GetAndUpdatePlayerAccounts?playerIdsCommaSeperated=${requestNameCleaned}`
    );
    formState.playerProfile = response.data;
    console.log("Formsate", formState.playerProfile);

    if (formState.playerProfile.value == 0 || formState.playerProfile == {}) {
      formState.isUbisoftNameValid = false;
      setErrorMessage("Ubisoft name is not valid", errorMessage);
      return;
    } else {
      formState.isUbisoftNameValid = true;
      setErrorMessage("Ubisoft name is valid", errorMessage);
    }
  } catch (error) {
    setErrorMessage("Ubisoft name is not valid", errorMessage);
    formState.isUbisoftNameValid = false;
  }
};

const handleRegister = async () => {
  try {
    const playerProfile = formState.playerProfile;
    const response = await axios.post("/api/Auth/register", {
      username: formState.username,
      password: formState.password,
      playerProfile: playerProfile[0],
    });
    console.log(response.data);
    router.push("/");
  } catch (error) {
    setErrorMessage("Username not valid, please try again", errorMessage);
  }
};
</script>

<template>
  <div
    class="login-form bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0"
  >
    <h2 class="text-3xl text-center font-semibold mb-6">Register</h2>
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
      <div v-if="formState.isUbisoftNameValid === false" class="mb-4">
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
      <p v-if="errorMessage" class="text-red-500 text-sm mt-4">
        {{ errorMessage }}
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import axios from "axios";
import MapCard from "@/components/MapCard.vue";
import {
  setErrorMessage,
  GetCurrentUser,
  validateUbisoftName,
} from "@/utils/utuil.js";

const state = reactive({
  maps: [],
  isLoading: false,
  haveSelectedSeasonAndYear: false,
});

const selection = reactive({
  season: "",
  year: null,
});

const seasonOptions = ["Winter", "Spring", "Summer", "Fall"];
const yearOptions = [2023, 2024, 2025];

const comparisonString = ref();

const comparisonError = ref();
const mapSelectionError = ref();

const handleSeasonAndYearSelection = async () => {
  state.haveSelectedSeasonAndYear = true;
  state.isLoading = true;
  try {
    const response = await axios.get(
      `/api/Map/GetMapsByYearAndSeason?year=${selection.year}&season=${selection.season}`
    );
    state.maps = response.data;
    if (response.status != 200) {
      setErrorMessage(response.data, mapSelectionError);
      state.maps = [];
      return;
    }
    setErrorMessage("success", mapSelectionError);
  } catch (error) {
    setErrorMessage(
      "Could not fetch maps for the selected season and year",
      mapSelectionError
    );
  } finally {
    state.isLoading = false;
  }
};

const getUbisoftNames = async () => {
  const currentUser = GetCurrentUser();

  if (!currentUser) {
    return;
  }

  // if (!comparisonString.value || typeof comparisonString.value !== "string") {
  //   setErrorMessage("Please enter at least one username.");
  //   return;
  // }

  //console.log("Validating Ubisoft name:", comparisonString.value);
  // let requestNames =
  //   currentUser.ubisoftUsername + "," + comparisonString.value;
  // const requestNamesCleaned = requestNames.replace(/\s+/g, "");
  // const response = await axios.post(
  //   `/api/PlayerAccounts/GetAndUpdatePlayerAccounts?ubisoftUsernamesCommaSeperated=${requestNamesCleaned}`
  // );
  // console.log(response.data);
  const response = await validateUbisoftName(
    comparisonString.value,
    comparisonError
  );
  if (response) {
    currentUser.comparisonNames = response;
    sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
  }
};
</script>

<template>
  <section class="bg-blue-50 px-4 py-10">
    <div class="container-xl lg:container m-auto">
      <h2 class="text-3xl font-bold text-blue-400 mb-6 text-center">
        Trackmania Campaign Maps
      </h2>

      <div
        class="flex flex-col md:flex-row gap-6 p-4 bg-gray-100 rounded-lg shadow-inner"
      >
        <div class="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold text-gray-700 mb-4">Select Maps</h3>
          <form @submit.prevent="handleSeasonAndYearSelection">
            <div class="mb-4">
              <label for="season" class="block text-gray-700 font-bold mb-2"
                >Select a season</label
              >
              <select
                v-model="selection.season"
                id="season"
                name="season"
                class="w-full border rounded py-2 px-3 text-center"
                required
              >
                <option
                  v-for="value in seasonOptions"
                  :key="value"
                  :value="value"
                >
                  {{ value }}
                </option>
              </select>
            </div>
            <div class="mb-4">
              <label for="year" class="block text-gray-700 font-bold mb-2"
                >Select a year</label
              >
              <select
                v-model="selection.year"
                id="year"
                name="year"
                class="w-full border rounded py-2 px-3 text-center"
                required
              >
                <option
                  v-for="value in yearOptions"
                  :key="value"
                  :value="value"
                >
                  {{ value }}
                </option>
              </select>
            </div>
            <button
              type="submit"
              class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
            >
              Show maps
            </button>
          </form>
          <p v-if="mapSelectionError">{{ mapSelectionError }}</p>
        </div>

        <div class="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold text-gray-700 mb-4">
            Compare Players
          </h3>
          <div class="mb-4">
            <label
              for="comparisonString"
              class="block text-gray-700 font-bold mb-2"
            >
              Enter usernames to compare your times to (separated by commas)
            </label>
            <input
              type="text"
              v-model="comparisonString"
              id="comparisonString"
              placeholder="user1, user2"
              class="w-full border rounded py-2 px-3 mb-4"
            />
            <button
              type="button"
              @click="getUbisoftNames"
              class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
            >
              Submit names
            </button>
            <p v-if="comparisonError">
              {{ comparisonError }}
            </p>
          </div>
        </div>
      </div>

      <div class="mt-10">
        <div v-if="state.isLoading" class="text-center text-gray-500 py-6">
          <PulseLoader />
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-5 gap-5">
          <MapCard v-for="map in state.maps" :key="map.id" :map="map" />
        </div>
      </div>
    </div>
  </section>
</template>

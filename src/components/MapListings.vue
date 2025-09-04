<script setup>
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import axios from "axios";
import MapCard from "@/components/MapCard.vue";

const state = reactive({
  maps: [],
  isLoading: false,
  haveSelectedSeasonAndYear: false,
});

const selection = reactive({
  season: "",
  year: null,
});

const comparisonString = ref();

const comparisonError = ref();

const setComparisonError = (errorMessage) => {
  comparisonError.value = errorMessage;
  setTimeout(() => {
    comparisonError.value = "";
  }, 2000);
};

const handleSeasonAndYearSelection = async () => {
  state.haveSelectedSeasonAndYear = true;
  state.isLoading = true;
  try {
    const response = await axios.get(
      `/api/Map/GetMapsByYearAndSeason?year=${selection.year}&season=${selection.season}`
    );
    state.maps = response.data;
    console.log(state.maps);
  } catch (error) {
    console.error("Failed to fetch maps:", error);
  } finally {
    state.isLoading = false;
  }
};

const validateUbisoftNames = async () => {
  try {
    const currentUserString = sessionStorage.getItem("currentUser");
    const currentUser = JSON.parse(currentUserString);

    if (!currentUser) {
      console.error("User not logged in or data not found");
      return;
    }
    console.log("Validating Ubisoft name:", comparisonString.value);
    let requestNames = comparisonString.value;
    const requestNamesCleaned = requestNames.replace(/\s+/g, "");

    const response = await axios.get(
      `/api/OAuth2Account/GetAccountId?accountNames=${requestNamesCleaned}`
    );
    const names = Object.keys(response.data);

    currentUser.comparisonNames = {};

    names.forEach((name) => {
      currentUser.comparisonNames[name] = response.data[name];
    });
    if (Object.keys(currentUser.comparisonNames).length === 0) {
      setComparisonError("Error validating Ubisoft name");
      return;
    }
    console.log(Object.keys(currentUser.comparisonNames));
    sessionStorage.setItem("currentUser", JSON.stringify(currentUser));

    setComparisonError("successfully added users");
  } catch (error) {
    console.error("Error validating Ubisoft name:", error);
    setComparisonError("Error validating Ubisoft name");
  }
};
</script>

<template>
  <section class="bg-blue-50 px-4 py-10">
    <div class="container-xl lg:container m-auto">
      <h2 class="text-3xl font-bold text-green-500 mb-6 text-center">
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
                <option value="Winter">Winter</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Fall">Fall</option>
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
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </select>
            </div>
            <button
              type="submit"
              class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
            >
              Show maps
            </button>
          </form>
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
              @click="validateUbisoftNames"
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

      <div class="mt-8">
        <div v-if="state.isLoading" class="text-center text-gray-500 py-6">
          <PulseLoader />
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-5 gap-6">
          <MapCard v-for="map in state.maps" :key="map.id" :map="map" />
        </div>
      </div>
    </div>
  </section>
</template>

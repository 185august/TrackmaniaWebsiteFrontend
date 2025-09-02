<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import axios from "axios";
import MapCard from "@/components/MapCard.vue";
import { currentUser } from "../main.js";

const state = reactive({
  maps: [],
  isLoading: false,
  haveSelectedSeasonAndYear: false,
});

const selection = reactive({
  season: "",
  year: null,
});

const handleSeasonAndYearSelection = async () => {
  state.haveSelectedSeasonAndYear = true;
  state.isLoading = true;
  try {
    const response = await axios.get(
      `http://localhost:5190/api/Map/GetMapsByYearAndSeason?year=${selection.year}&season=${selection.season}`
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
    console.log("Validating Ubisoft name:", currentUser.comparisonString);
    const requestNames = currentUser.comparisonString.trim();

    const response = await axios.get(
      `http://localhost:5190/api/OAuth2Account/GetAccountId?accountNames=${requestNames}`
    );
    const names = Object.keys(response.data);

    names.forEach((name) => {
      currentUser.comparisonNames[name] = response.data[name];
    });
    console.log(currentUser.comparisonNames);
  } catch (error) {
    console.error("Error validating Ubisoft name:", error);
  }
};
</script>

<template>
  <section class="bg-blue-50 px-4 py-10">
    <div class="container-xl lg:container m-auto">
      <h2 class="text-3xl font-bold text-green-500 mb-6 text-center">
        Trackmania Campaign Maps
      </h2>
      <div class="text-center mb-6">
        <form @submit.prevent="handleSeasonAndYearSelection">
          <label for="season" class="block text-gray-700 font-bold mb-2"
            >Select a season</label
          >
          <select
            v-model="selection.season"
            id="season"
            name="season"
            class="border rounded py-2 px-3 w-30 text-center"
            required
          >
            <option value="Winter">Winter</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Fall">Fall</option>
          </select>
          <label for="year" class="block text-gray-700 font-bold mb-2 mt-4"
            >Select a year</label
          >
          <select
            v-model="selection.year"
            id="year"
            name="year"
            class="border rounded w-30 py-2 px-3 text-center"
            required
          >
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
          <br />
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-30 mt-4 mx-auto m-10"
          >
            Show maps
          </button>
        </form>
      </div>
      <div class="mb-4">
        <label for="comparionString"
          >Enter usernames to compare to seperated by commas</label
        >
        <br />
        <input
          type="text"
          v-model="currentUser.comparisonString"
          id="comparisonString"
          placeholder="user1, user2, user3"
          class="border rounded w-50 py-2 px-3 text-center mb-6"
        />
        <button
          type="button"
          @click="validateUbisoftNames"
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-50 mt-4 mx-auto m-10"
        >
          Check if names are valid
        </button>
      </div>
      <div>
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

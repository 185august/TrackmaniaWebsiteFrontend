<script setup>
import { ref, reactive, computed } from "vue";
import axios from "axios";
import { currentUser } from "../main.js";

const time = reactive({
  timeData: [],
  showTime: false,
  error: null,
});
const showTime = ref(false);
const timeData = ref([]);
const error = ref(null);

const timeMessage = computed(() => {
  if (error.value) {
    return `Error: ${error.value}`;
  } else if (timeData.value.length > 0 && timeData.value[0].recordScore) {
    let timeString = "";
    const nameKeys = Object.keys(currentUser.comparisonNames);
    timeString += `Your time ${timeData.value[0].recordScore.formatedTime}`;
    for (let i = 1; i < timeData.value.length; i++) {
      timeString += `\n${nameKeys[i - 1]}: ${
        timeData.value[i].recordScore.formatedTime
      }`;
    }
    return timeString;
  } else {
    return "No time data available.";
  }
});

const getUserTime = async (mapId) => {
  try {
    let accountsIdString = "";
    if (currentUser.comparisonNames == {}) {
      accountsIdString = currentUser.ubisoftUserId;
    } else {
      accountsIdString = currentUser.ubisoftUserId;
      const userKeys = Object.keys(currentUser.comparisonNames);
      userKeys.forEach((user) => {
        accountsIdString += `,${currentUser.comparisonNames[user]}`;
      });
    }
    console.log(
      `Fetching time for mapId: ${mapId} and accountIdList: ${currentUser.comparisonString}`
    );
    const response = await axios.get(
      `http://localhost:5190/api/Map/GetMapRecord?mapId=${mapId}&accountIdList=${accountsIdString}`
    );
    timeData.value = response.data;
    console.log(time.timeData);
    showTime.value = true;
    error.value = null;
  } catch (error) {
    console.error("Failed to fetch user time:", error);
    error.value = "Failed to fetch user time";
  }
};

const closePopup = () => {
  showTime.value = false;
};

const props = defineProps({
  map: Object,
});
</script>

<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden w-50 h-30">
    <div class="pl-2">
      <h3 class="text-m font-semibold mb-2">{{ map.name }}</h3>
      <button
        @click="getUserTime(map.mapId)"
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-40 focus:outline-none focus:shadow-outline"
      >
        Get map time/s
      </button>
      <teleport to="body">
        <div
          v-if="showTime"
          @click="closePopup"
          class="mt-4 absolute top-0 left-0 bg-black/10 w-full h-full flex justify-center items-center cursor-pointer"
        >
          <div @click.stop class="bg-white p-8 rounded-lg shadow-lg">
            <p class="mt-2 text-sm text-gray-600">{{ timeMessage }}</p>
          </div>
        </div>
      </teleport>
    </div>
  </div>
</template>

<!--
<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden w-50 h-30">
    <div class="pl-2">
      <h3 class="text-m font-semibold mb-2">{{ map.name }}</h3>
      <button
        @click="getUserTime(map.mapId)"
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-40 focus:outline-none focus:shadow-outline"
      >
        Get your time
      </button>

      <teleport to="body">
        <div
          v-if="showTime"
          @click="closePopup"
          class="mt-4 absolute top-0 left-0 bg-black/10 w-full h-full flex justify-center items-center cursor-pointer"
        >
          <div @click.stop class="bg-white p-8 rounded-lg shadow-lg">
            <p class="mt-2 text-sm text-gray-600">{{ timeMessage }}</p>
            </div>
        </div>
      </teleport>
    </div>
  </div>
</template>
*/
-->

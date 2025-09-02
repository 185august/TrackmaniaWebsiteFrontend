<script setup>
import { ref, reactive, computed } from "vue";
import axios from "axios";
import TimesTable from "./TimesTable.vue";

const showTime = ref(false);
const timeData = ref([]);
const error = ref(null);

const processMapTimes = (apiResponse, currentUser) => {
  if (!apiResponse || !currentUser || !currentUser.comparisonNames) {
    return [];
  }

  const reverseMap = {};
  reverseMap[currentUser.ubisoftUserId] = currentUser.ubisoftUsername;

  for (const name in currentUser.comparisonNames) {
    const id = currentUser.comparisonNames[name];
    reverseMap[id] = name;
  }

  const processedData = apiResponse.map((record) => {
    const playerName = reverseMap[record.accountId];

    return {
      ...record,
      name: playerName || "Unknown Player",
    };
  });
  processedData.sort((a, b) => a.recordScore.time - b.recordScore.time);

  return processedData;
};

const getUserTime = async (mapId) => {
  try {
    let accountsIdString = "";
    const currentUserString = localStorage.getItem("currentUser");
    const currentUser = JSON.parse(currentUserString);
    if (currentUser.comparisonNames == {}) {
      accountsIdString = currentUser.ubisoftUserId;
    } else {
      accountsIdString = currentUser.ubisoftUserId;
      const userKeys = Object.keys(currentUser.comparisonNames);
      userKeys.forEach((u) => {
        accountsIdString += `,${currentUser.comparisonNames[u]}`;
      });
    }
    const response = await axios.get(
      `http://localhost:5190/api/Map/GetMapRecord?mapId=${mapId}&accountIdList=${accountsIdString}`
    );
    timeData.value = processMapTimes(response.data, currentUser);
    console.log(timeData.value);
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
          class="mt-4 absolute top-0 left-0 bg-black/10 w-full h-full flex justify-center items-center cursor-pointer p-10"
        >
          <div @click.stop class="bg-white p-8 rounded-lg shadow-lg">
            <!-- <p class="mt-2 text-sm text-gray-600">{{ timeMessage }}</p>-->
            <TimesTable :timeData="timeData" />
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

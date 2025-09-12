<script setup>
import { ref } from "vue";
import axios from "axios";
import TimesTable from "./TimesTable.vue";
import TimeChart from "./TimeChart.vue";

const showTime = ref(false);
const timeData = ref([]);
const errorMessage = ref(null);
const chartData = ref(null);

const getUserTime = async (mapId, mapUid) => {
  try {
    const currentUserJson = sessionStorage.getItem("currentUser");
    const currentUser = JSON.parse(currentUserJson);

    const response = await axios.post(
      `/api/MapTime/GetAllMapTimes?mapId=${mapId}&mapUid=${mapUid}`,
      currentUser.comparisonNames
    );
    timeData.value = response.data;
    chartData.value = {
      labels: timeData.value.map((record) => record.name),
      datasets: [
        {
          label: "Time away from WR (ms)",
          backgroundColor: "#f87979",
          data: timeData.value.map((record) => record.recordScore.timeVsWr),
        },
      ],
    };
    showTime.value = true;
    errorMessage.value = null;
  } catch (error) {
    errorMessage.value = "Failed to fetch times";
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
  <div
    class="bg-white shadow-md rounded-lg overflow-hidden w-50 h-25 pl-3 pt-3"
  >
    <div class="pl-2">
      <h3 class="text-m font-semibold mb-2 pl-3">{{ map.name }}</h3>
      <button
        @click="getUserTime(map.mapId, map.mapUid)"
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-40 focus:outline-none focus:shadow-outline"
      >
        Get map times
      </button>
      <teleport to="body">
        <p v-if="errorMessage != null"></p>
        <div
          v-if="showTime"
          @click="closePopup"
          class="mt-4 absolute top-0 left-0 bg-black/10 w-full h-full flex justify-center items-center cursor-pointer p-10"
        >
          <div @click.stop class="bg-white p-8 rounded-lg shadow-lg">
            <!-- <p class="mt-2 text-sm text-gray-600">{{ timeMessage }}</p>-->
            <TimesTable :timeData="timeData" />
            <TimeChart :chart-Data="chartData" />
          </div>
        </div>
      </teleport>
    </div>
  </div>
</template>

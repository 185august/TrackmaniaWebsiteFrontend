<script setup>
import { computed, defineProps } from "vue";

const props = defineProps({
  timeData: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div v-if="props.timeData.length > 0" class="p-4">
    <table
      class="w-full text-lg border-separate border-spacing-x-4 border-spacing-y-2"
    >
      <thead>
        <tr>
          <th class="text-left px-4 py-2 text-4xl">Player Name</th>
          <th class="text-left px-4 py-2 text-4xl">Time</th>
          <th class="text-left px-4 py-2 text-4xl">Medal</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record in props.timeData" :key="record.accountId">
          <td class="px-4 py-2 text-2xl">{{ record.name }}</td>
          <td class="px-4 py-2 text-2xl">
            {{ record.recordScore.formatedTime }}
          </td>
          <td class="px-4 py-2 text-2xl">
            {{ record.medalText }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

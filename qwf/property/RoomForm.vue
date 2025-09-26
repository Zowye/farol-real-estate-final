<template>
  <v-form v-model="isValid" @submit.prevent>
    <v-row>
      <v-col cols="12" md="6">
        <v-select
          v-model="room.roomTypeId"
          :items="roomTypes"
          item-title="label"
          item-value="id"
          label="Room Type"
          required
          :rules="[v => !!v || 'Room type is required']"
        ></v-select>
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="room.name"
          label="Room Name"
          placeholder="e.g. Master Suite, Kitchen"
          :rules="[v => !!v || 'Room name is required']"
        ></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-textarea
          v-model="room.description"
          label="Description"
          rows="2"
          placeholder="Describe the room features, size, etc."
        ></v-textarea>
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model.number="room.areaM2"
          label="Area (m²)"
          type="number"
          min="0"
          step="0.01"
          :rules="[v => !v || v > 0 || 'Area must be greater than 0']"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model.number="room.floorNumber"
          label="Floor Number"
          type="number"
          placeholder="e.g. 0 for ground floor"
        ></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-file-input
          v-model="room.photos"
          label="Room Photos"
          multiple
          accept="image/*"
          prepend-icon="mdi-camera"
          show-size
        ></v-file-input>
      </v-col>

      <!-- Preview das fotos -->
      <v-col 
        v-for="(file, index) in room.photos"
        :key="index"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card>
          <v-img
            :src="URL.createObjectURL(file)"
            aspect-ratio="16/9"
            cover
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          <v-card-actions>
            <v-text-field
              v-model="room.photoCaptions[index]"
              label="Caption"
              hide-details
              density="compact"
              class="mx-2"
            ></v-text-field>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
interface Room {
  roomTypeId: number;
  name: string;
  description?: string;
  areaM2?: number;
  floorNumber?: number;
  photos?: File[];
  photoCaptions: string[];
  position: number;
}

const props = defineProps<{
  modelValue: Room;
  roomTypes: Array<{ id: number; code: string; label: string; }>;
}>()

const emit = defineEmits(['update:modelValue', 'update:valid'])

// Form validation
const isValid = ref(true)
watch(isValid, (value) => emit('update:valid', value))

// Computed room for v-model
const room = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>
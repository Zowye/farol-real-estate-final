<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h4 mb-6">Create New Property</h1>
        <v-card>
          <!-- Tabs centralizadas -->
          <v-tabs
            v-model="currentTab"
            color="primary"
            grow
            centered
          >
            <v-tab value="basic">
              <v-icon
                :color="isBasicValid ? 'success' : 'grey'"
                class="mr-2"
              >
                {{ isBasicValid ? 'mdi-check-circle' : 'mdi-circle-outline' }}
              </v-icon>
              Basic Information
            </v-tab>
            <v-tab value="location">
              <v-icon
                :color="isLocationValid ? 'success' : 'grey'"
                class="mr-2"
              >
                {{ isLocationValid ? 'mdi-check-circle' : 'mdi-circle-outline' }}
              </v-icon>
              Location
            </v-tab>
            <v-tab value="rooms">
              <v-icon
                :color="isRoomsValid ? 'success' : 'grey'"
                class="mr-2"
              >
                {{ isRoomsValid ? 'mdi-check-circle' : 'mdi-circle-outline' }}
              </v-icon>
              Rooms
            </v-tab>
            <v-tab value="photos">
              <v-icon
                :color="isPhotosValid ? 'success' : 'grey'"
                class="mr-2"
              >
                {{ isPhotosValid ? 'mdi-check-circle' : 'mdi-circle-outline' }}
              </v-icon>
              Photos
            </v-tab>
          </v-tabs>

          <v-card-text>
            <v-window v-model="currentTab">
              <!-- Basic Information Tab -->
              <v-window-item value="basic">
                <v-form v-model="isBasicValid" @submit.prevent>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="property.name"
                        label="Property Name"
                        required
                        :rules="[v => !!v || 'Name is required']"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12">
                      <v-textarea
                        v-model="property.description"
                        label="Description"
                        required
                        :rules="[v => !!v || 'Description is required']"
                      ></v-textarea>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-select
                        v-model="property.propertyTypeId"
                        :items="propertyTypes"
                        item-title="label"
                        item-value="id"
                        label="Property Type"
                        required
                        :rules="[v => !!v || 'Property type is required']"
                      ></v-select>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-select
                        v-model="property.contract"
                        :items="['RENT', 'SALE']"
                        label="Contract Type"
                        required
                        :rules="[v => !!v || 'Contract type is required']"
                      ></v-select>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model.number="property.price"
                        label="Price"
                        type="number"
                        prefix="R$"
                        required
                        :rules="[
                          v => !!v || 'Price is required',
                          v => v > 0 || 'Price must be greater than 0'
                        ]"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model.number="property.roomsCount"
                        label="Number of Rooms"
                        type="number"
                        required
                        :rules="[v => v >= 0 || 'Cannot be negative']"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model.number="property.bathrooms"
                        label="Number of Bathrooms"
                        type="number"
                        required
                        :rules="[v => v >= 0 || 'Cannot be negative']"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model.number="property.garages"
                        label="Number of Garage Spots"
                        type="number"
                        required
                        :rules="[v => v >= 0 || 'Cannot be negative']"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-window-item>

              <!-- Location Tab -->
              <v-window-item value="location">
                <LocationForm
                  v-model="property.location"
                  @update:valid="isLocationValid = $event"
                />
              </v-window-item>

              <!-- Rooms Tab -->
              <v-window-item value="rooms">
                <v-row>
                  <v-col cols="12" class="d-flex justify-space-between align-center">
                    <h2 class="text-h6">Rooms</h2>
                    <v-btn
                      color="primary"
                      prepend-icon="mdi-plus"
                      @click="addRoom"
                    >
                      Add Room
                    </v-btn>
                  </v-col>

                  <v-col cols="12">
                    <v-expansion-panels>
                      <v-expansion-panel
                        v-for="(room, index) in property.rooms"
                        :key="index"
                      >
                        <v-expansion-panel-title>
                          <div class="d-flex align-center">
                            <v-icon
                              :color="isRoomValid(room) ? 'success' : 'grey'"
                              class="mr-2"
                            >
                              {{ isRoomValid(room) ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                            </v-icon>
                            {{ room.name || `Room ${index + 1}` }}
                          </div>
                          <template v-slot:actions>
                            <v-btn
                              icon="mdi-delete"
                              size="small"
                              color="error"
                              variant="text"
                              @click.stop="removeRoom(index)"
                            ></v-btn>
                          </template>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                          <RoomForm
                            v-model="property.rooms[index]"
                            :room-types="roomTypes"
                            @update:valid="updateRoomValidity(index, $event)"
                          />
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-col>
                </v-row>
              </v-window-item>

              <!-- Photos Tab -->
              <v-window-item value="photos">
                <v-form v-model="isPhotosValid" @submit.prevent>
                  <v-row>
                    <v-col cols="12">
                      <v-file-input
                        v-model="propertyPhotos"
                        label="Property Photos"
                        multiple
                        accept="image/*"
                        prepend-icon="mdi-camera"
                        show-size
                        :rules="[
                          v => v?.length > 0 || 'At least one photo is required'
                        ]"
                      ></v-file-input>
                    </v-col>

                    <!-- Preview das fotos -->
                    <v-col 
                      v-for="(file, index) in propertyPhotos"
                      :key="index"
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-card>
                        <v-img
                          :src="objectURL(file)"
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
                          <v-checkbox
                            v-model="coverPhotoIndex"
                            :value="index"
                            label="Set as cover"
                            hide-details
                          ></v-checkbox>
                          <v-spacer></v-spacer>
                          <v-text-field
                            v-model="photosCaptions[index]"
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
              </v-window-item>
            </v-window>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn
              v-if="currentTab !== 'basic'"
              variant="text"
              @click="currentTab = tabs[tabs.indexOf(currentTab) - 1]"
            >
              Previous
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              v-if="currentTab !== 'photos'"
              color="primary"
              @click="currentTab = tabs[tabs.indexOf(currentTab) + 1]"
              :disabled="!isCurrentTabValid"
            >
              Next
            </v-btn>
            <v-btn
              v-else
              color="primary"
              @click="handleSubmit"
              :loading="isSubmitting"
              :disabled="!isFormValid"
            >
              Create Property
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import LocationForm from '~/components/property/LocationForm.vue'
import RoomForm from '~/components/property/RoomForm.vue'


definePageMeta({ ssr: false })

// Tabs configuration
const tabs = ['basic', 'location', 'rooms', 'photos']
const currentTab = ref('basic')

// Form validation states
const isBasicValid = ref(false)
const isLocationValid = ref(false)
const isRoomsValid = ref(false)
const isPhotosValid = ref(false)
const isSubmitting = ref(false)

// Room validations
const roomValidations = ref<boolean[]>([])

// Photos handling
const propertyPhotos = ref<File[]>([])
const photosCaptions = ref<string[]>([])
const coverPhotoIndex = ref(0)

// Fetch reference data
const { data: propertyTypes } = await useFetch('/api/property-types')
const { data: roomTypes } = await useFetch('/api/room-types')

// Property data
const property = ref({
  name: '',
  description: '',
  propertyTypeId: null as number | null,
  contract: 'SALE' as 'RENT' | 'SALE',
  price: 0,
  roomsCount: 0,
  bathrooms: 0,
  garages: 0,
  location: {
    street: '',
    streetNumber: '',
    neighborhood: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    latitude: 0,
    longitude: 0,
    placeId: ''
  },
  rooms: [] as Array<{
    roomTypeId: number;
    name: string;
    description?: string;
    areaM2?: number;
    floorNumber?: number;
    photos?: File[];
    photoCaptions: string[];
    position: number;
  }>
})


const objectURL = (f: File) => URL.createObjectURL(f)



// Computed properties for validation
// Room management
const addRoom = () => {
  property.value.rooms.push({
    roomTypeId: 0,
    name: '',
    description: '',
    photoCaptions: [],
    position: property.value.rooms.length
  })
  roomValidations.value.push(false)
}

const removeRoom = (index: number) => {
  property.value.rooms.splice(index, 1)
  roomValidations.value.splice(index, 1)
  // Update positions
  property.value.rooms.forEach((room, idx) => {
    room.position = idx
  })
}

const updateRoomValidity = (index: number, isValid: boolean) => {
  roomValidations.value[index] = isValid
  isRoomsValid.value = property.value.rooms.length > 0 && 
    roomValidations.value.every(v => v)
}

const isRoomValid = (room: any) => {
  return room.roomTypeId && room.name
}

// Computed properties for validation
const isCurrentTabValid = computed(() => {
  switch (currentTab.value) {
    case 'basic':
      return isBasicValid.value
    case 'location':
      return isLocationValid.value
    case 'rooms':
      return isRoomsValid.value
    case 'photos':
      return isPhotosValid.value
    default:
      return false
  }
})

const isFormValid = computed(() => {
  const valid = isBasicValid.value && 
         isLocationValid.value && 
         isRoomsValid.value &&
         isPhotosValid.value;
  console.log('isFormValid computed', valid, {
    basic: isBasicValid.value,
    location: isLocationValid.value,
    rooms: isRoomsValid.value,
    photos: isPhotosValid.value
  });
  return valid;
});

watch(isFormValid, (newVal) => {
  console.log('isFormValid changed to:', newVal);
});

watch([isBasicValid, isLocationValid, isRoomsValid, isPhotosValid], (newVals) => {
  console.log('Validation states changed:', {
    basic: newVals[0],
    location: newVals[1],
    rooms: newVals[2],
    photos: newVals[3]
  });
});

// Submit handler
const handleSubmit = async () => {
  if (!isFormValid.value) return

  try {
    isSubmitting.value = true

    // 1) Monta o payload sem fotos
    const propertyData = {
      ...property.value,
      street: property.value.location.street,
      streetNumber: property.value.location.streetNumber,
      neighborhood: property.value.location.neighborhood,
      city: property.value.location.city,
      state: property.value.location.state,
      country: property.value.location.country,
      postalCode: property.value.location.postalCode,
      latitude: property.value.location.latitude,
      longitude: property.value.location.longitude,
      placeId: property.value.location.placeId,

      rooms: {
        create: property.value.rooms.map((room) => ({
          roomTypeId: room.roomTypeId,
          name: room.name,
          description: room.description,
          areaM2: room.areaM2,
          floorNumber: room.floorNumber,
          position: room.position
          // ❌ não incluir photos aqui
        }))
      }
      // ❌ não incluir photos aqui
    }

    console.log('🟦 propertyData (NO PHOTOS):', propertyData)

    // 2) Cria a propriedade
    const created = await $fetch('/api/properties', {
      method: 'POST',
      body: propertyData
    })
    console.log('🟩 property created:', created)

    // 3) Faz upload das fotos da propriedade
    for (let i = 0; i < propertyPhotos.value.length; i++) {
      const file = propertyPhotos.value[i]
      const form = new FormData()
      form.append('file', file)

      const resp = await $fetch(`/api/properties/${created.id}/photos`, {
        method: 'POST',
        body: form,
        params: {
          isCover: i === coverPhotoIndex.value ? 'true' : 'false'
        }
      })

      console.log(`🟨 uploaded photo [${i}]`, resp)
    }

    // (Opcional) aqui você pode recarregar a property se quiser fotos já vinculadas
    // const propertyWithPhotos = await $fetch(`/api/properties/${created.id}`)

    // 4) Redireciona
    navigateTo('/')

  } catch (error) {
    console.error('❌ Error creating property flow:', error)
    alert('There was an error creating the property. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

</script>
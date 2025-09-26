<!-- PropertyCard.vue -->
<template>
  <v-card class="h-100" elevation="2" hover>
    <!-- Property Image -->
    <v-img
      :src="coverPhoto"
      :alt="property.name"
      height="200"
      cover
    >
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-row>
      </template>
      
      <!-- Contract Type Badge -->
      <v-chip
        class="ma-2"
        :color="property.contract === 'RENT' ? 'info' : 'success'"
        label
        style="position: absolute; right: 0; top: 0;"
      >
        {{ formatContractType(property.contract) }}
      </v-chip>
    </v-img>

    <v-card-title>{{ property.name }}</v-card-title>

    <v-card-text>
      <div class="d-flex align-center mb-2">
        <v-chip size="small" color="primary" class="mr-2">
          {{ property.propertyType.label }}
        </v-chip>
      </div>

      <p class="mb-4 text-truncate">{{ property.description }}</p>

      <!-- Price -->
      <div class="text-h5 mb-4 text-primary">
        {{ formatPrice(property.price) }}
        <span v-if="property.contract === 'RENT'" class="text-body-1">/month</span>
      </div>

      <!-- Property Features -->
      <v-row class="mb-4">
        <v-col cols="4" class="text-center">
          <v-icon icon="mdi-bed" class="mr-1"></v-icon>
          {{ property.roomsCount }} rooms
        </v-col>
        <v-col cols="4" class="text-center">
          <v-icon icon="mdi-shower" class="mr-1"></v-icon>
          {{ property.bathrooms }} baths
        </v-col>
        <v-col cols="4" class="text-center">
          <v-icon icon="mdi-car" class="mr-1"></v-icon>
          {{ property.garages }} garage
        </v-col>
      </v-row>

      <!-- Amenities -->
      <div v-if="property.amenities.length" class="mb-4">
        <v-chip-group>
          <v-chip
            v-for="amenity in property.amenities.slice(0, 3)"
            :key="amenity.amenityTypeId"
            size="small"
            variant="outlined"
          >
            {{ amenity.amenityType.label }}
          </v-chip>
          <v-chip
            v-if="property.amenities.length > 3"
            size="small"
            variant="outlined"
          >
            +{{ property.amenities.length - 3 }} more
          </v-chip>
        </v-chip-group>
      </div>

      <!-- Location -->
      <div class="d-flex align-center">
        <v-icon icon="mdi-map-marker" class="mr-2"></v-icon>
        <span>{{ property.neighborhood }}, {{ property.city }} - {{ property.state }}</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
interface PropertyPhoto {
  id: number;
  url: string;
  caption?: string;
  position: number;
  isCover: boolean;
}

interface PropertyAmenity {
  amenityTypeId: number;
  amenityType: {
    id: number;
    code: string;
    label: string;
    category?: string;
  };
}

interface Property {
  id: number;
  name: string;
  description: string;
  propertyType: {
    id: number;
    code: string;
    label: string;
  };
  contract: 'RENT' | 'SALE';
  price: number;
  roomsCount: number;
  bathrooms: number;
  garages: number;
  street: string;
  streetNumber: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  amenities: PropertyAmenity[];
  photos: PropertyPhoto[];
}

const props = defineProps<{
  property: Property;
}>();

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

const formatContractType = (type: 'RENT' | 'SALE') => {
  return type === 'RENT' ? 'For Rent' : 'For Sale';
};

// Get cover photo or first photo or placeholder
const coverPhoto = computed(() => {
  const cover = props.property.photos.find(p => p.isCover);
  const first = props.property.photos[0];
  return (cover || first)?.url || 'https://via.placeholder.com/800x600?text=No+Photo';
});
</script>
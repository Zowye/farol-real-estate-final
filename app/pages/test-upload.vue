<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h4 mb-6">Test Upload</h1>

        <v-file-input
          v-model="file"
          label="Select Image"
          accept="image/*"
          show-size
          @change="handleFileChange"
        ></v-file-input>

        <v-btn
          color="primary"
          :loading="isUploading"
          :disabled="!file"
          @click="handleUpload"
          class="mb-4"
        >
          Upload
        </v-btn>

        <div v-if="uploadedUrl" class="mt-4">
          <p class="mb-2">Uploaded successfully!</p>
          <v-img
            :src="uploadedUrl"
            max-width="300"
            class="rounded-lg"
          ></v-img>
          <p class="mt-2">Storage Path: {{ storagePath }}</p>
        </div>

        <v-alert
          v-if="error"
          type="error"
          class="mt-4"
        >
          {{ error }}
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const file = ref<File | null>(null)
const isUploading = ref(false)
const uploadedUrl = ref<string | null>(null)
const storagePath = ref<string | null>(null)
const error = ref<string | null>(null)

const handleFileChange = () => {
  // Reset states on new file
  uploadedUrl.value = null
  storagePath.value = null
  error.value = null
}

const handleUpload = async () => {
  if (!file.value) return

  isUploading.value = true
  error.value = null

  try {
    const formData = new FormData()
    formData.append('file', file.value)

    // Test upload as a property photo
    const response = await useFetch('/api/upload', {
      method: 'POST',
      body: formData,
      query: {
        type: 'property',
        propertyId: 'test-123',
        isCover: 'true'
      }
    })

    if (response.error.value) {
      throw new Error(response.error.value.message || 'Upload failed')
    }

    const data = response.data.value as { url: string; storagePath: string }
    uploadedUrl.value = data.url
    storagePath.value = data.storagePath
  } catch (err) {
    console.error('Upload error:', err)
    error.value = err.message || 'Upload failed'
  } finally {
    isUploading.value = false
  }
}
</script>

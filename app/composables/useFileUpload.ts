export const useFileUpload = () => {
  const uploadFile = async (
    file: File,
    type: 'property' | 'room',
    propertyId: string | number,
    options?: {
      roomId?: string | number;
      isCover?: boolean;
    }
  ) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      // Build query parameters
      const params = new URLSearchParams({
        type,
        propertyId: propertyId.toString()
      })

      if (options?.roomId) {
        params.append('roomId', options.roomId.toString())
      }

      if (options?.isCover) {
        params.append('isCover', 'true')
      }

      // Upload file
      const response = await useFetch(`/api/upload?${params.toString()}`, {
        method: 'POST',
        body: formData
      })

      if (response.error.value) {
        throw new Error(response.error.value.message)
      }

      return response.data.value
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    }
  }

  return {
    uploadFile
  }
}

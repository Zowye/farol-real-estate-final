import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // 2) Criar tipos base
  await prisma.propertyType.createMany({
    data: [
      { code: 'house', label: 'House' },
      { code: 'apartment', label: 'Apartment' },
      { code: 'studio', label: 'Studio' },
      { code: 'land', label: 'Land' },
      { code: 'commercial', label: 'Commercial' },
    ],
  })

  await prisma.amenityType.createMany({
    data: [
      { code: 'children_playground', label: 'Children Playground', category: 'leisure' },
      { code: 'pool', label: 'Pool', category: 'leisure' },
      { code: 'gym', label: 'Gym', category: 'leisure' },
      { code: 'pets_allowed', label: 'Pets Allowed', category: 'rules' },
      { code: 'security_24h', label: '24/7 Security', category: 'security' },
      { code: 'elevator', label: 'Elevator', category: 'infrastructure' },
      { code: 'parking', label: 'Parking', category: 'infrastructure' },
    ],
  })

  await prisma.roomType.createMany({
    data: [
      { code: 'bedroom', label: 'Bedroom' },
      { code: 'suite', label: 'Suite' },
      { code: 'bathroom', label: 'Bathroom' },
      { code: 'kitchen', label: 'Kitchen' },
      { code: 'living_room', label: 'Living Room' },
      { code: 'garage', label: 'Garage' },
      { code: 'office', label: 'Office' },
      { code: 'laundry', label: 'Laundry Room' },
    ],
  })

  // 3) Buscar IDs necessários
  const apartmentType = await prisma.propertyType.findUnique({ 
    where: { code: 'apartment' } 
  })
  const houseType = await prisma.propertyType.findUnique({ 
    where: { code: 'house' } 
  })
  
  if (!apartmentType || !houseType) {
    throw new Error('Property types not found')
  }

  const suiteType = await prisma.roomType.findUnique({ 
    where: { code: 'suite' } 
  })
  const livingRoomType = await prisma.roomType.findUnique({ 
    where: { code: 'living_room' } 
  })
  const bedroomType = await prisma.roomType.findUnique({ 
    where: { code: 'bedroom' } 
  })
  
  if (!suiteType || !livingRoomType || !bedroomType) {
    throw new Error('Room types missing')
  }

  const gymAmenity = await prisma.amenityType.findUnique({ 
    where: { code: 'gym' } 
  })
  const poolAmenity = await prisma.amenityType.findUnique({ 
    where: { code: 'pool' } 
  })
  const petsAmenity = await prisma.amenityType.findUnique({ 
    where: { code: 'pets_allowed' } 
  })
  
  if (!gymAmenity || !poolAmenity || !petsAmenity) {
    throw new Error('Amenity types missing')
  }

  // 4) Criar propriedades - CORREÇÕES APLICADAS

  // Apartamento (SALE)
  console.log('Creating apartment...')
  await prisma.property.create({
    data: {
      name: "Modern Apartment in Downtown",
      description: "Beautiful apartment with great view",
      propertyTypeId: apartmentType.id,
      contract: "SALE", // Usar string do enum
      price: new Prisma.Decimal(450000.00), // Sem aspas
      roomsCount: 2,
      bathrooms: 1,
      garages: 1,
      street: "Main Street",
      streetNumber: "123",
      neighborhood: "Downtown",
      city: "São Paulo",
      state: "SP",
      country: "Brazil",
      postalCode: "01001-000",
      rooms: {
        create: [
          {
            roomTypeId: suiteType.id,
            name: "Master Suite",
            description: "Spacious suite with walk-in closet",
            areaM2: new Prisma.Decimal(20.00), // Sem aspas
            floorNumber: 10,
            position: 1
          },
          {
            roomTypeId: livingRoomType.id,
            name: "Living Room",
            description: "Bright living room with balcony",
            areaM2: new Prisma.Decimal(15.00), // Sem aspas
            floorNumber: 10,
            position: 2
          }
        ]
      },
      amenities: {
        create: [
          { amenityTypeId: gymAmenity.id },
          { amenityTypeId: poolAmenity.id },
        ]
      },
      photos: {
        create: [
          {
            storagePath: "photos/properties/apartment_front.jpg",
            caption: "Front view",
            position: 1,
            isCover: true
          },
          {
            storagePath: "photos/properties/apartment_living_room.jpg",
            caption: "Living room",
            position: 2
          }
        ]
      }
    }
  })

  // Casa (RENT)
  console.log('Creating house...')
  await prisma.property.create({
    data: {
      name: "Spacious House with Garden",
      description: "Perfect family house in quiet neighborhood",
      propertyTypeId: houseType.id,
      contract: "RENT", // Usar string do enum
      price: new Prisma.Decimal(5000.00), // Sem aspas
      roomsCount: 3,
      bathrooms: 2,
      garages: 2,
      street: "Park Avenue",
      streetNumber: "456",
      neighborhood: "Green Valley",
      city: "São Paulo",
      state: "SP",
      country: "Brazil",
      postalCode: "04567-000",
      rooms: {
        create: [
          {
            roomTypeId: suiteType.id,
            name: "Master Suite",
            description: "Large suite with garden view",
            areaM2: new Prisma.Decimal(25.00), // Sem aspas
            position: 1,
            photos: {
              create: [
                {
                  storagePath: "photos/rooms/master_suite.jpg",
                  caption: "Suite interior",
                  position: 1
                }
              ]
            }
          },
          {
            roomTypeId: bedroomType.id,
            name: "Guest Bedroom",
            description: "Comfortable guest room",
            areaM2: new Prisma.Decimal(15.00), // Sem aspas
            position: 2,
            photos: {
              create: [
                {
                  storagePath: "photos/rooms/guest_bedroom.jpg",
                  caption: "Guest bedroom",
                  position: 1
                }
              ]
            }
          }
        ]
      },
      amenities: {
        create: [
          { amenityTypeId: petsAmenity.id },
        ]
      },
      photos: {
        create: [
          {
            storagePath: "photos/properties/house_front.jpg",
            caption: "House front",
            position: 1,
            isCover: true
          }
        ]
      }
    }
  })

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
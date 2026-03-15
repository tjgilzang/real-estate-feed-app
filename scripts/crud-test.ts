import { PrismaClient, ListingType, ContractType } from '@prisma/client';
import BetterSQLite3 from 'better-sqlite3';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: './dev.db' }),
});

async function main() {
  // 1. Create a Region
  const seoul = await prisma.region.create({
    data: {
      name: 'Seoul',
      popularity: 9.5,
      preferenceWeight: 0.8,
      description: 'Capital city of South Korea',
    },
  });
  console.log('Created region:', seoul);

  // 2. Create a Listing associated with the Region
  const apartmentListing = await prisma.listing.create({
    data: {
      title: 'Cozy Apartment in Gangnam',
      address: 'Gangnam-gu, Seoul',
      price: 500000000,
      area: 85.5,
      rooms: 3,
      bathrooms: 2,
      type: ListingType.APARTMENT,
      contractType: ContractType.JEONSE,
      listingDate: new Date(),
      rating: 4.5,
      styleScore: 8,
      description: 'A beautiful apartment near Gangnam Station.',
      neighborhood: 'Gangnam',
      region: {
        connect: { id: seoul.id },
      },
    },
  });
  console.log('Created listing:', apartmentListing);

  // 3. Read all Listings
  const allListings = await prisma.listing.findMany({
    include: {
      region: true,
    },
  });
  console.log('\nAll listings:', allListings);

  // 4. Update a Listing
  const updatedListing = await prisma.listing.update({
    where: { id: apartmentListing.id },
    data: { price: 520000000 },
  });
  console.log('\nUpdated listing:', updatedListing);

  // 5. Delete a Listing
  const deletedListing = await prisma.listing.delete({
    where: { id: apartmentListing.id },
  });
  console.log('\nDeleted listing:', deletedListing);

  // 6. Delete a Region (only possible after all associated listings are deleted)
  const deletedRegion = await prisma.region.delete({
    where: { id: seoul.id },
  });
  console.log('\nDeleted region:', deletedRegion);

}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { hash } from 'bcryptjs'
import { faker, tr } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

async function seed() {
    await prisma.organization.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
        data:
        {
            name: 'John doe',
            email: 'john@acme.com',
            avatarUrl: 'https://github.com/razecflavio.png',
            passwordHash: await hash('123456', 1)
        }
    })
    const anotherUser = await prisma.user.create({
        data:
        {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            avatarUrl: faker.image.avatarGitHub(),
            passwordHash: await hash('123456', 1)
        }
    })
    const anotherUser2 = await prisma.user.create({
        data:
        {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            avatarUrl: faker.image.avatarGitHub(),
            passwordHash: await hash('123456', 1)
        }
    })

    await prisma.organization.create({
        data: {
            name: 'Acme Inc (Admin)',
            domain: 'acme.com',
            slug: 'acme-admin',
            avatarUrl: faker.image.avatarGitHub(),
            shouldAttachUsersByDomains: true,
            ownerId: user.id,
            projects: {
                createMany: {
                    data: [
                        {
                            name: faker.lorem.words(5),
                            slug: faker.lorem.slug(5),
                            description: faker.lorem.paragraph(),
                            avatarUrl: faker.image.avatarGitHub(),
                            ownerId: faker.helpers.arrayElement([
                                user.id,
                                anotherUser.id,
                                anotherUser2.id
                            ])
                        },
                        {
                            name: faker.lorem.words(5),
                            slug: faker.lorem.slug(5),
                            description: faker.lorem.paragraph(),
                            avatarUrl: faker.image.avatarGitHub(),
                            ownerId: faker.helpers.arrayElement([
                                user.id,
                                anotherUser.id,
                                anotherUser2.id
                            ])
                        },
                        {
                            name: faker.lorem.words(5),
                            slug: faker.lorem.slug(5),
                            description: faker.lorem.paragraph(),
                            avatarUrl: faker.image.avatarGitHub(),
                            ownerId: faker.helpers.arrayElement([
                                user.id,
                                anotherUser.id,
                                anotherUser2.id
                            ])
                        }
                    ]
                }
            },
            members: {
                createMany: {
                    data: [
                        {
                            userId: user.id,
                            role: 'ADMIN'
                        },
                        {
                            userId: anotherUser.id,
                            role: 'MEMBER'
                        },
                        {
                            userId: anotherUser2.id,
                            role: 'MEMBER'
                        }
                    ]
                }
            }
        }
    })

    await prisma.organization.create({
        data: {
            name: 'Acme Inc (Member)',
            slug: 'acme-member',
            avatarUrl: faker.image.avatarGitHub(),
            ownerId: user.id,
            projects: {
                createMany: {
                    data: [
                        {
                            name: faker.lorem.words(5),
                            slug: faker.lorem.slug(5),
                            description: faker.lorem.paragraph(),
                            avatarUrl: faker.image.avatarGitHub(),
                            ownerId: faker.helpers.arrayElement([
                                user.id,
                                anotherUser.id,
                                anotherUser2.id
                            ])
                        },
                        {
                            name: faker.lorem.words(5),
                            slug: faker.lorem.slug(5),
                            description: faker.lorem.paragraph(),
                            avatarUrl: faker.image.avatarGitHub(),
                            ownerId: faker.helpers.arrayElement([
                                user.id,
                                anotherUser.id,
                                anotherUser2.id
                            ])
                        },
                        {
                            name: faker.lorem.words(5),
                            slug: faker.lorem.slug(5),
                            description: faker.lorem.paragraph(),
                            avatarUrl: faker.image.avatarGitHub(),
                            ownerId: faker.helpers.arrayElement([
                                user.id,
                                anotherUser.id,
                                anotherUser2.id
                            ])
                        },
                    ]
                }
            },
            members: {
                createMany: {
                    data: [
                        {
                            userId: user.id,
                            role: 'MEMBER'
                        },
                        {
                            userId: anotherUser.id,
                            role: 'ADMIN'
                        },
                        {
                            userId: anotherUser2.id,
                            role: 'MEMBER'
                        }
                    ]
                }
            }
        }
    })

    await prisma.organization.create({
        data: {
            name: 'Acme Inc (Billing)',
            slug: 'acme-billing',
            avatarUrl: faker.image.avatarGitHub(),
            ownerId: user.id,
            projects: {
                createMany: {
                    data: [
                        {
                            name: faker.lorem.words(5),
                            slug: faker.lorem.slug(5),
                            description: faker.lorem.paragraph(),
                            avatarUrl: faker.image.avatarGitHub(),
                            ownerId: faker.helpers.arrayElement([
                                user.id,
                                anotherUser.id,
                                anotherUser2.id
                            ])
                        },
                        {
                            name: faker.lorem.words(5),
                            slug: faker.lorem.slug(5),
                            description: faker.lorem.paragraph(),
                            avatarUrl: faker.image.avatarGitHub(),
                            ownerId: faker.helpers.arrayElement([
                                user.id,
                                anotherUser.id,
                                anotherUser2.id
                            ])
                        },
                        {
                            name: faker.lorem.words(5),
                            slug: faker.lorem.slug(5),
                            description: faker.lorem.paragraph(),
                            avatarUrl: faker.image.avatarGitHub(),
                            ownerId: faker.helpers.arrayElement([
                                user.id,
                                anotherUser.id,
                                anotherUser2.id
                            ])
                        },
                    ]
                }
            },
            members: {
                createMany: {
                    data: [
                        {
                            userId: user.id,
                            role: 'BILLING'
                        },
                        {
                            userId: anotherUser.id,
                            role: 'ADMIN'
                        },
                        {
                            userId: anotherUser2.id,
                            role: 'MEMBER'
                        }
                    ]
                }
            }
        }
    })

}

seed().then(() => {
    console.log('Database seeded!')
});


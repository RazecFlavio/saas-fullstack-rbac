import { api } from "./api-client"

interface GetProjectsResponse {
    projects: {
        name: string;
        id: string;
        slug: string;
        avatarUrl: string | null;
        ownerId: string;
        organizationId: string;
        description: string;
        createdAt: string
        owner: {
            name: string | null;
            id: string;
            avatarUrl: string | null;
        }
    }[]
}

export async function getProjects(org: string) {
    //await new Promise(resolve => setTimeout(resolve, 2000))

    const result = await api.get(`organizations/${org}/projects`).json<GetProjectsResponse>()
    return result
}
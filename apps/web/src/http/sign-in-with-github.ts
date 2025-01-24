import { api } from "./api-client"

interface SignWithGithubRequest {
    code: string
}

interface SignWithGithubResponse {
    token: string
}

export async function signWithGithub({
    code }: SignWithGithubRequest
) {
    const token = await api.post('sessions/github', {
        json: {
            code
        }
    }).json<SignWithGithubResponse>()

    return token
}
export type Bookmark = {
    id: string
    user_id: string | null
    title: string
    description: string
    url: string
    image_url: string
    sitename: string
    domain: string
}

export type BookmarkCollection = {
    id: string
    user_id: string | null
    title: string
}

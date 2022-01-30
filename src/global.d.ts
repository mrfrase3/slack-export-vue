
declare global {
  interface User {
    id: string
    name: string
    image?: string
    image72?: string
    image24?: string
  }

  interface Reaction {
    name: string
    count: number
    userIds: string[]
  }

  interface FileObject {
    id: string
    name: string
    mimeType: string
    src: string
    width?: number
    height?: number
  }

  interface Attachment {
    serviceName?: string
    serviceIcon?: string
    title?: string
    titleUrl?: string
    text?: string
    thumbUrl?: string
    imageUrl?: string
    quoteId?: number
    channelId?: string
  }

  interface Message {
    id: number
    type: string
    userId?: string
    channelId?: string
    user?: User
    text: string
    ts: number
    tags: string[]
    isEdited?: boolean
    threadId?: number
    replyCount?: number
    replyUsersCount?: number
    replyUserIds?: string[]
    replyMessageIds?: number[]
    latestReply?: number
    reactions?: Reaction[]
    files?: FileObject[]
    attachments?: Attachment[]
  }

  interface Channel {
    id: string
    name: string
    isArchived: boolean
    isGeneral: boolean
    topic?: string
    purpose?: string
    // memberIds: string[];
    pinnedMessageIds?: number[]
    messages: Message[]
    rootMessages?: Message[]
  }
}
export {};

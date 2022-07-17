import { Type } from 'js-binary';

export default new Type({
  users: [{
    'id': 'string',
    'name': 'string',
    'image?': 'string',
    'image72?': 'string',
    'image24?': 'string',
  }],
  channels: [{
    'id': 'string',
    'name': 'string',
    'isArchived': 'boolean',
    'isGeneral': 'boolean',
    'topic?': 'string',
    'purpose?': 'string',
    'pinnedMessageIds?': ['uint'],
    // memberIds: ['string'],
    'messages': [{
      'id': 'uint',
      'type': 'string',
      'userId?': 'string',
      'channelId': 'string',
      'text': 'string',
      'ts': 'uint',
      'tags': ['string'],
      'isEdited': 'boolean',
      'editedAt?': 'uint',
      'threadId?': 'uint',
      'replyCount?': 'uint',
      'replyUsersCount?': 'uint',
      'replyUserIds?': ['string'],
      'replyMessageIds?': ['uint'],
      'latestReply?': 'uint',
      'reactions?': [{
        name: 'string',
        count: 'uint',
        userIds: ['string'],
      }],
      'files?': [{
        'id': 'string',
        'name': 'string',
        'mimeType': 'string',
        'src': 'string',
        'width?': 'uint',
        'height?': 'uint',
      }],
      'attachments?': [{
        'serviceName?': 'string',
        'serviceIcon?': 'string',
        'title?': 'string',
        'titleUrl?': 'string',
        'text?': 'string',
        'thumbUrl?': 'string',
        'thumbWidth?': 'uint',
        'thumbHeight?': 'uint',
        'imageUrl?': 'string',
        'imageWidth?': 'uint',
        'imageHeight?': 'uint',
        'authorName?': 'string',
        'authorUrl?': 'string',
        'videoHtml?': 'string',
        'videoWidth?': 'uint',
        'videoHeight?': 'uint',
        'quoteId?': 'uint',
        'channelId?': 'string',
      }],
    }],
  }],
});
import { TELEGRAM_API_URL, ERROR_LEVELS } from '../constants';
import { Notification } from '../models/Notification';
import { removeDuplicateTags } from '../utils/helpers';
/**
 * A collection of image URLs and associated tags.
 *
 * @typedef {Object} postCollection
 * @property {string} imageUrl - The URL of the image.
 * @property {string} tag - An associated tag for the image.
 */

/** A class for sending of images to a Telegram channel or chat. */
export class TelegramImageSender {
    _createRequestBody(chatId, mediaGroup) {
        const uniqueTags = removeDuplicateTags(mediaGroup).join(' ');

        const mediaData = mediaGroup.map((item, index) => ({
            type: item.type,
            media: item.url,
            caption: index === 0 ? uniqueTags : ''
        }));

        return JSON.stringify({
            chat_id: chatId,
            media: mediaData,
            parse_mode: 'Markdown',
            schedule_date: Date.now() + 86400000
        });
    }

    /**
     * Send an array media to the Telegram channel/chat.
     *
     * @param {postCollection} collection
     * @returns {Promise<Notification>}
     * @throws {Error} If request error.
     */
    async sendMedia(mediaGroup) {
        const { botToken, chatId } = await chrome.storage.sync.get(['botToken', 'chatId']);
        const requestBody = this._createRequestBody(chatId, mediaGroup);

        return fetch(TELEGRAM_API_URL + botToken + '/sendMediaGroup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestBody
        }).then(response => {
            if (response.ok) {
                return new Notification(ERROR_LEVELS.SUCCESS, 'Media successfully sent to Telegram.');
            } else {
                console.error(response);
                return new Notification(ERROR_LEVELS.ERROR, 'Error sending the media to Telegram.');
            }
        }).catch(error => {
            console.error(error);
            return new Notification(ERROR_LEVELS.ERROR, error);
        });
    }
}

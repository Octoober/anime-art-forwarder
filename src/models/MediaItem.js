import { MEDIA_TYPES } from "../constants";


/**
 * Class representing a media item.
 */
export class MediaItem {
    /**
     * Create a new media item.
     *
     * @param {MEDIA_TYPES} type - The type of the media.
     * @param {string} url - The URL of the media.
     * @param {string} caption - The cation for the media item.
     * @param {Object} hashtags - The object that contains hashtags.
     * @param {string} sourceUrl
     */
    constructor(type, url, caption, hashtags, sourceUrl) {
        if (!Object.values(MEDIA_TYPES).includes(type)) {
            throw new Error(`Invalid media type: ${type}`);
        }

        this.type = type;
        this.url = url;
        this.caption = caption;
        this.hashtags = hashtags;
        this.sourceUrl = sourceUrl
    }
}

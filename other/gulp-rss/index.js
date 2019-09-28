import es from "event-stream";
import {Feed} from "feed";
import {File} from 'gulp-util';

/**
 * Inspired by https://github.com/byteclubfr/gulp-rss
 */
function rss(options) {
    let feedOptions = Object.assign({
        title: null,
        // Basic options required for `feed` to work properly
        link: '',
        description: '',
        author: {}
    }, options || {});
    delete feedOptions.properties;
    delete feedOptions.render;

    const feed = new Feed(feedOptions);
    return es.through(
        function data(file) {
            let item = feedOptions.frontMatterTransformer(file.data.frontMatter)

            if (!item.date) {
                item.date = (file.stat || {}).ctime || new Date();
            } else if (!item.date.toUTCString) {
                item.date = new Date(item.date);
            }

            feed.addItem(item);
        },

        function end() {
            try {
                let file = new File({"path": ('./' + feedOptions.fileName)});
                file.contents = Buffer.from(feed.atom1());
                this.emit('data', file);
                this.emit('end');

            } catch (e) {
                this.emit('error', e);
            }
        }
    );
}

export default rss
const request = require('./request')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')
class YouZhan {
    constructor() {}
    async mkdirsSync(dirname) {
        if (fs.existsSync(dirname)) {
            return true
        } else {
            const res = await this.mkdirsSync(path.dirname(dirname))
            if (res) {
                fs.mkdirSync(dirname);
                return true
            }
        }
    }
    async getUrl(url) {
        const res = await request.get(url)
        const $ = cheerio.load(res)
        const list = []
        $("#post-list .post-featured-image a img").each((i, e) => {
            list.push({
                thumb: e.attribs.src,
                name: e.attribs.alt
            })
        })
        console.log(list)
        return list
    }

    async write(data) {
        const options = {
            flags: 'w',
            encoding: 'utf8',
            fd: null,
            mode: 0o666,
            autoClose: true
        }
        await this.mkdirsSync('data')
        const stream = fs.createWriteStream(path.resolve('./data/data.json'), options)
        const res = stream.write(JSON.stringify(data))
        return res
    }

    async download(item) {
        const download_image_path = path.resolve('./data/images')
        await this.mkdirsSync(download_image_path)
        const name = `${download_image_path}/${item['name']}.png`
        await request.getImage(item['thumb'], name)
    }
}

module.exports = new YouZhan()
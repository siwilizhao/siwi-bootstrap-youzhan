const Youzhan = require('./lib/youzhan')
class Spider {
    constructor() {
        this.init()
    }
    async init() {
        let data = []
        const base_url = 'http://www.youzhan.org/page/'
        for (let page = 2; page < 90; page++) {
            const list = await Youzhan.getUrl(`${base_url}${page}/`)
            data = data.concat(list)
        }
        await Youzhan.write(data)
        for (const item of data) {
            await Youzhan.download(item)
        }
    }
}
module.exports = new Spider()
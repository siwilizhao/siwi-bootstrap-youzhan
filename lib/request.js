const http = require('http')
const https = require('https')
const fs = require('fs')
const util = require('util')
const writeFile = util.promisify(fs.writeFile)
const qs = require('querystring')
const {
    URL
} = require('url')

class Request {
    constructor() {

    }

    /**
     * get
     * @param {*} url 
     */
    async get(url) {
        return new Promise((resolve, reject) => {
            const data = arguments[1] ? arguments[1] : {}
            const headers = arguments[2] ? arguments[2] : {}
            const Uri = new URL(url)
            const search = `${Uri.search?Uri.search + '&': '?'}${qs.stringify(data)}`
            const protocol = Uri.protocol === 'http:' ? http : https
            const options = {
                protocol: Uri.protocol,
                host: Uri.host,
                hostname: Uri.hostname,
                port: Uri.port,
                method: 'GET',
                path: `${Uri.pathname}${search}`,
                headers: headers
            }
            let body = ''
            const req = http.request(options, (res) => {
                res.setEncoding('utf8')
                res.on('data', chunk => {
                    body += chunk
                })
                res.on('end', () => {
                    resolve(body)
                })
            })
            req.setTimeout(10000, () => {
                console.error(`请求超时`);
            })
            req.on('error', (e) => {
                console.error(`请求遇到问题: ${e.message}`);
            })
            req.end()
        })
    }

    /**
     * 下载图片
     * @param {*} url 
     */
    async getImage(url, name) {
        return new Promise((resolve, reject) => {
            if (!name) {
                return false
            }
            const Uri = new URL(url)
            const protocol = Uri.protocol === 'http:' ? http : https
            let body = ''
            const req = protocol.get(url, (res) => {
                res.setEncoding('binary')
                res.on('data', chunk => {
                    body += chunk
                })
                res.on('end', async () => {
                    const res = await writeFile(name, body, "binary")
                    resolve(res)
                })
            })
            req.setTimeout(10000, () => {
                console.error(`请求超时`);
            })
            req.on('error', (e) => {
                console.error(`请求遇到问题: ${e.message}`);
            })
            req.end()
        })
    }
}
module.exports = new Request()